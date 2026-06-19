# Regenerate the interactive "sharpest-bound win share" figure (The
# Informativeness of Frequency-Report Scoring Rules) shipped at
# static/figures/frequency-rules-winshare.html.
#
# Source: the frequency-beliefs repo's committed
#   outputs/design_exercise/rule_comparison.csv
# Adjust CSV/OUT below if your local paths differ, then run:
#   uv run --with plotly --with pandas python scripts/gen_frequency_fig.py
#
import json, os, sys
import pandas as pd, plotly.graph_objects as go

# Shared figure palette + theme block (single source of truth for the
# warm-charcoal + amber values; this generator supplies only its ROLES).
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from figure_theme import theme_block


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
colors = {"Squared distance": "#9a6310", "Frequency guessing": "#a8572b",
          "Manhattan distance": "#6f664c"}

agg = df.groupby(["metric", "rule", "alpha"])["win_share"].mean().reset_index()
def yvals(metric_key, rule):
    s = agg[(agg["metric"] == metric_key) & (agg["rule"] == rule)].set_index("alpha")["win_share"]
    return [round(float(s.get(a, float("nan"))), 4) for a in alphas]

INK = "#5f594c"; GRID = "rgba(120,113,92,0.22)"
default_key = metrics[0][0]

fig = go.Figure()
for rule in rules:
    fig.add_trace(go.Scatter(
        x=alphas, y=yvals(default_key, rule), mode="lines+markers", name=rule,
        line=dict(color=colors[rule], width=2.5), marker=dict(size=7, color=colors[rule]),
        hovertemplate=f"<b>{rule}</b><br>α %{{x}}<br>win share %{{y:.2f}}<extra></extra>"))

fig.update_layout(
    autosize=True,
    margin=dict(l=46, r=12, t=58, b=46),
    paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
    font=dict(family="'Hanken Grotesk', system-ui, sans-serif", color=INK, size=13),
    hovermode="x unified",
    legend=dict(orientation="h", x=0.0, y=1.16, font=dict(size=10.5),
                itemwidth=30, bgcolor="rgba(0,0,0,0)"),
    hoverlabel=dict(bgcolor="rgba(20,18,14,0.92)", font=dict(color="#ece4d3", size=12),
                    bordercolor="rgba(138,131,112,0.4)"),
)
axis = dict(showgrid=True, gridcolor=GRID, zeroline=False, linecolor=GRID,
            ticks="outside", tickcolor=GRID,
            tickfont=dict(family="'JetBrains Mono', monospace", size=11))
fig.update_xaxes(title_text="α  (belief concentration)", type="log",
                 tickvals=alphas, ticktext=[str(a) for a in alphas], **axis)
fig.update_yaxes(title_text="Win share", range=[0, 1], **axis)

html = fig.to_html(include_plotlyjs="cdn", full_html=True,
                   config={"responsive": True, "displayModeBar": False})
# Background follows the host theme and the three rule lines recolor per theme.
# Traces in add order: Squared distance (c0 amber), Frequency guessing (c2 clay),
# Manhattan distance (c1 warm grey).
ROLES = "[[0,'line','c0'],[1,'line','c2'],[2,'line','c1']]"
html = html.replace("<head>", "<head>" + theme_block(ROLES))

# The metric toggle lives in the host page's figure caption (aligned with the
# headline, like the CitiBike legend). The figure embed channel re-dispatches the
# parent's emb-metric message as the DOM event 'emb:metric'; restyle on it.
YDATA = json.dumps({key: [yvals(key, r) for r in rules] for key, _ in metrics})
listener = (
    "<script>(function(){var Y=" + YDATA + ";"
    "document.addEventListener('emb:metric',function(e){"
    "var k=e.detail&&e.detail.key;if(!k||!Y[k])return;"
    "var gd=document.querySelector('.plotly-graph-div');"
    "if(gd&&window.Plotly)Plotly.restyle(gd,{y:Y[k]});});"
    "})();</script>"
)
html = html.replace("</body>", listener + "</body>")
open(OUT, "w").write(html)
print("wrote", OUT, len(html), "bytes")
