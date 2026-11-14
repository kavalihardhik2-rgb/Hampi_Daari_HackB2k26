"""Route planner.

Problem: a visitor has limited time and Hampi is spread out. Which monuments
should they see, and in what order, so that they miss as little as possible?

Method:
  1. Greedy insertion. Keep adding the monument that gives the most value per
     extra minute, at the position in the route where it adds the fewest
     minutes, while it still fits in the time available. Anything the visitor
     marked as a must-see goes in before this step.
  2. 2-opt. Reverse stretches of the route whenever that shortens the walk.

Distances are straight-line (haversine) multiplied by a detour factor, since
paths in Hampi wind around boulders.
"""
import math

SPEED_KMPH = {"walk": 4.0, "cycle": 10.0, "auto": 18.0, "bike": 22.0, "car": 28.0}
DETOUR = 1.35
WEIGHT = 3.0  # how much more one extra star of importance is worth


def km(a, b):
    """Haversine distance in km between two points with 'lat' and 'lon'."""
    r = 6371.0
    p1, p2 = math.radians(a["lat"]), math.radians(b["lat"])
    dp = p2 - p1
    dl = math.radians(b["lon"] - a["lon"])
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(h))


def travel_min(a, b, mode):
    return km(a, b) * DETOUR / SPEED_KMPH[mode] * 60


def route_minutes(start, route, mode):
    """Total minutes for start -> route[0] -> ... including time at each stop."""
    total, here = 0.0, start
    for s in route:
        total += travel_min(here, s, mode) + s["visit_min"]
        here = s
    return total


def _cheapest_insert(start, route, site, mode):
    """Best position for a new site and the minutes it adds."""
    best_pos, best_extra = 0, float("inf")
    for i in range(len(route) + 1):
        prev = start if i == 0 else route[i - 1]
        extra = travel_min(prev, site, mode)
        if i < len(route):
            extra += travel_min(site, route[i], mode) - travel_min(prev, route[i], mode)
        if extra < best_extra:
            best_pos, best_extra = i, extra
    return best_pos, best_extra + site["visit_min"]


def _two_opt(start, route, mode):
    improved = True
    while improved:
        improved = False
        for i in range(len(route) - 1):
            for j in range(i + 1, len(route)):
                candidate = route[:i] + route[i:j + 1][::-1] + route[j + 1:]
                if route_minutes(start, candidate, mode) + 1e-6 < route_minutes(start, route, mode):
                    route, improved = candidate, True
    return route


def plan(start, sites, minutes, mode="walk", must=()):
    """Return the visit plan as a dict ready to send to the browser."""
    if mode not in SPEED_KMPH:
        raise ValueError(f"unknown mode: {mode}")
    route, left = [], list(sites)

    # Places the visitor insisted on go in first, even if they are far.
    for site in [s for s in left if s["id"] in must]:
        pos, _ = _cheapest_insert(start, route, site, mode)
        route.insert(pos, site)
        left.remove(site)

    # Greedy: keep adding the monument that gives the most value per extra
    # minute. Value triples with each star, so a 5-star monument is worth a
    # long walk but three 3-star ones next door can still beat it.
    while left:
        used = route_minutes(start, route, mode)
        best = None
        for site in left:
            pos, extra = _cheapest_insert(start, route, site, mode)
            if used + extra > minutes:
                continue
            value = WEIGHT ** site["priority"] / extra
            if best is None or value > best[0]:
                best = (value, site, pos)
        if best is None:
            break
        _, site, pos = best
        route.insert(pos, site)
        left.remove(site)

    route = _two_opt(start, route, mode)

    stops, clock, here, dist = [], 0.0, start, 0.0
    for s in route:
        leg_km = km(here, s) * DETOUR
        clock += leg_km / SPEED_KMPH[mode] * 60
        dist += leg_km
        stops.append({
            "id": s["id"], "name": s["name"], "lat": s["lat"], "lon": s["lon"],
            "leg_km": round(leg_km, 2), "arrive_min": round(clock),
            "visit_min": s["visit_min"], "tip": s.get("tip", ""),
            "rating": s.get("rating", 0), "reviews": s.get("reviews", 0),
        })
        clock += s["visit_min"]
        here = s

    return {
        "mode": mode, "minutes_available": minutes,
        "minutes_used": round(clock), "distance_km": round(dist, 1),
        "over_budget": clock > minutes + 0.5,
        "stops": stops,
        "skipped": [{"id": s["id"], "name": s["name"],
                     "rating": s.get("rating", 0), "reviews": s.get("reviews", 0)}
                    for s in sorted(left, key=lambda s: -s["priority"])],
        "total_sites": len(sites),
    }
