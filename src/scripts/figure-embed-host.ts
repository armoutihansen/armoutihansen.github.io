/* Figure embed channel — host (Work page) side.
 *
 * The one canonical definition of the host half of the contract; the embed half
 * lives in static/figures/_embed.js. See CONTEXT.md -> "Figure embed channel".
 *
 * Astro bundles this module into the page that imports it (it is imported by a
 * processed <script> in src/pages/projects.astro), so it can be ordinary
 * TypeScript — unlike the embed side, which ships verbatim from static/.
 */

type Theme = "light" | "dark";

type EmbTheme = { type: "emb-theme"; theme: Theme };
type EmbMetric = { type: "emb-metric"; key: string | undefined };

const FRAME_SELECTOR = ".work__panel-frame iframe";
const TOGGLE_SELECTOR = ".work__toggle";

function currentTheme(): Theme {
  return (document.documentElement.dataset.theme as Theme) || "dark";
}

// Post to a frame's window, ignoring frames that aren't ready or refuse the
// message; "*" because some illustrations are served from a sibling origin.
function post(target: Window | null, message: EmbTheme | EmbMetric): void {
  try {
    target?.postMessage(message, "*");
  } catch {
    /* not-ready / cross-origin frames are ignored */
  }
}

function frames(): HTMLIFrameElement[] {
  return Array.from(document.querySelectorAll<HTMLIFrameElement>(FRAME_SELECTOR));
}

function broadcastTheme(): void {
  const theme = currentTheme();
  frames().forEach((f) => post(f.contentWindow, { type: "emb-theme", theme }));
}

// Figure-caption toggles drive their sibling illustration via emb-metric.
function wireToggles(): void {
  document.querySelectorAll<HTMLElement>(TOGGLE_SELECTOR).forEach((group) => {
    const panel = group.closest(".work__panel");
    const frame = panel?.querySelector<HTMLIFrameElement>(FRAME_SELECTOR) ?? null;
    const buttons = Array.from(group.querySelectorAll<HTMLButtonElement>(".work__toggle-btn"));
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.setAttribute("aria-selected", b === btn ? "true" : "false"));
        post(frame?.contentWindow ?? null, { type: "emb-metric", key: btn.dataset.key });
      });
    });
  });
}

export function initFigureEmbedHost(): void {
  // A figure announces readiness; reply with the active theme so it syncs even
  // if it loaded after our initial broadcast.
  addEventListener("message", (e: MessageEvent) => {
    if (e?.data?.type === "emb-ready" && e.source) {
      post(e.source as Window, { type: "emb-theme", theme: currentTheme() });
    }
  });

  const ready = () => {
    broadcastTheme();
    wireToggles();
  };
  if (document.readyState !== "loading") ready();
  else addEventListener("DOMContentLoaded", ready);

  // Re-broadcast whenever the host page's theme changes.
  new MutationObserver(broadcastTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
}
