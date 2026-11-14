# Project tasks and plan

## Purpose

This file tracks where Hampi Daari stands and the order in which to check and improve it. The app already works. A task listed below is not done until its box is ticked and the work log has an entry for it.

## What exists today

- Flask web application and JSON API.
- Interactive map with 18 monument records.
- Monument list, seen-progress bar and settings saved in the browser.
- Interface labels, monument names and summaries in English, Kannada and Hindi.
- Position from GPS or from a tap on the map.
- Closest-monuments estimate.
- Monument details with source labels, fact categories and tips.
- Read-aloud through the browser.
- TF-IDF question lookup and matching against prepared claims.
- Visit planner with a time limit, using greedy insertion and 2-opt.
- Printable QR signboards.
- pytest suite of 48 tests.

Re-run the suite before quoting that number or saying the tests pass.

## Phases

### Phase 1: reproduce and understand the baseline

Status: done on the build machine on 12 November 2026 (see the work log). Still to be repeated on the team's own laptops and phones.

- [ ] Create a clean Python environment with Python 3.9 or newer.
- [ ] Install dependencies with `pip install -r requirements.txt`.
- [ ] Start the app with `python app.py` or the launch script.
- [ ] Open the home page on a laptop and on a phone on the same network.
- [ ] Run `python -m pytest -q` and write down the output.
- [ ] Try `/api/sites`, `/api/ask`, `/api/check` and `/api/plan`.
- [ ] Open `/signs` and scan at least one QR code.
- [ ] Note the Python and browser versions and anything that failed.

Done when: a clean install starts, the tests pass, and each main visitor flow can be shown.

### Phase 2: audit the facts and their sources

Status: not started. Required before anyone says the dataset is verified.

- [ ] Go through all 18 monument records and their 58 facts.
- [ ] Check every fact against a suitable source.
- [ ] Replace vague source labels with exact citations.
- [ ] Go through all 20 claims and their verdicts.
- [ ] Confirm each explanation matches the evidence and does not overstate it.
- [ ] Mark conflicting, traditional or uncertain accounts as such.
- [ ] Add a review status for each fact, in the data or in a separate source register.
- [ ] Have native speakers review the Kannada and Hindi summaries.
- [ ] Recheck the coordinates and note where each came from and how accurate it is.

Done when: every published historical statement has a source that can be traced and a review status, uncertain statements are still labelled uncertain, and the translation review is on record.

### Phase 3: test search and claim checking properly

Status: the logic is built and has unit tests. A wider evaluation has not been done.

- [ ] Write a set of typical Hampi questions with the fact each should return.
- [ ] Write a set of unrelated and out-of-scope questions.
- [ ] Write paraphrases of each prepared claim.
- [ ] Test for wrong matches between monuments with similar names.
- [ ] Test statements with numbers and other extra details we have not checked.
- [ ] Record how often the right fact is found, how often a wrong one is returned, and how often the system refuses. Describe how each figure was measured.
- [ ] Change a threshold only when a test shows a specific problem.
- [ ] Treat a refusal or `unknown` as a correct result where it is the right one.

Done when: a written evaluation set exists, known examples behave correctly, and unrelated or unsupported inputs get no verdict they have not earned.

### Phase 4: check route estimates and map data

Status: the approximate planner is built. Nothing has been checked on the ground.

- [ ] Check each coordinate against a reliable map or a site visit.
- [ ] Review the assumed visit time for each monument.
- [ ] Compare planner estimates with a few real visitor routes.
- [ ] Review the 1.35 detour factor and the assumed speeds.
- [ ] Run the planner in all three modes from every start point.
- [ ] Check what happens when must-sees take the route over the time limit.
- [ ] Look at a routing service or a checked route graph only if the project needs path-level navigation.

Done when: the app describes its route estimates as approximate, and the assumptions have been compared with real journeys.

### Phase 5: accessibility, languages and devices

Status: a layout for phone and desktop, three interface languages and read-aloud are built. None has been fully tested for accessibility or translation quality.

- [ ] Run every main flow on a small Android phone and on a desktop browser.
- [ ] Have native speakers review the Kannada and Hindi interface text.
- [ ] Try read-aloud in English, Kannada and Hindi where the device has those voices.
- [ ] Use the app with a keyboard only and check that focus is visible.
- [ ] Check screen-reader labels for the controls and the monument sheet.
- [ ] Check contrast and the size of touch targets.
- [ ] Keep the English-only notes on facts and on the guide until those are translated.

Done when: the main flows work on the phones and browsers we support, accessibility problems are logged or fixed, and the translation limits are stated on screen.

### Phase 6: signboards and hosting

Status: printable signboards and QR codes are built. There is no permanent hosting and nothing has been installed on site.

- [ ] Choose a stable hosted URL before printing permanent boards.
- [ ] Set `PUBLIC_URL` for that deployment.
- [ ] Scan every QR code and confirm it opens the right monument.
- [ ] Check the printed board for layout, readability and paper size.
- [ ] Find out whether mobile data works at the monuments themselves.
- [ ] Write down how monument data and signboards get updated.
- [ ] Agree who maintains it with a tourism or heritage body before anything is put up in public.

Done when: there is a stable URL, every QR link works on visitors' phones, and the printed boards have been reviewed.

### Phase 7: optional additions

Proposals only. None of these exists in the code.

- [ ] A source register and a review-and-approve step for content edits.
- [ ] A small admin page, only if the people maintaining the data need one.
- [ ] Offline caching for the app and its JSON data.
- [ ] Questions and claims in Kannada and Hindi, after translation and testing.
- [ ] Routing along real paths, if the approximate plan is not enough.
- [ ] Deployment automation and browser-level regression tests.
- [ ] A licensed-guide directory, only with authoritative data and the guides' consent.

## Order of work

For a student project, work in this order:

1. Reproduce the app and run the tests.
2. Audit facts, claims, sources and coordinates.
3. Evaluate search and claim checking with examples that should and should not match.
4. Check route estimates and map behaviour.
5. Test translations, accessibility and devices.
6. Arrange stable hosting and print signboards.
7. Take on optional additions only once the data and the core behaviour can be trusted.

## Work log

Add a dated entry when a task is actually finished. Use this shape:

```text
Date:
Phase / task:
Files changed:
What was done or checked:
Tests run:
Result:
Known issue remaining:
Evidence:
```

```text
Date: 12 November 2026
Phase / task: Phase 1 on the build machine (Linux, Python 3.13, headless Chrome)
Files changed: none
What was done or checked: unzipped a fresh copy, installed requirements, started
  the server, opened /, /signs and /sign/vittala, called all four API routes.
  Drove the app in headless Chrome at 1280 px and 390 px: place list, claim
  check, a refused question, a 4-hour walking plan, adding Vittala as a
  must-see, setting a position on the map, Kannada monument sheet.
Tests run: python -m pytest -q
Result: 48 passed. No JavaScript errors in the browser run.
Known issue remaining: map tiles could not load on the build machine (no access
  to the tile server), so only the fallback map was seen. QR codes were not
  scanned with a real phone. Nothing was run on Windows.
Evidence: test output and screenshots from the build session.
```

```text
Date: 12 November 2026
Phase / task: brought the code in line with the PRD and development rules
Files changed: static/app.js, hampi/guide.py, templates/index.html,
  templates/signs.html, tests/test_app.py, README.md, PITCH.md, docs/
What was done or checked: the tagline and messages no longer call the facts
  "checked"; an unknown claim now says it is not necessarily false; the Plan
  tab says its figures are estimates; the "No record" label is translated;
  a browser without GPS falls back to picking a point on the map; the
  signboard page explains PUBLIC_URL. Two tests added (unknown is not false,
  forced must-see sets over_budget).
Tests run: python -m pytest -q
Result: 48 passed.
Known issue remaining: Phases 2 to 6 are untouched.
Evidence: test output from the build session.
```

## Finishing checklist

- [ ] Setup instructions work on the machine we will demo from.
- [ ] Tests pass on the final version.
- [ ] All 18 monument records have been reviewed.
- [ ] All facts and all 20 claims have a traceable source and a review status.
- [ ] Kannada and Hindi names and summaries have been checked.
- [ ] Coordinates and route assumptions have been reviewed.
- [ ] Refusal behaviour for questions and claims has been evaluated.
- [ ] Planner estimates are described as approximate.
- [ ] Phone and desktop layouts have been tested.
- [ ] QR codes work against a stable URL.
- [ ] README and the six documents match the final code.
- [ ] The demo and the pitch claim only what was built and tested.
