from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Helpline, QueryLog, ChatSession
from .serializers import HelplineSerializer
from .groq_client import classify_query, format_response
from .global_client import get_global_resources
from rest_framework.pagination import PageNumberPagination
from rest_framework.throttling import AnonRateThrottle
from django.utils.text import slugify
from .fallbacks import get_fallback

from copy import deepcopy
from .translator import translate_texts


TRANSLATABLE_FIELDS = [
    "name",
    "title",
    "organization",
    "department",
    "description",
    "service",
    "type",
    "availability",
    "languages",
    "verified_by",
    "notes",
    "target",
]


def localize_resources(resources, user_lang):
    if not resources:
        return []

    localized_resources = deepcopy(resources)

    for resource in localized_resources:
        source_lang = resource.get("source_language", "English")

        fields = []
        values = []

        for field in TRANSLATABLE_FIELDS:
            value = resource.get(field)

            if isinstance(value, str) and value.strip():
                fields.append(field)
                values.append(value)

        if not values:
            continue

        # Translate all human-readable fields of this resource together.
        # Google batch is primary; translate_texts() already falls back to
        # Argos per string and finally returns the original value.
        translated_values = translate_texts(
            values,
            target_lang_name=user_lang,
            source_lang_name=source_lang,
        )

        for field, translated_value in zip(
            fields,
            translated_values,
        ):
            resource[field] = translated_value

    return localized_resources





def generate_slug(category, country, state, district):
        parts = [ category, country ]
        if state:
            parts.append(state)
        if district:
            parts.append(district)
        base = slugify("-".join(parts))
        return base

def resolve_resources(extracted):
    if extracted["country"].lower() == "india":
        helplines = ChatQueryView()._lookup_india(extracted)
    else:
        helplines = ChatQueryView()._lookup_global(extracted)
    if not helplines:
        helplines = get_fallback(extracted["country"],extracted["category"])
    return helplines



class ChatQueryView(APIView):
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        query_text = request.data.get("query")

        # Validate the incoming query.
        if not isinstance(query_text, str):
            return Response(
                {"error": "query must be a string"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        query_text = query_text.strip()

        if not query_text:
            return Response(
                {"error": "query is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(query_text) > 4000:
            return Response(
                {"error": "query must be 4000 characters or fewer"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        context = request.data.get("context")

        # Keep only the latest two valid messages.
        if isinstance(context, list):
            context = [
                {
                    "role": item["role"],
                    "content": item["content"].strip()[:800],
                }
                for item in context[-2:]
                if isinstance(item, dict)
                and item.get("role") in ("user", "assistant")
                and isinstance(item.get("content"), str)
                and item["content"].strip()
            ]
        else:
            context = None

        # Groq primary; Sentence Transformer is the fallback.
        extracted = classify_query(query_text, context=context)

        route = extracted.get("route")
        category = extracted.get("category")
        raw_language = str(extracted.get("language") or "English").strip()

        language_key = raw_language.lower().replace("_", "-")

        if language_key in {"hi", "hi-in", "hindi"}:
            contains_devanagari = any("\u0900" <= char <= "\u097F"
               for char in query_text
            )
            language = "Hindi" if contains_devanagari else "Hinglish"

        elif language_key in {"hinglish", "hi-en", "hindi-english"}:
            language = "Hinglish"

        elif language_key in {"en", "en-us", "en-in", "english"}:
            language = "English"

        else:
            language = raw_language

        language_lower = language.lower()
        extracted["language"] = language

        # Fail safely if routing output is invalid.
        if (
            route not in {
                "in_scope",
                "needs_clarification",
                "out_of_scope",
            }
            or (route == "in_scope" and not category)
        ):
            route = "needs_clarification"
            extracted["route"] = route
            extracted["category"] = None

        # No database lookup or public slug for non-support routes.
        if route != "in_scope":
            if route == "needs_clarification":
                reply = extracted.get("clarification_question")

                if not reply:
                    if (
                        "hindi" in language_lower
                        or "hinglish" in language_lower
                    ):
                        reply = "Aapko kis tarah ki madad chahiye?"
                    else:
                        reply = "What kind of support do you need?"

            else:
                if (
                    "hindi" in language_lower
                    or "hinglish" in language_lower
                ):
                    reply = (
                        "TrustLine verified helplines aur support "
                        "resources dhoondhne ke liye hai."
                    )
                else:
                    reply = (
                        "TrustLine helps you find verified helplines "
                        "and support resources."
                    )

            return Response({
                "route": route,
                "query_text": query_text,
                "extracted": extracted,
                "resources": [],
                "reply": reply,
                "slug": None,
            })

        # Resolve location only after identifying a support need.
        dropdown_country = request.data.get("dropdown_country")
        geo_location = request.data.get("geo_location")

        if not extracted.get("country"):
            if (
                isinstance(dropdown_country, str)
                and dropdown_country.strip()
            ):
                extracted["country"] = dropdown_country.strip()

            elif (
                isinstance(geo_location, dict)
                and geo_location.get("country")
            ):
                extracted["country"] = geo_location["country"]
                extracted["state"] = (
                    extracted.get("state")
                    or geo_location.get("state")
                )
                extracted["district"] = (
                    extracted.get("district")
                    or geo_location.get("district")
                )

            else:
                extracted["country"] = "India"

        # Existing verified database/cache lookup.
        if extracted["country"].lower() == "india":
            helplines = self._lookup_india(extracted)
        else:
            helplines = self._lookup_global(extracted)

        # Track real database/cache matches before applying fallback.
        has_stored_resources = bool(helplines)

        if not helplines:
            helplines = get_fallback(
                extracted["country"],
                extracted["category"],
            )

        resource_language = (
         "Hindi" if language_lower == "hinglish" else language
        )
        helplines = localize_resources(helplines, resource_language)

        # No second Groq call for response formatting.
        if (
            "hindi" in language_lower
            or "hinglish" in language_lower
        ):
            reply = (
                "Neeche aapki need ke mutabik support resources diye "
                "gaye hain. Urgent situation mein listed helpline "
                "se seedha sampark karein."
            )
        else:
            reply = (
                "Here are the support resources matching your need. "
                "If the situation is urgent, contact the listed "
                "helpline directly."
            )

        # Log only support-related queries.
        QueryLog.objects.create(
            query_text=query_text,
            category=extracted["category"],
            urgency_tier=extracted.get(
                "urgency_tier", "general"
            ),
            country=extracted.get("country", ""),
            location_detected=(
                f"{extracted.get('state')}, "
                f"{extracted.get('district')}"
            ),
        )

        # Public session slug only when real stored resources exist.
        session_slug = None

        if has_stored_resources:
            slug_base = generate_slug(
                extracted["category"],
                extracted["country"],
                extracted.get("state"),
                extracted.get("district"),
            )

            existing = ChatSession.objects.filter(
                slug=slug_base
            ).first()

            if not existing:
                ChatSession.objects.create(
                    slug=slug_base,
                    category=extracted["category"],
                    country=extracted["country"],
                    state=extracted.get("state"),
                    district=extracted.get("district"),
                )

            session_slug = slug_base

        return Response({
            "route": "in_scope",
            "query_text": query_text,
            "extracted": extracted,
            "resources": helplines,
            "reply": reply,
            "slug": session_slug,
        })

    def _lookup_india(self, extracted):
        category = extracted["category"]
        state = extracted.get("state")
        district = extracted.get("district")

        qs = Helpline.objects.filter(
            country__iexact="India",
            category=category,
        )

        if state:
            qs = qs.filter(
                Q(state__iexact=state) | Q(state__isnull=True)
            )

        if district:
            qs = qs.filter(
                Q(district__iexact=district)
                | Q(district__isnull=True)
            )

        results = list(qs)

        def sort_key(helpline):
            district_match = 0 if (
                district
                and helpline.district
                and helpline.district.lower() == district.lower()
            ) else 1

            state_match = 0 if (
                state
                and helpline.state
                and helpline.state.lower() == state.lower()
            ) else 1

            return (
                district_match,
                state_match,
                -helpline.priority,
            )

        results.sort(key=sort_key)
        return HelplineSerializer(results[:5], many=True).data

    def _lookup_global(self, extracted):
        data = get_global_resources(
            extracted["country"],
            extracted["category"],
        )

        verification_rank = {
            "verified_authority": 0,
            "verified_web": 1,
            "cross_referenced": 2,
            "legacy_unverified": 3,
        }

        data.sort(
            key=lambda resource: verification_rank.get(
                resource.get("verification_status"), 4
            )
        )

        return data

    


class HelplineListView(APIView):
    def get(self, request):
        qs = Helpline.objects.all()
        state = request.query_params.get("state")
        category = request.query_params.get("category")

        if state:
            qs = qs.filter(state__iexact=state)
        if category:
            qs = qs.filter(category__iexact=category)

        paginator = PageNumberPagination()
        paginator.page_size = 20
        result = paginator.paginate_queryset(qs, request)

        return paginator.get_paginated_response(HelplineSerializer(result, many=True).data)



class ChatSessionDetailView(APIView):
    def get(self, request, slug):
        session = ChatSession.objects.filter(slug=slug).first()
        if not session:
            return Response({"error": "Not found"}, status=404)

        extracted = {
            "category": session.category, "country": session.country,
            "state": session.state, "district": session.district,
            "urgency_tier": "general", "language": "English",

        }

        helplines = resolve_resources(extracted)
        query_hint = f"{session.category.replace('_',' ')} help in {session.district or session.state or session.country}"
        reply = format_response(query_hint, helplines, "English" )
        return Response({"query_text": query_hint, "extracted": extracted, "resources": helplines, "reply": reply})


class SitemapDataView(APIView):
    def get(self, request):
        sessions = ChatSession.objects.all().values('slug', 'created_at')
        return Response(list(sessions))
    



class TranslatedTextView(APIView):
    def post(self, request):
        texts = request.data.get("texts", [])
        target_lang = request.data.get("lang", "en")

        if not isinstance(texts, list):
            return Response(
                {"error": "texts must be a list"},
                status=400,
            )

        if not all(isinstance(text, str) for text in texts):
            return Response(
                {"error": "every item in texts must be a string"},
                status=400,
            )

        translated = translate_texts(
            texts,
            target_lang_name=target_lang,
            source_lang_name="English",
        )

        return Response({
            "translated": translated,
        })

