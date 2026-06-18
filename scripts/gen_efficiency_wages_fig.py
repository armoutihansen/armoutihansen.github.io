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


def theme_block(roles):
    """<style>+<script> injected into the Plotly HTML <head>: background follows
    the host theme, and the plot recolors (warm, amber-on-neutral) per theme."""
    return (
        "<style>:root{--emb-bg:#ece6d7}"
        "@media (prefers-color-scheme:dark){:root{--emb-bg:#1c1912}}"
        ':root[data-theme="light"]{--emb-bg:#ece6d7}:root[data-theme="dark"]{--emb-bg:#1c1912}'
        "html,body{margin:0;background:var(--emb-bg)}"
        ".plot-container,.svg-container{background:transparent!important}</style>"
        # Shared embed-side contract (theme sync + emb-ready handshake); the one
        # canonical definition lives in static/figures/_embed.js.
        '<script src="/figures/_embed.js"></script>'
        "<script>(function(){"
        "var PAL={light:{ink:'#5f594c',grid:'rgba(120,113,92,0.22)',axis:'rgba(120,113,92,0.55)',"
        "c0:'#9a6310',c1:'#6f664c',c2:'#a8572b'},"
        "dark:{ink:'#b1a98f',grid:'rgba(138,131,112,0.2)',axis:'rgba(138,131,112,0.5)',"
        "c0:'#edb24e',c1:'#9a9070',c2:'#d98a52'}};"
        "var ROLES=" + roles + ";"
        "function rgba(h,a){var n=parseInt(h.slice(1),16);"
        "return 'rgba('+((n>>16)&255)+','+((n>>8)&255)+','+(n&255)+','+a+')';}"
        "function curT(){return document.documentElement.dataset.theme||"
        "(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');}"
        "function apply(){var gd=document.querySelector('.plotly-graph-div');"
        "if(!gd||!window.Plotly){return setTimeout(apply,60);}var p=PAL[curT()]||PAL.dark;"
        "Plotly.relayout(gd,{'font.color':p.ink,'legend.font.color':p.ink,"
        "'xaxis.gridcolor':p.grid,'xaxis.linecolor':p.axis,'xaxis.tickcolor':p.axis,"
        "'xaxis.tickfont.color':p.ink,'xaxis.title.font.color':p.ink,"
        "'yaxis.gridcolor':p.grid,'yaxis.linecolor':p.axis,'yaxis.tickcolor':p.axis,"
        "'yaxis.tickfont.color':p.ink,'yaxis.title.font.color':p.ink});"
        "if(gd.layout&&gd.layout.updatemenus&&gd.layout.updatemenus.length){"
        "Plotly.relayout(gd,{'updatemenus[0].font.color':p.ink,'updatemenus[0].bordercolor':p.axis});}"
        "ROLES.forEach(function(r){var c=p[r[2]];"
        "if(r[1]==='line'){Plotly.restyle(gd,{'line.color':[c],'marker.color':[c]},[r[0]]);}"
        "else{Plotly.restyle(gd,{'fillcolor':[rgba(c,0.14)]},[r[0]]);}});}"
        "apply();new MutationObserver(apply).observe(document.documentElement,"
        "{attributes:true,attributeFilter:['data-theme']});"
        "})();</script>"
    )


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

# Light-theme base palette (warm, amber-on-neutral like the front-page panels);
# the injected theme script swaps to the dark palette when the page is dark.
INK = "#5f594c"; GRID = "rgba(120,113,92,0.22)"
colors = {"Prosocial": "#9a6310", "GE": "#6f664c"}
bands  = {"Prosocial": "rgba(154,99,16,0.14)", "GE": "rgba(111,102,76,0.14)"}

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
# Match the card background AND recolor the plot to the host page's light/dark
# theme (iframes can't inherit it; the parent posts the active theme). Plot bg
# stays transparent so --emb-bg shows through. ROLES maps trace index -> palette.
ROLES = "[[0,'band','c0'],[1,'line','c0'],[2,'band','c1'],[3,'line','c1']]"
html = html.replace("<head>", "<head>" + theme_block(ROLES))
open(OUT, "w").write(html)
print("wrote", OUT, len(html), "bytes")
