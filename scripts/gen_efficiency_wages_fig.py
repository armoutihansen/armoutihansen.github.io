# Regenerate the interactive "chosen effort by wage" figure (Efficiency Wages
# with Motivated Agents) shipped at static/figures/efficiency-wages-effort.html.
#
# Source data: the efficiency-wages repo's derived CSV, built (no Stata) with
#   uv run python -c "from src.data.assemble import build; build()"
# in that repo. Adjust CSV/OUT below if your local paths differ, then run:
#   uv run --with plotly --with pandas --with numpy python scripts/gen_efficiency_wages_fig.py
#
import os, sys
import numpy as np, pandas as pd
import plotly.graph_objects as go

# Shared figure palette + theme block (single source of truth for the
# warm-charcoal + amber values; this generator supplies only its ROLES).
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from figure_theme import finish_figure


CSV = "/Users/jesper/repos/efficiency-wages/data/derived/agent_wage_long.csv"
OUT = "/Users/jesper/repos/armoutihansen.github.io/static/figures/efficiency-wages-effort.html"

d = pd.read_csv(CSV)
d = d[d["Treatment"].isin(["P", "S"])].copy()
d["Treatment"] = d["treatment_label"]   # P->GE, S->Prosocial

rng = np.random.default_rng(2024)
def stats(vals, n=2000):
    vals = vals[~np.isnan(vals)]
    if len(vals) == 0:
        return np.nan, np.nan, np.nan
    boot = vals[rng.integers(0, len(vals), size=(n, len(vals)))].mean(axis=1)
    return float(vals.mean()), float(np.percentile(boot, 2.5)), float(np.percentile(boot, 97.5))

# Trace STRUCTURE only — no hardcoded colours. The two treatments each ship a
# CI band then a line, in this add order: 0 Prosocial band, 1 Prosocial line,
# 2 GE band, 3 GE line. Colours (build-time + the per-theme runtime swap) come
# from PAL via ROLES: Prosocial = c0 amber, GE = c1 warm-grey.
ROLES = [[0, "band", "c0"], [1, "line", "c0"], [2, "band", "c1"], [3, "line", "c1"]]

fig = go.Figure()
for t in ["Prosocial", "GE"]:
    sub = d[d["Treatment"] == t]
    wages = sorted(sub["Wage"].unique())
    g = sub.groupby("Wage")["Effort"]
    means, lo, hi = [], [], []
    for w in wages:
        m, l, h = stats(g.get_group(w).to_numpy())
        means.append(m); lo.append(l); hi.append(h)
    fig.add_trace(go.Scatter(
        x=wages + wages[::-1], y=hi + lo[::-1], fill="toself",
        line=dict(width=0), hoverinfo="skip",
        showlegend=False, name=f"{t} CI"))
    fig.add_trace(go.Scatter(
        x=wages, y=means, mode="lines+markers", name=t,
        line=dict(width=2.5), marker=dict(size=6),
        customdata=np.stack([lo, hi], axis=-1),
        hovertemplate=f"<b>{t}</b><br>wage %{{x}}<br>mean effort %{{y:.2f}}"
                      "<br>95% CI [%{customdata[0]:.2f}, %{customdata[1]:.2f}]<extra></extra>"))

# Bespoke layout bits stay local; finish_figure merges the shared house style
# (font, transparent bg, hoverlabel, axis-colour skeleton + axis titles) on top.
fig.update_layout(
    autosize=True,
    margin=dict(l=54, r=18, t=46, b=46),
    hovermode="x unified",
    legend=dict(orientation="h", x=0.02, y=1.12, font=dict(size=13),
                bgcolor="rgba(0,0,0,0)"),
)

html = finish_figure(fig, roles=ROLES, x_title="Offered wage",
                     y_title="Mean chosen effort", div_id="efficiency-wages-effort")
open(OUT, "w").write(html)
print("wrote", OUT, len(html), "bytes")
