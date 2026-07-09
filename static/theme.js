/* Document theme state.
 *
 * This file is loaded synchronously from BaseLayout.astro so the resolved theme
 * is on <html> before the first paint. The document's data-theme attribute is
 * the external seam: page modules and embedded figures observe it, while this
 * module owns preference resolution, persistence, and the theme toggle.
 *
 * Figure palette values and figure-specific recolouring stay outside this file.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "theme";
  var THEME_COLORS = { light: "#f3efe4", dark: "#15130e" };
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  var userSelected = false;
  var followingSystem = false;

  function isTheme(value) {
    return value === "light" || value === "dark";
  }

  function storedTheme() {
    try {
      var value = window.localStorage.getItem(STORAGE_KEY);
      return isTheme(value) ? value : null;
    } catch (_) {
      return null;
    }
  }

  function systemTheme() {
    return media && media.matches ? "dark" : "light";
  }

  function syncChrome(theme) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", THEME_COLORS[theme] || THEME_COLORS.dark);

    var toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(theme === "dark"));
      toggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
      );
    }
  }

  function apply(theme) {
    if (!isTheme(theme)) return;
    root.dataset.theme = theme;
    syncChrome(theme);
  }

  function onSystemChange(event) {
    if (followingSystem && !userSelected) apply(event.matches ? "dark" : "light");
  }

  function stopFollowingSystem() {
    if (!followingSystem || !media || !media.removeEventListener) return;
    media.removeEventListener("change", onSystemChange);
    followingSystem = false;
  }

  function startFollowingSystem() {
    if (!media || followingSystem || !media.addEventListener) return;
    media.addEventListener("change", onSystemChange);
    followingSystem = true;
  }

  function persist(theme) {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (_) {
      // A session-only explicit choice is still useful when storage is blocked.
    }
  }

  function wireToggle() {
    var toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle) return;

    syncChrome(root.dataset.theme || systemTheme());
    toggle.addEventListener("click", function () {
      var current = root.dataset.theme === "dark" ? "dark" : "light";
      var next = current === "dark" ? "light" : "dark";
      userSelected = true;
      stopFollowingSystem();
      persist(next);
      apply(next);
    });
  }

  var stored = storedTheme();
  if (stored) {
    userSelected = true;
    apply(stored);
  } else {
    apply(systemTheme());
    startFollowingSystem();
  }

  // Keep browser chrome and the toggle coherent if another page adapter writes
  // the document seam. Theme policy still has one owner: this module.
  if (window.MutationObserver) {
    new window.MutationObserver(function () {
      syncChrome(root.dataset.theme || systemTheme());
    }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  }

  if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", wireToggle);
  else wireToggle();
})();
