import { bandStats, type HeroPoint } from "../data/hero-model";

type Cleanup = () => void;
type Metric = "sev" | "risk";

type ConfidencePalette = {
  pos: string;
  neg: string;
  band: string;
  axis: string;
  text: string;
};

type PlacedPoint = { x: number; y: number; p: number; cls: number };

type ConfidenceLayout = {
  x0: number;
  x1: number;
  plotW: number;
  baseY: number;
  topY: number;
  radius: number;
  placed: PlacedPoint[];
};

type TodReadout = { peak: string; mult: string; exp: string };

type TodPayload = {
  readouts?: Partial<Record<Metric, TodReadout>>;
  notes?: Partial<Record<Metric, string>>;
  peakSevI?: number;
  peakRiskI?: number;
};

const NOOP: Cleanup = () => {};
const mounted = new WeakMap<HTMLElement, Cleanup>();

function readJson<T>(element: Element | null): T | null {
  if (!element?.textContent) return null;
  try {
    return JSON.parse(element.textContent) as T;
  } catch {
    return null;
  }
}

function initConfidencePanel(root: HTMLElement): Cleanup {
  const figure = root.querySelector<HTMLElement>(".predict");
  if (!figure) return NOOP;
  const canvas = figure.querySelector<HTMLCanvasElement>(".predict__canvas")!;
  if (!canvas) return NOOP;
  const handle = figure.querySelector<HTMLElement>("[data-handle]")!;
  if (!handle) return NOOP;
  const points = readJson<HeroPoint[]>(root.querySelector("[data-hero-points]"))!;
  if (!points) return NOOP;
  const context = canvas.getContext("2d")!;
  if (!context) return NOOP;

  const output = {
    auto: figure.querySelector<HTMLElement>('[data-k="auto"]'),
    review: figure.querySelector<HTMLElement>('[data-k="review"]'),
    accuracy: figure.querySelector<HTMLElement>('[data-k="acc"]'),
  };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const HI_MIN = 0.52;
  const HI_MAX = 0.97;
  const INSET = { l: 12, r: 12, t: 16, b: 26 };

  let hi = 0.75;
  let width = 0;
  let height = 0;
  let layout: ConfidenceLayout | null = null;
  let palette = readPalette();
  let dragging = false;
  let resizeFrame: number | undefined;
  let introFrame: number | undefined;
  let resizeObserver: ResizeObserver | undefined;
  let themeObserver: MutationObserver | undefined;

  function readPalette(): ConfidencePalette {
    const styles = getComputedStyle(document.documentElement);
    const token = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback;
    return {
      pos: token("--accent", "#edb24e"),
      neg: token("--viz-neg", "#7f8da6"),
      band: token("--viz-band", "rgba(127,127,127,0.07)"),
      axis: token("--line-strong", "#4a4434"),
      text: token("--faint", "#8a8370"),
    };
  }

  function xFor(probability: number): number {
    return layout ? layout.x0 + probability * layout.plotW : 0;
  }

  function computeLayout(): void {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    if (width < 2 || height < 2) {
      layout = null;
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const x0 = INSET.l;
    const x1 = width - INSET.r;
    const plotW = x1 - x0;
    const baseY = height - INSET.b;
    const topY = INSET.t;
    const availableHeight = baseY - topY;
    const binCount = Math.max(22, Math.min(64, Math.floor(plotW / 9)));
    const bins: HeroPoint[][] = Array.from({ length: binCount }, () => []);

    for (const point of points) {
      let bin = Math.floor(point.p * binCount);
      if (bin < 0) bin = 0;
      if (bin >= binCount) bin = binCount - 1;
      bins[bin].push(point);
    }

    let maxCount = 1;
    for (const bin of bins) maxCount = Math.max(maxCount, bin.length);
    const gap = Math.min(8, availableHeight / maxCount);
    const radius = Math.max(1.5, Math.min(3.3, gap * 0.44));
    const placed: PlacedPoint[] = [];

    for (let bin = 0; bin < binCount; bin++) {
      const centerX = x0 + ((bin + 0.5) / binCount) * plotW;
      for (let row = 0; row < bins[bin].length; row++) {
        const point = bins[bin][row];
        placed.push({ x: centerX, y: baseY - (row + 0.5) * gap, p: point.p, cls: point.y });
      }
    }

    layout = { x0, x1, plotW, baseY, topY, radius, placed };
  }

  function draw(progress: number): void {
    if (!layout) return;
    const lo = 1 - hi;
    context.clearRect(0, 0, width, height);

    const bandStart = xFor(lo);
    const bandEnd = xFor(hi);
    context.fillStyle = palette.band;
    context.fillRect(bandStart, layout.topY - 6, bandEnd - bandStart, layout.baseY - layout.topY + 6);
    context.strokeStyle = palette.pos;
    context.globalAlpha = 0.55;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(Math.round(bandStart) + 0.5, layout.topY - 6);
    context.lineTo(Math.round(bandStart) + 0.5, layout.baseY);
    context.moveTo(Math.round(bandEnd) + 0.5, layout.topY - 6);
    context.lineTo(Math.round(bandEnd) + 0.5, layout.baseY);
    context.stroke();
    context.globalAlpha = 1;

    context.strokeStyle = palette.axis;
    context.beginPath();
    context.moveTo(layout.x0, layout.baseY + 0.5);
    context.lineTo(layout.x1, layout.baseY + 0.5);
    context.stroke();
    context.fillStyle = palette.text;
    context.font = '600 10px "JetBrains Mono Variable", ui-monospace, monospace';
    context.textBaseline = "top";

    const ticks: [string, number, CanvasTextAlign][] = [
      ["0", 0, "left"],
      ["0.5", 0.5, "center"],
      ["1", 1, "right"],
    ];
    for (const [label, probability, align] of ticks) {
      const x = xFor(probability);
      context.fillRect(x - 0.5, layout.baseY, 1, 3);
      context.textAlign = align;
      context.fillText(label, x, layout.baseY + 5);
    }

    const reveal = layout.x0 + progress * (layout.plotW + 2);
    for (const point of layout.placed) {
      if (point.x > reveal) continue;
      const inReview = point.p > lo && point.p < hi;
      context.globalAlpha = inReview ? 0.2 : 0.92;
      context.fillStyle = point.cls ? palette.pos : palette.neg;
      context.beginPath();
      context.arc(point.x, point.y, layout.radius, 0, Math.PI * 2);
      context.fill();
    }
    context.globalAlpha = 1;
  }

  function syncUI(): void {
    const stats = bandStats(points, hi);
    if (output.auto) output.auto.textContent = stats.autoPct + "%";
    if (output.review) output.review.textContent = stats.reviewPct + "%";
    if (output.accuracy) output.accuracy.textContent = stats.autoAcc + "%";
    if (layout) handle.style.left = xFor(hi) + "px";
    handle.setAttribute("aria-valuenow", String(Math.round(hi * 100)));
    handle.setAttribute("aria-valuetext", stats.reviewPct + "% of cases sent to review");
  }

  function setHiFromClientX(clientX: number): void {
    if (!layout) return;
    const rect = canvas.getBoundingClientRect();
    let probability = (clientX - rect.left - layout.x0) / layout.plotW;
    if (probability < 0.5) probability = 1 - probability;
    hi = Math.max(HI_MIN, Math.min(HI_MAX, probability));
    draw(1);
    syncUI();
  }

  function startDrag(event: PointerEvent, element: HTMLElement): void {
    dragging = true;
    element.setPointerCapture(event.pointerId);
    setHiFromClientX(event.clientX);
    event.preventDefault();
  }

  const onCanvasPointerDown = (event: PointerEvent) => startDrag(event, canvas);
  const onHandlePointerDown = (event: PointerEvent) => startDrag(event, handle);
  const onPointerMove = (event: PointerEvent) => {
    if (dragging) setHiFromClientX(event.clientX);
  };
  const onPointerUp = () => {
    dragging = false;
  };
  const onHandleKeyDown = (event: KeyboardEvent) => {
    const step = event.shiftKey ? 0.05 : 0.01;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") hi = Math.max(HI_MIN, hi - step);
    else if (event.key === "ArrowRight" || event.key === "ArrowUp") hi = Math.min(HI_MAX, hi + step);
    else return;
    event.preventDefault();
    draw(1);
    syncUI();
  };

  canvas.addEventListener("pointerdown", onCanvasPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  handle.addEventListener("pointerdown", onHandlePointerDown);
  handle.addEventListener("pointermove", onPointerMove);
  handle.addEventListener("pointerup", onPointerUp);
  handle.addEventListener("keydown", onHandleKeyDown);

  if (typeof ResizeObserver !== "undefined") {
    let firstResize = true;
    resizeObserver = new ResizeObserver(() => {
      if (firstResize) {
        firstResize = false;
        return;
      }
      if (resizeFrame !== undefined) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        palette = readPalette();
        computeLayout();
        draw(1);
        syncUI();
      });
    });
    resizeObserver.observe(canvas);
  }

  if (typeof MutationObserver !== "undefined") {
    themeObserver = new MutationObserver(() => {
      palette = readPalette();
      draw(1);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }

  computeLayout();
  syncUI();
  if (reducedMotion) {
    draw(1);
  } else {
    const duration = 850;
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min(1, (timestamp - start) / duration);
      draw(1 - Math.pow(1 - progress, 3));
      if (progress < 1) introFrame = window.requestAnimationFrame(step);
      else introFrame = undefined;
    };
    introFrame = window.requestAnimationFrame(step);
  }

  return () => {
    canvas.removeEventListener("pointerdown", onCanvasPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointercancel", onPointerUp);
    handle.removeEventListener("pointerdown", onHandlePointerDown);
    handle.removeEventListener("pointermove", onPointerMove);
    handle.removeEventListener("pointerup", onPointerUp);
    handle.removeEventListener("keydown", onHandleKeyDown);
    resizeObserver?.disconnect();
    themeObserver?.disconnect();
    if (resizeFrame !== undefined) window.cancelAnimationFrame(resizeFrame);
    if (introFrame !== undefined) window.cancelAnimationFrame(introFrame);
  };
}

function initRiskPanel(root: HTMLElement): Cleanup {
  const panel = root.querySelector<HTMLElement>("[data-tod]");
  const bars = panel ? Array.from(panel.querySelectorAll<SVGRectElement>(".rbar__rect")) : [];
  const buttons = panel ? Array.from(panel.querySelectorAll<HTMLButtonElement>("[data-tod-go]")) : [];
  const payload = readJson<TodPayload>(panel?.querySelector("[data-tod-readouts]") ?? null);
  if (!panel || !payload || bars.length === 0 || buttons.length === 0) return NOOP;
  const tod = payload;
  if (!Number.isInteger(tod.peakSevI) || !Number.isInteger(tod.peakRiskI)) return NOOP;

  const note = panel.querySelector<HTMLElement>("[data-tod-note]");
  const output = {
    peak: panel.querySelector<HTMLElement>('[data-k="peak"]'),
    multiplier: panel.querySelector<HTMLElement>('[data-k="mult"]'),
    exposure: panel.querySelector<HTMLElement>('[data-k="exp"]'),
  };
  const peak: Record<Metric, number> = {
    sev: tod.peakSevI as number,
    risk: tod.peakRiskI as number,
  };

  function setMetric(metric: Metric): void {
    for (const [index, bar] of bars.entries()) {
      bar.style.transform = `scaleY(${bar.dataset[metric] || "0"})`;
      bar.classList.toggle("is-peak", index === peak[metric]);
    }
    const readout = tod.readouts?.[metric];
    if (readout) {
      if (output.peak) output.peak.textContent = readout.peak;
      if (output.multiplier) output.multiplier.textContent = readout.mult;
      if (output.exposure) output.exposure.textContent = readout.exp;
    }
    if (note && tod.notes?.[metric]) note.textContent = tod.notes[metric] as string;
    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(button.dataset.todGo === metric));
    }
  }

  const cleanups: Cleanup[] = [];
  for (const button of buttons) {
    const onClick = () => {
      const metric = button.dataset.todGo;
      if (metric === "sev" || metric === "risk") setMetric(metric);
    };
    button.addEventListener("click", onClick);
    cleanups.push(() => button.removeEventListener("click", onClick));
  }
  setMetric("risk");

  return () => cleanups.forEach((cleanup) => cleanup());
}

function initDeckNavigation(root: HTMLElement): Cleanup {
  const track = root.querySelector<HTMLElement>("[data-deck-track]");
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>(".deck__tab"));
  if (!track || tabs.length === 0) return NOOP;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let scrollTimer: number | undefined;
  const setActive = (index: number) => {
    tabs.forEach((tab, tabIndex) => tab.setAttribute("aria-selected", String(tabIndex === index)));
  };
  const cleanups: Cleanup[] = [];

  for (const tab of tabs) {
    const onClick = () => {
      const index = Number(tab.dataset.go);
      if (!Number.isInteger(index) || index < 0 || index >= tabs.length) return;
      const left = index * track.clientWidth;
      if (typeof track.scrollTo === "function") {
        track.scrollTo({ left, behavior: reducedMotion ? "auto" : "smooth" });
      } else {
        track.scrollLeft = left;
      }
      setActive(index);
    };
    tab.addEventListener("click", onClick);
    cleanups.push(() => tab.removeEventListener("click", onClick));
  }

  const onScroll = () => {
    if (scrollTimer !== undefined) window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      const width = track.clientWidth || 1;
      setActive(Math.round(track.scrollLeft / width));
    }, 60);
  };
  track.addEventListener("scroll", onScroll);
  cleanups.push(() => {
    track.removeEventListener("scroll", onScroll);
    if (scrollTimer !== undefined) window.clearTimeout(scrollTimer);
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}

/** Initialize the hero's browser behavior and return its teardown function. */
export function initHeroDeck(root: HTMLElement): Cleanup {
  const existing = mounted.get(root);
  if (existing) return existing;

  const cleanups = [initConfidencePanel(root), initRiskPanel(root), initDeckNavigation(root)];
  let active = true;
  const teardown = () => {
    if (!active) return;
    active = false;
    for (const cleanup of cleanups) cleanup();
    mounted.delete(root);
  };
  mounted.set(root, teardown);
  return teardown;
}
