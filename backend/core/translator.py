
import argostranslate.translate
from decouple import config
import requests
import pycountry


GOOGLE_TRANSLATE_API_KEY = config("GOOGLE_TRANSLATE_API_KEY")

ARGOS_LANGUAGE_MAP = {
    "English": "en",
    "Hindi": "hi",
    "French": "fr",
    "German": "de",
    "Japanese": "ja",
    "Swedish": "sv",
}

GOOGLE_LANGUAGE_ALIASES = {
    "Chinese (Simplified)": "zh-CN",
    "Chinese (Traditional)": "zh-TW",
    "Chinese": "zh",
    "Portuguese (Brazil)": "pt-BR",
    "Portuguese (Portugal)": "pt-PT",
    "Bengali (India)": "bn",
    "Punjabi": "pa",
}


def google_lang_to_code(language_name):
    """
    Convert TrustLine language name to Argos language code.
    """
    if not language_name:
        return "en"

    language_name = language_name.strip()

    if len(language_name) in (2, 5):
        return language_name

    try:
        language = pycountry.languages.lookup(language_name)
        return language.alpha_2
    except Exception:
        pass

    normalized = language_name.lower()

    common_map = {
        "english": "en",
        "hindi": "hi",
        "french": "fr",
        "german": "de",
        "japanese": "ja",
        "swedish": "sv",
        "spanish": "es",
        "italian": "it",
        "russian": "ru",
        "arabic": "ar",
        "korean": "ko",
        "tamil": "ta",
        "telugu": "te",
        "marathi": "mr",
        "gujarati": "gu",
        "kannada": "kn",
        "malayalam": "ml",
        "bengali": "bn",
        "punjabi": "pa",
        "urdu": "ur",
        "nepali": "ne",
        "thai": "th",
        "vietnamese": "vi",
        "indonesian": "id",
        "turkish": "tr",
        "dutch": "nl",
        "polish": "pl",
        "ukrainian": "uk",
        "hebrew": "he",
        "greek": "el",
        "romanian": "ro",
        "hungarian": "hu",
        "czech": "cs",
        "danish": "da",
        "norwegian": "no",
        "finnish": "fi",
    }
    return common_map.get(normalized)

def argos_lang_to_code(language_name):
    if not language_name:
        return None

    language_name = language_name.strip()

    if language_name in ARGOS_LANGUAGE_MAP:
        return ARGOS_LANGUAGE_MAP[language_name]

    if language_name in ARGOS_LANGUAGE_MAP.values():
        return language_name

    return None


def google_translate_text(text, target_lang_name,source_lang_name=None,):
    target_code = google_lang_to_code(target_lang_name)
    
    if not target_code:
            raise ValueError(
                f"Google language code not found for: {target_lang_name}"
            )
    
    source_code = None

    if source_lang_name:
            source_code = google_lang_to_code(source_lang_name)

    url = (
        "https://translation.googleapis.com/"
        "language/translate/v2"
    )

    params = {
        "key": GOOGLE_TRANSLATE_API_KEY
    }

    payload = {
         "q": text,
         "source": source_code,
         "target": target_code,
         "format": "text",
    }
    if source_code:
        payload["source"] = source_code

    response = requests.post(
        url,
        params=params,
        json=payload,
        timeout=5,
    )


    response.raise_for_status()

    data = response.json()

    translated = ( data["data"]["translations"][0]["translatedText"])

    return translated
        

def argos_translate_text(text, source_lang_name, target_lang_name,):
    source_code = argos_lang_to_code(source_lang_name)
    target_code = argos_lang_to_code(target_lang_name)

    return argostranslate.translate.translate(text,source_code,target_code,)



def google_translate_texts(texts, target_lang_name, source_lang_name=None):
    """
    Translate multiple strings in one Google Translation v2 request.
    Returns translations in the same order as the input list.
    """
    if not texts:
        return []

    target_code = google_lang_to_code(target_lang_name)
    if not target_code:
        raise ValueError(
            f"Google language code not found for: {target_lang_name}"
        )

    source_code = None
    if source_lang_name:
        source_code = google_lang_to_code(source_lang_name)

    url = (
        "https://translation.googleapis.com/"
        "language/translate/v2"
    )

    payload = {
        "q": texts,
        "target": target_code,
        "format": "text",
    }

    if source_code:
        payload["source"] = source_code

    response = requests.post(
        url,
        params={"key": GOOGLE_TRANSLATE_API_KEY},
        json=payload,
        timeout=10,
    )
    response.raise_for_status()

    translations = response.json()["data"]["translations"]

    if len(translations) != len(texts):
        raise ValueError(
            "Google returned a different number of translations."
        )

    return [
        item.get("translatedText") or texts[index]
        for index, item in enumerate(translations)
    ]


def translate_texts(texts, target_lang_name, source_lang_name=None):
    """
    Batch translation pipeline:
    Google batch -> Argos per-string fallback -> original text.
    """
    if not texts:
        return []

    if not target_lang_name:
        return list(texts)

    source_code = (
        google_lang_to_code(source_lang_name)
        if source_lang_name
        else None
    )
    target_code = google_lang_to_code(target_lang_name)

    if source_code and target_code and source_code == target_code:
        return list(texts)

    translated_results = []
    batch_size = 128

    for start in range(0, len(texts), batch_size):
        batch = texts[start:start + batch_size]

        try:
            translated_results.extend(
                google_translate_texts(
                    batch,
                    target_lang_name=target_lang_name,
                    source_lang_name=source_lang_name,
                )
            )
            continue
        except Exception as google_error:
            print(
                f"[Google Batch Translation Error] "
                f"{source_lang_name or 'auto'} -> "
                f"{target_lang_name}: {google_error}"
            )

        for text in batch:
            try:
                argos_source = source_lang_name or "English"
                argos_source_code = argos_lang_to_code(argos_source)
                argos_target_code = argos_lang_to_code(target_lang_name)

                if not argos_source_code or not argos_target_code:
                    raise ValueError(
                        f"Argos language pair unsupported: "
                        f"{argos_source} -> {target_lang_name}"
                    )

                translated = argostranslate.translate.translate(
                    text,
                    argos_source_code,
                    argos_target_code,
                )

                translated_results.append(
                    translated if translated else text
                )
            except Exception as argos_error:
                print(
                    f"[Argos Fallback Error] "
                    f"{source_lang_name or 'English'} -> "
                    f"{target_lang_name}: {argos_error}"
                )
                translated_results.append(text)

    return translated_results

def translate_text(text,target_lang_name,source_lang_name=None,):

    if not text or not text.strip():
        return text

    if not target_lang_name:
        return text

    
    if source_lang_name:
        source_google = google_lang_to_code(source_lang_name)
        target_google = google_lang_to_code(target_lang_name)

        if (
            source_google
            and target_google
            and source_google == target_google
        ):
            return text

    
    # 1. GOOGLE = PRIMARY
   

    try:
        translated = google_translate_text(
            text=text,
            target_lang_name=target_lang_name,
            source_lang_name=source_lang_name,
        )

        if translated:
            print(
                f"[Google Translation] "
                f"{source_lang_name or 'auto'} -> "
                f"{target_lang_name}"
            )

            return translated

    except Exception as e:
        print(
            f"[Google Translation Error] "
            f"{source_lang_name or 'auto'} -> "
            f"{target_lang_name}: {e}"
        )

    # --------------------------------------------------------
    # 2. ARGOS = FALLBACK
    # --------------------------------------------------------

    try:
        argos_source = source_lang_name or "English"

        translated = argos_translate_text(
            text=text,
            source_lang_name=argos_source,
            target_lang_name=target_lang_name,
        )

        if translated:
            print(
                f"[Argos Fallback] "
                f"{argos_source} -> "
                f"{target_lang_name}"
            )

            return translated

    except Exception as e:
        print(
            f"[Argos Translation Error] "
            f"{source_lang_name or 'English'} -> "
            f"{target_lang_name}: {e}"
        )

    # --------------------------------------------------------
    # 3. FINAL FALLBACK = ORIGINAL TEXT
    # --------------------------------------------------------

    print(
        "[Translation Failed] Returning original text"
    )

    return text