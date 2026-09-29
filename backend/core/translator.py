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

    return LANGUAGE_MAP.get(
        language_name.strip(),
        "en"
    )


def translate_text(
    text,
    target_lang_name,
    source_lang_name="English",
):
    """
    Translate text from source language to target language.

    Example:
        translate_text("Emergency Services", "French", "English")
        translate_text("Services d'urgence", "English", "French")
    """

    if not text or not text.strip():
        return text

    source_code = lang_to_code(source_lang_name)
    target_code = lang_to_code(target_lang_name)

    # Same language -> no translation required
    if source_code == target_code:
        return text

    try:
        translated = argostranslate.translate.translate(
            text,
            source_code,
            target_code,
        )

        return translated if translated else text

    except Exception as e:
        print(
            f"[Argos Translation Error] "
            f"{source_lang_name} ({source_code}) -> "
            f"{target_lang_name} ({target_code}): {e}"
        )
        return text