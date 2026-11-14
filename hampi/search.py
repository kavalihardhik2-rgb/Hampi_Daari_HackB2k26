"""TF-IDF search written from scratch.

Each fact (or claim) is one document. A question is turned into the same kind
of vector and compared by cosine similarity. If nothing scores above the
threshold the caller gets an empty list, and the app says "not in the record"
instead of guessing. That refusal is the whole point of the project.
"""
import math
from collections import Counter

from .text import SYNONYMS, STOPWORDS, _TOKEN, stem, tokens


class Index:
    def __init__(self, docs, text_of):
        """docs: list of anything. text_of: function that returns the text to index."""
        self.docs = docs
        counts = [Counter(tokens(text_of(d))) for d in docs]
        df = Counter()
        for c in counts:
            df.update(c.keys())
        n = len(docs)
        self.idf = {t: math.log((1 + n) / (1 + f)) + 1 for t, f in df.items()}
        self.vectors = [self._weigh(c) for c in counts]

    def _weigh(self, counts):
        vec = {t: (1 + math.log(f)) * self.idf[t] for t, f in counts.items() if t in self.idf}
        norm = math.sqrt(sum(v * v for v in vec.values())) or 1.0
        return {t: v / norm for t, v in vec.items()}

    def search(self, query, k=3, threshold=0.12, keep=None):
        """Return up to k (score, doc) pairs, best first. keep(doc) can filter."""
        q = self._weigh(Counter(tokens(query, expand=True)))
        if not q:
            return []
        # Each word of the question, with its synonym if it has one.
        words = [{stem(w), stem(SYNONYMS.get(w, w))} for w in _TOKEN.findall(query.lower())
                 if w not in STOPWORDS]
        hits = []
        for doc, vec in zip(self.docs, self.vectors):
            if keep and not keep(doc):
                continue
            score = sum(w * vec.get(t, 0.0) for t, w in q.items())
            # One shared word is not enough: half the question must be covered.
            covered = sum(1 for group in words if any(t in vec for t in group))
            if score >= threshold and covered * 2 >= len(words):
                hits.append((round(score, 3), doc))
        hits.sort(key=lambda h: -h[0])
        return hits[:k]
