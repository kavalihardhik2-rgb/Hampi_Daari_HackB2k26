# Product requirements

## Overview

Hampi Daari is a hackathon web app: a visitor guide for Hampi, Karnataka, that runs in a phone or laptop browser. Our domain is tourism and cultural heritage.

A visitor can find monuments on a map, see which statements about a monument are recorded and which are local tradition, plan a visit around the time they have, and open a monument's page by scanning a QR code on a printed signboard.

One rule sits under all of it. The guide answers from the facts we have stored. When it has nothing stored, it says so and does not make up an answer.

## Problem

Hampi's monuments are spread over a large area. A visitor often does not know which sites are nearby, which ones matter most, or how many they can reach in the time they have. There are few signs on site. Visitors also hear historical claims told as fact when they are uncertain or come from local tradition.

One small web app takes on these problems:

- A map and a list of monuments by zone, so visitors can see what is there.
- A planner that suggests a route from a start point, a time limit and a way of travelling.
- A question box that looks up answers in a local fact file.
- A claim checker that compares a statement with a prepared list of common claims.
- Three languages, read-aloud and QR signboards, so more people can get to the information.

## Who it is for

1. First-time visitors and families who want to see what is there and decide where to go.
2. Students and school groups who need short summaries and a plan that fits a fixed number of hours.
3. Visitors who are more comfortable in Kannada or Hindi than in English.
4. Visitors who have just been told something by a guide and want to check it.
5. Tourism or heritage bodies, who could take over the data files and the signboards.

The app has no directory of licensed guides, no ticketing or booking, and no link to any tourism authority.

## Goals

- Show our starter set of 18 Hampi monuments on a map and in a list grouped by zone.
- Show monument names and short summaries in English, Kannada and Hindi.
- Show each fact with a source label and one of three categories: recorded, tradition or uncertain.
- Let visitors mark monuments as seen and watch their progress.
- Show the closest monuments once a visitor gives a location, by GPS or by tapping the map.
- Build a suggested route for a chosen time limit and travel mode.
- Let a visitor mark a left-out monument as a must-see and rebuild the route.
- Answer Hampi questions the fact file covers and refuse the ones it does not.
- Compare a guide's statement with our claim list and give a verdict only on a strong match.
- Produce a printable QR signboard for each monument.

## Scope

### What is built

| Area | What it does now | Main files |
|---|---|---|
| Monument map | Shows 18 markers around Hampi with Leaflet and OpenStreetMap tiles | `static/app.js`, `static/vendor/leaflet/` |
| Place list | Lists sites by zone with summaries and visit times | `data/sites.json`, `static/app.js` |
| Progress | Visitors mark places as seen. Progress and language are kept in the browser's local storage | `static/app.js` |
| Location | Uses browser GPS where it works, or a tap on the map. Shows the three closest sites with rough distance and compass direction | `static/app.js` |
| Monument details | Name and summary in three languages, facts in English, source and category labels, a visitor tip | `data/sites.json`, `static/app.js` |
| Read aloud | Reads the summary with the browser's speech feature. In English it reads the facts too | `static/app.js` |
| Claim checker | Compares a statement with 20 prepared claims and returns a verdict or "unknown" | `hampi/guide.py`, `data/claims.json` |
| Questions | Looks up matching facts in the monument records and four general Hampi facts | `hampi/search.py`, `hampi/guide.py` |
| Route planner | Builds a route from time, start point, walk, cycle or auto, and optional must-sees | `hampi/planner.py` |
| QR signboards | Printable boards for all sites and a page for each one | `app.py`, `templates/signs.html` |
| Server and API | Flask serves the pages and the JSON endpoints | `app.py` |
| Tests | 48 tests on data structure, claims, questions, planning and web routes | `tests/test_app.py` |

### What is not built

- Hosting, a public domain or any production setup.
- A database, an admin dashboard or a content-management system.
- User accounts, or visit history that follows a visitor across devices.
- Turn-by-turn navigation, routing along real paths, or live transport information.
- Any link to ASI or the tourism department, live opening hours, ticket prices or booking.
- A fully offline app or a service worker.
- AI-written history or a general chatbot built on a language model.
- Automatic fact checking against the internet.
- Facts in Kannada or Hindi, or questions and claims in those languages.
- A verified list of licensed guides.

## Functional requirements

### FR-01: Browse monuments

The app loads monument records from `data/sites.json` through `/api/sites`. It shows the 18 sites on the map and in a list grouped by zone. Selecting a marker or a list item opens that monument's details.

Accepted when: each site has an ID, a name and a summary in English, Kannada and Hindi, coordinates, a zone, a visit duration, a priority, and at least one fact with a source and a category.

### FR-02: Change language

The interface works in English, Kannada and Hindi. The chosen language is kept in the browser's local storage. Monument names and summaries appear in the chosen language.

Accepted when: all three can be selected without reloading the page. Facts and the question and claim boxes are English-only in this version, and the screen says so.

### FR-03: Track visited monuments

A visitor can switch a monument's seen status on and off. The map marker and the list both show it. A progress bar shows how many sites are marked seen out of the total.

Accepted when: seen status is still there after a refresh in the same browser, if local storage is available. It does not carry over to other devices.

### FR-04: Find nearby monuments

A visitor can use browser GPS or tap a point on the map. The app shows up to three closest monuments with rough distance and compass direction.

Accepted when: if GPS is missing or refused, the app switches to picking a point on the map. Browsers allow GPS only on localhost or HTTPS.

### FR-05: View monument information

Each monument's detail view shows its name, summary, facts, source labels, fact categories and a visitor tip. The only fact categories are `recorded`, `tradition` and `uncertain`.

Accepted when: the source and category are always shown with the fact. A category label alone does not prove that the statement has been independently checked.

### FR-06: Ask a question

A visitor submits a question about Hampi through `/api/ask`. The system searches the local index for matching records. If nothing passes the matching rules, it returns a refusal and does not generate an answer. If it recognises a monument but finds no matching fact, it may show a few facts for that monument.

Accepted when: an unrelated question, such as one about sport or programming, gets no answer. A question the fact file covers gets one or more facts with their sources.

### FR-07: Check a claim

A visitor submits a statement through `/api/check`. The system compares it with the prepared claims. A match returns `true`, `false`, `partly`, `legend` or `unproven`. A statement with no match, or a weak one, returns `unknown` and may show related facts. Any number in the visitor's statement must also appear in the matched claim or its alternate wordings, so an unchecked number cannot borrow a verdict.

Accepted when: a statement that matches no prepared claim never gets a definite verdict. The reply for `unknown` says that the exact claim is not in our list, and that this does not make it false.

### FR-08: Plan a visit

The visitor picks a start point, a time limit and a travel mode (`walk`, `cycle` or `auto`). They may mark left-out monuments as must-sees and ask for a new plan. The response lists the stops in order, with rough leg distances, arrival minutes, visit durations, total distance, time used and the sites left out.

Accepted when: an ordinary plan stays inside the time limit. A forced must-see is included even if the estimate then goes over, and the response sets `over_budget` to show it.

### FR-09: Print and scan signboards

`/signs` shows printable signboards for every monument in the data. `/sign/<site_id>` shows one signboard and returns 404 for an unknown ID. Each QR code links to its monument in the web app.

Accepted when: QR codes appear when the `segno` package is installed. The code points to the configured public URL, or to the laptop's current LAN address. For a phone demo on a local network, the phone and the laptop must be on the same Wi-Fi or hotspot.

## Other requirements

- The app runs locally with Python 3.9 or newer and has no frontend build step.
- It needs three packages: Flask, Segno and pytest. Search and route planning use only Python's standard library.
- The layout works on phones and on desktop screens.
- Facts stay in JSON files, separate from the code that displays or searches them.
- Every answer can be traced to a stored fact or claim, and shows its source where there is one.
- If map tiles fail to load, the pins and labels stay. If Segno is missing, everything except the QR images still works.
- The visitor's location stays in the browser. It goes to the local Flask server only when a route request uses it. There are no accounts and no stored location history.
- A new monument is added by editing the data file, not by writing code.

## Data quality

Our content is a curated starter set. It is not an audited historical database. The facts were compiled with AI assistance and only some were cross-checked online. Coordinates are approximate, and the Kannada and Hindi text needs review by native speakers.

Before any public or official use:

1. Check each historical statement against a reliable source, such as Archaeological Survey of India (ASI) material, inscriptions, UNESCO material or scholarly work.
2. Confirm each source label and the wording of each claim.
3. Have competent Kannada and Hindi speakers review all translations.
4. Correct the coordinates from an authoritative map or a field visit.
5. Record source URLs or publication details, with access dates where useful.

Until this is done, do not call the facts independently verified. Say "curated information" or "starter records with source labels".

## How we know this version works

- The Flask app starts and the home page loads.
- `/api/sites` returns all 18 monument records and three start locations.
- All three languages work for interface text, names and summaries.
- Seen status and language survive a refresh in the same browser.
- The question and claim examples in the tests behave as the tests describe.
- The planner returns a valid ordered route for walk, cycle and auto.
- The signboard pages render, with QR codes when Segno is installed.
- The test suite passes in the environment we intend to use.

## Known limits and risks

- Coordinates are approximate. Route distances and nearest-site distances are not precise enough to navigate by.
- The planner uses straight-line distance multiplied by 1.35. It knows nothing about real paths, road conditions or terrain.
- Travel speeds and visit times are our assumptions, not live estimates.
- Map tiles need internet. Without it the pins stay but the base map does not load.
- GPS may not work on a plain LAN address. Tapping the map is the fallback.
- Facts, questions and claims are in English only.
- Search quality depends on how the stored facts, aliases, synonyms and claims are worded.
- A refusal cuts down unsupported answers. It does not guarantee that every fact we return is correct.
- A QR code made with a temporary LAN address will not work outside that network. Public signboards need a stable `PUBLIC_URL`.
- There is no service worker and no full offline cache.

## Possible next steps (none of these is built)

1. A source register for every fact and claim, with citation, access date and review status.
2. Better coordinates, and routing along real paths through a mapping service or a checked route graph.
3. A content workflow where edits are reviewed and approved before they go live.
4. Facts in Kannada and Hindi, and question handling in those languages using controlled retrieval.
5. Offline caching for the app and its JSON data. Live map tiles may still be unavailable offline.
6. Testing on more browsers and devices, and accessibility checks for keyboard use, screen readers, text scaling and contrast.

Status: this document describes the code in this repository as of 12 November 2026. Built features and possible future work are kept apart. Update it when the scope of the app changes.
