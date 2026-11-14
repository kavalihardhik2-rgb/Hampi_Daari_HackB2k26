"""Stays, food, water, toilets, ATMs and shops near a point, from OpenStreetMap.

This is live third-party data, kept apart from the fact base. It changes all
the time and we do not check it, so the app labels it with its source.
"""
import json
import math
import time
import urllib.parse
import urllib.request

OVERPASS_URL = "https://overpass-api.de/api/interpreter"
TIMEOUT_S = 8
CACHE_S = 3600
PER_KIND = 5

# kind -> (OpenStreetMap filter, search radius in metres)
KINDS = {
    "stay": ('["tourism"~"^(hotel|guest_house|hostel|motel|apartment|camp_site|chalet)$"]', 5000),
    "food": ('["amenity"~"^(restaurant|cafe|fast_food|food_court)$"]', 1500),
    "water": ('["amenity"="drinking_water"]', 1500),
    "toilet": ('["amenity"="toilets"]', 1500),
    "atm": ('["amenity"~"^(atm|bank)$"]', 5000),
    "shop": ('["shop"]', 1500),
}
ORDER = list(KINDS)

_cache = {}


def distance_m(lat1, lon1, lat2, lon2):
    r = 6371000.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = p2 - p1, math.radians(lon2 - lon1)
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(h))


def build_query(lat, lon):
    parts = [f"nwr{flt}(around:{radius},{lat:.5f},{lon:.5f});" for flt, radius in KINDS.values()]
    return "[out:json][timeout:15];(" + "".join(parts) + ");out center tags 300;"


def kind_of(tags):
    """Which of our kinds an OpenStreetMap element belongs to, or None."""
    tourism, amenity = tags.get("tourism", ""), tags.get("amenity", "")
    if tourism in ("hotel", "guest_house", "hostel", "motel", "apartment", "camp_site", "chalet"):
        return "stay"
    if amenity in ("restaurant", "cafe", "fast_food", "food_court"):
        return "food"
    if amenity == "drinking_water":
        return "water"
    if amenity == "toilets":
        return "toilet"
    if amenity in ("atm", "bank"):
        return "atm"
    if "shop" in tags:
        return "shop"
    return None


def parse(data, lat, lon):
    """Turn an Overpass answer into a short list per kind, nearest first."""
    grouped = {k: [] for k in ORDER}
    seen = set()
    for el in data.get("elements", []):
        tags = el.get("tags", {})
        kind = kind_of(tags)
        plat = el.get("lat", el.get("center", {}).get("lat"))
        plon = el.get("lon", el.get("center", {}).get("lon"))
        if kind is None or plat is None or plon is None:
            continue
        key = (kind, tags.get("name"), round(plat, 4), round(plon, 4))
        if key in seen:
            continue
        seen.add(key)
        grouped[kind].append({
            "kind": kind,
            "name": tags.get("name:en") or tags.get("name"),
            "lat": plat,
            "lon": plon,
            "distance_m": round(distance_m(lat, lon, plat, plon)),
            "phone": tags.get("phone") or tags.get("contact:phone"),
        })
    out = []
    for kind in ORDER:
        out += sorted(grouped[kind], key=lambda p: p["distance_m"])[:PER_KIND]
    return out


def fetch(query):
    """Ask Overpass. Kept separate so tests can replace it."""
    body = urllib.parse.urlencode({"data": query}).encode()
    req = urllib.request.Request(OVERPASS_URL, data=body,
                                 headers={"User-Agent": "HampiDaari/1.0 (heritage guide)"})
    with urllib.request.urlopen(req, timeout=TIMEOUT_S) as resp:
        return json.loads(resp.read().decode("utf-8"))


def nearby(lat, lon):
    """Places near (lat, lon). live is False when OpenStreetMap could not be reached."""
    key = (round(lat, 3), round(lon, 3))
    hit = _cache.get(key)
    if hit and time.time() - hit[0] < CACHE_S:
        return hit[1]
    try:
        places = parse(fetch(build_query(lat, lon)), lat, lon)
    except Exception:
        return {"live": False, "places": [], "source": "OpenStreetMap"}
    result = {"live": True, "places": places, "source": "OpenStreetMap"}
    _cache[key] = (time.time(), result)
    return result
