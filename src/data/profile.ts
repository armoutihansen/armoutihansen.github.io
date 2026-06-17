export const profile = {
  name: "Jesper Armouti-Hansen",
  title: "Quantitative Analyst · Economics PhD",
  email: "jesper@armoutihansen.xyz",
  location: "Cologne, Germany",
  summary:
    "Quantitative analyst with a background in economics and applied data science. Experience working with statistical models and machine learning in practical settings, with a focus on understanding model performance and supporting decisions based on data.",
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
      "Accuracy, calibration, and error-pattern checks that show where a model's output can be used directly and where a person should review it."
  },
  {
    label: "Statistical & econometric modeling",
    summary:
      "Build and estimate statistical and econometric models on structured data, then measure how much of the variation they actually capture."
  },
  {
    label: "Machine learning on structured data",
    summary:
      "Apply machine-learning methods to structured datasets and benchmark them against simpler baselines."
  },
  {
    label: "Reproducible code",
    summary:
      "Version-controlled, tested Python, SQL, and R — with an economics background for reading whether a result reflects a mechanism or a coincidence."
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
