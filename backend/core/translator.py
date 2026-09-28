import argostranslate.translate
import pycountry

def lang_to_code(name):
    try:
        return pycountry.language.lookup(name).aplha_2
    except Exception:
        return "en"

def translate_text(text, target_lang_name):
    code = lang_to_code(target_lang_name)
    if not text or code == "en":
        return text
    try:
        return argostranslate.translate.translate(text, "en", code)
    except Exception:
        return text
    
