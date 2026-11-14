# System architecture

## Purpose

This document describes how Hampi Daari is put together today. Ideas that are not built are kept in a separate section at the end.

## Summary

Hampi Daari has a small Flask backend, a frontend in plain HTML, CSS and JavaScript, JSON files for content, and a few Python modules for text search and route planning. It needs no database and no frontend build step.

```text
                         Visitor's browser
                                |
                 HTML + CSS + plain JavaScript
                  templates/index.html
                  static/app.js, style.css
                                |
              +-----------------+------------------+
              |                 |                  |
          Leaflet map       Browser APIs       fetch / JSON
       OpenStreetMap tiles   GPS + speech            |
                                                 Flask app.py
                                                     |
                      +------------------------------+-----------------------+
                      |                              |                       |
                 /api/sites                    /api/ask, /api/check       /api/plan
                      |                              |                       |
             hampi/data.py                    hampi/guide.py          hampi/planner.py
                      |                              |                       |
            data/sites.json              hampi/search.py (TF-IDF)   haversine + heuristics
            data/claims.json              hampi/text.py helpers      (greedy + 2-opt)

                 /signs and /sign/<id>
                           |
                  templates/signs.html
                           |
                    Segno QR SVG
```

## Technology

| Layer | Technology | What it does |
|---|---|---|
| Backend | Python 3.9+ and Flask | Web server, HTML routes, JSON API |
| Frontend | HTML, CSS, plain JavaScript | The interface and everything the visitor does in it |
| Map | Leaflet, copied into the repository | Interactive map and monument markers |
| Map tiles | OpenStreetMap tile service | Base map. Needs internet |
| Content | JSON files | Monument records and the claim list |
| Search | Our own TF-IDF weighting and cosine similarity | Matches a question or claim to stored text |
| Text handling | Python standard library | Splitting into words, stopword removal, a small stemmer, synonyms |
| Route planning | Haversine distance, greedy insertion, 2-opt | Orders monuments inside a time limit, approximately |
| QR codes | Segno | SVG QR codes on the printable signboards |
| Tests | pytest | Data, guide, planner and route tests |
| Browser features | Geolocation, Speech Synthesis, localStorage | Location, read-aloud, saved language and progress |

`requirements.txt` contains `flask>=3.0`, `segno>=1.6` and `pytest>=8.0`.

## Repository layout

```text
hampi-daari/
|-- app.py                       Flask application and HTTP routes
|-- requirements.txt             Python dependencies
|-- run.sh                       Mac/Linux launch script
|-- run.bat                      Windows launch script
|-- README.md                    How to run it and what it does
|-- PITCH.md                     Hackathon pitch and demo notes
|-- docs/                        These six project documents
|-- hampi/
|   |-- __init__.py
|   |-- data.py                  Loads JSON content and start locations
|   |-- text.py                  Tokeniser, stemmer, stopwords, synonyms
|   |-- search.py                TF-IDF index and similarity search
|   |-- guide.py                 Question answering and claim checking
|   `-- planner.py               Route planning inside a time limit
|-- data/
|   |-- sites.json               18 monument records
|   `-- claims.json              20 prepared guide claims and verdicts
|-- templates/
|   |-- index.html               Main page
|   `-- signs.html               Printable signboard template
|-- static/
|   |-- app.js                   Interface logic: language, map, guide, planner
|   |-- style.css                Styles for phone and desktop
|   `-- vendor/leaflet/          Leaflet files and marker images
`-- tests/
    `-- test_app.py              Automated tests
```

## Data

### `data/sites.json`

The file holds 18 monument records. Each record has:

- `id`: a fixed identifier used by the API, the map and the QR links.
- `name`: the name in English (`en`), Kannada (`kn`) and Hindi (`hi`).
- `aliases`: other names used to spot the monument in a visitor's text.
- `zone`: a grouping label, one of Sacred centre, Royal centre or Riverside.
- `lat`, `lon`: approximate map coordinates.
- `visit_min`: estimated minutes to spend at the site.
- `priority`: a 1 to 5 importance value used by the route planner.
- `summary`: a short description in English, Kannada and Hindi.
- `facts`: one or more facts, each with `text`, `kind` and `source`.
- `tip`: visitor advice shown on the detail sheet.

A fact's `kind` is `recorded`, `tradition` or `uncertain`. The kind and the source are labels we attached. They do not prove the statement is accurate. The data must be audited before anyone presents the app as an authoritative guide.

### `data/claims.json`

The file holds 20 claim records. Each has:

- `id`: a fixed claim identifier.
- `site`: the related monument ID, or `null` for a claim about Hampi in general.
- `claim`: the standard wording.
- `alt`: other ways a visitor might phrase it.
- `verdict`: one of `true`, `false`, `partly`, `legend` or `unproven`.
- `answer`: the explanation shown when a match is accepted.

A statement that matches nothing gets `unknown`. This is not a sixth stored verdict. It means the statement did not pass the matching and coverage checks.

### Start locations

`hampi/data.py` defines three fixed start points: Hampi Bazaar bus stand, Kamalapura bus stand and Vittala temple parking. A visitor's own position, from GPS or a map tap, can also be sent to the planner as latitude and longitude.

## Backend modules

### `app.py`

Creates the Flask app and defines the routes.

Page routes:

| Route | Behaviour |
|---|---|
| `GET /` | The main application |
| `GET /signs` | All printable signboards |
| `GET /sign/<site_id>` | One signboard. An unknown ID returns 404 |

API routes:

| Route | Input | Behaviour |
|---|---|---|
| `GET /api/sites` | None | Returns all sites and start locations |
| `GET /api/ask?q=...` | A question | Returns matching facts or a refusal |
| `GET /api/check?q=...` | A statement | Returns a prepared verdict or `unknown` |
| `POST /api/plan` | JSON with `minutes`, `mode`, `start` and optional `must` | Returns an ordered route and the sites left out |

Question and claim text is trimmed and cut to 300 characters. The planner keeps the requested time between 30 and 720 minutes and rejects an invalid travel mode or start point.

### `hampi/data.py`

Loads the two JSON files as UTF-8, exposes `SITES`, `CLAIMS` and `SITE_BY_ID`, and defines the start locations. Everything is held in memory. There is no database.

### `hampi/text.py`

Prepares text for search in four steps:

1. Lowercase it and split it into words with a regular expression.
2. Drop a fixed list of stopwords.
3. Strip a few common suffixes.
4. Optionally add synonyms from a hand-written dictionary.

It is a small helper tuned for this project, not a full stemmer and not multilingual.

### `hampi/search.py`

Builds an `Index` over facts or claims.

- Each document becomes a count of its words.
- Document frequency gives each word an inverse document frequency.
- Term frequency is log-weighted.
- Vectors are normalised.
- A query is turned into the same kind of vector.
- Cosine similarity is the dot product of the two normalised vectors.
- A result is returned only if it passes a score threshold and a rule that at least half of the query's words are covered.

The code uses only Python's `math` module and `collections.Counter`. The project does not import scikit-learn, PyTorch, TensorFlow or any LLM framework.

### `hampi/guide.py`

Builds the fact index from every monument fact plus four general Hampi facts. It builds a second index from each claim's standard wording and alternates.

How a question is handled:

1. Look for a monument name or alias in the question.
2. Search that monument's facts first.
3. If nothing is found, search all facts.
4. When scores are close, put recorded facts before stories.
5. If no fact matches but a monument was named, show a few facts for that monument.
6. Otherwise return a refusal.

How a claim is handled:

1. Look for a monument name or alias in the statement.
2. Find the closest prepared claim.
3. If that claim belongs to a different monument, search again inside the named one.
4. Check that enough of the statement's words appear in the claim and its alternates.
5. Reject the match if the visitor gave a number that the stored claim does not contain.
6. Return the stored verdict and answer, or `unknown` with related facts if there are any.

This is retrieval and matching. It is not a generative chatbot and not an independent fact-checking service.

### `hampi/planner.py`

Estimates a route from a start point and a list of sites.

- The haversine formula gives the straight-line distance between two coordinates.
- A fixed multiplier of 1.35 stands in for winding paths.
- Speeds are assumed: 4 km/h on foot, 10 km/h by cycle, 18 km/h by auto.
- Each site has an estimated visit time (`visit_min`).
- Must-see sites go in first.
- Greedy insertion then adds whichever site gives the most importance per extra minute, at the position where it costs the least, as long as it fits.
- A 2-opt pass reverses stretches of the route when that shortens the total time.

The result has the stops, the sites left out, arrival times, distance, time used, the time limit and an `over_budget` flag. These are estimates. They are not navigation and not guaranteed travel times.

## Frontend

### Main page

`templates/index.html` holds the page structure and the tab containers. `static/app.js` fills them in and handles every interaction.

The interface has Map, Places, Guide, Plan and Signs sections. On a wide screen the map and the side panel sit next to each other. On a narrow screen the app shows one tab at a time.

### Map

Leaflet draws the map and the site markers, and OpenStreetMap supplies the tiles. If tiles fail to load, the frontend keeps the markers and shows name labels for the higher-priority sites. The visitor can set a location by tapping the map or by asking the browser for a GPS position.

### Saved state and speech

- The chosen language is stored under the `hd-lang` key in local storage.
- Seen status is stored under `hd-seen`.
- Both belong to that browser on that device. Nothing is stored on the server.
- Read-aloud uses `SpeechSynthesisUtterance`. It asks for an `en-IN`, `kn-IN` or `hi-IN` voice, and whether one exists depends on the browser.

### Signboards

`templates/signs.html` lays out boards for printing. `app.py` uses Segno to make inline SVG QR codes that point to `/#site/<site_id>` on the configured public URL or the laptop's LAN address.

## Request flows

### Opening the app

```text
Browser -> GET /
Flask -> render index.html
Browser -> GET /api/sites
Flask -> SITES and STARTS from memory -> JSON
JavaScript -> create the map, draw markers and list, set up tabs
```

### Asking a question

```text
Visitor question
   -> JavaScript GET /api/ask?q=...
   -> app.py validates the input
   -> guide.ask()
   -> search.Index searches the facts
   -> matching facts with sources, or a refusal
   -> JavaScript shows the result
```

### Checking a claim

```text
Visitor statement
   -> JavaScript GET /api/check?q=...
   -> app.py validates the input
   -> guide.check()
   -> claim index finds a candidate
   -> coverage and number checks
   -> stored verdict, or unknown
   -> JavaScript shows the verdict and any related facts
```

### Planning a route

```text
Start point + time + travel mode + must-see IDs
   -> JavaScript POST /api/plan
   -> app.py validates and tidies the request
   -> planner.plan()
   -> greedy insertion + 2-opt
   -> JSON route
   -> frontend shows the stop list and an approximate route line
```

## Running it

For local development:

```bash
pip install -r requirements.txt
python app.py
```

Then open `http://localhost:5000`. The server listens on `0.0.0.0` and prints a LAN address so a phone on the same Wi-Fi or hotspot can open the app. Set `PORT` to change the port. Set `PUBLIC_URL` to change the address written into the QR codes when the app is hosted somewhere stable.

The repository has `run.sh` and `run.bat` to start it. It has no production server configuration, hosting manifest, CI pipeline or domain setup.

## Tests

`tests/test_app.py` covers:

- Required keys and all three languages in each site record.
- Fact categories and the presence of a source.
- Claim verdict values and the site IDs claims refer to.
- Known claims and unknown claims, including that `unknown` is not reported as false.
- Questions that should find a fact and questions that should be refused.
- Route time limits, no repeated stops, priority, and must-sees, including going over the limit.
- A sanity check on distance and a check that 2-opt never makes a route longer.
- The main page, the signboard pages and the API responses.

There are 48 tests as of 12 November 2026. Run `python -m pytest -q` on your own machine before relying on that number.

## Current limits

- JSON files are the only content store. There is no editor and no review workflow.
- The content set is small and needs a full independent audit.
- Search matches words. It depends on synonyms and aliases that we maintain by hand.
- Questions and claims are handled in English only.
- Routes use approximate straight-line distances and assumed speeds.
- Map tiles need internet. There is no full offline cache.
- GPS generally needs localhost or HTTPS. On a LAN address the visitor may have to tap the map.
- Progress in local storage does not follow a visitor to another device.

## Possible future architecture (not built)

Anything added should keep content, search, planning and display separate, as they are now. Candidates:

- A file or schema that records where each fact came from and who reviewed it.
- A reviewed editing workflow before JSON data is published.
- A routing adapter for real walking, cycling and vehicle paths.
- A service worker and a cache for static files and JSON records.
- Search in Kannada and Hindi, after the facts are translated and the results evaluated.
- Automated browser tests and a deployment pipeline.

Do not add a database, an LLM, an outside routing provider or any other large dependency unless a specific requirement calls for it.

Status: describes the code in this repository as of 12 November 2026. The last section is a proposal only.
