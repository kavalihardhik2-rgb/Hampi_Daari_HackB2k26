"""Tests for stays and shops nearby. OpenStreetMap is never called here."""
from app import app
from hampi import nearby

SAMPLE = {"elements": [
    {"type": "node", "lat": 15.3355, "lon": 76.4605, "tags": {"tourism": "guest_house", "name": "Far Stay", "phone": "+91 99999 00000"}},
    {"type": "node", "lat": 15.3351, "lon": 76.4601, "tags": {"tourism": "hotel", "name": "Near Stay"}},
    {"type": "way", "center": {"lat": 15.3352, "lon": 76.4602}, "tags": {"amenity": "restaurant", "name": "Cafe"}},
    {"type": "node", "lat": 15.3353, "lon": 76.4603, "tags": {"amenity": "drinking_water"}},
    {"type": "node", "lat": 15.3354, "lon": 76.4604, "tags": {"amenity": "toilets"}},
    {"type": "node", "lat": 15.3356, "lon": 76.4606, "tags": {"amenity": "atm", "name": "SBI ATM"}},
    {"type": "node", "lat": 15.3357, "lon": 76.4607, "tags": {"shop": "convenience"}},
    {"type": "node", "lat": 15.3358, "lon": 76.4608, "tags": {"amenity": "bench"}},
    {"type": "node", "tags": {"tourism": "hotel", "name": "No position"}},
]}


def setup_function():
    nearby._cache.clear()


def test_query_has_every_kind_and_the_point():
    q = nearby.build_query(15.335, 76.46)
    assert "15.33500,76.46000" in q
    for word in ("guest_house", "restaurant", "drinking_water", "toilets", "atm", '["shop"]'):
        assert word in q


def test_parse_groups_sorts_and_skips_junk():
    places = nearby.parse(SAMPLE, 15.335, 76.46)
    kinds = [p["kind"] for p in places]
    assert kinds == ["stay", "stay", "food", "water", "toilet", "atm", "shop"]
    assert places[0]["name"] == "Near Stay"          # nearest first
    assert places[1]["phone"] == "+91 99999 00000"
    assert places[2]["lat"] == 15.3352               # a way uses its centre
    assert all(p["name"] != "No position" for p in places)


def test_parse_keeps_five_per_kind():
    many = {"elements": [{"lat": 15.335 + i / 10000, "lon": 76.46, "tags": {"amenity": "toilets"}} for i in range(9)]}
    assert len(nearby.parse(many, 15.335, 76.46)) == 5


def test_nearby_uses_cache(monkeypatch):
    calls = []
    monkeypatch.setattr(nearby, "fetch", lambda q: calls.append(q) or SAMPLE)
    a = nearby.nearby(15.335, 76.46)
    b = nearby.nearby(15.335, 76.46)
    assert a["live"] and a["source"] == "OpenStreetMap" and a == b and len(calls) == 1


def test_nearby_survives_network_failure(monkeypatch):
    def boom(q):
        raise OSError("no network")
    monkeypatch.setattr(nearby, "fetch", boom)
    r = nearby.nearby(15.335, 76.46)
    assert r == {"live": False, "places": [], "source": "OpenStreetMap"}


def test_api_nearby_by_site_and_by_point(monkeypatch):
    monkeypatch.setattr(nearby, "fetch", lambda q: SAMPLE)
    c = app.test_client()
    r = c.get("/api/nearby?site=vittala").get_json()
    assert r["live"] and len(r["places"]) == 7 and "lat" in r
    r = c.get("/api/nearby?lat=15.335&lon=76.46").get_json()
    assert r["live"]


def test_api_nearby_rejects_bad_input():
    c = app.test_client()
    assert c.get("/api/nearby?site=nowhere").status_code == 400
    assert c.get("/api/nearby?lat=abc&lon=1").status_code == 400
    assert c.get("/api/nearby").status_code == 400
    assert c.get("/api/nearby?lat=12.97&lon=77.59").status_code == 400   # Bengaluru
