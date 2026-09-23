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

    "India": {
        "cyber_crime": [{"name": "National Cyber Crime Helpline", "phone": "1930"}],
        "mental_health": [{"name": "Tele-MANAS", "phone": "14416"}],
        "child_helpline": [{"name": "Child Helpline", "phone": "1098"}],
        "women_safety": [{"name": "Women Helpline", "phone": "181"}],
        "domestic_violence": [{"name": "Women Helpline", "phone": "181"}],
        "legal_aid": [{"name": "NALSA Legal Services", "phone": "15100"}],
        "senior_citizen": [{"name": "Elder Line", "phone": "14567"}],
        "disaster_relief": [{"name": "Disaster Management", "phone": "1078"}],
        "consumer_complaint": [{"name": "National Consumer Helpline", "phone": "1915"}],
        "road_accident": [{"name": "National Emergency", "phone": "112"}],
        "missing_person": [{"name": "Police Emergency", "phone": "112"}],
        "default": [{"name": "National Emergency", "phone": "112"}],
    },

    "United States": {
        "default": [{"name": "Emergency Services", "phone": "911"}]
    },

    "Canada": {
        "default": [{"name": "Emergency Services", "phone": "911"}]
    },

    "United Kingdom": {
        "default": [{"name": "Emergency Services", "phone": "999"}]
    },

    "Australia": {
        "default": [{"name": "Emergency Services", "phone": "000"}]
    },

    "Germany": {
        "default": [{"name": "Emergency Services", "phone": "112"}]
    },

    "France": {
        "default": [{"name": "Emergency Services", "phone": "112"}]
    },

    "Spain": {
        "default": [{"name": "Emergency Services", "phone": "112"}]
    },

    "Italy": {
        "default": [{"name": "Emergency Services", "phone": "112"}]
    },

    "Netherlands": {
        "default": [{"name": "Emergency Services", "phone": "112"}]
    },

    "Belgium": {
        "default": [{"name": "Emergency Services", "phone": "112"}]
    },

    "Japan": {
        "default": [{"name": "Police", "phone": "110"}]
    },

    "South Korea": {
        "default": [{"name": "Emergency Services", "phone": "119"}]
    },

    "Singapore": {
        "default": [{"name": "Emergency Services", "phone": "999"}]
    },

    "Brazil": {
        "default": [{"name": "Police Emergency", "phone": "190"}]
    },

    "South Africa": {
        "default": [{"name": "Emergency Services", "phone": "112"}]
    },

    "default": {
        "default": [{
            "name": "General Guidance",
            "phone": None,
            "note": "Please contact your local emergency services."
        }]
    }
}

def get_fallback(country, category):
    if country == "India":
        return NATIONAL_FALLBACK["India"].get(category, NATIONAL_FALLBACK["India"]["default"])
    return NATIONAL_FALLBACK.get(country, NATIONAL_FALLBACK.get("default", [{"name": "General Guidance", "phone": None}]))




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

        # FIX: India lookup ALWAYS runs — never skipped for missing location
        if extracted["country"].lower() == "india":
            helplines = self._lookup_india(extracted)
        else:
            helplines = self._lookup_global(extracted)

        if not helplines:
            helplines = get_fallback(extracted["country"], extracted["category"])
            reply = "Verified local resource nahi mila is category ke liye. Neeche diya emergency number try karein."
        else:
            reply = format_response(query_text, helplines, extracted.get('language', 'English'))

        QueryLog.objects.create(
            query_text=query_text,
            category=extracted.get('category', ''),
            urgency_tier=extracted.get('urgency_tier', ''),
            country=extracted.get('country', ''),
            location_detected=f"{extracted.get('state')}, {extracted.get('district')}"
        )

        slug_base = generate_slug(
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

        qs = Helpline.objects.filter(country__iexact="India", category=category)
        if state:
            qs = qs.filter(Q(state__iexact=state) | Q(state__isnull=True))
        if district:
            qs = qs.filter(Q(district__iexact=district) | Q(district__isnull=True))

        results = list(qs)

        def sort_key(h):
            district_match = 0 if (district and h.district and h.district.lower() == district.lower()) else 1
            state_match = 0 if (state and h.state and h.state.lower() == state.lower()) else 1
            return (district_match, state_match, -h.priority)

        results.sort(key=sort_key)
        return HelplineSerializer(results[:5], many=True).data

    def _lookup_global(self, extracted):
        data = get_global_resources(extracted["country"], extracted["category"])
        verification_rank = {"verified_authority": 0, "verified_web": 1, "cross_referenced": 2, "legacy_unverified": 3}
        data.sort(key=lambda r: verification_rank.get(r.get("verification_status"), 4))
        return data

    def _lookup_global(self, extracted):
        data = get_global_resources(extracted["country"],extracted["category"])

        verification_rank = {
             "verified_authority": 0,
             "verified_web":1,
             "cross_referenced": 2,
             "legacy_unverified": 3,
            }

        data.sort(key=lambda r: verification_rank.get(r.get("verification_status"),4))
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
        return Response({
            "query_text": session.query_text,
            "extracted": {
                "category": session.category,
                "urgency_tier": session.urgency_tier,
                "state": session.state,
                "district": session.district,
                "country": session.country,
            },
            "resources": session.resources,
            "reply": session.reply,

        })