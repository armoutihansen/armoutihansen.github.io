#!/usr/bin/env python3
"""Generate scripts/data/citibike_tod_risk.json from the owner's CitiBike project.

Dev tool, run manually (like the other gen_*.py). Reads the AXA/DSC project's
trip parquet + cleaned collision CSV, replays the risk_analysis.ipynb temporal
aggregation, and emits the five time-of-day bins (hazard H, exposure E, per-trip
risk R, and the x-vs-safest-window multiple) consumed by the hero's Panel 2.

The committed JSON is the artifact; this script needs the external project and is
not part of the site build. Provenance: ~/Documents/AXA/DSC/notebooks/risk_analysis.ipynb.

    PROJECT_DIR=~/Documents/AXA/DSC python scripts/gen_citibike_tod.py
"""
import json
import os
from pathlib import Path

import duckdb
import numpy as np
import pandas as pd
from sklearn.neighbors import BallTree

PROJECT = Path(os.path.expanduser(os.environ.get("PROJECT_DIR", "~/Documents/AXA/DSC")))
DATA_PATH = str(PROJECT / "data/processed/citibike/*/*/data.parquet")
COLLISION_PATH = str(PROJECT / "data/processed/cleaned_collision_data.csv")
OUT = Path(__file__).resolve().parent / "data" / "citibike_tod_risk.json"

EPS, EARTH_RADIUS_M, MAX_DIST_M, C = 1e-6, 6_371_000, 300, 200.0
ORDER = ["morning", "midday", "evening", "late_evening", "night"]
LABEL = {"morning": "Morning", "midday": "Midday", "evening": "Evening",
         "late_evening": "Late eve", "night": "Night"}


def tod_of(h: int) -> str:
    if 5 <= h < 10:
        return "morning"
    if 10 <= h < 16:
        return "midday"
    if 16 <= h < 20:
        return "evening"
    if 20 <= h < 24:
        return "late_evening"
    return "night"


def eb(H, E, mu, C=C):
    lam = E / (E + C)
    raw = H / (E + EPS)
    return raw, lam * raw + (1 - lam) * mu, lam


def main() -> None:
    col = pd.read_csv(COLLISION_PATH, parse_dates=["CRASH DATETIME"]).dropna(
        subset=["LATITUDE", "LONGITUDE", "CRASH DATETIME"])
    col["CYCLIST_INVOLVED"] = col["CYCLIST_INVOLVED"].fillna(0).astype(int)
    col["NUMBER OF PERSONS INJURED"] = col["NUMBER OF PERSONS INJURED"].fillna(0)
    col["NUMBER OF PERSONS KILLED"] = col["NUMBER OF PERSONS KILLED"].fillna(0)
    col["tod"] = col["CRASH DATETIME"].dt.hour.apply(tod_of)
    base = 1 + 5.0 * col["NUMBER OF PERSONS INJURED"] + 20.0 * col["NUMBER OF PERSONS KILLED"]
    col["severity"] = col["CYCLIST_INVOLVED"] * base + 0.1 * (1 - col["CYCLIST_INVOLVED"]) * base

    con = duckdb.connect()
    stations = con.execute(
        """
        WITH trips AS (SELECT start_station_id, start_lat, start_lng, end_station_id, end_lat, end_lng
                       FROM read_parquet($d)),
        u AS (SELECT start_station_id station_id, start_lat lat, start_lng lon FROM trips WHERE start_station_id IS NOT NULL
              UNION SELECT end_station_id, end_lat, end_lng FROM trips WHERE end_station_id IS NOT NULL)
        SELECT DISTINCT CAST(station_id AS VARCHAR) station_id, ROUND(lat::DOUBLE,5) lat, ROUND(lon::DOUBLE,5) lon
        FROM u ORDER BY station_id
        """, {"d": DATA_PATH}).df().dropna(subset=["lat", "lon"])

    tree = BallTree(np.deg2rad(stations[["lat", "lon"]].values), metric="haversine")
    dist, idx = tree.query(np.deg2rad(col[["LATITUDE", "LONGITUDE"]].values), k=1)
    dm = dist.flatten() * EARTH_RADIUS_M
    col["station_id"] = np.where(dm <= MAX_DIST_M, stations.iloc[idx.flatten()]["station_id"].values, np.nan)
    col = col.dropna(subset=["station_id"])
    col["station_id"] = col["station_id"].astype(str)

    hazard = col.groupby(["station_id", "tod"], as_index=False)["severity"].sum().rename(columns={"severity": "H"})
    exposure = con.execute(
        """
        WITH trips AS (SELECT CAST(start_station_id AS VARCHAR) station_id, started_at
                       FROM read_parquet($d) WHERE start_station_id IS NOT NULL),
        b AS (SELECT station_id, CASE
                WHEN EXTRACT(hour FROM started_at) BETWEEN 5 AND 9 THEN 'morning'
                WHEN EXTRACT(hour FROM started_at) BETWEEN 10 AND 15 THEN 'midday'
                WHEN EXTRACT(hour FROM started_at) BETWEEN 16 AND 19 THEN 'evening'
                WHEN EXTRACT(hour FROM started_at) BETWEEN 20 AND 23 THEN 'late_evening'
                ELSE 'night' END tod FROM trips)
        SELECT station_id, tod, COUNT(*) E FROM b GROUP BY station_id, tod
        """, {"d": DATA_PATH}).df()

    rp = exposure.merge(hazard, on=["station_id", "tod"], how="left")
    rp["H"] = rp["H"].fillna(0)
    t = rp.groupby("tod", as_index=False)[["H", "E"]].sum()
    mu = t["H"].sum() / (t["E"].sum() + EPS)
    t["R_raw"], t["R_eb"], t["lam"] = eb(t["H"], t["E"], mu)
    t = t.set_index("tod")
    rmin = t["R_eb"].min()

    bins = [{
        "key": k, "label": LABEL[k],
        "H": round(float(t.loc[k, "H"]), 1),
        "E": int(t.loc[k, "E"]),
        "R": round(float(t.loc[k, "R_eb"]), 6),
        "x_daytime": round(float(t.loc[k, "R_eb"] / rmin), 2),
    } for k in ORDER]

    doc = ("CitiBike system-wide per-trip crash risk by time of day. Recomputed from the "
           "owner's AXA/DSC project (notebooks/risk_analysis.ipynb): NYPD collision severity "
           "(hazard H) and CitiBike departures (exposure E) aggregated over 2025 trips, "
           "risk = H / E, EB-smoothed (lambda ~ 1 at this aggregate exposure, so R_eb ~ R_raw). "
           "x_daytime = R / min(R). The exposure normalization inverts the ranking: most crash "
           "severity is at midday, but per-trip risk peaks at night.")
    OUT.write_text(json.dumps({"_doc": doc, "bins": bins}, indent=2) + "\n")
    print("wrote", OUT)
    for b in bins:
        print(f"  {b['label']:>9}  H={b['H']:>9}  E={b['E']:>9}  R={b['R']:.6f}  {b['x_daytime']}x")


if __name__ == "__main__":
    main()
