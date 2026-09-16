from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Helpline, QueryLog
from .serializers import HelplineSerializer
from .groq_client import classify_query, format_response
from .global_client import get_global_resources


class ChatQueryView(APIView):
    def post(self, request):
        query_text = request.data.get("query")

        if not query_text:
            return Response(
                {"error": "query is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        extracted = classify_query(query_text)

        if extracted["country"].lower() == "india":
            helplines = self._lookup_india(extracted)
        else:
            helplines = self._lookup_global(extracted)

        reply = (
            format_response(query_text)
            if helplines
            else "Sorry, I couldn't find any relevant helplines for your query. Please try rephrasing your question or provide more details."
        )

        QueryLog.objects.create(
            query_text=query_text,
            category=extracted.get("category", ""),
            urgency_tier=extracted.get("urgency_tier", ""),
            location_detected=f"{extracted.get('state')}, {extracted.get('district')}",
        )

        return Response(
            {
                "extracted": extracted,
                # Resource facts come directly from the trusted backend store.
                # The LLM never receives or generates these values.
                "resources": helplines,
                "reply": reply,
            }
        )

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

        return Response(
            HelplineSerializer(qs, many=True).data
        )
