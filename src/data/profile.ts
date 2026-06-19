export const profile = {
  name: "Jesper Armouti-Hansen",
  title: "Quantitative Analyst · Economics PhD",
  email: "jesper@armoutihansen.xyz",
  location: "Cologne, Germany",
  summary:
    "Quantitative analyst with an economics PhD and a decade of applied data work. I build statistical and machine-learning models on structured data, and assess when their output is reliable enough to act on.",
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
      "Accuracy, calibration, and error-pattern checks that decide where a model can run on its own and where it needs review. It's what gets a model trusted in production."
  },
  {
    label: "Statistical & econometric modeling",
    summary:
      "Statistical and econometric models, built and estimated on structured data, with a clear read on how much of the variation they actually capture."
  },
  {
    label: "Machine learning on structured data",
    summary:
      "Machine learning on tabular data (gradient boosting, regularized models, and the like), always benchmarked against a simple baseline so the added complexity has to earn it."
  },
  {
    label: "Reproducible code",
    summary:
      "Version-controlled, tested code in Python, SQL, and R. The economics training is the edge on the harder part: telling a real effect from noise."
  }
];

export interface EducationEntry {
  degree: string;
  institution: string;
  period: string;
  location: string;
  detail: string;
  logo?: string;
}

export const education: EducationEntry[] = [
  {
    degree: "PhD in Economics (Dr. rer. pol.)",
    institution: "University of Cologne",
    period: "2015 – 2021",
    location: "Cologne, Germany",
    detail: "Summa cum laude. Focus on microeconomics, statistics, and econometrics.",
    logo: "/images/logos/university-of-cologne-wordmark.jpg"
  },
  {
    degree: "MSc International Economics and Public Policy",
    institution: "University of Mainz",
    period: "2012 – 2014",
    location: "Mainz, Germany",
    detail: "GPA 1.6.",
    logo: "/images/logos/university-of-mainz.svg"
  },
  {
    degree: "BA Financial Management and Services",
    institution: "Copenhagen Business Academy",
    period: "2008 – 2012",
    location: "Copenhagen, Denmark",
    detail: "",
    logo: "/images/logos/copenhagen-business-academy.png"
  },
  {
    degree: "Exchange semester",
    institution: "European University of Cyprus",
    period: "2010",
    location: "Nicosia, Cyprus",
    detail: "",
    logo: "/images/logos/european-university-of-cyprus.png"
  }
];

export const spokenLanguages: string[] = ["English", "German", "Danish"];

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

export interface SkillGroup {
  label: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  { label: "Programming languages", items: skills.languages },
  { label: "Python stack", items: skills.pythonStack },
  { label: "Methods", items: skills.methods },
  { label: "Tools & workflow", items: skills.tools },
  { label: "Languages", items: spokenLanguages }
];
