import { useState } from "react";
import Groq from "groq-sdk";
import { scoreResume } from "../utils/scoring";
import {
  LATEX_TEMPLATE,
  LOCKED_EXPERIENCE,
  CERTS_POOL,
  PROJECT_BULLETS,
  VERIFIED_SKILLS,
  DEFAULT_SKILLS,
} from "../data/resumeData";

const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const sanitize = (str) =>
  str
    .replace(/[\u2013\u2014]/g, "--")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2026]/g, "...")
    .replace(/[^\x00-\x7F]/g, " ");

const fixLatex = (s) => {
  if (!s) return "";
  return s
    .replace(/C\\#/g, "CSHARP").replace(/C#/g, "CSHARP").replace(/CSHARP/g, "C\\#")
    .replace(/(?<!\\)%/g, "\\%")
    .replace(/(?<!\\)\$(?=[0-9])/g, "\\$");
};

const wrap = (text) => `\\resumeItem{${fixLatex(text)}}`;

const fillTemplate = (template, values) => {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(`%%${key}%%`, value);
  }
  return result;
};

const selectCerts = (jd, pool) => {
  const text = jd.toLowerCase();
  const scored = pool
    .map(c => ({ ...c, score: c.tags.filter(t => text.includes(t)).length }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, 3);
};

// Score each project pool against JD, return top N projects
const selectProjects = (jd, bullets) => {
  const text = jd.toLowerCase();

  const scorePool = (pool) => {
    return pool.reduce((total, bullet) => {
      const words = bullet.toLowerCase().split(/\s+/);
      return total + words.filter(w => w.length > 4 && text.includes(w)).length;
    }, 0);
  };

  const projects = [
    { key: "resumeBoss", score: scorePool(bullets.resumeBoss), pool: bullets.resumeBoss, heading: `\\resumeProjectHeading\n{\\textbf{Resume Boss} $|$ \\emph{React, Vite, JavaScript, Groq API} $|$ \\href{https://bossresume.vercel.app/}{\\color{blue}Live Demo}}{}` },
    { key: "dataHub", score: scorePool(bullets.dataHub), pool: bullets.dataHub, heading: `\\resumeProjectHeading\n{\\textbf{Data Hub} $|$ \\emph{Python, Flask, SQLite, HTML, CSS} $|$ \\href{https://github.com/Paimondevil/Data-Hub}{\\color{blue}GitHub}}{}` },
    { key: "traffic", score: scorePool(bullets.traffic), pool: bullets.traffic, heading: `\\resumeProjectHeading\n{\\textbf{Traffic Controller System} $|$ \\emph{React, JavaScript, Scheduling Algorithms, CSS} $|$ \\href{https://traffic-controll-neon.vercel.app/}{\\color{blue}Live Demo}}{}` },
    { key: "goodwill", score: scorePool(bullets.goodwill), pool: bullets.goodwill, heading: `\\resumeProjectHeading\n{\\textbf{GoodWill Enterprises Website} $|$ \\emph{React, Tailwind CSS, Framer Motion, Vercel} $|$ \\href{https://goodwill-enterprises.vercel.app}{\\color{blue}Live Demo}}{}` },
  ].sort((a, b) => b.score - a.score);

  // Pick top 3
  return projects.slice(0, 2);
};

// Pick best 2 bullets from a pool for a given JD
const selectBullets = (jd, pool) => {
  const text = jd.toLowerCase();
  const scored = pool.map(b => {
    const words = b.toLowerCase().split(/\s+/);
    const score = words.filter(w => w.length > 4 && text.includes(w)).length;
    return { text: b, score };
  }).sort((a, b) => b.score - a.score);
  return [scored[0].text, scored[1].text];
};

// Strip LaTeX for clean diff
const stripLatex = (text) => text
  .replace(/\\href\{[^}]+\}\{[^}]+\}/g, "")        // remove \href{url}{text}
  .replace(/\\textbf\{([^}]+)\}/g, "$1")             // \textbf{x} → x
  .replace(/\\emph\{([^}]+)\}/g, "$1")               // \emph{x} → x
  .replace(/\\resumeItem\{([^}]+)\}/g, "• $1")       // bullets
  .replace(/\\resumeProjectHeading\{([^}]+)\}.*/g, "📁 $1") // project headings
  .replace(/\\resumeSubheading\{([^}]+)\}\{[^}]+\}\{([^}]+)\}\{[^}]+\}/g, "🏢 $1 — $2") // job headings
  .replace(/\\resumeItemListStart/g, "")
  .replace(/\\resumeItemListEnd/g, "")
  .replace(/\\resumeSubHeadingListStart/g, "")
  .replace(/\\resumeSubHeadingListEnd/g, "")
  .replace(/\\textbf\{[^}]*\}/g, "")
  .replace(/\\[a-zA-Z]+\*?\{([^}]*)\}/g, "$1")       // any remaining \cmd{x} → x
  .replace(/\\[a-zA-Z]+/g, "")                        // bare commands
  .replace(/[{}$]/g, "")                              // braces and dollar signs
  .replace(/%-+.*$/gm, "")                            // % comments
  .replace(/\\\\/g, "\n")                             // \\ → newline
  .replace(/\\\$/g, "$")
  .replace(/\\%/g, "%")
  .replace(/\\#/g, "#")
  .replace(/[ \t]+/g, " ")  
  .replace(/\\vspace\{[^}]+\}/g, "")
  .replace(/\\begin\{[^}]+\}/g, "")
  .replace(/\\end\{[^}]+\}/g, "")
  .replace(/\[[^\]]+\]/g, "")
  .replace(/0\.\d+in/g, "")                          // collapse spaces
  .replace(/\bitemize\b/g, "")
  .split("\n")
  .map(l => l.trim())
  .filter(l => l.length > 3)                          // remove empty/tiny lines
  .join("\n")
  .trim();

const buildDiff = (originalLatex, newLatex) => {
  // Extract only the sections that change
  const extractSection = (latex, startMarker, endMarker) => {
    const start = latex.indexOf(startMarker);
    const end = latex.indexOf(endMarker, start);
    if (start === -1 || end === -1) return "";
    return latex.substring(start, end + endMarker.length);
  };

  const sections = [
    { name: "Freelance Experience", start: "\\resumeSubheading\n{Freelance}", end: "\\resumeItemListEnd" },
    { name: "Projects", start: "%-----------PROJECTS", end: "\\resumeSubHeadingListEnd" },
    { name: "Technical Skills", start: "%-----------TECHNICAL SKILLS", end: "\\end{itemize}" },
  ];

  return sections.map(({ name, start, end }) => ({
    name,
    original: stripLatex(extractSection(originalLatex, start, end)),
    updated: stripLatex(extractSection(newLatex, start, end)),
  })).filter(s => s.original !== s.updated);
};

function JDInput({ setTailoredLatex, setScore, setLoading, loading }) {
  const [jd, setJd] = useState("");
  const [status, setStatus] = useState("");

  const handleTailor = async () => {
    if (!jd.trim()) return alert("Please paste a job description.");
    setLoading(true);
    setStatus("Reading job description...");

    const cleanJD = sanitize(jd);

    // Select projects and bullets before AI call
    const selectedProjects = selectProjects(cleanJD, PROJECT_BULLETS);
    const projectBlocks = selectedProjects.map(p => {
      const [b1, b2] = selectBullets(cleanJD, p.pool);
      return `${p.heading}\n\\resumeItemListStart\n${wrap(b1)}\n${wrap(b2)}\n\\resumeItemListEnd`;
    });

    // Select certs
    const selectedCerts = selectCerts(cleanJD, CERTS_POOL);
    const remaining = CERTS_POOL.length - selectedCerts.length;
    const certsBlock = selectedCerts
      .map(c => `\\textbf{${c.name}}{: ${c.issuer}, ${c.year}}`)
      .join(" \\\\\n     ")
      + ` \\\\\n     \\textbf{More}{: \\href{https://www.linkedin.com/in/29deveshgautam/details/certifications/}{\\color{blue}${remaining}+ additional certifications on LinkedIn}}`;

    try {
      // Main tailoring call
      const response = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: [
              "You are a resume tailoring engine. Output ONLY a valid JSON object. No markdown, no backticks, no explanation.",
              "CRITICAL: Do NOT use backslashes in string values. Write C# not C\\#, $1.5M not \\$1.5M, 40% not 40\\%.",
              "",
              "OUTPUT FORMAT:",
              JSON.stringify({
                keywords: [{ word: "example", tier: 1 }],
                freelance_1: "bullet text max 180 chars",
                freelance_2: "bullet text max 180 chars",
                skills_languages: "list",
                skills_frontend: "list",
                skills_backend: "list",
                skills_databases: "list",
                skills_cloud: "list",
                skills_deployment: "list",
                skills_tools: "list",
                skills_concepts: "list",
                skills_practices: "list",
              }, null, 2),
              "",
              "KEYWORD EXTRACTION:",
              "- Extract every meaningful skill, tool, concept, soft skill from the JD",
              "- tier 1 = required/must have, tier 2 = nice to have, tier 3 = context/implied",
              "- Include soft skills as keywords",
              "- Extract 20-40 keywords total",
              "",
              "FREELANCE BULLETS (Software Developer, Remote, May 2025-Present):",
              "- EXACTLY 2 bullets, web/software dev context only",
              "- Each bullet MUST be 120-180 characters minimum — never shorter",
              "- Start with strong action verb: Engineered, Developed, Built, Designed, Implemented",
              "- Include at least 2 specific technologies per bullet",
              "- Good example: 'Engineered scalable .NET Core APIs and React SPAs, implementing CI/CD pipelines on Azure DevOps to automate deployments.'",
              "- Bad example: 'Designed custom solutions' or 'Developed scalable APIs' — too vague and short",
              "- Weave in tier 1 keywords naturally",
              "- No filler endings",
              "",
              "SKILLS RULES — CRITICAL:",
              "- ALWAYS output ALL skills from the original list, just reorder by JD priority",
              "- JD-relevant skills go first in each category, rest follow",
              "- Do NOT remove any skills from the original list",
              "- You MAY add 1-2 JD keywords per category ONLY if genuinely in candidate background",
              "- Original full list must be preserved:",
              "- Languages: C, C++, Python, C#, Java, JavaScript, SQL, Kotlin",
              "- Frontend: React.js, HTML, CSS, Tailwind CSS, Framer Motion, Lottie",
              "- Backend: .NET, Django, Flask, REST APIs",
              "- Databases: MySQL, SQLite, relational design, query optimization",
              "- Cloud: AWS (EC2, S3 -- foundational knowledge)",
              "- Deployment: Vercel, Netlify, Cloudinary, Vite",
              "- Tools: Linux, Git, Visual Studio, Eclipse, Jupyter Notebook",
              "- Concepts: Data Structures, OOP, SDLC, API design, Machine Learning, Distributed Systems",
              "- Practices: Debugging, performance optimization, Agile/Scrum",
            ].join("\n"),
          },
          {
            role: "user",
            content: `Here is the job description:\n\n${cleanJD}\n\nReturn ONLY the JSON object.`,
          },
        ],
        temperature: 0.1,
        max_tokens: 2000,
      });

      setStatus("Checking skills safety...");

      let raw = response.choices[0].message.content.trim();
      raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
      const jsonStart = raw.indexOf("{");
      const jsonEnd = raw.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) raw = raw.substring(jsonStart, jsonEnd + 1);
      raw = raw.replace(/\\#/g, "#").replace(/\\%/g, "%").replace(/\\\$/g, "$");

      let data;
      try {
        data = JSON.parse(raw);
      } catch (e) {
        console.error("JSON parse failed:", raw);
        alert("AI returned unexpected format. Try again.");
        throw new Error("JSON parse failed");
      }

      const { keywords, ...bullets } = data;

      // Detect new skills AI added that aren't verified
      const extractSkillWords = (obj) => {
        return Object.values(obj)
          .filter(Boolean)
          .join(", ")
          .toLowerCase()
          .split(/[,]+/)  // split on commas only, not spaces
          .map(w => w.trim().replace(/[^a-z0-9.#+/]/g, " ").trim())
          .filter(w => w.length > 3)  // filter out short words
          .filter(w => !["and", "the", "with", "for", "via", "app", "core", "sql", "api", "oop", "git"].includes(w));
      };

      const skillWords = extractSkillWords({
        skills_languages: bullets.skills_languages,
        skills_frontend: bullets.skills_frontend,
        skills_backend: bullets.skills_backend,
        skills_databases: bullets.skills_databases,
        skills_cloud: bullets.skills_cloud,
        skills_deployment: bullets.skills_deployment,
        skills_tools: bullets.skills_tools,
        skills_concepts: bullets.skills_concepts,
        skills_practices: bullets.skills_practices,
      });

      const unverified = [...new Set(skillWords)].filter(w =>
        !VERIFIED_SKILLS.some(v =>
          v.toLowerCase() === w ||
          v.toLowerCase().includes(w) ||
          w.includes(v.toLowerCase())
        )
      );

      // AI classifies unverified skills
      let skillWarnings = [];
      if (unverified.length > 0) {
        try {
          const classifyResponse = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: `Classify skills as SAFE or VERIFY. Return ONLY a JSON array, no markdown.
SAFE = soft skill, methodology, concept (agile, collaboration, oop, sdlc, problem-solving)
VERIFY = specific tool, language, framework, platform an interviewer would ask you to demo (fastapi, kubernetes, docker, tensorflow)
Format: [{"skill": "name", "type": "SAFE" or "VERIFY"}]`,
              },
              {
                role: "user",
                content: `Classify these: ${unverified.join(", ")}`,
              },
            ],
            temperature: 0,
            max_tokens: 500,
          });

          let cr = classifyResponse.choices[0].message.content.trim();
          cr = cr.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
          const s = cr.indexOf("[");
          const e = cr.lastIndexOf("]");
          if (s !== -1 && e !== -1) cr = cr.substring(s, e + 1);
          const classified = JSON.parse(cr);
          skillWarnings = classified.filter(c => c.type === "VERIFY").map(c => c.skill);
        } catch {
          console.warn("Skill classification failed silently");
        }
      }

      setStatus("Assembling resume...");

      // Build skills block
      const skillsBlock = [
        bullets.skills_languages  ? `\\textbf{Languages}{: ${fixLatex(bullets.skills_languages)}} \\\\` : null,
        bullets.skills_frontend   ? `\\textbf{Frontend}{: ${fixLatex(bullets.skills_frontend)}} \\\\` : null,
        bullets.skills_backend    ? `\\textbf{Backend}{: ${fixLatex(bullets.skills_backend)}} \\\\` : null,
        bullets.skills_databases  ? `\\textbf{Databases}{: ${fixLatex(bullets.skills_databases)}} \\\\` : null,
        bullets.skills_cloud      ? `\\textbf{Cloud}{: ${fixLatex(bullets.skills_cloud)}} \\\\` : null,
        bullets.skills_deployment ? `\\textbf{Deployment}{: ${fixLatex(bullets.skills_deployment)}} \\\\` : null,
        bullets.skills_tools      ? `\\textbf{Tools}{: ${fixLatex(bullets.skills_tools)}} \\\\` : null,
        bullets.skills_concepts   ? `\\textbf{Concepts}{: ${fixLatex(bullets.skills_concepts)}} \\\\` : null,
        bullets.skills_practices  ? `\\textbf{Practices}{: ${fixLatex(bullets.skills_practices)}}` : null,
      ].filter(Boolean).join("\n");

      // Build freelance block
      const freelanceBlock = `\\resumeSubheading
{Freelance}{Remote}
{Software Developer}{May 2025 -- Present}
\\resumeItemListStart
${wrap(bullets.freelance_1 || "Designed and deployed React-based web applications with REST APIs, delivering responsive, accessible UIs.")}
${wrap(bullets.freelance_2 || "Implemented CI/CD workflows using Git and cloud deployment platforms, improving release consistency.")}
\\resumeItemListEnd`;

      // Build default latex for diff comparison
      const defaultProjectBlock = [
        `\\resumeProjectHeading\n{\\textbf{Resume Boss} $|$ \\emph{React, Vite, JavaScript, Groq API} $|$ \\href{https://bossresume.vercel.app/}{\\color{blue}Live Demo}}{}\n\\resumeItemListStart\n${wrap(PROJECT_BULLETS.resumeBoss[0])}\n${wrap(PROJECT_BULLETS.resumeBoss[1])}\n\\resumeItemListEnd`,
        `\\resumeProjectHeading\n{\\textbf{Data Hub} $|$ \\emph{Python, Flask, SQLite, HTML, CSS} $|$ \\href{https://github.com/Paimondevil/Data-Hub}{\\color{blue}GitHub}}{}\n\\resumeItemListStart\n${wrap(PROJECT_BULLETS.dataHub[0])}\n${wrap(PROJECT_BULLETS.dataHub[1])}\n\\resumeItemListEnd`,
        `\\resumeProjectHeading\n{\\textbf{Traffic Controller System} $|$ \\emph{React, JavaScript, Scheduling Algorithms, CSS} $|$ \\href{https://traffic-controll-neon.vercel.app/}{\\color{blue}Live Demo}}{}\n\\resumeItemListStart\n${wrap(PROJECT_BULLETS.traffic[0])}\n${wrap(PROJECT_BULLETS.traffic[1])}\n\\resumeItemListEnd`,
      ];

      const originalLatex = fillTemplate(LATEX_TEMPLATE, {
        FREELANCE_BLOCK: `\\resumeSubheading{Freelance}{Remote}{Software Developer}{May 2025 -- Present}\\resumeItemListStart${wrap("Designed and deployed React-based web applications with REST APIs, delivering responsive, accessible UIs.")}${wrap("Implemented CI/CD workflows using Git and cloud deployment platforms, improving release consistency.")}\\resumeItemListEnd`,
        LOCKED_EXPERIENCE,
        PROJECT_1: defaultProjectBlock[0],
        PROJECT_2: defaultProjectBlock[1],
        SKILLS_BLOCK: DEFAULT_SKILLS,
        CERTS_BLOCK: "",
      });

      const filled = {
        FREELANCE_BLOCK: freelanceBlock,
        LOCKED_EXPERIENCE,
        PROJECT_1: projectBlocks[0],
        PROJECT_2: projectBlocks[1],
        SKILLS_BLOCK: skillsBlock || DEFAULT_SKILLS,
        CERTS_BLOCK: certsBlock,
      };

      const finalLatex = fillTemplate(LATEX_TEMPLATE, filled);
      const diff = buildDiff(originalLatex, finalLatex);

      setTailoredLatex(finalLatex);
      setScore({ ...scoreResume(keywords, finalLatex), skillWarnings, diff });
      setStatus("");

    } catch (err) {
      if (err.message !== "JSON parse failed") alert("Something went wrong: " + err.message);
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Job Description</h2>
      <textarea
        placeholder="Paste the job description here..."
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        rows={10}
      />
      {status && <p className="status-msg">⚙ {status}</p>}
      <button onClick={handleTailor} disabled={loading}>
        {loading ? "⚙ Tailoring..." : "⚡ Tailor My Resume"}
      </button>
    </div>
  );
}

export default JDInput;