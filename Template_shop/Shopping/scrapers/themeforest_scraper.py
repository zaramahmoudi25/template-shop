from curl_cffi import requests
from bs4 import BeautifulSoup
import re


def get_item(url):
    session = requests.Session()

    # Step 1 – Initial request (Cloudflare may challenge here)
    r1 = session.get(url, impersonate="chrome124", http2=True, timeout=30)

    # Step 2 – repeat request (Cloudflare solved, cookies present)
    r2 = session.get(url, impersonate="chrome124", http2=True, timeout=30)

    html = r2.text
    soup = BeautifulSoup(html, "html.parser")

    # ====== BASIC INFO ======
    title = soup.select_one("h1[itemprop='name']")
    title = title.get_text(strip=True) if title else None

    # PRICE
    price_tag = soup.select_one(".price")
    price = None
    if price_tag:
        price_text = price_tag.get_text(strip=True).replace("$", "").replace(",", "")
        try:
            price = float(price_text)
        except:
            pass

    # MAIN IMAGE
    main_image = soup.select_one(".item-preview img")
    main_image_url = main_image["src"] if main_image else None

    # SALES COUNT
    sales = None
    sales_tag = soup.select_one(".meta-attributes .sales-count")
    if sales_tag:
        sales = int(re.sub(r"\D", "", sales_tag.get_text()))

    # ====== RATING ======
    rating = None
    rating_count = None

    rating_tag = soup.select_one(".rating")
    if rating_tag:
        score_match = re.search(r"([0-9.]+)\/5", rating_tag.get_text())
        if score_match:
            rating = float(score_match.group(1))

    count_tag = soup.select_one(".rating-count")
    if count_tag:
        rating_count = int(re.sub(r"\D", "", count_tag.get_text()))

    # CATEGORY
    category = soup.select_one(".meta-categories a")
    category = category.get_text(strip=True) if category else "Shopify"

    # ====== META ATTRIBUTES ======
    meta = {
        "version": None,
        "last_update": None,
        "compatible_with": None
    }

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

    # ====== DESCRIPTION ======
    description = ""
    desc_block = soup.select_one(".user-html")
    if desc_block:
        description = desc_block.get_text("\n", strip=True)

    # ====== TAGS / KEYWORDS ======
    tags = []
    tag_items = soup.select(".meta-keywords a")
    for t in tag_items:
        tags.append(t.get_text(strip=True))

    return {
        "title": title,
        "price": price,
        "main_image_url": main_image_url,
        "sales": sales,
        "rating": rating,
        "rating_count": rating_count,
        "category": category,

        # Extended attributes
        "version": meta["version"],
        "last_update": meta["last_update"],
        "compatible_with": meta["compatible_with"],

        "description": description,
        "tags": tags
    }
