from unittest.mock import patch

from django.test import SimpleTestCase


class TranslationConfigurationTests(SimpleTestCase):
    @patch("core.translator.config", return_value="")
    @patch("core.translator.requests.post")
    @patch(
        "core.translator.argostranslate.translate.translate",
        return_value="नमस्ते",
    )
    def test_missing_google_key_uses_argos_fallback(
        self,
        mock_argos_translate,
        mock_google_request,
        mock_config,
    ):
        from .translator import translate_texts

        result = translate_texts(
            ["Hello"],
            target_lang_name="Hindi",
            source_lang_name="English",
        )

        self.assertEqual(result, ["नमस्ते"])
        mock_google_request.assert_not_called()
        mock_argos_translate.assert_called_once()

    @patch("core.translator.config", return_value="")
    @patch("core.translator.requests.post")
    @patch(
        "core.translator.argostranslate.translate.translate",
        side_effect=RuntimeError("Argos language package unavailable"),
    )
    def test_missing_google_key_and_argos_package_returns_original_text(
        self,
        mock_argos_translate,
        mock_google_request,
        mock_config,
    ):
        from .translator import translate_texts

        result = translate_texts(
            ["Hello"],
            target_lang_name="Hindi",
            source_lang_name="English",
        )

        self.assertEqual(result, ["Hello"])
        mock_google_request.assert_not_called()
        mock_argos_translate.assert_called_once()
