# Regenerate the interactive "sharpest-bound win share" figure (The
# Informativeness of Frequency-Report Scoring Rules) shipped at
# static/figures/frequency-rules-winshare.html.
#
# Source: the frequency-beliefs repo's committed
#   outputs/design_exercise/rule_comparison.csv
# Adjust CSV/OUT below if your local paths differ, then run:
#   uv run --with plotly --with pandas python scripts/gen_frequency_fig.py
#
import pandas as pd, plotly.graph_objects as go

CSV = "/Users/jesper/repos/frequency-beliefs/outputs/design_exercise/rule_comparison.csv"
OUT = "/Users/jesper/repos/armoutihansen.github.io/static/figures/frequency-rules-winshare.html"

df = pd.read_csv(CSV)
RULE_MAP = {"Discrete metric": "Frequency guessing",
            "Quadratic distance": "Squared distance",
            "Manhattan distance": "Manhattan distance"}
df["rule"] = df["rule"].map(lambda r: RULE_MAP.get(r, r))

metrics = [("coord_avg", "Average-coordinate"), ("mean_linear", "Linear-mean")]
rules = ["Squared distance", "Frequency guessing", "Manhattan distance"]
alphas = [0.1, 0.3, 1.0, 3.0, 10.0]
colors = {"Squared distance": "#c8881f", "Frequency guessing": "#5f7d9a",
          "Manhattan distance": "#7d9b6f"}

agg = df.groupby(["metric", "rule", "alpha"])["win_share"].mean().reset_index()
def yvals(metric_key, rule):
    s = agg[(agg["metric"] == metric_key) & (agg["rule"] == rule)].set_index("alpha")["win_share"]
    return [round(float(s.get(a, float("nan"))), 4) for a in alphas]

INK = "#8a8370"; GRID = "rgba(138,131,112,0.18)"
default_key = metrics[0][0]

fig = go.Figure()
for rule in rules:
    fig.add_trace(go.Scatter(
        x=alphas, y=yvals(default_key, rule), mode="lines+markers", name=rule,
        line=dict(color=colors[rule], width=2.5), marker=dict(size=7, color=colors[rule]),
        hovertemplate=f"<b>{rule}</b><br>α %{{x}}<br>win share %{{y:.2f}}<extra></extra>"))

buttons = [dict(label=label, method="update",
                args=[{"y": [yvals(key, r) for r in rules]}])
           for key, label in metrics]

fig.update_layout(
    autosize=True,
    margin=dict(l=54, r=18, t=58, b=46),
    paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
    font=dict(family="'Hanken Grotesk', system-ui, sans-serif", color=INK, size=13),
    hovermode="x unified",
    legend=dict(orientation="h", x=0.0, y=1.16, font=dict(size=12.5), bgcolor="rgba(0,0,0,0)"),
    hoverlabel=dict(bgcolor="rgba(20,18,14,0.92)", font=dict(color="#ece4d3", size=12),
                    bordercolor="rgba(138,131,112,0.4)"),
    updatemenus=[dict(type="buttons", direction="right", showactive=True,
                      x=1.0, xanchor="right", y=1.18, yanchor="bottom",
                      pad=dict(t=2, r=2, b=2, l=2),
                      bgcolor="rgba(0,0,0,0)", bordercolor=GRID,
                      font=dict(family="'JetBrains Mono', monospace", size=11, color=INK),
                      buttons=buttons)],
)
axis = dict(showgrid=True, gridcolor=GRID, zeroline=False, linecolor=GRID,
            ticks="outside", tickcolor=GRID,
            tickfont=dict(family="'JetBrains Mono', monospace", size=11))
fig.update_xaxes(title_text="α  (belief concentration)", type="log",
                 tickvals=alphas, ticktext=[str(a) for a in alphas], **axis)
fig.update_yaxes(title_text="Win share", range=[0, 1], **axis)

html = fig.to_html(include_plotlyjs="cdn", full_html=True,
                   config={"responsive": True, "displayModeBar": False})
# Match the card background to the host page's light/dark theme (the parent
# posts the active theme; iframes can't inherit it). Plot stays transparent.
THEME = (
    "<style>:root{--emb-bg:#f3efe4}"
    "@media (prefers-color-scheme:dark){:root{--emb-bg:#15130e}}"
    ':root[data-theme="light"]{--emb-bg:#f3efe4}:root[data-theme="dark"]{--emb-bg:#15130e}'
    "html,body{margin:0;background:var(--emb-bg)}"
    ".plot-container,.svg-container{background:transparent!important}</style>"
    "<script>(function(){function s(t){if(t==='dark'||t==='light')"
    "document.documentElement.dataset.theme=t;}addEventListener('message',function(e){"
    "if(e&&e.data&&e.data.type==='emb-theme')s(e.data.theme);});"
    "try{parent.postMessage({type:'emb-ready'},'*');}catch(_){}})();<\\/script>"
)
html = html.replace("<head>", "<head>" + THEME)
open(OUT, "w").write(html)
print("wrote", OUT, len(html), "bytes")
