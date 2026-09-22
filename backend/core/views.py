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




NATIONAL_FALLBACK = {
    "India": [{"name": "National Emergency", "phone": "112", "note": "Police/Fire/Ambulance"}],
    "United States": [{"name": "Emergency", "phone": "911", "note": "Police/Fire/Ambulance"}],
    "United Kingdom": [{"name": "Emergency", "phone": "999", "note": "Police/Fire/Ambulance"}],
    "Australia": [{"name": "Emergency", "phone": "000", "note": "Police/Fire/Ambulance"}],
    "default": [{"name": "General Guidance", "phone": None, "note": "Please search '[your country] emergency number' or contact local police/embassy."}]
}



def generate_slug(category, country, state, district):
        parts = [ category, country ]
        if state:
            parts.append(state)
        if district:
            parts.append(district)
        base = slugify("-".join(parts))
        return base

class ChatQueryView(APIView):

    throttle_classes = [AnonRateThrottle]


    def post(self, request):
        query_text = request.data.get("query")
        dropdown_country = request.data.get('dropdown_country')
        geo_location = request.data.get('geo_location')

        if not query_text:
            return Response({"error": "query is required"}, status=status.HTTP_400_BAD_REQUEST)

        extracted = classify_query(query_text)

        if not extracted.get('country'):
            if dropdown_country:
                extracted['country'] = dropdown_country
            elif geo_location and geo_location.get('country'):
                extracted['country'] = geo_location['country']
                extracted['state'] = extracted.get('state') or geo_location.get('state')
                extracted['district'] = extracted.get('district') or geo_location.get('district')
            else:
                extracted['country'] = 'India'

        if extracted["country"].lower() == "india":
            if extracted.get("state") or extracted.get("district"):
              helplines = self._lookup_india(extracted)
            else:
              helplines = []  # force fallback when no location signal at all
        else:
            helplines = self._lookup_global(extracted)

        if not helplines:
            helplines = NATIONAL_FALLBACK.get(extracted["country"], NATIONAL_FALLBACK["default"])
            reply = "Sorry, I couldn't find any relevant helplines for your query. Please try rephrasing your question or provide more details."
        else:
            reply = format_response(query_text)


        QueryLog.objects.create(
            query_text=query_text,
            category=extracted.get('category', ''),
            urgency_tier=extracted.get('urgency_tier', ''),
            country=extracted.get('country', ''),
            location_detected=f"{extracted.get('state')}, {extracted.get('district')}"
        )

        
        slug_base =  generate_slug(
            extracted.get('category', 'general'),
            extracted.get('country', 'india'),
            extracted.get('state'),
            extracted.get('district')
        )

        existing = ChatSession.objects.filter(slug=slug_base).first()

        if existing:
            session_slug = existing.slug
        else:
            slug_candidate = slug_base
            counter = 1
            while ChatSession.objects.filter(slug=slug_candidate).exists():
               slug_candidate = f"{slug_base}-{counter}"
               counter += 1
            ChatSession.objects.create(
              slug=slug_candidate,
              query_text=query_text,
              category=extracted.get('category', ''),
              urgency_tier=extracted.get('urgency_tier', ''),
              country=extracted.get('country', ''),
              state=extracted.get('state'),
              district=extracted.get('district'),
              resources=helplines,
              reply=reply,
            )
            session_slug = slug_candidate
            

        return Response({
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

        # Keep only resources matching the requested location hierarchy:
        # district-specific, state-specific, or national fallback.
        if state:
            qs = qs.filter(
                Q(state__iexact=state) | Q(state__isnull=True)
            )

        if district:
            qs = qs.filter(
                Q(district__iexact=district) | Q(district__isnull=True)
            )

        return HelplineSerializer(
            qs.order_by("-priority", "name")[:5],
            many=True,
        ).data

    def _lookup_global(self, extracted):
        return get_global_resources(
            extracted["country"],
            extracted["category"],
        )


    


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
        return Response({
            "extracted": {
                "query_text": session.query_text,
                "category": session.category,
                "urgency_tier": session.urgency_tier,
                "state": session.state,
                "district": session.district,
                "country": session.country,
            },
            "resources": session.resources,
            "reply": session.reply,

        })