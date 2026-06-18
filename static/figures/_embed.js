/* Figure embed channel — embed (iframe) side.
 *
 * The one canonical definition of the embed half of the contract between the
 * Work page and the illustration iframes it hosts. The host half lives in
 * src/scripts/figure-embed-host.ts. See CONTEXT.md -> "Figure embed channel".
 *
 * Wire protocol:
 *   child  -> parent : {type:"emb-ready"}              handshake — "send me state"
 *   parent -> child  : {type:"emb-theme", theme}       theme in {"light","dark"}
 *   parent -> child  : {type:"emb-metric", key}        re-dispatched on this
 *                      document as the DOM event "emb:metric" (detail.key), for
 *                      the figure to handle with its own data.
 *
 * Figures include this verbatim and never re-implement the protocol:
 *   <script src="/figures/_embed.js"></script>
 * A figure reacts to theme by observing the data-theme attribute, and to a
 * metric change by listening for the "emb:metric" event. This module carries no
 * figure-specific logic (palette, chart data) — that stays in each figure.
 *
 * This file is shipped verbatim from static/ (Astro does not bundle public/),
 * so it is plain ES5-safe JS with no imports.
 */
(function () {
  function setTheme(t) {
    if (t === "dark" || t === "light") document.documentElement.dataset.theme = t;
  }

  // Pure message dispatch — the channel's whole behaviour, kept as one function.
  function handle(data) {
    if (!data || !data.type) return;
    if (data.type === "emb-theme") {
      setTheme(data.theme);
    } else if (data.type === "emb-metric") {
      document.dispatchEvent(new CustomEvent("emb:metric", { detail: { key: data.key } }));
    }
  }

  addEventListener("message", function (e) {
    handle(e && e.data);
  });

  // Announce readiness so the host replies with the active theme, even if this
  // figure finished loading after the host's initial broadcast.
  try {
    parent.postMessage({ type: "emb-ready" }, "*");
  } catch (_) {}
})();
