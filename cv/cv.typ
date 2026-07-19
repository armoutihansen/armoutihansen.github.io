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

#let publications = (
  ([Efficiency Wages with Motivated Agents], ("J. Armouti-Hansen", "L. Cassar", "A. Dereky", "F. Engl"), [Games and Economic Behavior], [145, 66–83], "2024"),
  ([Managing Anticipation and Reference-Dependent Choice], ("J. Armouti-Hansen", "C. Kops"), [Journal of Mathematical Economics], [112, 102988], "2024"),
  ([Optimal Contracting with Endogenous Project Mission], ("J. Armouti-Hansen", "L. Cassar"), [Journal of the European Economic Association], [18(5), 2647–2676], "2020"),
  ([This or That? Sequential Rationalization of Indecisive Choice Behavior], ("J. Armouti-Hansen", "C. Kops"), [Theory and Decision], [84(4), 507–524], "2018"),
)

#let projects = (
  (title: "CitiBike Demand, Risk & Net Flow", tag: "Operational analysis",
   summary: [A per-trip crash-risk measure for a bike-share network — NYPD collisions over trip exposure, empirical-Bayes smoothed — usable as an insurer rating input, with demand patterns and a net-flow classifier for rebalancing.],
   tools: ("Python", "pandas", "GeoPandas", "risk analysis")),
  (title: "Frequency-Report Scoring Rules", tag: "Inference & simulation",
   summary: [Belief elicitation recast as partial identification: characterized the identified set of beliefs behind each frequency report under three scoring rules and compared the sharpness of their bounds, validated by simulation.],
   tools: ("Python", "simulation", "pytest")),
  (title: "Economic Theories & Machine Learning", tag: "Model comparison",
   summary: [Benchmarked theory-based behavioral specifications against machine-learning models to measure how much of the predictable variation in choice data each theory actually captures.],
   tools: ("Python", "scikit-learn", "model evaluation")),
  (title: "RAG Search Engine", tag: "Retrieval system",
   summary: [Hybrid search combining BM25, embeddings, CLIP, and reciprocal-rank fusion with reranking and RAG answers, evaluated on precision, recall, and F1 against a golden set.],
   tools: ("Python", "embeddings", "CLIP", "evaluation")),
)

#let education = (
  ([PhD in Economics (Dr. rer. pol.)], "2015 – 2021", [University of Cologne — Summa cum laude]),
  ([MSc International Economics & Public Policy], "2012 – 2014", [University of Mainz — GPA 1.6]),
  ([BA Financial Management & Services], "2008 – 2012", [Copenhagen Business Academy]),
)

#let teaching_lead = [University lecturer and tutor in applied, behavioral, and organizational economics; supervised 60+ bachelor's and master's theses.]
#let teaching = (
  ([Seminar on Current Topics in Microeconomics], "2025 – present", [Undergraduate lecturer]),
  ([Research Module on Applied Microeconomics & Management], "2022 – 2025", [Graduate lecturer]),
  ([Empirical Evaluation of Management Practices], "2019 – 2022", [Graduate lecturer]),
  ([Behavioral Management Science], "2017 – 2020", [Undergraduate lecturer]),
)

#let skills = (
  ("Programming", ("Python", "R", "SQL", "Stata", "TypeScript")),
  ("Python stack", ("NumPy", "pandas", "SciPy", "scikit-learn", "statsmodels", "PyTorch", "XGBoost / LightGBM", "GeoPandas")),
  ("Methods", ("Statistical modeling", "Econometrics", "Machine learning", "Model evaluation & calibration", "Forecasting", "Experiment & A/B analysis", "Simulation", "Fine-tuning", "Retrieval / RAG")),
  ("Tools", ("Git", "GitHub Actions", "Docker", "pytest", "uv", "JupyterLab", "Linux", "LaTeX")),
  ("Languages", ("English (C2)", "German (C1/C2)", "Danish (native)")),
)

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
  let auth = authors.map(a => if a == "J. Armouti-Hansen" { text(weight: 600)[#a] } else { [#a] }).join(", ")
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
