# Hampi Daari

A visitor guide for Hampi — every monument on a map, every fact with its source, and an honest "I have no record for that" when it has none. Works offline, speaks four languages, reads monuments aloud, and even identifies them from photos.

**Problem statement (Tourism):** Hampi's monuments are spread over 26 km² with very little signage. Visitors miss half the sites or depend on unlicensed guides who invent the history.

---

## Features

| Problem | What the app does | Where |
| --- | --- | --- |
| Monuments are spread out | Interactive map of 18 monuments with "closest to you", distance, direction, and a progress bar of what you've seen | `static/app.js` |
| Visitors miss half the sites | **Route planner** — pick your time budget (2 h to 1 week), travel mode (walk / cycle / auto / bike / car), and get an optimised itinerary with day-by-day splits for multi-day plans | `hampi/planner.py` |
| Very little signage | **Printable signboards** with QR codes for each monument — scan and the monument opens on your phone with facts, audio, and sources | `/signs`, `templates/signs.html` |
| Guides make up the history | **Claim checker** — type what the guide said and get a verdict backed by sources. Every fact is labelled *On record*, *Story*, or *Not known for sure* | `hampi/guide.py`, `data/claims.json` |
| Language barrier | UI in **English, ಕನ್ನಡ, हिंदी, and తెలుగు**. Questions can be asked in Kannada, Hindi or Telugu — regional words are mapped to English tokens automatically | `hampi/text.py`, `static/app.js` |
| No audio guides available | **Audio Guide & Audiobook** — every monument has a Brief Audio and a Full Story narrated with the best available voice (Siri / Natural / Neural), with play/pause, progress bar, and sentence-by-sentence chunking to avoid browser cutoffs | `static/app.js` |
| Can't identify a monument | **Photo-based monument lookup** — upload or snap a photo and the app matches it against sample images using client-side canvas comparison | `static/app.js`, `static/samples/` |
| No internet at the site | **Offline PWA** — service worker caches the app shell, map data, and assets; works without internet (Ask/Check buttons gracefully show "Needs internet") | `static/sw.js`, `static/manifest.json` |
| Accessibility | **Large-text toggle** and **voice input** (mic button using Web Speech API, with language auto-detection from current UI language) | `static/app.js`, `static/style.css` |

---

## Run it

You need **Python 3.9** or newer.

**Windows:** double-click `run.bat`

**Mac / Linux:**

```
./run.sh
```

**Or by hand:**

```
pip install -r requirements.txt
python app.py
```

Open http://localhost:5000. The terminal also prints an address like `http://192.168.x.x:5000` — any phone on the same Wi-Fi or hotspot can use it, and the QR codes on the signboards point to it.

### Tests

```
python -m pytest -q          # 69 tests
python evaluate.py           # 60-item evaluation suite
```

---

## How the search works

Questions and claims are matched with **TF-IDF weighting and cosine similarity**, written from scratch in `hampi/search.py` (~60 lines, no ML library). Each fact is one document. A question becomes a vector and is compared with every fact. This is classic information retrieval — nothing is trained and no language model is involved.

**Refusal by design:** If the best match is weak, or fewer than half of the question's words appear in the matched fact, the app answers "I have no record for that". A language model would produce a confident paragraph — which is exactly what the bad guides do.

**Claim checker extra rule:** Any number in the visitor's sentence must appear in the stored claim, so "the statue is 100 feet tall" is not matched to a claim about the statue's name. Unmatched claims come back as "not in my list" with a note that this doesn't make them false.

**Regional language support:** `hampi/text.py` maps ~80 common Kannada, Hindi, and Telugu words (temple names, "who", "when", "built", "pillar", etc.) to English tokens before tokenising, so visitors can ask questions in their own language.

## How the planner works

The planner picks stops to maximise value inside a time limit. `hampi/planner.py` uses **greedy insertion followed by 2-opt** local search. Value triples with each importance star, so the Vittala temple is worth a long walk but doesn't always beat four nearby monuments.

**Travel modes:** Walk (4 km/h), Cycle (10), Auto (18), Bike (22), Car (28).

**Duration options:** 2 h, 4 h, 6 h, 8 h, 1 Day, 2 Days, 3 Days, 1 Week — multi-day plans show a day-by-day itinerary with header dividers.

Tap a left-out monument to force it in. If forced monuments don't fit, the plan goes over the limit and says so.

## How the audio guide works

When you open a monument (from the list, the map, or by scanning a QR code), the **Audio Guide** card appears with two modes:

- **⚡ Brief Audio** — a short welcome narration: monument name, zone, summary, and visitor tip
- **📖 Full Story / Audiobook** — a chapter-by-chapter narration covering history, architecture, legends, and mysteries, built from all the monument's facts

The app selects the **best available voice** (prioritising Siri, Samantha, Natural, Neural, Aria, Google voices) and narrates sentence-by-sentence with a live progress bar. Long narratives are chunked to prevent browser speech synthesis cutoffs.

---

## Files

```
app.py                Flask server and API routes
evaluate.py           60-item evaluation runner
hampi/
  data.py             loads the JSON files
  text.py             tokeniser, stemmer, synonyms, regional word mapping
  search.py           TF-IDF index (~60 lines)
  guide.py            ask() and check()
  planner.py          route planner (greedy + 2-opt)
data/
  sites.json          18 monuments: position, names (en/kn/hi), summaries, facts, sources
  claims.json         20 common guide claims with verdicts
templates/
  index.html          main app
  signs.html          printable signboards
static/
  app.js              front-end: map, planner, guide, audio, photo lookup
  style.css           all styles
  sw.js               service worker (offline PWA)
  manifest.json       web app manifest
  samples/            6 monument photos for photo lookup
  vendor/             Leaflet map library
tests/
  test_app.py         69 tests
  eval_set.json       60-item evaluation set
docs/                 requirements, architecture, design, rules, tasks, memory
PITCH.md              demo script and jury questions
```

All content lives in the two JSON files. To add a monument, add one block to `sites.json`. To cover another place (Badami, Pattadakal, Mysuru), replace the two JSON files and the map centre in `app.js`. No other code changes.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Backend | Python 3.9+, Flask |
| Search | Custom TF-IDF + cosine similarity (no ML) |
| Frontend | Vanilla JavaScript, Leaflet.js (maps) |
| Audio | Web Speech Synthesis API (browser-native, no server) |
| Voice input | Web Speech Recognition API |
| Photo match | Client-side canvas pixel comparison |
| Offline | Service Worker, Web App Manifest (PWA) |
| QR codes | segno (Python) |
| Tests | pytest |

**Zero external JS frameworks. Zero ML models. Zero API keys. Runs entirely on a laptop.**

---

## Limits

- The facts were compiled with AI help. A handful were cross-checked online: dates and sizes for the Narasimha statue, the two Ganeshas, the Krishna temple and the Vittala temple. Check the rest against the ASI boards or the UNESCO listing before calling the data verified. Until then, call it curated.
- Coordinates are approximate. Pins may be 50–150 metres off. Correct them from a reliable map.
- Detailed facts are in English. Summaries and the full interface are in four languages. The Kannada, Hindi, and Telugu text needs a read-through by a native speaker.
- Map tiles need internet. Without them, the pins and labels still show on a plain background.
- GPS works only on `localhost` or HTTPS (a browser rule). On a phone over Wi-Fi, use "Tap map to set my spot".
- Distances are straight lines × 1.35, not real walking paths. Speeds and visit times are estimates.
- Audio narration quality depends on the browser's available voices. Safari and Chrome on modern devices have the best natural voices.
- QR codes printed while the app runs on a laptop point to that laptop. Set `PUBLIC_URL` to a hosted address before printing boards for real use.
