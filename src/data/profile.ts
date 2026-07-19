import { professionalRecord } from "./professional-record";

interface ProfileLinkPresentation {
  id: string;
  label: string;
}

export interface ProfileLink extends ProfileLinkPresentation {
  href: string;
}

export function resolveProfileLinks(
  selected: ProfileLinkPresentation[]
): ProfileLink[] {
  const byId = new Map(
    professionalRecord.identity.links.map((link) => [link.id, link])
  );
  return selected.map((selection) => {
    const fact = byId.get(selection.id);
    if (!fact) {
      throw new Error(`Unknown Professional record link id: ${selection.id}`);
    }
    return { ...selection, href: fact.url };
  });
}

const professionalLinkPresentation: ProfileLinkPresentation[] = [
  { id: "website", label: "Website" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "github", label: "GitHub" },
  { id: "google-scholar", label: "Google Scholar" },
  { id: "orcid", label: "ORCID" }
];

const professionalLinks = resolveProfileLinks(professionalLinkPresentation);
const visibleProfileLinkIds = new Set([
  "linkedin",
  "github",
  "google-scholar",
  "orcid"
]);

export const profile = {
  name: professionalRecord.identity.name,
  title: "Data Scientist · Economics PhD",
  email: professionalRecord.identity.email,
  location: professionalRecord.identity.location,
  summary:
    "Data scientist with an economics PhD and a decade of applied data work. I build statistical and machine-learning models on structured data, and assess when their output is reliable enough to act on.",
  tagline:
    "A decade in academic economics, now a data scientist at AXA — applying statistical and machine-learning methods and checking where their output is reliable enough to act on.",
  links: professionalLinks.filter((link) => visibleProfileLinkIds.has(link.id))
};

export function profileLink(id: string): ProfileLink {
  const link = professionalLinks.find((candidate) => candidate.id === id);
  if (!link) {
    throw new Error(`Unknown website profile link id: ${id}`);
  }
  return link;
}

export const capabilities = [
  {
    label: "Model evaluation",
    summary:
      "Accuracy, calibration, and error-pattern checks that decide where a model can run on its own and where it needs review."
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

export interface SkillGroup {
  label: string;
  items: string[];
}

interface SkillGroupSelection {
  label: string;
  skillIds: string[];
}

export function resolveSkillGroups(
  selected: SkillGroupSelection[]
): SkillGroup[] {
  const byId = new Map(
    professionalRecord.skills.items.map((skill) => [skill.id, skill])
  );
  const selectedIds = new Set<string>();
  return selected.map((group) => ({
    label: group.label,
    items: group.skillIds.map((id) => {
      if (selectedIds.has(id)) {
        throw new Error(`Duplicate website skill selection id: ${id}`);
      }
      selectedIds.add(id);
      const fact = byId.get(id);
      if (!fact) {
        throw new Error(`Unknown Professional record skill id: ${id}`);
      }
      return fact.name;
    })
  }));
}

export function resolveSpokenLanguages(selectedIds: string[]): string[] {
  const byId = new Map(
    professionalRecord.spokenLanguages.map((language) => [language.id, language])
  );
  const seen = new Set<string>();
  return selectedIds.map((id) => {
    if (seen.has(id)) {
      throw new Error(`Duplicate website spoken-language selection id: ${id}`);
    }
    seen.add(id);
    const fact = byId.get(id);
    if (!fact) {
      throw new Error(`Unknown Professional record spoken language id: ${id}`);
    }
    return fact.name;
  });
}

const websiteSkillPresentation: SkillGroupSelection[] = [
  {
    label: "Programming languages",
    skillIds: ["python", "r", "sql", "stata", "typescript"]
  },
  {
    label: "Python stack",
    skillIds: [
      "numpy",
      "pandas",
      "scipy",
      "scikit-learn",
      "statsmodels",
      "pytorch",
      "xgboost-lightgbm",
      "geopandas"
    ]
  },
  {
    label: "Methods",
    skillIds: [
      "statistical-modeling",
      "econometrics",
      "machine-learning",
      "model-evaluation-calibration",
      "forecasting",
      "experiment-ab-analysis",
      "simulation",
      "fine-tuning",
      "retrieval-rag"
    ]
  },
  {
    label: "Tools & workflow",
    skillIds: [
      "git",
      "github-actions",
      "docker",
      "pytest",
      "uv",
      "pixi",
      "jupyterlab",
      "linux",
      "latex"
    ]
  }
];

export const skillGroups: SkillGroup[] = [
  ...resolveSkillGroups(websiteSkillPresentation),
  {
    label: "Languages",
    items: resolveSpokenLanguages(["english", "german", "danish"])
  }
];
