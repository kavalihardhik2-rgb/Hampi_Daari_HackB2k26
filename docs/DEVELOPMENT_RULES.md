# Development rules

## Purpose

These rules keep Hampi Daari easy to follow, easy to test and careful with history. Follow them every time you change the project.

## Historical content

1. Do not invent historical facts, dates, names, measurements, quotations or attributions.
2. Every new fact needs a source someone else can find. Use an official or primary source where one exists: ASI documentation, an inscription, UNESCO material or a reliable scholarly publication.
3. Record the actual source. "Internet" or "Google" does not count.
4. Keep evidence apart from interpretation and local tradition. The only categories are `recorded`, `tradition` and `uncertain`.
5. Do not mark a statement `recorded` just because it is already in a project file. Existing content still needs independent review.
6. When sources disagree, or the evidence is thin, keep that uncertainty in the wording.
7. Do not call the dataset verified until every statement in it has been checked.
8. Do not let an LLM write a historical answer from its general knowledge. If a language model is added later, it must work only from retrieved records that carry sources, and it must keep their uncertainty.
9. An `unknown` result from the claim checker means the exact claim is not in our prepared list. It does not show the claim is false.

## Data files

### `data/sites.json`

- Never change a monument's `id`. Map links, route requests, tests and printed QR codes all depend on it.
- IDs are lowercase and URL-safe. Use a hyphen only where needed.
- Keep the current keys: `id`, `name`, `aliases`, `zone`, `lat`, `lon`, `visit_min`, `priority`, `summary`, `facts` and `tip`.
- `name` and `summary` must each have `en`, `kn` and `hi` values.
- Each fact must have `text`, `kind` and `source`.
- `kind` must be exactly `recorded`, `tradition` or `uncertain`.
- Check the coordinates: `lat` is latitude, `lon` is longitude, and both are numbers.
- Keep visit times and priorities sensible. If a change alters what the planner picks, note why.
- Add aliases for common spellings and other names. Do not add one that could point to a different monument.
- Special characters are handled by the existing JSON and HTML rendering. Do not bypass it.
- Save the file as UTF-8 so Kannada and Hindi text survives.

### `data/claims.json`

- Each claim has a fixed `id`, plus `site`, `claim`, `alt`, `verdict` and `answer`.
- `site` is a real site ID, or `null` for a claim about Hampi in general.
- Stored verdicts are `true`, `false`, `partly`, `legend` and `unproven`.
- Do not store `unknown`. The code produces it when a visitor's text is not covered by the prepared claims.
- The standard wording and every alternate must make the same assertion. Do not add a loose alternate that could match a different claim.
- Get numbers exactly right. The code refuses a match when the visitor adds a number the claim does not contain.
- The answer must not say more than the evidence supports.

## Backend code

- Keep the route handlers in `app.py` short. Search, content and planning logic go in the matching `hampi/` module.
- Load files only in `hampi/data.py`. Do not repeat JSON loading inside routes.
- Validate input where it enters the API. Missing, malformed and out-of-range values must not show a traceback to the visitor.
- Keep the response style: JSON on success, and a JSON `error` field with a suitable HTTP status for a bad request.
- Keep the 300-character limit on text input unless you write down a reason to change it.
- Do not add frameworks or packages the app does not need. Search uses only the standard library on purpose.
- No network calls when modules are imported or when the app starts.
- Port and public URL come from environment variables.
- Never turn on Flask debug mode on a public deployment.

## Search and guide

- Tokenising, stopwords, stemming and synonyms live in `hampi/text.py`.
- TF-IDF indexing and cosine similarity live in `hampi/search.py`.
- Rules specific to Hampi questions and claims live in `hampi/guide.py`.
- Keep the refusal. A weak match must not be promoted to a confident answer just to avoid an empty result.
- Test search with questions that should match and with unrelated or misleading ones that should not.
- If you change a threshold, the coverage rule, the synonyms or the ranking, add tests that show what changed and why.
- The source and the fact category must travel from the JSON record through the API to the screen.
- Do not call TF-IDF a trained machine-learning model. It is word-based information retrieval using TF-IDF weighting and cosine similarity.

## Route planning

- Distance, travel time and route selection live in `hampi/planner.py`.
- Write down the assumptions: the 1.35 detour multiplier, the speeds, the visit time for each site.
- Accept only `walk`, `cycle` and `auto` as travel modes.
- Handle must-sees explicitly. A forced must-see can push the route over the limit, and the result must keep the `over_budget` flag.
- Do not describe the output as turn-by-turn directions or as a route along real roads or paths.
- Test that a route has no repeated sites, that chosen plus left-out sites add up to the input, and that the time limit behaves as expected.
- Do not claim route distances are accurate until they have been compared with real paths or measured on the ground.

## Frontend

- Stay without a framework unless a measured need justifies moving to one.
- Styles go in `static/style.css`. Behaviour goes in `static/app.js`.
- Interface text comes from the `T` dictionary in `static/app.js`. Do not scatter translated labels through event handlers.
- Keep all three languages: `en`, `kn` and `hi`.
- When you add something visible, translate its labels, or say plainly that it is English-only because its content is not translated.
- Keep the note that facts, questions and claims are English-only in this version.
- Pass dynamic text through `esc()` before putting it into an HTML string. Never insert visitor input or content fields as raw HTML.
- Keep keyboard focus visible and keep both layouts working.
- Do not assume a browser has GPS, speech or local storage. Each needs a fallback.
- Keep the map usable when OpenStreetMap tiles cannot load.

## QR codes and URLs

- A QR code must point to the right site ID on a stable base URL.
- Use `PUBLIC_URL` for a hosted installation. Do not print permanent signboards with a temporary LAN address.
- Before presenting the feature, scan a code with a phone that is not the laptop running the server.
- If Segno is not installed, the rest of the app must still work, and the signboard page must say that QR codes are off.

## Testing

Before merging or presenting a change:

1. Run `python -m pytest -q`.
2. Add or update tests for every backend behaviour you changed.
3. Test valid and invalid API inputs.
4. Test guide inputs that should match and ones that should not.
5. Test route time limits, modes, start points and must-sees.
6. Open the home page and the signboard pages in a browser.
7. Check the interface at phone and desktop widths.
8. Check the English, Kannada and Hindi labels and summaries after any interface or data change.
9. Scan the QR codes from a phone on the network you intend to use.
10. Do not say tests pass unless you ran them on the changed version.

The suite had 48 tests on 12 November 2026. The number that counts is the one the test runner prints on your checkout.

## Documents

- Update `README.md` when installation, dependencies, commands, routes or visible behaviour change.
- Update `PRD.md` when scope or requirements change.
- Update `SYSTEM_ARCHITECTURE.md` when modules, data flows or dependencies change.
- Update `DESIGN_SYSTEM.md` when shared styles, data conventions or component rules change.
- Update `PROJECT_TASK.md` when work is finished or priorities change.
- Update `PROJECT_MEMORY.md` with confirmed decisions, current status and known limits.
- In every document, keep what is built apart from what is planned.
- A feature is not complete because its code was drafted. It must be integrated and tested.

## Git

- Make small commits with messages that say what changed.
- Do not commit virtual environments, cache folders, API secrets, personal location data or temporary files.
- `requirements.txt` lists only packages the app or the tests need.
- Do not delete or replace an existing test to make new code pass.
- Read the diff before committing, especially JSON content and translations.

## When a change is done

- It does what the requirement asked.
- Tests for it exist and pass.
- Existing features still work.
- Sources, uncertainty and translation needs are written down.
- The interface works at phone and desktop widths, where the change touches it.
- The README and the relevant documents are updated.
- What is built and what is not are still clearly separated.
