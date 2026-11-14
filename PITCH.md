# Pitch and demo notes

## One line

Hampi Daari is the guide that admits what it does not know: a map of every monument, facts labelled by how sure we are, and a checker for what your guide just told you.

## The poster's three questions

Choose a problem: Hampi has more than 1,600 remains spread over about 41 square kilometres and almost no signs. Visitors see the famous five and go home, or hire an unlicensed guide who invents the history.

Who it affects: first-time visitors and families, tourists who cannot read the local signs, school trips, and licensed guides who lose work to people who make things up.

How we solve it: the demo below.

## Three-minute demo

1. Open the app on the projector. "Eighteen monuments. Most visitors see five." Point at the progress bar: 0 of 18.
2. Guide tab, Check a claim. Tap "The musical pillars are hollow". Read the verdict: Not correct. Tap "Lotus Mahal was the queen's palace": Nobody knows for sure. "We do not pretend to know."
3. Switch to Ask a question. Tap "Who won the IPL in 2020?". The app refuses. "A chatbot would have answered. Ours speaks only from its fact file."
4. Plan tab. Four hours, walking, Plan my visit. Show the route on the map and the left-out list. Tap "+ Vijaya Vittala Temple" and the plan rebuilds around it.
5. Signs tab, open the Vittala signboard. Ask a jury member to scan the QR with their phone (your laptop and their phone must share a hotspot). The monument opens on their phone. Switch it to ಕನ್ನಡ and press Listen.
6. Close: "No app to install, no login, and it works for the next heritage site by changing one data file."

Test step 5 on your own phones before the round. If the venue Wi-Fi stops devices from seeing each other, run a mobile hotspot and connect the laptop to it.

## Questions the jury may ask

Where is the AI? Be exact here, because this is an AIML jury. The guide is information retrieval: TF-IDF weighting and cosine similarity, written by hand. Nothing is trained and there is no language model. The planner is a search heuristic: greedy insertion plus 2-opt. Be ready to open `hampi/search.py` and walk through it line by line.

Why not use an LLM? The problem is guides who invent history. A model that invents history fluently is the same problem. Retrieval over a fact file cannot say anything that is not in the file. A language model could be added later to rephrase or translate a retrieved fact, but never to produce one.

Where do the facts come from? Each fact carries a source label: an inscription, an ASI record, a traveller's account, or local tradition. Say plainly that this is a curated starter set of 18 monuments, compiled with AI help and only partly cross-checked, and that the plan is for ASI or the Hampi authority to own and audit the data file. Do not say "verified".

How is it different from Google Maps or a travel blog? Neither tells you which parts of the story are on record and which are legend, and neither will check a specific claim.

How accurate is the route? It is an estimate. Distances are straight lines multiplied by 1.35 and the speeds are assumed. It tells you what fits in your time. It does not give directions.

What about no network at the site? The fact base is two small JSON files. The next step is to cache them on the phone so the app works after the first scan. That is not built yet.

Who pays for it? Each signboard is a sheet of paper and hosting is one small server. That fits a tourism department or ASI budget, and licensed guides can use it to back up what they say.

## When the twist comes

The poster says "we will bring the twist". Most twists are one of these.

- A new user group (elderly, visually impaired, children): the Listen button already reads text aloud. Add a large-text toggle in `style.css`, or a children's summary field in `sites.json`.
- A new language: add a block to `T` in `static/app.js` and a key to each name and summary in `sites.json`.
- A different place: swap `data/sites.json` and `data/claims.json`.
- No internet: the map already falls back to labelled pins. Say that the data can be cached on the phone.
- A revenue or guide angle: add a `guides.json` and a page that lists licensed guides. Use sample names and say they are samples.
- A new feature in 90 minutes: each route in `app.py` is about ten lines. Copy `/api/ask` as a pattern.

Whatever you add, follow `docs/DEVELOPMENT_RULES.md`: no invented facts, and a test for every backend change.

## Splitting the work among four

- One person owns the data: checks facts and coordinates, fixes the Kannada and Hindi.
- One person owns the backend and can explain search, guide and planner line by line.
- One person owns the front end and handles whatever the twist needs on screen.
- One person owns the pitch: slides, demo script, the phone-scan rehearsal.

All four of you should run the app and read `hampi/` once tonight. The jury can ask any of you.
