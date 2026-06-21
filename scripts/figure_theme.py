# Figure palette — the single source of truth.
#
# The warm-charcoal + amber palette shared by every figure shipped from
# static/figures/ lives HERE, in one place, as structured Python data. Two
# delivery mechanisms read from it so the VALUES are defined exactly once:
#
#   1. Generated Plotly figures (scripts/gen_*_fig.py) inject `theme_block(ROLES)`
#      into their <head>. It builds the <style> (--emb-bg) and the recolor <script>
#      (the PAL object: ink/grid/axis/c0/c1/c2 per theme) from the constants below.
#
#   2. Hand-written figures (coding-agent-trace.html, rag-architecture.html) <link>
#      static/figures/_palette.css, which is emitted by `write_palette_css()` from
#      these same constants. They reference var(--ink)/var(--amber)/... instead of
#      re-declaring the tokens.
#
# To change the palette, edit the constants in this file and re-run the two
# generators plus this module's __main__ (it rewrites _palette.css). Nothing else
# transcribes these values.
#
# This is the PALETTE seam only. The embed WIRE PROTOCOL (theme-sync handshake) is
# a separate, already-consolidated concern: static/figures/_embed.js +
# src/scripts/figure-embed-host.ts. See CONTEXT.md.

import os

# --- canonical palette, per theme -------------------------------------------
# `ink`  : primary text / foreground.
# `c0`   : the amber accent (the hand-written figures' --amber).
# `c1`/`c2`: the warm-grey and clay secondaries used by the Plotly traces.
# `emb-bg`: the card background each figure paints so it matches the host page.
# Grid/axis hairlines share one neutral RGB base per theme at different alphas.
PAL = {
    "light": {
        "ink": "#5f594c",
        "c0": "#9a6310",
        "c1": "#6f664c",
        "c2": "#a8572b",
        "emb-bg": "#ece6d7",
        "neutral": "120,113,92",   # rgb base for grid/axis/line hairlines
    },
    "dark": {
        "ink": "#b1a98f",
        "c0": "#edb24e",
        "c1": "#9a9070",
        "c2": "#d98a52",
        "emb-bg": "#1c1912",
        "neutral": "138,131,112",
    },
}

# Hairline alphas over the per-theme neutral RGB base.
GRID_ALPHA = {"light": "0.22", "dark": "0.2"}
AXIS_ALPHA = {"light": "0.55", "dark": "0.5"}


def _grid(theme):
    return "rgba(" + PAL[theme]["neutral"] + "," + GRID_ALPHA[theme] + ")"


def _axis(theme):
    return "rgba(" + PAL[theme]["neutral"] + "," + AXIS_ALPHA[theme] + ")"


# The dark hover tooltip shared by every generated figure. Copy-pasted across
# the generators today and NOT part of PAL (it is its own dark-on-warm chrome,
# not a theme token), so it lives here as the one canonical definition.
HOVERLABEL = dict(
    bgcolor="rgba(20,18,14,0.92)",
    font=dict(color="#ece4d3", size=12),
    bordercolor="rgba(138,131,112,0.4)",
)


def _pal_js(theme):
    """One theme's slice of the JS PAL object, byte-compatible with the
    hand-written original (ink/grid/axis/c0/c1/c2)."""
    p = PAL[theme]
    return (
        "{ink:'" + p["ink"] + "',"
        "grid:'" + _grid(theme) + "',"
        "axis:'" + _axis(theme) + "',"
        "c0:'" + p["c0"] + "',c1:'" + p["c1"] + "',c2:'" + p["c2"] + "'}"
    )


def _roles_js(roles):
    """Serialize the Python roles list to the exact JS literal the runtime
    recolor expects: single quotes, no spaces, unquoted ints — e.g.
    `[[0,'line','c0']]`. Hand-built (not json.dumps) to stay byte-identical."""
    return "[" + ",".join(
        "[%d,'%s','%s']" % (idx, kind, role) for idx, kind, role in roles
    ) + "]"


def _rgba(hex_color, alpha):
    """hex -> rgba(r,g,b,alpha), matching the JS rgba() helper in theme_block."""
    n = int(hex_color.lstrip("#"), 16)
    return "rgba(%d,%d,%d,%s)" % ((n >> 16) & 255, (n >> 8) & 255, n & 255, alpha)


def theme_block(roles):
    """<style>+<script> injected into the Plotly HTML <head>: background follows
    the host theme, and the plot recolors (warm, amber-on-neutral) per theme.

    `roles` is the Python list mapping trace index -> palette role (e.g.
    `[[0, "line", "c0"], ...]`), serialized here to the JS literal. It is the ONLY
    per-figure input; everything else is single-sourced from this module's PAL."""
    light, dark = PAL["light"], PAL["dark"]
    return (
        "<style>:root{--emb-bg:" + light["emb-bg"] + "}"
        "@media (prefers-color-scheme:dark){:root{--emb-bg:" + dark["emb-bg"] + "}}"
        ':root[data-theme="light"]{--emb-bg:' + light["emb-bg"] + '}'
        ':root[data-theme="dark"]{--emb-bg:' + dark["emb-bg"] + '}'
        "html,body{margin:0;background:var(--emb-bg)}"
        ".plot-container,.svg-container{background:transparent!important}</style>"
        # Shared embed-side contract (theme sync + emb-ready handshake); the one
        # canonical definition lives in static/figures/_embed.js.
        '<script src="/figures/_embed.js"></script>'
        "<script>(function(){"
        "var PAL={light:" + _pal_js("light") + ","
        "dark:" + _pal_js("dark") + "};"
        "var ROLES=" + _roles_js(roles) + ";"
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


def finish_figure(fig, *, roles, x_title, y_title, div_id):
    """Build a generated Plotly figure in the house style and return its HTML.

    The generator supplies only data, trace STRUCTURE, the `roles` map, and a
    stable `div_id`; every colour — build-time (here) and runtime (theme_block's
    JS) — comes from PAL, keyed by that one map. For each `[idx, kind, role]`: a
    'line' trace gets its line/marker colour set to PAL["light"][role]; a 'band'
    trace gets its fillcolor set to that role colour at 0.14 alpha (the Python
    twin of the JS recolor in theme_block). The shared font, transparent
    backgrounds, dark hoverlabel, and axis-colour skeleton are merged on top of
    the generator's bespoke layout/axis settings (margins, legend,
    type/range/tickangle/...), which survive untouched.

    `div_id` makes the output deterministic: plotly otherwise stamps a fresh
    random uuid on the plot <div> per run, so regenerating would always diff.
    With a stable id, `python scripts/gen_*_fig.py` is reproducible and a clean
    `git diff` is the real regression gate."""
    light = PAL["light"]
    for idx, kind, role in roles:
        c = light[role]
        if kind == "line":
            fig.data[idx].line.color = c
            fig.data[idx].marker.color = c
        else:
            fig.data[idx].fillcolor = _rgba(c, "0.14")

    # Merge the shared house style onto the generator's bespoke layout/axes.
    fig.update_layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(family="'Hanken Grotesk', system-ui, sans-serif",
                  color=light["ink"], size=13),
        hoverlabel=HOVERLABEL,
    )
    axis = dict(showgrid=True, gridcolor=_grid("light"), zeroline=False,
                linecolor=_grid("light"), ticks="outside", tickcolor=_grid("light"),
                tickfont=dict(family="'JetBrains Mono', monospace", size=11))
    fig.update_xaxes(title_text=x_title, **axis)
    fig.update_yaxes(title_text=y_title, **axis)

    html = fig.to_html(include_plotlyjs="cdn", full_html=True, div_id=div_id,
                       config={"responsive": True, "displayModeBar": False})
    return html.replace("<head>", "<head>" + theme_block(roles))


# --- shared CSS for the hand-written figures --------------------------------
# Hand-written figures <link> this file and reference var(--ink)/var(--amber)/
# var(--emb-bg)/var(--line) instead of re-declaring the warm-charcoal + amber
# tokens. --line is the axis-alpha hairline; figures that want a different line
# weight (or extra figure-local tokens like --dim) override locally AFTER the
# <link>. Generated from PAL by write_palette_css() — DO NOT hand-edit the .css.
PALETTE_CSS_PATH = os.path.join(
    os.path.dirname(__file__), "..", "static", "figures", "_palette.css"
)


def _tokens(theme):
    p = PAL[theme]
    return (
        "--ink:" + p["ink"] + "; "
        "--amber:" + p["c0"] + "; "
        "--line:" + _axis(theme) + "; "
        "--emb-bg:" + p["emb-bg"] + ";"
    )


def palette_css():
    """The canonical :root token block for the hand-written figures, emitted
    from PAL. Covers the light default, prefers-color-scheme:dark, and the
    explicit [data-theme] overrides the embed channel toggles."""
    light, dark = _tokens("light"), _tokens("dark")
    return (
        "/* Figure palette — GENERATED from scripts/figure_theme.py (PAL). Do not\n"
        " * hand-edit; change the palette there and re-run `python scripts/figure_theme.py`.\n"
        " * This is the canonical warm-charcoal + amber token source shared by the\n"
        " * hand-written figures. Figures <link> it, then may override --line/add\n"
        " * figure-local tokens (e.g. --dim) locally. */\n"
        ":root { " + light + " }\n"
        "@media (prefers-color-scheme:dark){ :root{ " + dark + " } }\n"
        ':root[data-theme="light"]{ ' + light + " }\n"
        ':root[data-theme="dark"]{ ' + dark + " }\n"
    )


def write_palette_css():
    out = os.path.normpath(PALETTE_CSS_PATH)
    with open(out, "w") as f:
        f.write(palette_css())
    return out


if __name__ == "__main__":
    path = write_palette_css()
    print("wrote", path)
