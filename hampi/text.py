"""Small text helpers: tokenising, stemming and synonyms. No external libraries."""
import re

STOPWORDS = set("""
a an the is are was were be been being am do does did has have had of in on at to for from by with
and or but if then than that this these those it its as into about over under very can could would
should will shall may might there here what which who whom whose when where why how tell me us you
your my our their his her he she they them i we please say said says told guide so also just really
actually any some all not no yes temple hampi
""".split())

# Words visitors use -> words the fact base uses.
SYNONYMS = {
    "tall": "metres", "height": "metres", "high": "metres", "big": "metres", "size": "metres",
    "built": "built", "constructed": "built", "made": "built", "build": "built", "builder": "built",
    "old": "century", "age": "century", "year": "century", "date": "century",
    "idol": "image", "statue": "statue", "murti": "statue",
    "sound": "notes", "music": "musical", "sing": "musical", "ring": "notes",
    "name": "name", "called": "name", "meaning": "means", "mean": "means",
    "story": "said", "legend": "said", "myth": "said",
    "destroyed": "sacked", "ruined": "sacked", "attacked": "sacked", "fell": "sacked",
    "rock": "boulder", "stone": "stone", "monolithic": "single", "monolith": "single", "one": "single",
    "found": "uncovered", "discovered": "uncovered", "excavated": "uncovered",
    "inside": "inside", "empty": "empty", "missing": "empty",
    "king": "king", "raja": "king", "queen": "queens", "rani": "queens",
    "krishnadeva": "krishnadevaraya", "raya": "krishnadevaraya",
}

# Regional Kannada and Hindi word mappings
REGIONAL = {
    "ದೇವಾಲಯ": "temple", "ಗುಡಿ": "temple", "ರಾಜ": "king", "ಅರಸ": "king",
    "ಕಟ್ಟಿಸಿದ": "built", "ಕಟ್ಟಿಸಿದರು": "built", "ಕಟ್ಟಿಸಿದ್ದು": "built", "ಕಟ್ಟಿದ": "built",
    "ಯಾರು": "who", "ಯಾವಾಗ": "when", "ಕಂಬ": "pillar", "ಕಂಬಗಳು": "pillars",
    "ರಥ": "chariot", "ಎತ್ತರ": "tall", "ಎಷ್ಟು": "how", "ಸಂಗೀತ": "musical",
    "ಕಲ್ಲು": "stone", "ಕಲ್ಲಿನ": "stone", "ವಿರೂಪಾಕ್ಷ": "virupaksha", "ವಿಠ್ಠಲ": "vittala",
    "ವಿಜಯ ವಿಠ್ಠಲ": "vittala", "ಹೇಮಕೂಟ": "hemakuta", "ಸಾಸಿವೆಕಾಳು": "sasivekalu",
    "ಕಡಲೆಕಾಳು": "kadalekalu", "ಕೃಷ್ಣ": "krishna", "ನರಸಿಂಹ": "narasimha",
    "ಬಡವಿಲಿಂಗ": "badavilinga", "ನೆಲಮಾಳಿಗೆ": "underground", "ಹಜಾರ ರಾಮ": "hazararama",
    "ಕಮಲ ಮಹಲ್": "lotus mahal", "ಆನೆ ಲಾಯ": "elephant stables", "ಮಹಾನವಮಿ ದಿಬ್ಬ": "mahanavami",
    "ಮೆಟ್ಟಿಲು ಕೊಳ": "stepped tank", "ರಾಣಿ ಸ್ನಾನಗೃಹ": "queens bath", "ಅಚ್ಯುತರಾಯ": "achyutaraya",
    "ಮಾತಂಗ": "matanga", "ಬಸವಣ್ಣ": "bull", "ತುಲಾಭಾರ": "kings balance",
    "मंदिर": "temple", "राजा": "king", "बनवाया": "built", "बनाया": "built",
    "निर्माण": "built", "किसने": "who", "कौन": "who", "कब": "when",
    "स्तंभ": "pillar", "खंभा": "pillar", "खंभे": "pillars", "रथ": "chariot",
    "ऊंचाई": "tall", "ऊँचा": "tall", "कितना": "tall", "कितने": "how",
    "संगीत": "musical", "पत्थर": "stone", "विरुपाक्ष": "virupaksha", "विट्ठल": "vittala",
    "विजय विट्ठल": "vittala", "हेमकूट": "hemakuta", "ससिवेकालु": "sasivekalu",
    "कडलेकालु": "kadalekalu", "कृष्ण": "krishna", "नरसिंह": "narasimha",
    "बडवीलिंग": "badavilinga", "भूमिगत": "underground", "हजार राम": "hazararama",
    "लोटस महल": "lotus mahal", "गजशाला": "elephant stables", "महानवमी डिब्बा": "mahanavami",
    "सीढ़ीदार कुंड": "stepped tank", "रानी स्नानागार": "queens bath", "अच्युतराय": "achyutaraya",
    "मातंग": "matanga", "बसवण्णा": "bull", "तुलाभार": "kings balance",
    "గుడి": "temple", "దేవాలయం": "temple", "రాజు": "king",
    "కట్టించారు": "built", "నిర్మించారు": "built", "కట్టిన": "built",
    "ఎవరు": "who", "ఎప్పుడు": "when",
    "స్తంభం": "pillar", "స్తంభాలు": "pillars", "రథం": "chariot",
    "ఎత్తు": "tall", "ఎంత": "how", "సంగీతం": "musical",
    "రాయి": "stone", "శిల": "stone",
    "విరూపాక్ష": "virupaksha", "విఠల": "vittala", "విజయ విఠల": "vittala",
    "కృష్ణ": "krishna", "నరసింహ": "narasimha", "బడవలింగ": "badavilinga",
    "సాసివెకాలు": "sasivekalu", "కడలేకాలు": "kadalekalu",
    "లోటస్ మహల్": "lotus mahal", "ఏనుగుల శాల": "elephant stables",
    "మహానవమి దిబ్బ": "mahanavami", "మెట్ల కోనేరు": "stepped tank",
    "రాణి స్నానవాటిక": "queens bath", "అచ్యుతరాయ": "achyutaraya",
    "మాతంగ": "matanga", "బసవన్న": "bull", "తులాభారం": "kings balance",
    "హంపి": "hampi",
}

_TOKEN = re.compile(r"[a-z0-9]+")


def stem(word):
    """A very small stemmer: enough to match 'pillars' with 'pillar'."""
    for suffix in ("ing", "ed", "es", "s"):
        if word.endswith(suffix) and len(word) - len(suffix) >= 4:
            return word[: -len(suffix)]
    return word


def to_english(text):
    """Swap known Kannada and Hindi words for their English keywords."""
    for k, v in sorted(REGIONAL.items(), key=lambda kv: -len(kv[0])):
        if k in text:
            text = text.replace(k, f" {v} ")
    return text


def tokens(text, expand=False):
    """Lower-case, split, drop stopwords, stem. With expand=True, add synonyms."""
    text = to_english(text)
    out = []
    for w in _TOKEN.findall(text.lower().replace("'s", "")):
        if w in STOPWORDS:
            continue
        out.append(stem(w))
        if expand and w in SYNONYMS:
            out.append(stem(SYNONYMS[w]))
    return out
