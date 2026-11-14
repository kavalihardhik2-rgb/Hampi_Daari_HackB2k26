# Project memory

This is the short version of everything about Hampi Daari, for whoever picks the project up next. Read it first, then check the repository itself, because the code may have moved on since this was written.

## What the project is

Hampi Daari is a hackathon project: a heritage visitor guide for Hampi, Karnataka, that runs in the browser. Domain: tourism and cultural heritage.

It helps visitors find monuments, plan a visit, read facts that carry their sources, check common historical claims and open a monument's page from a QR signboard.

The guide would rather refuse than invent. It looks answers up in a local fact file and never writes history of its own.

## What is in the repository

```text
hampi-daari/
|-- app.py
|-- README.md
|-- PITCH.md
|-- requirements.txt
|-- run.sh
|-- run.bat
|-- docs/                  the six project documents, this one included
|-- hampi/
|   |-- __init__.py
|   |-- data.py
|   |-- text.py
|   |-- search.py
|   |-- guide.py
|   `-- planner.py
|-- data/
|   |-- sites.json
|   `-- claims.json
|-- templates/
|   |-- index.html
|   `-- signs.html
|-- static/
|   |-- app.js
|   |-- style.css
|   `-- vendor/leaflet/
`-- tests/
    |-- __init__.py
    `-- test_app.py
```

`requirements.txt` lists Flask, Segno and pytest. The backend is Python and the frontend is plain JavaScript. There is no build step and no database.

## Features in the code

### Finding monuments

- A Leaflet map with 18 monument locations.
- A list of places grouped by zone.
- A detail sheet for each monument: summary, facts in English, sources, fact categories, visitor tip.
- A visitor can mark a monument as seen.
- Seen progress is kept in the browser's local storage.

### Location

- Browser GPS sets the visitor's position where the browser allows it.
- A visitor can tap the map to set a position by hand. The app falls back to this when GPS is missing or refused.
- The app shows up to three closest monuments with rough distance and compass direction.

### Languages and read-aloud

- Interface labels, monument names and summaries are in English, Kannada and Hindi.
- The browser reads the summary aloud. In English it reads the facts as well.
- Facts, questions and claims are English-only in this version.
- The Kannada and Hindi text still needs review by native speakers.

### Guide and claim checker

- 58 facts come from the 18 site records.
- Four general Hampi facts are added in `hampi/guide.py`.
- 20 prepared claims are stored in `data/claims.json`.
- A question is answered by looking up facts with our own TF-IDF weighting and cosine similarity.
- A claim is checked against the claim index, then a word-coverage check, then a check on any numbers.
- A question or claim the data does not cover gets a refusal or `unknown`. Nothing is generated. An `unknown` reply says the claim is not necessarily false.

### Visit planner

- Modes: `walk`, `cycle`, `auto`.
- Start points: Hampi Bazaar bus stand, Kamalapura bus stand, Vittala temple parking, or the visitor's own coordinates.
- Distance: haversine multiplied by a fixed 1.35.
- Assumed speeds: 4 km/h on foot, 10 km/h by cycle, 18 km/h by auto.
- Method: greedy insertion by importance per extra minute, then a 2-opt pass.
- Must-see monuments are supported. The result lists sites left out and carries an `over_budget` flag.
- The Plan tab states that times and distances are estimates.

### QR signboards

- `/signs` shows printable signboards for every monument.
- `/sign/<site_id>` shows one.
- Segno makes inline SVG QR codes that open the monument in the app.
- The codes use `PUBLIC_URL` if it is set. Otherwise they use the laptop's LAN IP and port.

## How it is built

| Concern | Implementation |
|---|---|
| Server | Flask (`app.py`) |
| Interface | HTML, CSS, plain JavaScript |
| Map | Leaflet (copied into the repository) with OpenStreetMap tiles |
| Data | UTF-8 JSON (`data/sites.json`, `data/claims.json`) |
| Text handling | Our tokeniser, stopwords, small stemmer and synonyms (`hampi/text.py`) |
| Search | Our TF-IDF and cosine similarity (`hampi/search.py`) |
| Question and claim rules | `hampi/guide.py` |
| Route planning | Haversine, greedy insertion, 2-opt (`hampi/planner.py`) |
| QR codes | Segno |
| Location | Browser Geolocation API |
| Read-aloud | Browser Speech Synthesis API |
| Saved settings | localStorage |
| Tests | pytest (`tests/test_app.py`) |

The project uses no deep-learning model, no LLM and no hosted chatbot. Describe it as word-based retrieval with a heuristic route planner. Do not describe it as generative AI.

## API

| Endpoint | Method | Purpose |
|---|---|---|
| `/` | GET | Main page |
| `/signs` | GET | All printable signboards |
| `/sign/<site_id>` | GET | One signboard |
| `/api/sites` | GET | Monument records and start locations |
| `/api/ask?q=...` | GET | Facts for a question |
| `/api/check?q=...` | GET | Check a statement against prepared claims |
| `/api/plan` | POST | Build a route from start, time, mode and must-sees |

## Numbers to remember

- 18 monument records.
- 58 facts inside those records.
- 20 prepared claims.
- Three interface languages: English, Kannada, Hindi.
- Three zones: Sacred centre, Royal centre, Riverside.
- Three fixed start locations.
- 48 tests.

These were counted on 12 November 2026. Count again if the data or the tests change.

## Warnings about the information

Say these out loud in the pitch. Do not bury them.

1. The facts were compiled with AI assistance and only some were cross-checked online. Do not call the dataset verified until each statement has been checked independently.
2. Coordinates are approximate and may be off by tens of metres, some by more than a hundred.
3. The Kannada and Hindi text needs review by native speakers.
4. Facts, questions and claims are English-only.
5. Map tiles need internet. Pins and labels stay when tiles fail, but that is not an offline app.
6. GPS works only on localhost or HTTPS. On local Wi-Fi the visitor taps the map.
7. Distances are straight lines multiplied by 1.35, not real paths.
8. Travel speeds and visit times are assumptions.
9. A QR code made with a temporary LAN address is not a permanent signboard link.

## Commands

Install and run:

```bash
pip install -r requirements.txt
python app.py
```

Open `http://localhost:5000`.

Run the tests:

```bash
python -m pytest -q
```

Run them on the current code and note the actual result before telling anyone the app is validated.

## Rules that matter most

- Keep the Flask, JSON and plain JavaScript design unless a clear requirement forces a change.
- Keep data, search, claim logic, route planning and interface in their own places.
- Do not invent historical content. Every new fact or claim needs a source that can be traced.
- Keep recorded information, tradition and uncertainty apart.
- Keep the claim checker's refusal. `unknown` is not `false`.
- Never let an unchecked number ride on a nearby claim's verdict.
- Names and summaries always have all three languages.
- Do not claim Kannada or Hindi question support until it is built and evaluated.
- Route output stays labelled approximate until there is routing along real paths.
- Escape dynamic content before putting it into HTML.
- Add tests when you change search thresholds, claim matching, route calculation, the API or the data format.
- Update the README and the six documents when the code or the scope changes.

The full list is in `DEVELOPMENT_RULES.md`.

## What to do next

1. Run the project on the team's laptops and run the tests.
2. Audit the 18 records, 58 facts and 20 claims against reliable sources. Add exact references and a review status.
3. Check the coordinates and the planner's assumptions.
4. Build an evaluation set of questions and claims, some that should match and some that should not.
5. Review the Kannada and Hindi, and test on phones and desktops, including accessibility.
6. Set up a stable hosted URL before any signboard goes up on site.
7. Leave offline caching, search in other languages, content review tools and real path routing until the baseline can be trusted.

## Built and not built

Built: everything under "Features in the code" and every endpoint under "API".

Not built, or not shown to work: independent verification of all the historical content, production hosting, a database or admin dashboard, profiles that follow a visitor across devices, turn-by-turn navigation, a full offline cache, facts or search in Kannada and Hindi, any link to ASI or the tourism department, and a directory of licensed guides.

Do not describe a planned item as finished until it is in the repository and tested.

## Before you change anything

This applies to every teammate and to any coding assistant.

1. Read this file, then `PRD.md`, `SYSTEM_ARCHITECTURE.md`, `DEVELOPMENT_RULES.md`, `DESIGN_SYSTEM.md` and `PROJECT_TASK.md`.
2. Look at the repository as it is now. It may have changed.
3. Pin down the exact requirement and which files it touches.
4. Leave existing features alone unless the requirement changes them.
5. Do not guess a historical fact or a source.
6. Make the smallest change that does the job, and add tests.
7. Run the tests and report what actually happened.
8. Update the documents with confirmed changes only.

Last updated on 12 November 2026, after the code was brought in line with these documents. Change the date and the contents when the project changes.
