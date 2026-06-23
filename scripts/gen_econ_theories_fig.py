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
from figure_theme import finish_figure, write_figure_html


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

# Trace STRUCTURE only — no hardcoded colours. The single completeness line's
# colour (build-time and the per-theme runtime swap) comes from PAL via ROLES:
# one trace in add order, completeness = c0 amber.
ROLES = [[0, "line", "c0"]]

fig = go.Figure()
fig.add_trace(go.Scatter(
    x=x, y=y, mode="lines+markers", name="Completeness",
    line=dict(width=2.5, shape="spline"),
    marker=dict(size=8),
    hovertemplate="<b>%{x}</b><br>completeness %{y:.0f}%<extra></extra>"))

# Bespoke layout/axis bits stay local; finish_figure merges the shared house
# style (font, transparent bg, hoverlabel, axis-colour skeleton) on top.
fig.update_layout(
    autosize=True,
    margin=dict(l=54, r=18, t=30, b=64),
    hovermode="x unified", showlegend=False,
)
fig.update_xaxes(type="category", tickangle=-35)
fig.update_yaxes(range=[0, 100], ticksuffix="%")

html = finish_figure(
    fig, roles=ROLES,
    x_title="Heterogeneity captured  (1 type → latent types → full)",
    y_title="Completeness",
    div_id="econ-theories-completeness")
write_figure_html(html, OUT)
