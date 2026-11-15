"""Hampi Daari web server.

Run:  python app.py
Then open http://localhost:5000 on this laptop, or the LAN address printed in
the terminal on any phone connected to the same Wi-Fi or hotspot.
"""
import os
import socket

from flask import Flask, abort, jsonify, render_template, request

from hampi import guide, nearby, planner
from hampi.data import SITE_BY_ID, SITES, STARTS

try:
    import segno  # QR codes for the signboards
except ImportError:  # the rest of the app still works without it
    segno = None

app = Flask(__name__)
app.json.ensure_ascii = False  # send Kannada and Hindi text as it is
PORT = int(os.environ.get("PORT", 5000))


def lan_ip():
    """This laptop's address on the local network, so phones can reach it."""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("10.255.255.255", 1))  # nothing is sent; this only picks a route
        return s.getsockname()[0]
    except OSError:
        return "127.0.0.1"
    finally:
        s.close()


def public_url():
    """Address printed inside the QR codes. Set PUBLIC_URL if you host it online."""
    return os.environ.get("PUBLIC_URL", f"http://{lan_ip()}:{PORT}").rstrip("/")


def qr_svg(site_id, scale=6):
    if segno is None:
        return ""
    return segno.make(f"{public_url()}/#site/{site_id}", error="m").svg_inline(
        scale=scale, border=2, dark="#2b2622")


# ---------- pages ----------

@app.get("/sw.js")
def service_worker():
    return app.send_static_file("sw.js")


@app.get("/")
def home():
    return render_template("index.html")


@app.get("/login")
def login():
    return render_template("login.html")


@app.get("/signs")
def signs():
    cards = [{"site": s, "qr": qr_svg(s["id"], 4)} for s in SITES]
    return render_template("signs.html", cards=cards, base=public_url(), single=False,
                           qr_ready=segno is not None)


@app.get("/sign/<site_id>")
def sign(site_id):
    site = SITE_BY_ID.get(site_id) or abort(404)
    return render_template("signs.html", cards=[{"site": site, "qr": qr_svg(site_id, 8)}],
                           base=public_url(), single=True, qr_ready=segno is not None)


# ---------- data for the browser ----------

@app.get("/api/sites")
def api_sites():
    return jsonify({"sites": SITES, "starts": STARTS})


@app.get("/api/ask")
def api_ask():
    q = request.args.get("q", "").strip()[:300]
    if not guide.has_content(q):
        return jsonify({"error": "Type a question about Hampi."}), 400
    return jsonify(guide.ask(q))


@app.get("/api/check")
def api_check():
    q = request.args.get("q", "").strip()[:300]
    if not guide.has_content(q):
        return jsonify({"error": "Type what the guide told you."}), 400
    return jsonify(guide.check(q))


@app.post("/api/plan")
def api_plan():
    body = request.get_json(silent=True) or {}
    try:
        minutes = max(30, min(int(body.get("minutes", 240)), 10080))
        mode = body.get("mode", "walk")
        start = body.get("start", "hampi-bazaar")
        if isinstance(start, dict):
            start = {"name": "Your location", "lat": float(start["lat"]), "lon": float(start["lon"])}
        else:
            start = STARTS[start]
        must = [m for m in body.get("must", []) if m in SITE_BY_ID]
        result = planner.plan(start, SITES, minutes, mode, must)
    except (KeyError, TypeError, ValueError):
        return jsonify({"error": "Could not read the plan request."}), 400
    result["start"] = start
    return jsonify(result)


@app.get("/api/nearby")
def api_nearby():
    """Stays, food, water, toilets, ATMs and shops near a monument or a point."""
    site = request.args.get("site")
    try:
        if site:
            lat, lon = SITE_BY_ID[site]["lat"], SITE_BY_ID[site]["lon"]
        else:
            lat, lon = float(request.args["lat"]), float(request.args["lon"])
    except (KeyError, ValueError):
        return jsonify({"error": "Give a monument or a position."}), 400
    if nearby.distance_m(lat, lon, 15.327, 76.467) > 30000:
        return jsonify({"error": "That position is too far from Hampi."}), 400
    return jsonify({"lat": lat, "lon": lon, **nearby.nearby(lat, lon)})


if __name__ == "__main__":
    print("\n  Hampi Daari is running.")
    print(f"  On this laptop : http://localhost:{PORT}")
    print(f"  On a phone     : {public_url()}  (same Wi-Fi or hotspot)\n")
    app.run(host="0.0.0.0", port=PORT, debug=False)
