const containsWord = (text, word) => {
  const t = text.toLowerCase();
  const w = word.toLowerCase();
  if (w === "c#" || w === "csharp") {
    return t.includes("c#") || t.includes("c\\#") || t.includes("c\\\\#");
  }
  if (w === "ci/cd") {
    return t.includes("ci/cd") || t.includes("ci\\/cd");
  }
  if (w === ".net") {
    return t.includes(".net") || t.includes("\\.net");
  }
  if (w === "asp.net") {
    return t.includes("asp.net") || t.includes("asp\\.net");
  }
  if (/[#$^*+?.()|[\]{}\/]/.test(w)) {
    return t.includes(w);
  }
  try {
    const clean = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${clean}\\b`, 'i').test(t);
  } catch {
    return t.includes(w);
  }
};

const containsStem = (text, stem) => {
  return text.toLowerCase().includes(stem.toLowerCase());
};

export const extractJDKeywords = (jd) => {
  const text = jd.toLowerCase();

  const techList = [
    "c#", ".net", "asp.net", "react", "angular", "python", "javascript",
    "typescript", "java", "sql", "aws", "azure", "docker", "kubernetes",
    "git", "github", "agile", "scrum", "rest", "api", "html", "css",
    "mysql", "redis", "devops", "microservices", "linux", "jenkins",
    "nosql", "ci/cd", "cloud", "software development", "version control"
  ];
  const techMatches = techList.filter(t => containsWord(text, t));

  const actionList = [
    "develop", "design", "implement", "optimiz", "collaborat",
    "deploy", "build", "maintain", "improv", "automat", "integrat",
    "debug", "refactor", "troubleshoot", "contribut", "participat",
    "deliver", "architect", "manag", "resolv"
  ];
  const actionMatches = actionList.filter(a => containsStem(text, a));

  const softList = [
  "collaborat", "communicat", "problem-solv", "teamwork", "improvement"
];
  const softMatches = softList.filter(s => containsStem(text, s));

  return { techMatches, actionMatches, softMatches };
};

export const scoreResume = (jd, tailored) => {
  const { techMatches, actionMatches, softMatches } = extractJDKeywords(jd);

  const matchRate = (keywords, isStem = false) => {
    if (!keywords.length) return 1;
    const matched = keywords.filter(w =>
      isStem ? containsStem(tailored, w) : containsWord(tailored, w)
    ).length;
    return matched / keywords.length;
  };

  const techRate = matchRate(techMatches);
  const actionRate = matchRate(actionMatches, true);
  const softRate = matchRate(softMatches, true);

  const overall = Math.round((techRate * 0.5 + actionRate * 0.3 + softRate * 0.2) * 100);

  return {
    overall,
    techScore: Math.round(techRate * 100),
    actionScore: Math.round(actionRate * 100),
    softScore: Math.round(softRate * 100),
    missingTech: techMatches.filter(w => !containsWord(tailored, w)),
    missingAction: actionMatches.filter(w => !containsStem(tailored, w)),
    missingSoft: softMatches.filter(w => !containsStem(tailored, w)),
  };
};