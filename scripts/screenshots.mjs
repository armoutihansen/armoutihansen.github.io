// Local QA helper: headless screenshots of the site across breakpoints + both
// themes. Drives a Chrome/Chromium you already have installed (no bundled
// browser download). Override the binary with CHROME_PATH and the output
// directory with SHOTS_DIR.
//   BASE=http://localhost:4321 node scripts/screenshots.mjs
import { existsSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright-core";

const BASE = process.env.BASE || "http://localhost:4321";
const OUT = process.env.SHOTS_DIR || join(tmpdir(), "site-shots");
const PATHS = (process.env.PATHS || "/").split(",");

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);
const CHROME = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!CHROME) {
  throw new Error(
    `No Chrome/Chromium binary found. Set CHROME_PATH to your browser executable. Tried:\n  ${CHROME_CANDIDATES.join("\n  ")}`,
  );
}

const views = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
  { name: "narrow", width: 320, height: 760 },
];
const themes = ["dark", "light"];

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME });

for (const theme of themes) {
  const ctx = await browser.newContext({ colorScheme: theme, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  for (const path of PATHS) {
    const slug = path.replace(/\//g, "") || "home";
    for (const v of views) {
      await page.setViewportSize({ width: v.width, height: v.height });
      await page.goto(BASE + path, { waitUntil: "networkidle" });
      await page.waitForTimeout(1300); // let the hero animation settle
      await page.screenshot({ path: `${OUT}/${slug}-${v.name}-${theme}.png` });
      await page.screenshot({ path: `${OUT}/${slug}-${v.name}-${theme}-full.png`, fullPage: true });
      if (v.name === "desktop" && slug === "home") {
        const deckEl = await page.$(".deck");
        if (deckEl) {
          const handle = page.locator("[data-handle]");
          if ((await handle.count()) === 1) {
            const before = Number(await handle.getAttribute("aria-valuenow"));
            await handle.press("ArrowRight");
            const after = Number(await handle.getAttribute("aria-valuenow"));
            if (!Number.isFinite(before) || !Number.isFinite(after) || after <= before) {
              throw new Error(`hero confidence keyboard interaction failed: ${before} -> ${after}`);
            }
          }

          await deckEl.scrollIntoViewIfNeeded();
          await deckEl.screenshot({ path: `${OUT}/deck1-${theme}.png` });
          const tab2 = await page.$('.deck__tab[data-go="1"]');
          if (tab2) {
            await tab2.click();
            await page.waitForTimeout(500);
            if ((await tab2.getAttribute("aria-selected")) !== "true") {
              throw new Error("hero deck tab interaction failed: risk tab is not selected");
            }
            await deckEl.screenshot({ path: `${OUT}/deck2-${theme}.png` });
          }
          const severity = await page.$('[data-tod-go="sev"]');
          const risk = await page.$('[data-tod-go="risk"]');
          const peak = await page.$('[data-k="peak"]');
          if (severity && risk && peak) {
            await severity.click();
            if ((await peak.textContent())?.trim() !== "Midday") {
              throw new Error("hero risk interaction failed: severity peak is not Midday");
            }
            await risk.click();
            if ((await peak.textContent())?.trim() !== "Night") {
              throw new Error("hero risk interaction failed: risk peak is not Night");
            }
          }
          const tab1 = await page.$('.deck__tab[data-go="0"]');
          if (tab1) await tab1.click();
        }
        const pubEl = await page.$(".publist");
        if (pubEl) {
          await pubEl.scrollIntoViewIfNeeded();
          await pubEl.screenshot({ path: `${OUT}/research-${theme}.png` });
        }
        const capEl = await page.$(".capabilities");
        if (capEl) {
          await capEl.scrollIntoViewIfNeeded();
          await capEl.screenshot({ path: `${OUT}/capabilities-${theme}.png` });
        }
        const tlEl = await page.$(".timeline");
        if (tlEl) {
          await tlEl.scrollIntoViewIfNeeded();
          await tlEl.screenshot({ path: `${OUT}/experience-${theme}.png` });
        }
      }
    }
  }
  await ctx.close();
}

await browser.close();
console.log("shots written to", OUT);
