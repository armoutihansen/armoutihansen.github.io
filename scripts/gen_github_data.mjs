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

const user = await api(`/users/${USER}`);
const repos = await api(`/users/${USER}/repos?per_page=100&sort=pushed&type=owner`);
const owned = repos.filter((r) => !r.fork && !r.archived);

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
  source: "GitHub REST API (public, unauthenticated)",
};

writeFileSync("src/data/github.json", JSON.stringify(out, null, 2));
console.log(
  `repos=${out.ownedRepos} public=${out.publicRepos} ` +
    `langs=${languages.map((l) => `${l.name}:${l.pct}`).join(",")} lastPush=${out.lastPush}`,
);
