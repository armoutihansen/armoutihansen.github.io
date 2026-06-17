export const profile = {
  name: "Jesper Armouti-Hansen",
  title: "Quantitative Analyst · Economics PhD",
  email: "jesper@armoutihansen.xyz",
  location: "Cologne, Germany",
  summary:
    "Quantitative analyst with an economics PhD and a background in applied data science. I work with statistical and machine-learning models on structured data, and spend most of my time on a narrower question: when their output is reliable enough to act on.",
  tagline:
    "A decade in academic economics, now a data scientist at AXA — applying statistical and machine-learning methods and checking where their output is reliable enough to act on.",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/jesper-a-h/" },
    { label: "GitHub", href: "https://github.com/armoutihansen" },
    {
      label: "Google Scholar",
      href: "https://scholar.google.com/citations?user=j423pO8AAAAJ&hl=en&oi=ao"
    },
    { label: "ORCID", href: "https://orcid.org/0000-0001-7776-8016" }
  ]
};

export const capabilities = [
  {
    label: "Model evaluation",
    summary:
      "Accuracy, calibration, and error-pattern checks. The point is to mark where a model can be trusted on its own and where it needs a second look."
  },
  {
    label: "Statistical & econometric modeling",
    summary:
      "Building and estimating models on structured data, and being honest about how much of the variation they actually explain."
  },
  {
    label: "Machine learning on structured data",
    summary:
      "Standard ML on tabular data, always measured against a simple baseline. If the added complexity doesn't beat it, it isn't worth keeping."
  },
  {
    label: "Reproducible code",
    summary:
      "Version-controlled, tested code in Python, SQL, and R. An economics background helps with the harder part: telling a real effect from noise."
  }
];

export const skills = {
  languages: ["Python", "R", "SQL", "Stata", "TypeScript"],
  pythonStack: [
    "NumPy",
    "pandas",
    "SciPy",
    "scikit-learn",
    "statsmodels",
    "PyTorch",
    "XGBoost / LightGBM",
    "GeoPandas"
  ],
  methods: [
    "Statistical modeling",
    "Econometrics",
    "Machine learning",
    "Model evaluation & calibration",
    "Forecasting",
    "Experiment & A/B analysis",
    "Simulation",
    "Fine-tuning",
    "Retrieval / RAG"
  ],
  tools: ["Git", "GitHub Actions", "Docker", "pytest", "uv", "pixi", "JupyterLab", "Linux", "LaTeX"]
};
