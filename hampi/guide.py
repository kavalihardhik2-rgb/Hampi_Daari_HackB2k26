"""The guide: answers questions and checks claims, using only the fact base.

Nothing here writes history. ask() returns stored facts, check() returns a
stored verdict, and both give up when the match is weak.
"""
from .data import CLAIMS, SITE_BY_ID, SITES
from .search import Index
from .text import to_english, tokens

# One document per fact, so every answer can show its own source.
FACTS = [
    {"site": s["id"], "site_name": s["name"]["en"], **f}
    for s in SITES
    for f in s["facts"]
]
# General facts about the city that do not belong to one monument.
FACTS += [
    {"site": None, "site_name": "Hampi", "kind": "recorded", "source": "UNESCO World Heritage list",
     "text": "Hampi was the capital of the Vijayanagara empire. The Group of Monuments at Hampi was added to the UNESCO World Heritage list in 1986."},
    {"site": None, "site_name": "Hampi", "kind": "recorded", "source": "Historical record",
     "text": "The Vijayanagara empire is traditionally dated from 1336, when the brothers Harihara I and Bukka Raya I of the Sangama family founded it."},
    {"site": None, "site_name": "Hampi", "kind": "recorded", "source": "Historical record",
     "text": "The city was sacked and abandoned in 1565 after the battle of Talikota, when the armies of the Deccan sultanates defeated Vijayanagara."},
    {"site": None, "site_name": "Hampi", "kind": "recorded", "source": "UNESCO World Heritage list",
     "text": "The protected area covers about 41 square kilometres along the Tungabhadra river and holds more than 1,600 surviving remains: temples, shrines, halls, gateways, tanks and fortifications."},
]

_fact_index = Index(FACTS, lambda f: f"{f['site_name']} {f['text']}")
_claim_index = Index(CLAIMS, lambda c: " ".join([c["claim"]] + c["alt"]))

VERDICT_LABEL = {
    "true": "Correct",
    "false": "Not correct",
    "partly": "Partly correct",
    "legend": "A story, not a record",
    "unproven": "Nobody knows for sure",
}


def site_in(text):
    """Find which monument a sentence is talking about, from its aliases."""
    low = " " + to_english(text).lower().replace("'", "") + " "
    best = None
    for s in SITES:
        for alias in s["aliases"] + [s["name"]["en"].lower()]:
            if f" {alias.replace(chr(39), '')}" in low and (best is None or len(alias) > best[0]):
                best = (len(alias), s["id"])
    return best[1] if best else None


def ask(question):
    """Answer a question with facts from the record, or admit there is none."""
    site = site_in(question)
    hits = []
    if site:
        hits = _fact_index.search(question, keep=lambda f: f["site"] == site, threshold=0.05)
    if not hits:
        hits = _fact_index.search(question)
    if hits:
        # Show what is on record before stories, when both match about equally.
        top = hits[0][0]
        hits.sort(key=lambda h: (h[0] < 0.6 * top, h[1]["kind"] != "recorded", -h[0]))
    if not hits and site:
        # The visitor named a monument but nothing matched: show what we do know.
        hits = [(0.0, f) for f in FACTS if f["site"] == site][:3]
    return {
        "question": question,
        "found": bool(hits),
        "site": site,
        "answers": [{"score": sc, **f} for sc, f in hits],
        "message": None if hits else
        "I have no record for that. I would rather say so than make something up.",
    }


def _covers(statement, claim):
    """True if most words of the statement, and all its numbers, are in the claim."""
    said = set(tokens(statement))
    known = set(tokens(" ".join([claim["claim"]] + claim["alt"])))
    if any(w.isdigit() and w not in known for w in said):
        return False
    return len(said & known) >= 0.6 * len(said)


def check(statement):
    """Compare something a guide said with the list of known claims."""
    site = site_in(statement)
    hits = _claim_index.search(statement, k=1, threshold=0.22)
    if hits and site and hits[0][1]["site"] not in (None, site):
        # Matched a claim about a different monument: try again within this one.
        hits = _claim_index.search(statement, k=1, threshold=0.15,
                                   keep=lambda c: c["site"] == site)
    if hits and not _covers(statement, hits[0][1]):
        hits = []  # same topic, but the visitor said something we never checked
    if hits:
        score, c = hits[0]
        return {
            "statement": statement, "matched": True, "score": score,
            "claim": c["claim"], "verdict": c["verdict"],
            "label": VERDICT_LABEL[c["verdict"]], "answer": c["answer"],
            "site": c["site"],
            "site_name": SITE_BY_ID[c["site"]]["name"]["en"] if c["site"] else "Hampi",
        }
    related = ask(statement)
    return {
        "statement": statement, "matched": False, "verdict": "unknown",
        "label": "Not in my checked list",
        "answer": "This exact claim is not in my list, which does not mean it is false. "
        + ("Here is what I do have on record." if related["found"]
           else "I have nothing on record about it."),
        "related": related["answers"],
        "site": site,
    }


def has_content(text):
    return bool(tokens(text))
