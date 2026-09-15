# test_groq.py (root mein)
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.groq_client import classify_query
print(classify_query("mera dost cyber fraud ka shikaar hua hai Lucknow mein"))