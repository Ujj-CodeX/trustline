from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Helpline, QueryLog
from .serializers import HelplineSerializer
from .groq_client import classify_query, format_response

from .global_client import get_global_resources




class ChatQueryView(APIView):
    def post(self, request):
        query_text = request.data.get('query')
        if not query_text:
            return Response({"error": "query is required"}, status=status.HTTP_400_BAD_REQUEST)

        extracted = classify_query(query_text)

        if extracted['country'].lower() == 'india':
            helplines = self._lookup_india(extracted)
        else:
            helplines = self._lookup_global(extracted)

        reply = format_response(query_text, helplines) if helplines else \
            "Sorry, I couldn't find any relevant helplines for your query. Please try rephrasing your question or provide more details."

        QueryLog.objects.create(
            query_text=query_text,
            category=extracted.get('category', ''),
            urgency_tier=extracted.get('urgency_tier', ''),
            location_detected=f"{extracted.get('state')}, {extracted.get('district')}"
        )

        return Response({"extracted": extracted, "resources": helplines, "reply": reply})

    def _lookup_india(self, extracted):
        qs = Helpline.objects.filter(category=extracted['category'])
        if extracted.get('state'):
            state_qs = qs.filter(state__iexact=extracted['state'])
            if state_qs.exists():
                qs = state_qs
        if extracted.get('district'):
            district_qs = qs.filter(district__iexact=extracted['district'])
            if district_qs.exists():
                qs = district_qs
        return HelplineSerializer(qs[:5], many=True).data

    def _lookup_global(self, extracted):
        data = get_global_resources(extracted['country'], extracted['category'])
        return data

class HelplineListView(APIView):
    def get(self,request):
        qs = Helpline.objects.all()
        state = request.query_params.get('state')
        category = request.query_params.get('category')

        if state:
            qs = qs.filter(state__iexact=state)
        if category:
            qs = qs.filter(category__iexact=category)
        return Response(HelplineSerializer(qs, many=True).data)




            