# Design system and data design

## Purpose

This document writes down the design conventions Hampi Daari already follows, so later changes stay consistent. It covers colours and type, how the interface behaves, languages, the data format and the planner's assumptions. It is not a mock-up.

## Principles

1. Clear before decorative. A visitor should find a monument, its basic information and the next thing to do without hunting.
2. Evidence is on show. Every fact carries a category and a source label.
3. Not knowing is allowed. The guide can say it has no record.
4. More than one language. The interface, names and summaries are in English, Kannada and Hindi.
5. Built for a phone. Visitors use the app while walking around the site.
6. Nothing to install. A QR code opens a monument page in the browser, with no app and no account.
7. Estimates are called estimates. Location, distance and route times are approximate in this version.

## Look

The stylesheet takes its colours from Hampi itself: granite, sandstone, ochre soil and the river.

### Colours

| CSS variable | Value | Used for |
|---|---|---|
| `--granite` | `#2b2622` | The dark header and strong text |
| `--granite-2` | `#4a423b` | Secondary dark text |
| `--sand` | `#f6efe2` | Page background |
| `--paper` | `#fffaf1` | Cards and panels |
| `--line` | `#e2d6c1` | Borders and dividers |
| `--ochre` | `#b5651d` | Main buttons and map pins |
| `--ochre-dark` | `#8f4d12` | Hover and emphasis |
| `--river` | `#1f6f6b` | Location and focus accents |
| `--text` | `#2b2622` | Body text |
| `--muted` | `#74685b` | Supporting text |
| `--ok`, `--ok-bg` | `#2f6b3a`, `#e4f1e4` | "Correct" and "On record" |
| `--story`, `--story-bg` | `#8a5a00`, `#fbeccb` | Story, partly correct, legend |
| `--unsure`, `--unsure-bg` | `#5d5a66`, `#e9e7ee` | Uncertain and unknown |
| `--bad`, `--bad-bg` | `#9a2b22`, `#f8e1dd` | "Not correct" |

The variables in `static/style.css` are the only place colours are defined. New styles should use them. Do not add a near-duplicate colour without a reason.

### Type

- Serif (Georgia, Noto Serif, Times New Roman) for monument names and a few display lines.
- Sans-serif (the system UI font, with Segoe UI, Roboto, Noto Sans, Noto Sans Kannada and Noto Sans Devanagari as fallbacks) for everything else, including Kannada and Hindi.
- Keep body text readable. Instructions a visitor needs must not be set in small, low-contrast text.

### Shapes and components

- Rounded cards and buttons, with corners of about 10 to 12 px.
- Pill-shaped language switch and small chips for actions.
- Thin, warm-toned borders.
- Simple map pins, with separate looks for seen sites and for numbered route stops.
- Badges for recorded, tradition, uncertain and each claim verdict.
- A compact layout. It is not a dashboard.

## Layout

### Desktop

At widths of about 900 px and above:

- The map is the larger panel on the left.
- Controls and tab content are in a panel on the right.
- The side panel is at most about 520 px wide.
- Tabs sit at the top of the side panel.

### Mobile

Below that width:

- The app shows one tab at a time.
- The map is its own tab.
- Tabs sit at the bottom of the screen.
- Map controls and the closest-sites card float over the map.

Test both layouts when you add a component. A layout that works on a desktop may not be usable on a phone.

## Interface areas

| Area | What it is for | What the visitor does there |
|---|---|---|
| Map | Shows where the monuments are | Open a monument, set a position, use GPS, see the closest sites |
| Places | Lists sites by zone and shows progress | Open a site, see what is marked seen |
| Monument sheet | Summary, facts with source and category, tip | Listen, mark seen, show on map, open the signboard |
| Guide | Checks a claim or answers a question | Switch mode, type, tap a sample |
| Plan | Builds a route inside a time limit | Choose start, time and travel mode, add must-sees |
| Signs | Opens the printable QR signboards | Print all boards or one |

## State

- The chosen language is stored in the browser's local storage under `hd-lang`.
- The seen-sites object is stored under `hd-seen`.
- These are settings in one browser. Do not describe them as accounts or as syncing across devices.
- The current tab and the current route are held in memory only.
- A visitor sets a position by tapping the map. GPS is an alternative where the browser allows it.
- The closest-sites card shows up to three results, by straight-line distance and compass direction.
- Must-see choices last until the page is reloaded. They are not saved.
- Read-aloud uses the browser's built-in speech. Which voices exist depends on the browser and the device.

## Languages

The interface language codes are `en` (English), `kn` (Kannada) and `hi` (Hindi).

What is covered today:

| Content | English | Kannada | Hindi |
|---|---|---|---|
| Interface labels | Yes | Yes | Yes |
| Monument names | Yes | Yes | Yes |
| Monument summaries | Yes | Yes | Yes |
| Detailed facts | Yes | Not translated | Not translated |
| Questions | Yes | Not supported | Not supported |
| Claims | Yes | Not supported | Not supported |
| Route stop names | Yes | Yes | Yes |

Rules:

1. Add every interface label to the `T` dictionary in `static/app.js`, in all three languages.
2. Give every monument name and summary `en`, `kn` and `hi` values.
3. Do not machine-translate detailed historical facts and publish them without review.
4. Keep Unicode and UTF-8 intact in JSON, HTML and API responses.
5. Have a competent native speaker review the Kannada and Hindi before any public release.
6. Wherever a visitor might expect translated facts or search, keep the "English only for now" note on screen.

## Showing evidence and verdicts

### Fact categories

| Stored kind | Label in English | What it tells the visitor |
|---|---|---|
| `recorded` | On record | We have this as a recorded statement, with the source shown |
| `tradition` | Story | This is local tradition or a traditional account |
| `uncertain` | Not known for sure | The record does not settle the matter |

These labels say how we present a statement. They do not replace a source audit. Our data was compiled with AI assistance and only partly cross-checked.

### Claim verdicts

| API verdict | Label in English |
|---|---|
| `true` | Correct |
| `false` | Not correct |
| `partly` | Partly correct |
| `legend` | A story, not a record |
| `unproven` | Nobody knows for sure |
| `unknown` | Not in my checked list |

Always show a verdict in words as well as colour. Colour must never be the only signal. Keep `unknown` looking different from `false`.

## Data format

### Monument record

```json
{
  "id": "example-site",
  "name": { "en": "Example Site", "kn": "...", "hi": "..." },
  "aliases": ["example", "alternate name"],
  "zone": "Sacred centre",
  "lat": 15.33,
  "lon": 76.46,
  "visit_min": 30,
  "priority": 3,
  "summary": { "en": "...", "kn": "...", "hi": "..." },
  "facts": [
    { "text": "...", "kind": "recorded", "source": "Specific source reference" }
  ],
  "tip": "..."
}
```

This shows the structure only. It is not a real monument. Keep this format unless you plan a migration.

### Claim record

```json
{
  "id": "example-claim",
  "site": "example-site",
  "claim": "Standard statement to check",
  "alt": ["Equivalent wording"],
  "verdict": "unproven",
  "answer": "Careful explanation supported by the source"
}
```

Use `null` for `site` when the claim is about Hampi in general. The stored verdicts are `true`, `false`, `partly`, `legend` and `unproven`.

## Map, location and route constraints

- The map centre is set near Hampi in `static/app.js`.
- Pins use the coordinates in `data/sites.json`.
- OpenStreetMap tiles come from the public tile service and need a network connection.
- If tiles fail, the frontend keeps the pins and shows name labels for sites with priority 4 or 5.
- Browser GPS needs localhost or HTTPS.
- Tapping the map is the fallback for demos on a local network where GPS is blocked.
- The planner multiplies haversine distance by 1.35 and assumes 4 km/h on foot, 10 km/h by cycle and 18 km/h by auto.
- A plan is an itinerary estimate, not directions along roads or paths. The Plan tab says so under every plan.

## QR signboards

- One signboard is produced for each monument record.
- Each board shows the English name, the Kannada and Hindi names, the English summary and a QR code.
- The QR code opens the monument's detail sheet through the `#site/<site_id>` fragment.
- Print styles hide the navigation and start a new page for each board.
- For boards that will be put up in public, the base URL must be stable. Set `PUBLIC_URL` to the hosted address. A temporary LAN address will stop working.
- Print a board at the intended paper size and scan it before using it in the field.

## Accessibility

- Keep keyboard focus visible. The stylesheet gives buttons, links and form controls a focus outline.
- Use real buttons, forms and headings.
- Keep controls large enough to tap.
- Put a text label next to any icon or colour.
- Keep the reduced-motion rule that is already in the stylesheet.
- Check contrast for muted labels and coloured badges.
- Speech output is an extra. The text must always be there too.
- Check what a screen reader announces for the language switch, map controls, tabs and the monument sheet.

## Checklist before finishing a UI change

- It uses the existing colour and type variables.
- It works at phone and desktop widths.
- Its text is in English, Kannada and Hindi, or it says plainly that it is English-only.
- Dynamic text goes through `esc()` before it is put into HTML.
- Keyboard focus is visible and controls have meaningful labels.
- Status is shown in words as well as colour.
- Nothing approximate is presented as exact.
- Any changed content has been checked for its source and its translation.
