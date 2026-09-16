import requests
import logging
import pycountry

from django.utils import timezone
from datetime import timedelta
from .models import GlobalResourceCache

logger = logging.getLogger(__name__)
CACHE_TTL_HOURS = 24



def get_global_resources(country,category):
    now = timezone.now()

    cached = GlobalResourceCache.objects.filter(
        country__iexact = country,
        category=category,
        ttl_expiry__gte=now
    ).first()

    if cached:
        return cached.raw_data

    try:
        data = _fetch_external_api(country,category)
        if data:
            GlobalResourceCache.objects.create(
                source_name = "external_api",
                country = country,
                category = category,
                raw_data = data,
                ttl_expiry = now + timedelta(hours=CACHE_TTL_HOURS)
            )
            return data
    except Exception as e:
        print(f"External API fetch failed: {e}")
        


    stale = GlobalResourceCache.objects.filter(
        country__iexact = country,
        category=category).order_by('-fetched_at').first()

    if stale:
        return stale.raw_data
    
    return []


def _get_iso_code(country_name):
    try:
        result = pycountry.countries.search_fuzzy(country_name)
        return result[0].alpha_2.lower()
    except Exception:
        return None


def _fetch_external_api(country, category):
    return None