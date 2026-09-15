import requests

from django.core.management.base import BaseCommand

from django.utils import timezone
from datetime import timedelta
from core.models import GlobalResourceCache


RAW_URL = "https://raw.githubusercontent.com/craigrallen/world-emergency-hotlines/main/hotlines.json"

CATEGORY_MAP = {
    "emergency": "general",
    "domestic_violence": "domestic_violence",
    "child_protection": "child_helpline",
    "suicide_crisis": "mental_health",
    "mental_health": "mental_health",
    "sexual_violence": "women_safety",
    "legal_aid": "legal_aid",
}


class Command(BaseCommand):
    help = "Import global emergency hotline data"

    def handle(self, *args, **options):
        self.stdout.write("Fetching dataset...")
        resp = requests.get(RAW_URL,timeout=30)
        resp.raise_for_status()

        data = resp.json()

        countries = data.get("countries", [])
        created_count = 0


        for country_entry in countries:
            country_name = country_entry.get("country")
            hotlines = country_entry.get("hotlines", [])


            by_category = {}

            for h in hotlines:
                raw_category = h.get("category")
                mapped = CATEGORY_MAP.get(raw_category)

                if not mapped:
                    continue
                by_category.setdefault(mapped, []).append(h)

            for category, records in by_category.items():
                GlobalResourceCache.objects.update_or_create(
                    country=country_name,
                    category=category,
                    defaults={
                        "source_name": "world-emergency-hotlines (GitHub)",
                        "source_url": "https://github.com/craigrallen/world-emergency-hotlines",
                        "raw_data": records,  # keeps verification_status per record intact
                        "license_type": "check_repo_license",
                        "ttl_expiry": timezone.now() + timedelta(days=30),


                    })

                created_count += 1

        self.stdout.write(self.style.SUCCESS(f"Imported {created_count} records."))



                