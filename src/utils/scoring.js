// Score uses AI-extracted keywords so it matches what Jobscan sees

export const scoreResume = (keywords, resumeText) => {
  const text = resumeText.toLowerCase();

  const SYNONYMS = {
  "problem-solving": ["problem-solving", "problem solving", "troubleshoot", "debugging"],
  "analytical thinking": ["analytical", "analysis", "problem-solving", "algorithms"],
  "communication": ["communication", "communicat", "collaborated", "collaboration"],
  "collaboration": ["collaboration", "collaborated", "cross-functional", "teamwork"],
  "willingness to learn": ["continuous", "learning", "improvement", "development"],
  "cloud technologies": ["aws", "azure", "gcp", "cloud"],
  "cloud platforms": ["aws", "azure", "gcp", "cloud", "vercel"],
  "automation frameworks": ["ci/cd", "jenkins", "automation", "automated"],
  "scripting": ["python", "bash", "powershell", "shell", "script"],
  "it service management": ["sdlc", "agile", "devops", "incident"],
  "onsite-offshore delivery model": ["cross-functional", "global", "collaboration"],
};

const check = (word) => {
  const w = word.toLowerCase().trim();
  if (!w) return false;

  // Check synonyms first
  if (SYNONYMS[w]) {
    return SYNONYMS[w].some(syn => text.includes(syn));
  }

  if (w === "c#") return text.includes("c#") || text.includes("c\\#");
  if (w === "ci/cd") return text.includes("ci/cd");
  if (w === ".net") return text.includes(".net");

  // Multi-word: all parts must appear
  if (w.includes(" ")) {
    const parts = w.split(" ").filter(p => p.length > 2);
    return parts.every(part => text.includes(part));
  }

  try {
    const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}\\b`, "i").test(text);
  } catch {
    return text.includes(w);
  }
};

  const tier1 = keywords.filter(k => k.tier === 1);
  const tier2 = keywords.filter(k => k.tier === 2);
  const tier3 = keywords.filter(k => k.tier === 3);

  const matchedT1 = tier1.filter(k => check(k.word));
  const matchedT2 = tier2.filter(k => check(k.word));
  const matchedT3 = tier3.filter(k => check(k.word));

  const t1Rate = tier1.length ? matchedT1.length / tier1.length : 1;
  const t2Rate = tier2.length ? matchedT2.length / tier2.length : 1;
  const t3Rate = tier3.length ? matchedT3.length / tier3.length : 1;

  // Tier 1 worth 60%, tier 2 worth 30%, tier 3 worth 10%
  const overall = Math.round((t1Rate * 0.6 + t2Rate * 0.3 + t3Rate * 0.1) * 100);

  return {
    overall,
    tier1: { total: tier1.length, matched: matchedT1.length, missing: tier1.filter(k => !check(k.word)).map(k => k.word) },
    tier2: { total: tier2.length, matched: matchedT2.length, missing: tier2.filter(k => !check(k.word)).map(k => k.word) },
    tier3: { total: tier3.length, matched: matchedT3.length, missing: tier3.filter(k => !check(k.word)).map(k => k.word) },
  };
};