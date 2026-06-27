export interface ExperienceItem {
  role: string;
  organization: string;
  logo?: string;
  period: string;
  location: string;
  bullets: string[];
}

export const experience: ExperienceItem[] = [
  {
    role: "Data Scientist",
    organization: "AXA Konzern AG",
    logo: "/images/logos/axa.svg",
    period: "Apr. 2026 – present",
    location: "Cologne, Germany",
    bullets: [
      "Develop the production document-understanding pipeline that splits stacks of scanned pages into documents (boundary detection) and classifies each — hundreds of thousands of stacks per month — routing low-confidence cases to human review.",
      "Built document-class-specific confidence thresholds that automate more documents while holding at least 95% precision per class, cutting manual review by around 30% in production.",
      "Researching pipeline upgrades: an LLM post-processing step for frequently-confused class pairs, and a single vision-language model (Qwen3.5-VL 4B) to replace the two-stage BERT+CLIP and RNN stack."
    ]
  },
  {
    role: "Postdoctoral Researcher in Economics",
    organization: "University of Bonn",
    logo: "/images/logos/university-of-bonn.svg",
    period: "Jan. 2022 – Mar. 2026",
    location: "Bonn, Germany",
    bullets: [
      "Ran empirical and computational economics research — statistical and econometric modeling, machine-learning benchmarking, and partial-identification with simulation.",
      "Developed theoretical models and built reproducible analysis pipelines in Python and R; benchmarked economic theories against machine-learning models to quantify how much predictable variation each captures.",
      "Published peer-reviewed research and presented at international conferences."
    ]
  },
  {
    role: "Research Assistant in Economics",
    organization: "University of Cologne",
    logo: "/images/logos/university-of-cologne-wordmark.jpg",
    period: "Dec. 2015 – Dec. 2021",
    location: "Cologne, Germany",
    bullets: [
      "Conducted PhD research in microeconomic theory and experimental economics — decision-theory and contract-theory modeling, with empirical analysis of experimental data."
    ]
  },
  {
    role: "Intern",
    organization: "AirPlus International",
    logo: "/images/logos/airplus.svg",
    period: "Dec. 2014 – May 2015",
    location: "Neu Isenburg, Germany",
    bullets: [
      "Built VBA tools for data management and process automation."
    ]
  }
];
