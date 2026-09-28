import argostranslate.translate


LANGUAGE_MAP = {
    "English": "en",
    "Hindi": "hi",
    "French": "fr",
    "German": "de",
    "Japanese": "ja",
    "Swedish": "sv",
}


def lang_to_code(language_name):
    """
    Convert TrustLine language name to Argos language code.
    """
    if not language_name:
        return "en"

    return LANGUAGE_MAP.get(language_name.strip(), "en")


def translate_text(text, target_lang_name):
    """
    Translate English source text into the user's target language.

    Official names, phone numbers, URLs, etc. should not be passed here.
    """
    if not text:
        return text

    target_code = lang_to_code(target_lang_name)

    if target_code == "en":
        return text

    try:
        translated = argostranslate.translate.translate(
            text,
            "en",
            target_code,
        )

        return translated if translated else text

    except Exception as e:
        print(
            f"[Argos Translation Error] "
            f"{target_lang_name} ({target_code}): {e}"
        )
        return text