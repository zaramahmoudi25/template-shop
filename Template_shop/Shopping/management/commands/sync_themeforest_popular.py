import os
import time
import requests
import urllib.parse

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from Shopping.models import ThemeForestItem


API_TOKEN = "tblP6qoFhhBG30kLNW7Y0NyNLtl3kG0M"  # your token


class Command(BaseCommand):
    help = "Sync weekly popular Shopify templates from ThemeForest"

    def normalize_attributes(self, attributes):
        """Convert Envato attributes to a dict format."""
        if not attributes:
            return {}

        if isinstance(attributes, dict):
            return attributes

        if isinstance(attributes, list):
            attr_dict = {}
            for attr in attributes:
                key = attr.get("name")
                value = attr.get("value", [])
                if key:
                    attr_dict[key] = value
            return attr_dict

        return {}

    def get_with_retry(self, url, headers, params=None, retries=3):
        """Requests.get with debug logging & retry on failures."""
        for i in range(retries):
            try:
                self.stdout.write(f"Request attempt {i+1} → {url}")

                res = requests.get(url, headers=headers, params=params, timeout=10)

                self.stdout.write(f"→ Status Code: {res.status_code}")

                # Rate limit handling
                if res.status_code == 429:
                    wait = int(res.headers.get("Retry-After", 5))
                    self.stdout.write(f"Rate limited, waiting {wait}s...")
                    time.sleep(wait)
                    continue

                return res

            except Exception as e:
                self.stdout.write(f"Request error (attempt {i+1}): {e}")
                time.sleep(2)

        return None

    def handle(self, *args, **kwargs):

        headers = {
            "Authorization": f"Bearer {API_TOKEN}",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                          "AppleWebKit/537.36 (KHTML, like Gecko) "
                          "Chrome/120.0 Safari/537.36",
        }

        params = {
            "term": "shopify",
            "site": "themeforest.net",
            "sort_by": "trending",
            "page_size": 30,
        }

        search_url = "https://api.envato.com/v1/discovery/search/search/item"
        self.stdout.write("Fetching data from ThemeForest...\n")

        response = self.get_with_retry(search_url, headers, params=params)

        if not response:
            self.stdout.write(self.style.ERROR("API Error: No response from server"))
            return

        if response.status_code != 200:
            self.stdout.write(self.style.ERROR(
                f"API Error {response.status_code}: {response.text}"
            ))
            return

        items = response.json().get("matches", [])
        self.stdout.write(f"Received {len(items)} items.\n")

        for item in items:
            try:
                item_id = item.get("id")

                # TEMP DEBUG
                if item_id == items[0]["id"]:
                    import json
                    self.stdout.write("\n=== RAW ITEM DATA ===\n")
                    self.stdout.write(json.dumps(item, indent=2))
                    self.stdout.write("\n=====================\n")

                title = item.get("name")

                preview_url = (
                    item.get("previews", {}).get("live_site", {}).get("url")
                    or item.get("previews", {}).get("live_preview", {}).get("url")
                    or item.get("live_preview_url")
                    or item.get("preview_url")
                    or next(
                        (
                            attr.get("value")
                            for attr in item.get("attributes", [])
                            if attr.get("name") == "demo-url"
                        ),
                        None,
                    )
                )

                # ---------------------------
                # ⭐ Correct ThemeForest URL
                # ---------------------------
                slug_part = slugify(title)
                themeforest_url = f"https://themeforest.net/item/{slug_part}/{item_id}"

                # ---------------------------
                # Image extraction
                # ---------------------------
                previews = item.get("previews", {})
                img_url = ""

                if "icon_with_landscape_preview" in previews:
                    img_url = previews["icon_with_landscape_preview"].get("landscape_url")

                if not img_url and "landscape_preview" in previews:
                    img_url = previews["landscape_preview"].get("landscape_url")

                if not img_url and "icon_preview" in previews:
                    img_url = previews["icon_preview"].get("icon_url")

                # Fallback → detail API only if needed
                if not img_url:
                    detail_url = "https://api.envato.com/v3/market/catalog/item"
                    detail_res = self.get_with_retry(detail_url, headers, params={"id": item_id})

                    if detail_res and detail_res.status_code == 200:
                        detail = detail_res.json()
                        previews = detail.get("previews", {})

                        if "icon_with_landscape_preview" in previews:
                            img_url = previews["icon_with_landscape_preview"].get("landscape_url")
                        if not img_url and "landscape_preview" in previews:
                            img_url = previews["landscape_preview"].get("landscape_url")
                        if not img_url and "icon_preview" in previews:
                            img_url = previews["icon_preview"].get("icon_url")
                        if not img_url and "icon_with_square" in previews:
                            img_url = previews["icon_with_square"].get("icon_url")

                    time.sleep(0.5)

                # Attributes handling
                attributes = self.normalize_attributes(item.get("attributes"))
                compatible_browsers = attributes.get("compatible_browsers", ["1.0"])
                version = compatible_browsers[0] if compatible_browsers else "1.0"

                # Rating
                rating_obj = item.get("rating", {})
                rating_value = rating_obj.get("rating", 0) if isinstance(rating_obj, dict) else 0
                rating_count = rating_obj.get("count", 0) if isinstance(rating_obj, dict) else 0

                obj, created = ThemeForestItem.objects.update_or_create(
                    title=title,
                    defaults={
                        "themeforest_url": themeforest_url,
                        "main_image_url": img_url,
                        "live_preview_url": preview_url,
                        "price": item.get("price_cents", 0) / 100,
                        "sales": item.get("number_of_sales") or 0,
                        "rating": rating_value,
                        "rating_count": rating_count,
                        "category": "Shopify",
                        "last_update": item.get("updated_at"),
                        "version": version,
                        "compatible_with": ", ".join(compatible_browsers),
                        "description": item.get("description") or "",
                        "tags": ", ".join(item.get("tags", [])),
                    }
                )

                # Download image if missing
                if img_url and not obj.main_image:
                    try:
                        img_data = requests.get(img_url, timeout=10).content
                        filename = os.path.basename(
                            urllib.parse.urlparse(img_url).path
                        ) or f"{item_id}.jpg"
                        obj.main_image.save(filename, ContentFile(img_data), save=True)
                    except Exception as e:
                        self.stdout.write(self.style.WARNING(f"Image download failed for {title}: {e}"))

                obj.save()
                status = "Created" if created else "Updated"
                self.stdout.write(self.style.SUCCESS(f"{status}: {title}"))

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Failed to process item {item_id}: {e}"))

        self.stdout.write(self.style.SUCCESS("\nThemeForest Shopify templates synced successfully!"))
