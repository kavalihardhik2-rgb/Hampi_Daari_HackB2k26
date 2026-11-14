"""Loads the fact base. Everything the app says comes from these two files."""
import json
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def _load(name):
    with open(DATA_DIR / name, encoding="utf-8") as f:
        return json.load(f)


SITES = _load("sites.json")
CLAIMS = _load("claims.json")
SITE_BY_ID = {s["id"]: s for s in SITES}

# Places a visitor is likely to start from.
STARTS = {
    "hampi-bazaar": {"name": "Hampi Bazaar bus stand", "lat": 15.3349, "lon": 76.4612},
    "kamalapura": {"name": "Kamalapura bus stand", "lat": 15.3067, "lon": 76.4760},
    "vittala-parking": {"name": "Vittala temple parking", "lat": 15.3395, "lon": 76.4835},
}
