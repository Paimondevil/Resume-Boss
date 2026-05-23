const containsWord = (text, word) => {
  const t = text.toLowerCase();
  const w = word.toLowerCase();
  if (w === "c#" || w === "csharp") return t.includes("c#") || t.includes("c\\#") || t.includes("c\\\\#");
  if (w === "ci/cd") return t.includes("ci/cd") || t.includes("ci\\/cd");
  if (w === ".net") return t.includes(".net") || t.includes("\\.net");
  if (w === "asp.net") return t.includes("asp.net") || t.includes("asp\\.net");
  if (w === "c++") return t.includes("c++") || t.includes("c\\+\\+");
  if (/[#$^*+?.()|[\]{}\/]/.test(w)) return t.includes(w);
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

const knownTech = [
  "c#", ".net", "asp.net", "react", "angular", "vue", "node",
  "python", "javascript", "typescript", "java", "c++", "sql", "aws",
  "azure", "gcp", "docker", "kubernetes", "git", "github", "svn",
  "perforce", "agile", "scrum", "rest", "api", "html", "css", "tailwind",
  "django", "flask", "mongodb", "postgresql", "mysql", "redis", "graphql",
  "devops", "microservices", "linux", "windows", "jenkins", "nosql",
  "ci/cd", "cloud", "software development", "version control",
  "machine learning", "deep learning", "tensorflow", "pytorch",
  "embedded", "firmware", "hardware", "gdb", "windbg",
  "threading", "simulation", "automation", "debugging",
  "operating systems", "computer architecture", "production line",
  "hardware design", "fpga", "rust", "go", "llm",
  "postgresql", "prompt engineering", "generative ai", "openai",
  "front-end development", "full stack", "asp.net core"
];

const actionStems = [
  "develop", "design", "implement", "optimiz", "collaborat",
  "deploy", "build", "maintain", "improv", "automat", "integrat",
  "debug", "refactor", "troubleshoot", "contribut", "participat",
  "deliver", "architect", "manag", "resolv", "diagnos"
];

const softStems = [
  "collaborat", "communicat", "problem-solv", "teamwork", "improvement"
];

export const extractJDKeywords = (jd) => {
  const text = jd.toLowerCase();
  const techMatches = knownTech.filter(t => containsWord(text, t));
  const actionMatches = actionStems.filter(a => containsStem(text, a));
  const softMatches = softStems.filter(s => containsStem(text, s));
  return { techMatches, actionMatches, softMatches };
};

export const checkJobFit = (jd, baseResume) => {
  const { techMatches } = extractJDKeywords(jd);
  const missing = techMatches.filter(t => !containsWord(baseResume, t));
  const fitScore = techMatches.length
    ? Math.round(((techMatches.length - missing.length) / techMatches.length) * 100)
    : 100;
  let warning = null;
  if (fitScore < 25) warning = "strong";
  else if (fitScore < 40) warning = "moderate";
  return { fitScore, missing, warning };
};

// Score base resume against JD — honest, no AI inflation
const scoreBase = (jd, baseResume) => {
  const { techMatches, actionMatches, softMatches } = extractJDKeywords(jd);

  const techRate = techMatches.length
    ? techMatches.filter(w => containsWord(baseResume, w)).length / techMatches.length
    : 1;
  const actionRate = actionMatches.length
    ? actionMatches.filter(a => containsStem(baseResume, a)).length / actionMatches.length
    : 1;
  const softRate = softMatches.length
    ? softMatches.filter(s => containsStem(baseResume, s)).length / softMatches.length
    : 1;

  return Math.round((techRate * 0.5 + actionRate * 0.3 + softRate * 0.2) * 100);
};

export const scoreResume = (jd, tailored, baseResume) => {
  const { techMatches, actionMatches, softMatches } = extractJDKeywords(jd);

  // Score base resume honestly
  const base = scoreBase(jd, baseResume);

  // Score tailored for breakdown display only
  const techRate = techMatches.length
    ? techMatches.filter(w => containsWord(tailored, w)).length / techMatches.length
    : 1;
  const actionRate = actionMatches.length
    ? actionMatches.filter(a => containsStem(tailored, a)).length / actionMatches.length
    : 1;
  const softRate = softMatches.length
    ? softMatches.filter(s => containsStem(tailored, s)).length / softMatches.length
    : 1;

  // Overall = base score + max +15% improvement from tailoring
  const tailoredRaw = Math.round((techRate * 0.5 + actionRate * 0.3 + softRate * 0.2) * 100);
  const improvement = Math.min(tailoredRaw - base, 15);
  const overall = Math.min(base + Math.max(improvement, 0), 85);

  return {
    overall,
    base,
    techScore: Math.round(techRate * 100),
    actionScore: Math.round(actionRate * 100),
    softScore: Math.round(softRate * 100),
    missingTech: techMatches.filter(w => !containsWord(tailored, w)),
    missingAction: actionMatches.filter(w => !containsStem(tailored, w)),
    missingSoft: softMatches.filter(w => !containsStem(tailored, w)),
  };
};