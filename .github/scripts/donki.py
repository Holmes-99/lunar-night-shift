"""Fetch the last 7 days of real solar flares from NASA's DONKI space weather database.

Runs in the GitHub Pages deploy (every push and once a day), and writes a small JSON file
that the game reads (public/data/space-weather.json). If NASA can't be reached, nothing is
written and the game falls back to its archived list of real storms.
"""
import json
import sys
import urllib.request
from datetime import datetime, timedelta, timezone

out = sys.argv[1]
today = datetime.now(timezone.utc).date()
start = today - timedelta(days=7)
urls = [
    f"https://ccmc.gsfc.nasa.gov/DONKI-API/get/FLR?startDate={start}&endDate={today}",
    f"https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get/FLR?startDate={start}&endDate={today}",
    f"https://api.nasa.gov/DONKI/FLR?startDate={start}&endDate={today}&api_key=DEMO_KEY",
]


def rank(c):
    if not c or c[0] not in "ABCMX":
        return 0
    try:
        n = float(c[1:])
    except ValueError:
        n = 1.0
    return ("ABCMX".index(c[0]) + 1) * 10 + min(n, 9.9)


for url in urls:
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "junior-astronaut-game"}), timeout=40) as r:
            data = json.loads(r.read().decode("utf-8") or "[]")
        if not isinstance(data, list):
            continue
        flares = [{"date": (f.get("peakTime") or f.get("beginTime") or "")[:10], "cls": f.get("classType")} for f in data if f.get("classType")]
        top = max(flares, key=lambda f: rank(f["cls"]), default=None)
        json.dump({
            "_note": "Real solar flares from NASA DONKI (ccmc.gsfc.nasa.gov/donki), fetched automatically when the game is published.",
            "source": url.split("?")[0].replace("&api_key=DEMO_KEY", ""),
            "day": str(today), "n": len(flares), "top": top["cls"] if top else None, "date": top["date"] if top else None,
            "flares": flares[-20:],
        }, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print(f"saved {len(flares)} flares from {url.split('?')[0]}")
        break
    except Exception as e:  # try the next source
        print(f"could not fetch {url.split('?')[0]}: {e}")
else:
    print("NASA DONKI not reachable; the game will use its archived storms")
