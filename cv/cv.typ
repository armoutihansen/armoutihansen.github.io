// Jesper Armouti-Hansen — CV
// Build:  npm run cv:build (from the repository root)
// Design: clean, minimal, single-column data-science CV. Near-black on white, one
//         restrained navy accent (subtitle eyebrow + section rules). The site's
//         three fonts in STRICT single roles: Fraunces = name only, Hanken Grotesk
//         = all reading text, JetBrains Mono = metadata only (dates, contact, tags,
//         skill values; tabular figures). Tight size scale + one spacing scale.
//         Single column, real text → ATS-safe.
// Edit:   Professional facts live in src/data/professional-record.json. Selection,
//         prose, and styling live here.

// ============================================================ palette ========
#let ink    = rgb("#1a1a1a")
#let grey   = rgb("#595959")
#let faint  = rgb("#8a8a8a")
#let accent = rgb("#1f3a5f") // deep navy — the single restrained accent
#let paper  = rgb("#ffffff")

#let serif = "Fraunces"       // the name only
#let sans  = "Hanken Grotesk" // all reading text
#let mono  = "JetBrains Mono"  // metadata: dates, contact, tags, skill values

// size scale (5 steps + one mono size) ----------------------------------------
#let fs-name = 28pt
#let fs-sec  = 11pt
#let fs-lead = 10.5pt   // section-entry titles + the summary
#let fs-body = 10pt     // bullets, summaries, reading text
#let fs-cap  = 9.5pt    // sub-lines (location/role), skill labels
#let fs-meta = 8.5pt    // all mono metadata

// spacing scale ---------------------------------------------------------------
#let s-xs = 0.3em
#let s-s  = 0.55em
#let s-m  = 0.95em
#let s-l  = 1.5em

#let measure = 100%     // prose fills the content width — one unified right edge
                        // (line length is governed by the page margin instead)

#let professional-record = json("../src/data/professional-record.json")
#let identity-facts = professional-record.identity

// ============================================================ page ===========
#set page(
  paper: "a4",
  margin: (x: 2.5cm, top: 1.5cm, bottom: 1.3cm),
  fill: paper,
  footer: context {
    let pages = counter(page).final().first()
    if pages > 1 {
      set text(font: mono, size: 7.5pt, fill: faint)
      grid(columns: (1fr, auto),
        [#professional-record.identity.name],
        counter(page).display("1 / 1", both: true))
    }
  },
)
#set text(font: sans, size: fs-body, fill: ink, lang: "en")
#set par(leading: 0.74em, spacing: 0.7em, justify: false)
#show link: it => text(fill: ink)[#it]

// =========================================================== helpers =========
// mono metadata, optionally as non-breaking dot-separated terms
#let metatext(s) = text(font: mono, size: fs-meta, fill: grey)[#s]
// each separator binds to the FOLLOWING term (box = non-breaking), so a wrap never
// strands a dangling "·" at a line end
#let monolist(items) = text(font: mono, size: fs-meta, fill: grey,
  items.enumerate().map(pair => {
    let (i, t) = pair
    if i == 0 { box[#t] } else { box[· #t] }
  }).join(" "))

// section heading: tracked caps (Hanken) with the navy rule running on the same
// line — from after the title to the right edge (note, if any, sits at far right)
#let section(title, note: none) = block(above: s-l, below: s-s, breakable: false,
  grid(columns: (auto, 1fr, auto), column-gutter: 0.85em,
    align: (left + horizon, center + horizon, right + horizon),
    text(size: fs-sec, weight: 700, tracking: 0.1em, fill: accent)[#upper(title)],
    line(length: 100%, stroke: 0.8pt + accent),
    if note != none { metatext(note) } else [],
  ))

// two-line entry: bold title + right-aligned mono date, then italic grey sub-line
#let entry(title, date, sub) = {
  grid(columns: (1fr, auto), align: (left + horizon, right + horizon), column-gutter: 1em,
    text(size: fs-lead, weight: 600)[#title],
    text(font: mono, size: fs-meta, fill: grey)[#date])
  if sub != none { block(above: s-xs, text(size: fs-cap, style: "italic", fill: grey)[#sub]) }
}

#set list(marker: text(fill: grey, size: 0.62em, baseline: -0.12em)[•], indent: 0.2em, body-indent: 0.5em, spacing: 0.72em)
#let bullets(items) = block(above: 0.8em, width: measure, text(size: fs-body, fill: ink)[#list(..items)])

// ========================================================== CONTENT ==========
#let experience-facts = professional-record.experience
#let education-facts = professional-record.education
#let teaching-facts = professional-record.teaching.courses
#let skill-facts = professional-record.skills.items
#let spoken-language-facts = professional-record.spokenLanguages
#let people-facts = professional-record.people
#let publication-facts = professional-record.publications
#let selected-work-facts = professional-record.selectedWork

#let professional-link-fact(id) = {
  let matches = identity-facts.links.filter(link => link.id == id)
  assert(matches.len() == 1, message: "Unknown Professional record link id: " + id)
  matches.first()
}

#let website-link = professional-link-fact("website")
#let linkedin-link = professional-link-fact("linkedin")
#let github-link = professional-link-fact("github")

#let experience-fact(id) = {
  let matches = experience-facts.filter(entry => entry.id == id)
  assert(matches.len() == 1, message: "Unknown Professional record experience id: " + id)
  matches.first()
}

#let education-fact(id) = {
  let matches = education-facts.filter(entry => entry.id == id)
  assert(matches.len() == 1, message: "Unknown Professional record education id: " + id)
  matches.first()
}

#let teaching-fact(id) = {
  let matches = teaching-facts.filter(entry => entry.id == id)
  assert(matches.len() == 1, message: "Unknown Professional record teaching course id: " + id)
  matches.first()
}

#let skill-fact(id) = {
  let matches = skill-facts.filter(entry => entry.id == id)
  assert(matches.len() == 1, message: "Unknown Professional record skill id: " + id)
  matches.first()
}

#let spoken-language-fact(id) = {
  let matches = spoken-language-facts.filter(entry => entry.id == id)
  assert(matches.len() == 1, message: "Unknown Professional record spoken language id: " + id)
  matches.first()
}

#let person-fact(id) = {
  let matches = people-facts.filter(entry => entry.id == id)
  assert(matches.len() == 1, message: "Unknown Professional record person id: " + id)
  matches.first()
}

#let publication-fact(id) = {
  let matches = publication-facts.filter(entry => entry.id == id)
  assert(matches.len() == 1, message: "Unknown Professional record publication id: " + id)
  matches.first()
}

#let selected-work-fact(id) = {
  let matches = selected-work-facts.filter(entry => entry.id == id)
  assert(matches.len() == 1, message: "Unknown Professional record selected work id: " + id)
  matches.first()
}

#let selected-work-tool-fact(project, id) = {
  let matches = project.tools.filter(tool => tool.id == id)
  assert(matches.len() == 1, message: "Unknown selected work tool id: " + id + " for " + project.id)
  matches.first()
}

#let selected-work-title(project) = {
  if type(project.title) == str { project.title } else { publication-fact(project.title.publicationId).title }
}

#let month-labels = (
  "Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.",
  "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec.",
)

#let partial-date-label(value) = {
  let parts = value.split("-")
  if parts.len() == 1 {
    parts.first()
  } else {
    month-labels.at(int(parts.at(1)) - 1) + " " + parts.first()
  }
}

#let date-span-label(span) = {
  let end = if span.end == none { "present" } else { partial-date-label(span.end) }
  partial-date-label(span.start) + " – " + end
}

#let experience-presentation = (
  (id: "axa-data-scientist", bullets: (
    [Work on a production document-understanding pipeline that segments stacks of scanned pages into documents (boundary detection) and classifies each — hundreds of thousands of stacks per month — flagging low-confidence cases for human review.],
    [Built document-class-specific confidence thresholds that automate more documents while holding at least 95% precision per class, cutting manual review by around 30% in production.],
    [Researching pipeline upgrades: an LLM post-processing step for frequently-confused class pairs, and a single vision-language model (Qwen3.5-4B) to replace the existing two-stage BERT+CLIP and RNN stack.],
  )),
  (id: "bonn-postdoctoral-researcher", bullets: (
    [Ran empirical and computational economics research — statistical and econometric modeling, machine-learning benchmarking, and partial-identification with simulation.],
    [Developed theoretical models and built reproducible analysis pipelines in Python and R; benchmarked economic theories against machine-learning models to quantify how much predictable variation each captures.],
    [Published peer-reviewed research and presented at international conferences.],
  )),
  (id: "cologne-research-assistant", bullets: (
    [Conducted PhD research in microeconomic theory and experimental economics — decision-theory and contract-theory modeling, with empirical analysis of experimental data.],
  )),
  (id: "airplus-intern", bullets: (
    [Built VBA tools for data management and process automation.],
  )),
)

#let experience = experience-presentation.map(presentation => {
  let fact = experience-fact(presentation.id)
  (
    title: fact.role + ", " + fact.organization,
    date: date-span-label(fact.dates),
    where: fact.location,
    bullets: presentation.bullets,
  )
})

#let publication-selection = (
  "efficiency-wages-motivated-agents",
  "managing-anticipation-reference-dependent-choice",
  "optimal-contracting-endogenous-project-mission",
  "sequential-rationalization-indecisive-choice",
)
#assert(
  publication-selection.len() == publication-selection.dedup().len(),
  message: "Duplicate CV publication selection id",
)
#let abbreviated-person-name(person-id) = {
  let parts = person-fact(person-id).fullName.split(" ")
  parts.first().slice(0, 1) + ". " + parts.slice(1).join(" ")
}
#let owner-abbreviated-name = abbreviated-person-name("jesper-armouti-hansen")
#let publications = publication-selection.map(id => {
  let fact = publication-fact(id)
  assert(fact.type == "journal-publication", message: "CV publication selection is not a journal publication: " + id)
  (
    fact.title,
    fact.authorIds.map(abbreviated-person-name),
    fact.venue,
    fact.details.replace("pp. ", ""),
    fact.year,
  )
})

#let project-presentation = (
  (id: "citibike-demand-risk-net-flow", shortTitle: "CitiBike Demand, Risk & Net Flow",
   summary: [A per-trip crash-risk measure for a bike-share network — NYPD collisions over trip exposure, empirical-Bayes smoothed — usable as an insurer rating input, with demand patterns and a net-flow classifier for rebalancing.],
   toolIds: ("python", "pandas", "geopandas", "risk-analysis")),
  (id: "informativeness-frequency-report-scoring-rules", shortTitle: "Frequency-Report Scoring Rules",
   summary: [Belief elicitation recast as partial identification: characterized the identified set of beliefs behind each frequency report under three scoring rules and compared the sharpness of their bounds, validated by simulation.],
   toolIds: ("python", "simulation", "pytest")),
  (id: "economic-theories-machine-learning", shortTitle: "Economic Theories & Machine Learning",
   summary: [Benchmarked theory-based behavioral specifications against machine-learning models to measure how much of the predictable variation in choice data each theory actually captures.],
   toolIds: ("python", "scikit-learn", "model-evaluation")),
  (id: "rag-search-engine",
   summary: [Hybrid search combining BM25, embeddings, CLIP, and reciprocal-rank fusion with reranking and RAG answers, evaluated on precision, recall, and F1 against a golden set.],
   toolIds: ("python", "embeddings", "clip", "evaluation")),
)
#let project-selection-ids = project-presentation.map(presentation => presentation.id)
#assert(
  project-selection-ids.len() == project-selection-ids.dedup().len(),
  message: "Duplicate CV selected work id",
)
#let projects = project-presentation.map(presentation => {
  let fact = selected-work-fact(presentation.id)
  assert(
    presentation.toolIds.len() == presentation.toolIds.dedup().len(),
    message: "Duplicate CV selected work tool id for " + presentation.id,
  )
  (
    title: if "shortTitle" in presentation { presentation.shortTitle } else { selected-work-title(fact) },
    tag: fact.category,
    summary: presentation.summary,
    tools: presentation.toolIds.map(id => selected-work-tool-fact(fact, id).name),
  )
})

#let education-selection = (
  "cologne-economics-phd",
  "mainz-international-economics-msc",
  "copenhagen-financial-management-ba",
)

#let education = education-selection.map(id => {
  let fact = education-fact(id)
  let where = if fact.distinctions.len() == 0 {
    fact.institution
  } else {
    fact.institution + " — " + fact.distinctions.join(", ")
  }
  (
    fact.degree.replace(" and ", " & "),
    date-span-label(fact.dates),
    where,
  )
})

#let teaching-supervision = professional-record.teaching.supervision
#let teaching-level-labels = (
  undergraduate: "Undergraduate",
  graduate: "Graduate",
)
#let teaching-role-labels = (
  lecturer: "lecturer",
  tutor: "tutor",
)

#let teaching-span-label(span) = {
  if span.end == span.start {
    span.start
  } else {
    span.start + " – " + if span.end == none { "present" } else { span.end }
  }
}

#let teaching-presentation = (
  (id: "current-topics-microeconomics", roles: ("lecturer",), compact-title: false),
  (id: "applied-microeconomics-management-research-module", roles: ("lecturer",), compact-title: true),
  (id: "empirical-evaluation-management-practices", roles: ("lecturer",), compact-title: false),
  (id: "behavioral-management-science", roles: ("lecturer",), compact-title: false),
)
#let teaching-selection-ids = teaching-presentation.map(presentation => presentation.id)
#assert(
  teaching-selection-ids.len() == teaching-selection-ids.dedup().len(),
  message: "Duplicate CV teaching selection id",
)

#let teaching = teaching-presentation.map(presentation => {
  let fact = teaching-fact(presentation.id)
  for role in presentation.roles {
    assert(fact.roles.contains(role), message: "Teaching role is not recorded for " + presentation.id + ": " + role)
  }
  let title = if presentation.compact-title {
    fact.title.replace(" and ", " & ")
  } else {
    fact.title
  }
  (
    title,
    fact.dateSpans.map(teaching-span-label).join(", "),
    teaching-level-labels.at(fact.level) + " " + presentation.roles.map(role => teaching-role-labels.at(role)).join(" & "),
  )
})

#let supervision-levels = teaching-supervision.degreeLevels.map(level => level + "’s").join(" and ")
#let teaching_lead = [University lecturer and tutor in applied, behavioral, and organizational economics; supervised #teaching-supervision.minimumTheses+ #supervision-levels theses.]

#let skill-presentation = (
  (label: "Programming", ids: ("python", "r", "sql", "stata", "typescript")),
  (label: "Python stack", ids: ("numpy", "pandas", "scipy", "scikit-learn", "statsmodels", "pytorch", "xgboost-lightgbm", "geopandas")),
  (label: "Methods", ids: ("statistical-modeling", "econometrics", "machine-learning", "model-evaluation-calibration", "forecasting", "experiment-ab-analysis", "simulation", "fine-tuning", "retrieval-rag")),
  (label: "Tools", ids: ("git", "github-actions", "docker", "pytest", "uv", "jupyterlab", "linux", "latex")),
)
#let cv-skill-ids = skill-presentation.fold((), (ids, group) => ids + group.ids)
#assert(
  cv-skill-ids.len() == cv-skill-ids.dedup().len(),
  message: "Duplicate CV skill selection id",
)
#let skills = skill-presentation.map(group => (
  group.label,
  group.ids.map(id => skill-fact(id).name),
))

#let spoken-language-selection = ("english", "german", "danish")
#assert(
  spoken-language-selection.len() == spoken-language-selection.dedup().len(),
  message: "Duplicate CV spoken-language selection id",
)
#let cv-spoken-languages = spoken-language-selection.map(id => {
  let fact = spoken-language-fact(id)
  assert("proficiency" in fact, message: "Missing Professional record spoken language proficiency: " + id)
  fact.name + " (" + fact.proficiency + ")"
})
#let skills = skills + (("Languages", cv-spoken-languages),)

// ============================================================ HEADER ==========
#align(center)[
  #text(font: serif, size: fs-name, weight: 600, tracking: -0.01em)[Dr. #identity-facts.name]
  #v(0.34em)
  #text(font: mono, size: 9pt, weight: "medium", tracking: 0.14em, fill: accent)[#upper("Data Scientist · Economics PhD")]
  #v(0.5em)
  #text(font: mono, size: fs-meta, fill: grey)[
    #link("mailto:" + identity-facts.email)[#identity-facts.email] · #identity-facts.phone · #identity-facts.location #linebreak()
    #link(website-link.url)[armoutihansen.xyz] · #link(linkedin-link.url)[linkedin.com/in/jesper-a-h] · #link(github-link.url)[github.com/armoutihansen]
  ]
]
#v(0.5em)
#line(length: 100%, stroke: 0.8pt + accent)

#block(above: s-l, width: measure, text(size: fs-lead)[
  Data scientist with an economics PhD. I build and evaluate statistical and machine-learning
  models on structured data — econometrics, model validation, calibration, and uncertainty
  quantification — and turn results into decisions stakeholders act on. Currently at AXA.
])

// ======================================================== EXPERIENCE =========
#section("Experience")
#for e in experience {
  block(below: s-m, breakable: false)[
    #entry(e.title, e.date, e.where)
    #bullets(e.bullets)
  ]
}

// =================================================== PUBLICATIONS =============
#section("Publications", note: "80 citations · Google Scholar")
#set enum(numbering: n => text(font: mono, size: fs-meta, fill: grey)[#n.], indent: 0pt, body-indent: 0.5em, spacing: s-m)
#for (title, authors, venue, detail, year) in publications {
  let auth = authors.map(a => if a == owner-abbreviated-name { text(weight: 600)[#a] } else { [#a] }).join(", ")
  enum.item(block(width: measure)[
    #text(weight: 600)[#title.] #h(0.25em) #auth. #h(0.25em) #emph(venue), #detail (#year).
  ])
}

// ======================================================== EDUCATION ==========
#section("Education")
#for (degree, year, where) in education {
  block(below: s-m, breakable: false, entry(degree, year, where))
}

// ---- page 2 starts here: Projects + Teaching + Skills ----
#pagebreak()

// ========================================================= PROJECTS ==========
#section("Selected Projects")
#for p in projects {
  block(below: s-l, breakable: false)[
    #grid(columns: (1fr, auto), align: (left + horizon, right + horizon), column-gutter: 1em,
      text(size: fs-lead, weight: 600)[#p.title],
      text(size: fs-cap, style: "italic", fill: grey)[#p.tag])
    #block(above: s-s, width: measure, text(size: fs-body)[#p.summary])
    #block(above: s-s, monolist(p.tools))
  ]
}

// ========================================================= TEACHING ==========
#section("Teaching")
#block(below: s-m, width: measure, text(size: fs-body, fill: grey)[#teaching_lead])
#for (course, years, role) in teaching {
  block(below: s-m, breakable: false, entry(course, years, role))
}

// =========================================================== SKILLS ==========
#section("Skills")
#for (label, vals) in skills {
  block(below: s-s, grid(columns: (6.4em, 1fr), column-gutter: 1em, align: (left + top, left + top),
    text(size: fs-cap, weight: 600)[#label],
    monolist(vals)))
}
