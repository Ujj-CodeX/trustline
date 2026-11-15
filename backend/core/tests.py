import json
from datetime import timedelta
from unittest.mock import patch

from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from .models import (
    ChatSession,
    GlobalResourceCache,
    Helpline,
)


class ChatQueryTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        Helpline.objects.create(
            category="cyber_crime",
            country="India",
            state="Uttar Pradesh",
            district="Lucknow",
            name="UP Cyber Cell",
            phone="1930",
            verified_by="test",
            last_verified_date=timezone.now().date(),
            priority=1,
        )

        GlobalResourceCache.objects.create(
            source_name="test",
            country="Australia",
            category="domestic_violence",
            raw_data=[
                {
                    "name": "Test Helpline",
                    "voice_numbers": ["000"],
                }
            ],
            ttl_expiry=timezone.now() + timedelta(days=1),
        )

    def test_missing_query_returns_400(self):
        response = self.client.post(
            "/api/chat/",
            {},
            format="json",
        )

        self.assertEqual(response.status_code, 400)

    @patch("core.views.classify_query")
    def test_india_lookup_returns_helpline(self, mock_classify):
        mock_classify.return_value = {
            "route": "in_scope",
            "category": "cyber_crime",
            "urgency_tier": "urgent",
            "state": "Uttar Pradesh",
            "district": "Lucknow",
            "country": "India",
            "language": "English",
        }

        response = self.client.post(
            "/api/chat/",
            {"query": "cyber fraud in Lucknow"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["route"], "in_scope")
        self.assertTrue(response.data["resources"])
        self.assertEqual(
            response.data["resources"][0]["phone"],
            "1930",
        )

        # A matching stored resource should allow a slug.
        self.assertTrue(response.data["slug"])

        session = ChatSession.objects.get(
            slug=response.data["slug"]
        )
        self.assertEqual(session.category, "cyber_crime")
        self.assertEqual(session.state, "Uttar Pradesh")
        self.assertEqual(session.district, "Lucknow")

    @patch("core.views.classify_query")
    def test_global_lookup_returns_cache(self, mock_classify):
        mock_classify.return_value = {
            "route": "in_scope",
            "category": "domestic_violence",
            "urgency_tier": "urgent",
            "state": None,
            "district": None,
            "country": "Australia",
            "language": "English",
        }

        response = self.client.post(
            "/api/chat/",
            {"query": "DV help in Australia"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["resources"])

    @patch("core.views.classify_query")
    def test_empty_result_triggers_fallback(self, mock_classify):
        mock_classify.return_value = {
            "route": "in_scope",
            "category": "general",
            "urgency_tier": "general",
            "state": None,
            "district": None,
            "country": "Vatican City",
            "language": "English",
        }

        response = self.client.post(
            "/api/chat/",
            {"query": "obscure query"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["resources"])

        # Fallback-only resources must not create a public slug.
        self.assertIsNone(response.data["slug"])
        self.assertEqual(ChatSession.objects.count(), 0)

    @patch("core.views.classify_query")
    def test_unmatched_location_does_not_create_slug(
        self,
        mock_classify,
    ):
        Helpline.objects.create(
            category="legal_aid",
            country="India",
            state=None,
            district=None,
            name="Generic Legal Aid Resource",
            phone="15100",
            priority=1,
        )

        mock_classify.return_value = {
            "route": "in_scope",
            "category": "legal_aid",
            "urgency_tier": "general",
            "state": "MadeUp State",
            "district": "MadeUp District",
            "country": "India",
            "language": "English",
        }

        response = self.client.post(
            "/api/chat/",
            {
                "query": "I need legal aid in MadeUp District",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)

        # The generic stored resource can still be returned.
        self.assertTrue(response.data["resources"])

        # The unverified location must not become a public slug.
        self.assertIsNone(response.data["slug"])
        self.assertEqual(ChatSession.objects.count(), 0)

    @patch("core.views.classify_query")
    def test_valid_specific_location_creates_slug(
        self,
        mock_classify,
    ):
        Helpline.objects.create(
            category="legal_aid",
            country="India",
            state="Uttar Pradesh",
            district="Lucknow",
            name="NALSA Lucknow Legal Aid",
            phone="15100",
            priority=1,
        )

        mock_classify.return_value = {
            "route": "in_scope",
            "category": "legal_aid",
            "urgency_tier": "general",
            "state": "Uttar Pradesh",
            "district": "Lucknow",
            "country": "India",
            "language": "English",
        }

        response = self.client.post(
            "/api/chat/",
            {"query": "I need legal aid in Lucknow"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["resources"])
        self.assertTrue(response.data["slug"])

        session = ChatSession.objects.get(
            slug=response.data["slug"]
        )

        self.assertEqual(session.category, "legal_aid")
        self.assertEqual(session.state, "Uttar Pradesh")
        self.assertEqual(session.district, "Lucknow")

    @patch("core.views.classify_query")
    def test_context_is_forwarded_to_classifier(
        self,
        mock_classify,
    ):
        context = [
            {
                "role": "user",
                "content": "I need legal aid in Lucknow.",
            },
            {
                "role": "assistant",
                "content": "What kind of legal help do you need?",
            },
        ]

        mock_classify.return_value = {
            "route": "needs_clarification",
            "category": None,
            "urgency_tier": "general",
            "state": None,
            "district": None,
            "country": "",
            "language": "English",
            "clarification_question": (
                "Could you explain your situation?"
            ),
        }

        response = self.client.post(
            "/api/chat/",
            {
                "query": "I cannot afford a lawyer.",
                "context": context,
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        mock_classify.assert_called_once_with(
            "I cannot afford a lawyer.",
            context=context,
        )

    @patch("core.views.classify_query")
    def test_clarification_skips_resource_lookup(
        self,
        mock_classify,
    ):
        mock_classify.return_value = {
            "route": "needs_clarification",
            "category": None,
            "urgency_tier": "general",
            "state": None,
            "district": None,
            "country": "",
            "language": "English",
            "clarification_question": (
                "What kind of help do you need?"
            ),
        }

        with (
            patch(
                "core.views.ChatQueryView._lookup_india"
            ) as india_lookup,
            patch(
                "core.views.ChatQueryView._lookup_global"
            ) as global_lookup,
        ):
            response = self.client.post(
                "/api/chat/",
                {"query": "Please help me"},
                format="json",
            )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data["route"],
            "needs_clarification",
        )
        self.assertEqual(response.data["resources"], [])
        self.assertIsNone(response.data["slug"])

        india_lookup.assert_not_called()
        global_lookup.assert_not_called()

    @patch("core.views.classify_query")
    def test_out_of_scope_skips_resource_lookup(
        self,
        mock_classify,
    ):
        mock_classify.return_value = {
            "route": "out_of_scope",
            "category": None,
            "urgency_tier": "general",
            "state": None,
            "district": None,
            "country": "",
            "language": "English",
            "clarification_question": None,
        }

        with (
            patch(
                "core.views.ChatQueryView._lookup_india"
            ) as india_lookup,
            patch(
                "core.views.ChatQueryView._lookup_global"
            ) as global_lookup,
        ):
            response = self.client.post(
                "/api/chat/",
                {"query": "Tell me a joke"},
                format="json",
            )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data["route"],
            "out_of_scope",
        )
        self.assertEqual(response.data["resources"], [])
        self.assertIsNone(response.data["slug"])

        india_lookup.assert_not_called()
        global_lookup.assert_not_called()


class SchemaValidationTests(TestCase):
    def test_intent_schema_accepts_all_categories(self):
        from .schemas import IntentSchema

        valid_categories = [
            "cyber_crime",
            "domestic_violence",
            "mental_health",
            "child_helpline",
            "women_safety",
            "legal_aid",
            "health_emergency",
            "animal_husbandry",
            "senior_citizen",
            "disaster_relief",
            "labour_rights",
            "consumer_complaint",
            "road_accident",
            "missing_person",
            "general",
        ]

        for category in valid_categories:
            with self.subTest(category=category):
                data = {
                    "category": category,
                    "urgency_tier": "general",
                    "state": None,
                    "district": None,
                    "country": "India",
                }

                validated = IntentSchema.model_validate(data)
                self.assertEqual(validated.category, category)


class GroqRoutingGuardTests(TestCase):
    @patch("core.groq_client.get_groq_client")
    @patch("core.groq_client.classify_intent")
    @patch(
        "core.groq_client.check_outbound_limit",
        return_value=True,
    )
    def test_groq_in_scope_is_rejected_when_semantic_route_is_out_of_scope(
        self,
        mock_check_limit,
        mock_classify_intent,
        mock_get_groq_client,
    ):
        from .groq_client import classify_query

        mock_get_groq_client.return_value.chat.completions.create \
            .return_value.choices[0].message.content = json.dumps({
                "route": "in_scope",
                "category": "legal_aid",
                "urgency_tier": "general",
                "state": None,
                "district": None,
                "country": "",
                "language": "English",
                "clarification_question": None,
            })

        mock_classify_intent.return_value = {
            "route": "out_of_scope",
            "category": None,
        }

        result = classify_query("Tell me a joke")

        self.assertEqual(result["route"], "out_of_scope")
        self.assertIsNone(result["category"])
        self.assertEqual(
            result["routing_source"],
            "groq_guarded_by_sentence_transformer",
        )

    @patch("core.groq_client.get_groq_client")
    @patch("core.groq_client.classify_intent")
    @patch(
        "core.groq_client.check_outbound_limit",
        return_value=True,
    )
    def test_groq_in_scope_is_kept_when_semantic_route_agrees(
        self,
        mock_check_limit,
        mock_classify_intent,
        mock_get_groq_client,
    ):
        from .groq_client import classify_query

        mock_get_groq_client.return_value.chat.completions.create \
            .return_value.choices[0].message.content = json.dumps({
                "route": "in_scope",
                "category": "legal_aid",
                "urgency_tier": "general",
                "state": None,
                "district": None,
                "country": "",
                "language": "English",
                "clarification_question": None,
            })

        mock_classify_intent.return_value = {
            "route": "in_scope",
            "category": "legal_aid",
        }

        result = classify_query("I need legal aid")

        self.assertEqual(result["route"], "in_scope")
        self.assertEqual(result["category"], "legal_aid")
        self.assertEqual(result["routing_source"], "groq")


class FallbackClassifierTests(TestCase):
    def test_keyword_fallback_maps_supported_categories(self):
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
            with self.subTest(query=query):
                result = keyword_fallback_classify(query)
                self.assertEqual(
                    result["category"],
                    expected_category,
                )