// Headless-Chrome screenshots of the site across breakpoints + both themes.
// Drives the system Chrome via playwright-core (no bundled browser download).
//   BASE=http://localhost:4321 node scripts/screenshots.mjs
import { mkdirSync } from "node:fs";
import { chromium } from "playwright-core";

const BASE = process.env.BASE || "http://localhost:4321";
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = "/tmp/shots";
const PATHS = (process.env.PATHS || "/").split(",");

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
          await deckEl.scrollIntoViewIfNeeded();
          await deckEl.screenshot({ path: `${OUT}/deck1-${theme}.png` });
          const tab2 = await page.$('.deck__tab[data-go="1"]');
          if (tab2) {
            await tab2.click();
            await page.waitForTimeout(500);
            await deckEl.screenshot({ path: `${OUT}/deck2-${theme}.png` });
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
