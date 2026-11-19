
import logging
from copy import deepcopy
from datetime import timedelta

from django.utils import timezone

from .models import GlobalResourceCache


logger = logging.getLogger(__name__)

CACHE_TTL_HOURS = 24

GLOBAL_CATEGORY_MAP = {
    "health_emergency": "emergency",
}


def _add_cache_status(raw_data, status):
    """Attach cache freshness metadata without modifying stored JSON."""
    if not isinstance(raw_data, list):
        logger.warning("Invalid global cache data format: expected a list")
        return []

    resources = deepcopy(raw_data)

    for resource in resources:
        if not isinstance(resource, dict):
            continue

        resource["cache_status"] = status
        resource["is_stale"] = status == "stale"

        if status == "stale":
            original_status = resource.get("verification_status")

            if original_status:
                resource["source_verification_status"] = original_status

            resource["verification_status"] = "stale"

    return resources


def get_global_resources(country, category):
    now = timezone.now()
    lookup_category = GLOBAL_CATEGORY_MAP.get(category, category)

    cached = GlobalResourceCache.objects.filter(
        country__iexact=country,
        category=lookup_category,
        ttl_expiry__gte=now,
    ).order_by("-fetched_at").first()

    if cached:
        return _add_cache_status(cached.raw_data, "fresh")

    try:
        data = _fetch_external_api(country, category)

        if data:
            GlobalResourceCache.objects.create(
                source_name="external_api",
                country=country,
                category=lookup_category,
                raw_data=data,
                ttl_expiry=now + timedelta(hours=CACHE_TTL_HOURS),
            )

            return _add_cache_status(data, "fresh")

    except Exception:
        logger.exception(
            "External API fetch failed for %s / %s",
            country,
            lookup_category,
        )

    stale = GlobalResourceCache.objects.filter(
        country__iexact=country,
        category=lookup_category,
    ).order_by("-fetched_at").first()

    if stale:
        logger.warning(
            "Serving stale global cache for %s / %s",
            country,
            lookup_category,
        )
        return _add_cache_status(stale.raw_data, "stale")

    return []


def _fetch_external_api(country, category):
    return None
