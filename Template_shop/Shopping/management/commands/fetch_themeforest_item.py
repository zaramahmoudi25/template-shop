from django.core.management.base import BaseCommand
from Shopping.models import ThemeForestItem
from bs4 import BeautifulSoup
from curl_cffi import requests
import re


def scrape_themeforest_item(url):
    session = requests.Session()
    # Initial request to handle Cloudflare
    r1 = requests.get(url, impersonate="chrome124", timeout=30)
    r2 = requests.get(url, impersonate="chrome124", timeout=30)
    soup = BeautifulSoup(r2.text, "html.parser")

    # Extract basic info
    title_tag = soup.select_one("h1[itemprop='name']")
    title = title_tag.get_text(strip=True) if title_tag else None

    price_tag = soup.select_one(".price")
    price = None
    if price_tag:
        price_text = price_tag.get_text(strip=True).replace("$", "").replace(",", "")
        try:
            price = float(price_text)
        except:
            pass

    main_image = soup.select_one(".item-preview img")
    main_image_url = main_image["src"] if main_image else None

    sales_tag = soup.select_one(".meta-attributes .sales-count")
    sales = int(re.sub(r"\D", "", sales_tag.get_text())) if sales_tag else None

    rating_tag = soup.select_one(".rating")
    rating = None
    if rating_tag:
        match = re.search(r"([0-9.]+)\/5", rating_tag.get_text())
        if match:
            rating = float(match.group(1))

    rating_count_tag = soup.select_one(".rating-count")
    rating_count = int(re.sub(r"\D", "", rating_count_tag.get_text())) if rating_count_tag else None

    category_tag = soup.select_one(".meta-categories a")
    category = category_tag.get_text(strip=True) if category_tag else "Shopify"

    # Extended meta attributes
    meta = {"version": None, "last_update": None, "compatible_with": None}
    items = soup.select(".meta-attributes .meta-attributes__content .attribute")
    for item in items:
        label = item.select_one(".attribute-label")
        value = item.select_one(".attribute-value")
        if not label or not value:
            continue
        key = label.get_text(strip=True)
        val = value.get_text(strip=True)
        if key in ["Version", "نسخه"]:
            meta["version"] = val
        if key in ["Last Update", "آخرین بروزرسانی"]:
            meta["last_update"] = val
        if key in ["Compatible With", "سازگار با"]:
            meta["compatible_with"] = val

    # Description
    description = ""
    desc_block = soup.select_one(".user-html")
    if desc_block:
        description = desc_block.get_text("\n", strip=True)

    # Tags
    tags = [t.get_text(strip=True) for t in soup.select(".meta-keywords a")]

    return {
        "title": title,
        "themeforest_url": url,
        "main_image_url": main_image_url,
        "price": price,
        "sales": sales,
        "rating": rating,
        "rating_count": rating_count,
        "category": category,
        "version": meta["version"],
        "last_update": meta["last_update"],
        "compatible_with": meta["compatible_with"],
        "description": description,
        "tags": tags
    }


class Command(BaseCommand):
    help = "Fetch a ThemeForest item and save it to the database"

    def add_arguments(self, parser):
        parser.add_argument("url", type=str, help="ThemeForest product URL")

    def handle(self, *args, **kwargs):
        url = kwargs["url"]
        data = scrape_themeforest_item(url)

        item, created = ThemeForestItem.objects.update_or_create(
            themeforest_url=url,
            defaults=data
        )

        if created:
            self.stdout.write(self.style.SUCCESS(f"Created: {item.title}"))
        else:
            self.stdout.write(self.style.SUCCESS(f"Updated: {item.title}"))
