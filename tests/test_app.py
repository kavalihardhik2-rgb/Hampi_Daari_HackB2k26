"""Run with:  python -m pytest -q"""
import pytest

from app import app
from hampi import guide, planner
from hampi.data import CLAIMS, SITE_BY_ID, SITES, STARTS

BAZAAR = STARTS["hampi-bazaar"]


# ---------- data ----------

def test_every_site_is_complete():
    for s in SITES:
        assert set(s["name"]) == {"en", "kn", "hi"}, s["id"]
        assert set(s["summary"]) == {"en", "kn", "hi"}, s["id"]
        assert 15.29 < s["lat"] < 15.36 and 76.44 < s["lon"] < 76.50, s["id"]
        assert s["facts"], s["id"]
        for f in s["facts"]:
            assert f["kind"] in ("recorded", "tradition", "uncertain")
            assert f["source"]


def test_claims_point_to_real_sites():
    for c in CLAIMS:
        assert c["verdict"] in guide.VERDICT_LABEL
        assert c["site"] is None or c["site"] in SITE_BY_ID


# ---------- claim checker ----------

@pytest.mark.parametrize("said, verdict", [
    ("The musical pillars are hollow", "false"),
    ("The stone chariot is carved from a single rock", "false"),
    ("Hampi was destroyed by the Mughals", "false"),
    ("the hemakuta temples are jain", "false"),
    ("Krishnadevaraya built the Virupaksha temple", "partly"),
    ("Lotus Mahal was the queen's palace", "unproven"),
    ("britishers cut the pillars", "legend"),
    ("hanuman was born here", "legend"),
    ("the chariot is on the 50 rupee note", "true"),
])
def test_known_claims(said, verdict):
    assert guide.check(said)["verdict"] == verdict


@pytest.mark.parametrize("said", [
    "Sachin scored a century here",
    "Narasimha statue is 100 feet tall",        # right monument, unchecked number
    "The elephant stables are made of gold",
])
def test_unchecked_claims_get_no_verdict(said):
    r = guide.check(said)
    assert r["matched"] is False and r["verdict"] == "unknown"


def test_unknown_is_not_reported_as_false():
    r = guide.check("Sachin scored a century here")
    assert "does not mean it is false" in r["answer"]


def test_unchecked_claim_still_shows_the_record():
    r = guide.check("Narasimha statue is 100 feet tall")
    assert any("6.7 metres" in f["text"] for f in r["related"])


# ---------- questions ----------

@pytest.mark.parametrize("question, expected", [
    ("How tall is the Narasimha statue?", "6.7 metres"),
    ("Who built the Krishna temple and why?", "1513"),
    ("What is the stone chariot?", "Garuda"),
    ("When was the stepped tank found?", "1980s"),
    ("when was hampi destroyed", "1565"),
    ("who founded vijayanagara", "Harihara"),
    ("what does sasivekalu mean", "mustard"),
    ("how many pillars in vittala", "56"),
])
def test_questions_find_the_fact(question, expected):
    r = guide.ask(question)
    assert r["found"]
    assert any(expected in a["text"] for a in r["answers"]), [a["text"] for a in r["answers"]]


@pytest.mark.parametrize("question, expected", [
    ("ವಿಠ್ಠಲ ದೇವಾಲಯದಲ್ಲಿ ಎಷ್ಟು ಸಂಗೀತ ಕಂಬಗಳಿವೆ?", "56"),
    ("ಕೃಷ್ಣ ದೇವಾಲಯವನ್ನು ಯಾರು ಕಟ್ಟಿಸಿದರು?", "1513"),
    ("ನರಸಿಂಹ ಮೂರ್ತಿಯ ಎತ್ತರ ಎಷ್ಟು?", "6.7 metres"),
    ("ಸಾಸಿವೆಕಾಳು ಗಣೇಶ ಎಂದರೇನು?", "mustard"),
    ("ಕಲ್ಲಿನ ರಥ ಎಲ್ಲಿದೆ?", "Garuda"),
])
def test_kannada_questions(question, expected):
    r = guide.ask(question)
    assert r["found"]
    assert any(expected in a["text"] for a in r["answers"])


@pytest.mark.parametrize("question, expected", [
    ("विट्ठल मंदिर में कितने संगीत स्तंभ हैं?", "56"),
    ("कृष्ण मंदिर किसने बनवाया?", "1513"),
    ("नरसिंह प्रतिमा की ऊंचाई कितनी है?", "6.7 metres"),
    ("ससिवेकालु का क्या मतलब है?", "mustard"),
    ("पत्थर का रथ क्या है?", "Garuda"),
])
def test_hindi_questions(question, expected):
    r = guide.ask(question)
    assert r["found"]
    assert any(expected in a["text"] for a in r["answers"])


@pytest.mark.parametrize("question, expected", [
    ("విఠల దేవాలయంలో ఎన్ని సంగీత స్తంభాలు ఉన్నాయి?", "56"),
    ("కృష్ణ దేవాలయం ఎవరు కట్టించారు?", "1513"),
])
def test_telugu_questions(question, expected):
    r = guide.ask(question)
    assert r["found"]
    assert any(expected in a["text"] for a in r["answers"])


@pytest.mark.parametrize("question", [
    "Who won the IPL in 2020?",
    "what is the best biryani in bangalore",
    "python list comprehension",
])
def test_refuses_what_it_does_not_know(question):
    r = guide.ask(question)
    assert r["found"] is False and r["answers"] == [] and r["message"]


# ---------- planner ----------

@pytest.mark.parametrize("minutes", [60, 120, 240, 480])
@pytest.mark.parametrize("mode", ["walk", "cycle", "auto", "bike", "car"])
def test_plan_fits_the_time(minutes, mode):
    p = planner.plan(BAZAAR, SITES, minutes, mode)
    assert p["minutes_used"] <= minutes
    assert len(p["stops"]) + len(p["skipped"]) == len(SITES)
    assert len({s["id"] for s in p["stops"]}) == len(p["stops"])


def test_plan_multi_day_and_week():
    p_day = planner.plan(BAZAAR, SITES, 600, "car")
    assert len(p_day["stops"]) == len(SITES)
    p_week = planner.plan(BAZAAR, SITES, 4200, "bike")
    assert len(p_week["stops"]) == len(SITES)
    assert p_week["over_budget"] is False


def test_more_time_means_more_monuments():
    counts = [len(planner.plan(BAZAAR, SITES, m, "walk")["stops"]) for m in (60, 120, 240, 480)]
    assert counts == sorted(counts) and counts[-1] > counts[0]


def test_top_monuments_are_not_dropped_for_small_ones():
    assert "virupaksha" in [s["id"] for s in planner.plan(BAZAAR, SITES, 120, "walk")["stops"]]
    assert "vittala" in [s["id"] for s in planner.plan(BAZAAR, SITES, 240, "cycle")["stops"]]


def test_must_see_fits_by_dropping_others():
    p = planner.plan(BAZAAR, SITES, 240, "walk", must=["vittala"])
    assert "vittala" in [s["id"] for s in p["stops"]] and p["minutes_used"] <= 240


def test_must_see_is_always_included():
    p = planner.plan(BAZAAR, SITES, 60, "walk", must=["queensbath"])
    assert "queensbath" in [s["id"] for s in p["stops"]]


def test_forced_must_see_can_go_over_budget_and_says_so():
    p = planner.plan(BAZAAR, SITES, 30, "walk", must=["vittala"])
    assert [s["id"] for s in p["stops"]] == ["vittala"] and p["over_budget"] is True


def test_two_opt_never_makes_it_longer():
    route = list(reversed(SITES))
    better = planner._two_opt(BAZAAR, route, "walk")
    assert planner.route_minutes(BAZAAR, better, "walk") <= planner.route_minutes(BAZAAR, route, "walk")


def test_distance_is_sane():
    d = planner.km(SITE_BY_ID["virupaksha"], SITE_BY_ID["vittala"])
    assert 1.5 < d < 2.5


# ---------- web ----------

@pytest.fixture
def client():
    return app.test_client()


def test_pages_load(client):
    assert client.get("/").status_code == 200
    assert client.get("/signs").status_code == 200
    assert b"<svg" in client.get("/sign/vittala").data
    assert client.get("/sign/nowhere").status_code == 404
    assert client.get("/sw.js").status_code == 200


def test_api(client):
    assert len(client.get("/api/sites").get_json()["sites"]) == len(SITES)
    assert client.get("/api/check?q=pillars are hollow").get_json()["verdict"] == "false"
    assert client.get("/api/ask?q=").status_code == 400
    p = client.post("/api/plan", json={"minutes": 240, "mode": "cycle",
                                       "start": {"lat": 15.32, "lon": 76.47}}).get_json()
    assert p["stops"] and p["start"]["name"] == "Your location"
    assert client.post("/api/plan", json={"mode": "rocket"}).status_code == 400
