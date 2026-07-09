import { describe, expect, it } from "vitest";
import themeSource from "../../static/theme.js?raw";

type Listener = (event?: { matches?: boolean }) => void;

class FakeElement {
  dataset: Record<string, string> = {};
  attributes: Record<string, string> = {};
  listeners: Record<string, Listener[]> = {};

  setAttribute(name: string, value: string): void {
    this.attributes[name] = value;
  }

  addEventListener(name: string, listener: Listener): void {
    this.listeners[name] = [...(this.listeners[name] ?? []), listener];
  }

  dispatch(name: string, event?: { matches?: boolean }): void {
    for (const listener of this.listeners[name] ?? []) listener(event);
  }
}

interface Harness {
  root: FakeElement;
  meta: FakeElement;
  toggle: FakeElement;
  media: {
    matches: boolean;
    change: (matches: boolean) => void;
    listenerCount: () => number;
  };
  storage: { value: string | null; writes: string[]; throwOnAccess: boolean };
  ready: () => void;
}

function harness(stored: string | null, systemDark: boolean): Harness {
  const root = new FakeElement();
  const meta = new FakeElement();
  const toggle = new FakeElement();
  const windowListeners: Record<string, Listener[]> = {};
  const mediaListeners: Listener[] = [];
  const storage = { value: stored, writes: [] as string[], throwOnAccess: false };
  const media = {
    matches: systemDark,
    addEventListener: (_name: string, listener: Listener) => mediaListeners.push(listener),
    removeEventListener: (_name: string, listener: Listener) => {
      const index = mediaListeners.indexOf(listener);
      if (index >= 0) mediaListeners.splice(index, 1);
    },
    change: (matches: boolean) => {
      media.matches = matches;
      for (const listener of [...mediaListeners]) listener({ matches });
    },
    listenerCount: () => mediaListeners.length,
  };

  const windowObject = {
    matchMedia: () => media,
    localStorage: {
      getItem: () => {
        if (storage.throwOnAccess) throw new Error("storage unavailable");
        return storage.value;
      },
      setItem: (_key: string, value: string) => {
        if (storage.throwOnAccess) throw new Error("storage unavailable");
        storage.value = value;
        storage.writes.push(value);
      },
    },
    MutationObserver: class {
      constructor(private readonly callback: Listener) {}
      observe(): void {}
      trigger(): void { this.callback(); }
    },
    addEventListener: (name: string, listener: Listener) => {
      windowListeners[name] = [...(windowListeners[name] ?? []), listener];
    },
  };

  const documentObject = {
    documentElement: root,
    readyState: "loading",
    querySelector: (selector: string): FakeElement | null => {
      if (selector === 'meta[name="theme-color"]') return meta;
      if (selector === "[data-theme-toggle]") return toggle;
      return null;
    },
  };

  new Function("window", "document", themeSource)(windowObject, documentObject);

  return {
    root,
    meta,
    toggle,
    media,
    storage,
    ready: () => {
      for (const listener of windowListeners.DOMContentLoaded ?? []) listener();
    },
  };
}

describe("document theme state", () => {
  it("uses the OS theme when no explicit preference exists and follows OS changes", () => {
    const h = harness(null, true);

    expect(h.root.dataset.theme).toBe("dark");
    expect(h.meta.attributes.content).toBe("#15130e");
    expect(h.media.listenerCount()).toBe(1);

    h.media.change(false);
    expect(h.root.dataset.theme).toBe("light");
    expect(h.meta.attributes.content).toBe("#f3efe4");
  });

  it("honours a valid stored preference over the OS and does not follow it", () => {
    const h = harness("light", true);
    h.ready();

    expect(h.root.dataset.theme).toBe("light");
    expect(h.toggle.attributes["aria-pressed"]).toBe("false");
    expect(h.toggle.attributes["aria-label"]).toBe("Switch to dark theme");
    expect(h.media.listenerCount()).toBe(0);

    h.media.change(false);
    expect(h.root.dataset.theme).toBe("light");
  });

  it("ignores invalid stored values and persists an explicit toggle", () => {
    const h = harness("sepia", false);
    h.ready();

    expect(h.root.dataset.theme).toBe("light");
    h.toggle.dispatch("click");

    expect(h.root.dataset.theme).toBe("dark");
    expect(h.storage.writes).toEqual(["dark"]);
    expect(h.media.listenerCount()).toBe(0);
    expect(h.toggle.attributes["aria-pressed"]).toBe("true");
    expect(h.toggle.attributes["aria-label"]).toBe("Switch to light theme");

    h.media.change(true);
    expect(h.root.dataset.theme).toBe("dark");
  });

  it("still applies a session-only toggle when storage is unavailable", () => {
    const h = harness(null, false);
    h.storage.throwOnAccess = true;
    h.ready();

    expect(() => h.toggle.dispatch("click")).not.toThrow();
    expect(h.root.dataset.theme).toBe("dark");
    expect(h.media.listenerCount()).toBe(0);
  });
});
