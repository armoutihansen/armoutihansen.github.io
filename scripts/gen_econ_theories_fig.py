# Regenerate the interactive "individual-level completeness ladder" figure
# (Economic Theories and Machine Learning) shipped at
# static/figures/econ-theories-completeness.html.
#
# Source: the predictive-completeness repo's committed
#   results/il_ladder.csv
# Adjust CSV/OUT below if your local paths differ, then run:
#   uv run --with plotly --with pandas --with numpy python scripts/gen_econ_theories_fig.py
#
# Framing (load-bearing for honesty; see ADR 0009 in the source repo): this
# figure makes the HETEROGENEITY-RICHNESS claim only. Completeness rises as the
# model captures more individual heterogeneity — a single representative agent is
# far from enough, and even a few latent types do not exhaust it. The x-axis is
# the heterogeneity STRUCTURE (1 type -> K latent types -> full/continuous),
# never an "evaluation level," and the degenerate per-subject MLE rung is
# excluded (it is an overfit point, not part of the ladder).
import os, sys
import pandas as pd
import plotly.graph_objects as go

# Shared figure palette + theme block (single source of truth for the
# warm-charcoal + amber values; this generator supplies only its ROLES).
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from figure_theme import theme_block


CSV = "/Users/jesper/repos/pred_comp_soc_pref/results/il_ladder.csv"
OUT = "/Users/jesper/repos/armoutihansen.github.io/static/figures/econ-theories-completeness.html"

df = pd.read_csv(CSV)

# Exclude the per-subject MLE rung (overfit/degenerate, not part of the ladder).
df = df[df["rung"] != "per_subject_mle"].copy()

# The ladder climbs through richer heterogeneity structure. f_K1 (one latent
# type) coincides with f_1 (a single representative agent); keep one rung per
# distinct structure so the x-axis reads as increasing richness.
df = df[df["rung"] != "f_K1"].copy()

# Readable x labels for the heterogeneity structure: a single agent, then a
# growing number of latent types, then the full/continuous frontier.
def label(rung):
    if rung == "f_1":
        return "1 type"
    if rung == "f_G":
        return "Full"
    if rung.startswith("f_K"):
        return f"{rung[3:]} types"
    return rung

df["xlabel"] = df["rung"].map(label)
df["pct"] = df["C_IL_upper"] * 100.0

x = df["xlabel"].tolist()
y = [round(float(v), 2) for v in df["pct"].tolist()]

# Light-theme base palette (warm, amber-on-neutral like the front-page panels);
# the injected theme script swaps to the dark palette when the page is dark.
INK = "#5f594c"; GRID = "rgba(120,113,92,0.22)"
AMBER = "#9a6310"

fig = go.Figure()
fig.add_trace(go.Scatter(
    x=x, y=y, mode="lines+markers", name="Completeness",
    line=dict(color=AMBER, width=2.5, shape="spline"),
    marker=dict(size=8, color=AMBER),
    hovertemplate="<b>%{x}</b><br>completeness %{y:.0f}%<extra></extra>"))

fig.update_layout(
    autosize=True,
    margin=dict(l=54, r=18, t=30, b=64),
    paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
    font=dict(family="'Hanken Grotesk', system-ui, sans-serif", color=INK, size=13),
    hovermode="x unified", showlegend=False,
    hoverlabel=dict(bgcolor="rgba(20,18,14,0.92)", font=dict(color="#ece4d3", size=12),
                    bordercolor="rgba(138,131,112,0.4)"),
)
axis = dict(showgrid=True, gridcolor=GRID, zeroline=False, linecolor=GRID,
            ticks="outside", tickcolor=GRID,
            tickfont=dict(family="'JetBrains Mono', monospace", size=11))
fig.update_xaxes(title_text="Heterogeneity captured  (1 type → latent types → full)",
                 type="category", tickangle=-35, **axis)
fig.update_yaxes(title_text="Completeness", range=[0, 100], ticksuffix="%", **axis)

html = fig.to_html(include_plotlyjs="cdn", full_html=True,
                   config={"responsive": True, "displayModeBar": False})
# Background follows the host theme and the single completeness line recolors
# per theme. One trace in add order: completeness (c0 amber).
ROLES = "[[0,'line','c0']]"
html = html.replace("<head>", "<head>" + theme_block(ROLES))
open(OUT, "w").write(html)
print("wrote", OUT, len(html), "bytes")
