// Fetch a snapshot of public GitHub activity for the "Open source" strip.
// Run occasionally; the output (src/data/github.json) is committed and shipped
// static, so the site makes no GitHub API calls at build or request time.
//   node scripts/gen_github_data.mjs
import { writeFileSync } from "node:fs";

const USER = "armoutihansen";

async function api(path) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: { "User-Agent": `${USER}-site-build`, Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`${path} -> ${res.status} ${res.statusText}`);
  return res.json();
}

// Scrape the public contribution calendar (no auth) and fold it into week columns.
async function contributions() {
  const res = await fetch(`https://github.com/users/${USER}/contributions`, {
    headers: { "User-Agent": `${USER}-site-build`, "X-Requested-With": "XMLHttpRequest" },
  });
  if (!res.ok) throw new Error(`contributions -> ${res.status} ${res.statusText}`);
  const html = await res.text();
  // Dedupe by date (the HTML can repeat a day) and sort ascending for a clean scan.
  const byDate = new Map();
  for (const m of html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g)) {
    byDate.set(m[1], Number(m[2]));
  }
  const cells = [...byDate.keys()].sort().map((date) => ({ date, level: byDate.get(date) }));
  const totalMatch = html.match(/([\d,]+)\s+contributions?\s+in\s+the\s+last\s+year/i);
  const total = totalMatch ? Number(totalMatch[1].replace(/,/g, "")) : null;

  // Build Sunday-first week columns; pad the leading/trailing partial weeks with null.
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const weeks = [];
  const months = [];
  let week = null;
  let lastMonth = -1;
  for (const c of cells) {
    const d = new Date(`${c.date}T00:00:00Z`);
    const wd = d.getUTCDay();
    if (wd === 0 || week === null) {
      week = [null, null, null, null, null, null, null];
      weeks.push(week);
    }
    week[wd] = c.level;
    const m = d.getUTCMonth();
    if (m !== lastMonth) {
      months.push({ label: MONTHS[m], col: weeks.length - 1 });
      lastMonth = m;
    }
  }

  return { total, start: cells[0]?.date, end: cells.at(-1)?.date, weeks, months };
}

const user = await api(`/users/${USER}`);
const repos = await api(`/users/${USER}/repos?per_page=100&sort=pushed&type=owner`);
const owned = repos.filter((r) => !r.fork && !r.archived);
const contrib = await contributions();

const langCount = {};
for (const r of owned) if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
const ranked = Object.entries(langCount).sort((a, b) => b[1] - a[1]);
const total = ranked.reduce((s, [, n]) => s + n, 0) || 1;
const languages = ranked.slice(0, 5).map(([name, n]) => ({ name, pct: Math.round((100 * n) / total) }));

const out = {
  user: USER,
  url: user.html_url,
  publicRepos: user.public_repos,
  ownedRepos: owned.length,
  lastPush: owned[0]?.pushed_at ?? user.updated_at,
  languages,
  contributions: contrib,
  source: "GitHub REST API + public contributions calendar (unauthenticated)",
};

writeFileSync("src/data/github.json", JSON.stringify(out, null, 2));
console.log(
  `repos=${out.ownedRepos} public=${out.publicRepos} ` +
    `langs=${languages.map((l) => `${l.name}:${l.pct}`).join(",")} lastPush=${out.lastPush} ` +
    `contrib=${contrib.total} weeks=${contrib.weeks.length}`,
);
