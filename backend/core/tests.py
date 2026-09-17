from django.test import TestCase
from rest_framework.test import APIClient
from unittest.mock import patch
from .models import Helpline, GlobalResourceCache
from django.utils import timezone
from datetime import timedelta


class ChatQueryTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        Helpline.objects.create(
            category="cyber_crime", country="India", state="Uttar Pradesh",
            district="Lucknow", name="UP Cyber Cell", phone="1930",
            verified_by="test", last_verified_date=timezone.now().date(), priority=1
        )
        GlobalResourceCache.objects.create(
            source_name="test", country="Australia", category="domestic_violence",
            raw_data=[{"name": "Test Helpline", "voice_numbers": ["000"]}],
            ttl_expiry=timezone.now() + timedelta(days=1)
        )

    def test_missing_query_returns_400(self):
        response = self.client.post("/api/chat/", {}, format="json")
        self.assertEqual(response.status_code, 400)

    @patch("core.views.classify_query")
    def test_india_lookup_returns_helpline(self, mock_classify):
        mock_classify.return_value = {
            "category": "cyber_crime", "urgency_tier": "urgent",
            "state": "Uttar Pradesh", "district": "Lucknow", "country": "India"
        }
        response = self.client.post("/api/chat/", {"query": "cyber fraud in Lucknow"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data["resources"]) > 0)
        self.assertEqual(response.data["resources"][0]["phone"], "1930")

    @patch("core.views.classify_query")
    def test_global_lookup_returns_cache(self, mock_classify):
        mock_classify.return_value = {
            "category": "domestic_violence", "urgency_tier": "urgent",
            "state": None, "district": None, "country": "Australia"
        }
        response = self.client.post("/api/chat/", {"query": "DV help in Australia"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data["resources"]) > 0)

    @patch("core.views.classify_query")
    def test_empty_result_triggers_fallback(self, mock_classify):
        mock_classify.return_value = {
            "category": "gambling", "urgency_tier": "general",
            "state": None, "district": None, "country": "Vatican City"
        }
        response = self.client.post("/api/chat/", {"query": "obscure query"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("resources", response.data)
        self.assertTrue(len(response.data["resources"]) > 0)  # fallback, never empty


class SchemaValidationTests(TestCase):
    def test_intent_schema_accepts_all_categories(self):
        from .schemas import IntentSchema
        valid_categories = ["cyber_crime", "domestic_violence", "mental_health",
                             "child_helpline", "women_safety", "legal_aid",
                             "animal_husbandry", "general"]
        for cat in valid_categories:
            data = {"category": cat, "urgency_tier": "general", "state": None,
                     "district": None, "country": "India"}
            validated = IntentSchema.model_validate(data)
            self.assertEqual(validated.category, cat)


class FallbackClassifierTests(TestCase):
    def test_keyword_fallback_maps_all_categories(self):
        from .fallback_classifier import keyword_fallback_classify
        test_cases = {
            "online fraud happened": "cyber_crime",
            "husband beat me": "domestic_violence",
            "child abuse reported": "child_helpline",
            "harassment at work": "women_safety",
            "feeling suicidal": "mental_health",
            "need a lawyer": "legal_aid",
            "cattle injured": "animal_husbandry",
        }
        for query, expected_category in test_cases.items():
            result = keyword_fallback_classify(query)
            self.assertEqual(result["category"], expected_category)