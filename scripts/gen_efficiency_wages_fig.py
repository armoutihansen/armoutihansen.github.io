# Regenerate the interactive "chosen effort by wage" figure (Efficiency Wages
# with Motivated Agents) shipped at static/figures/efficiency-wages-effort.html.
#
# Source data: the efficiency-wages repo's derived CSV, built (no Stata) with
#   uv run python -c "from src.data.assemble import build; build()"
# in that repo. Adjust CSV/OUT below if your local paths differ, then run:
#   uv run --with plotly --with pandas --with numpy python scripts/gen_efficiency_wages_fig.py
#
import numpy as np, pandas as pd
import plotly.graph_objects as go

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

INK = "#8a8370"; GRID = "rgba(138,131,112,0.18)"
colors = {"Prosocial": "#c8881f", "GE": "#5f7d9a"}
bands  = {"Prosocial": "rgba(200,136,31,0.15)", "GE": "rgba(95,125,154,0.17)"}

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
        fillcolor=bands[t], line=dict(width=0), hoverinfo="skip",
        showlegend=False, name=f"{t} CI"))
    fig.add_trace(go.Scatter(
        x=wages, y=means, mode="lines+markers", name=t,
        line=dict(color=colors[t], width=2.5), marker=dict(size=6, color=colors[t]),
        customdata=np.stack([lo, hi], axis=-1),
        hovertemplate=f"<b>{t}</b><br>wage %{{x}}<br>mean effort %{{y:.2f}}"
                      "<br>95% CI [%{customdata[0]:.2f}, %{customdata[1]:.2f}]<extra></extra>"))

fig.update_layout(
    autosize=True,
    margin=dict(l=54, r=18, t=46, b=46),
    paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
    font=dict(family="'Hanken Grotesk', system-ui, sans-serif", color=INK, size=13),
    hovermode="x unified",
    legend=dict(orientation="h", x=0.02, y=1.12, font=dict(size=13),
                bgcolor="rgba(0,0,0,0)"),
    hoverlabel=dict(bgcolor="rgba(20,18,14,0.92)", font=dict(color="#ece4d3", size=12),
                    bordercolor="rgba(138,131,112,0.4)"),
)
axis = dict(showgrid=True, gridcolor=GRID, zeroline=False, linecolor=GRID,
            ticks="outside", tickcolor=GRID, tickfont=dict(family="'JetBrains Mono', monospace", size=11))
fig.update_xaxes(title_text="Offered wage", **axis)
fig.update_yaxes(title_text="Mean chosen effort", **axis)

html = fig.to_html(include_plotlyjs="cdn", full_html=True,
                   config={"responsive": True, "displayModeBar": False})
# transparent so the card background (light/dark) shows through
html = html.replace("<head>",
    "<head><style>html,body{margin:0;background:transparent}"
    ".plot-container,.svg-container{background:transparent!important}</style>")
open(OUT, "w").write(html)
print("wrote", OUT, len(html), "bytes")
