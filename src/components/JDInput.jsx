import { useState } from "react";
import Groq from "groq-sdk";
import { scoreResume } from "../utils/scoring";
import { LATEX_TEMPLATE, LOCKED_EXPERIENCE, CERTS_POOL } from "../data/resumeData";

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

function JDInput({ setTailoredLatex, setScore, setLoading, loading }) {
  const [jd, setJd] = useState("");
  const [status, setStatus] = useState("");

  const handleTailor = async () => {
    if (!jd.trim()) return alert("Please paste a job description.");
    setLoading(true);
    setStatus("Reading job description...");

    const cleanJD = sanitize(jd);

    try {
      const response = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: [
              "You are a resume tailoring engine. Output ONLY a valid JSON object. No markdown, no backticks, no explanation.",
              "",
              "CRITICAL JSON RULE: Do NOT use backslashes anywhere in string values.",
              "Write C# not C\\#, write $1.5M not \\$1.5M, write 40% not 40\\%, write .NET not \\.NET",
              "The app handles all LaTeX escaping. Your job is plain readable English text.",
              "",
              "OUTPUT FORMAT:",
              JSON.stringify({
                keywords: [
                  { word: "example keyword", tier: 1 },
                  { word: "another keyword", tier: 2 },
                  { word: "context keyword", tier: 3 }
                ],
                freelance_1: "bullet text — web/software dev context, max 180 chars",
                freelance_2: "bullet text — web/software dev context, max 180 chars",
                traffic_1: "bullet text, max 180 chars",
                traffic_2: "bullet text, max 180 chars",
                goodwill_1: "bullet text, max 180 chars",
                goodwill_2: "bullet text, max 180 chars",
                skills_languages: "list of languages",
                skills_frontend: "list of frontend skills",
                skills_backend: "list of backend skills",
                skills_databases: "list of database skills",
                skills_cloud: "list of cloud skills",
                skills_deployment: "list of deployment skills",
                skills_tools: "list of tools",
                skills_concepts: "list of concepts",
                skills_practices: "list of practices"
              }, null, 2),
              "",
              "KEYWORD EXTRACTION RULES:",
              "- Extract every meaningful skill, tool, concept, and soft skill from the JD",
              "- tier 1 = explicitly required / must have",
              "- tier 2 = nice to have / preferred / asset",
              "- tier 3 = mentioned in context / implied",
              "- Include soft skills as keywords too (collaboration, analytical thinking, etc)",
              "- Extract 20-40 keywords total for good coverage",
              "",
              "BULLET RULES:",
              "- freelance_1 and freelance_2: Write STRONG specific bullets, 150-180 chars each",
              "- Start with a strong action verb (Engineered, Developed, Built, Designed, Implemented)",
              "- Include specific technologies from JD tier 1 keywords naturally",
              "- Good example: 'Developed and deployed enterprise web applications using Java and Python, integrating REST APIs and SQL databases within an Agile/DevOps workflow.'",
              "- Bad example: 'Designed and developed software solutions using Java and Python'",
              "- traffic and goodwill: keep existing meaning, weave in relevant JD keywords naturally",
              "- Keep these metrics exactly: traffic_2 has 35%, goodwill_1 has 30%, goodwill_2 has 100%",
              "- No vague filler like 'to deliver high-quality solutions' or 'with strong problem-solving skills'",
              "- traffic_1 default: 'Developed a real-time traffic management simulator using advanced scheduling algorithms to optimize vehicle flow and reduce congestion.'",
              "- traffic_2 default: 'Built a dynamic React-based dashboard to visualize traffic data, improving simulated traffic efficiency by 35% through algorithmic problem-solving.'",
              "- goodwill_1 default: 'Engineered and deployed an interactive business platform, optimizing page load speeds by 30% through efficient asset management and code splitting.'",
              "- goodwill_2 default: 'Implemented responsive UI components and fluid animations using Framer Motion, ensuring 100% cross-browser compatibility and accessibility.'",
              "- ONLY weave in JD keywords by replacing weak words — never change the core meaning or metrics",
              "",
              "SKILLS RULES:",
              "- Only include skills that are honestly in the candidate's background",
              "- Reorder each category to put JD-relevant skills first",
              "- Original skills: Languages: C, C++, Python, C#, Java, JavaScript, SQL | Frontend: React.js, HTML, CSS, Tailwind CSS, Framer Motion | Backend: .NET, Django, REST APIs | Databases: MySQL, SQLite, relational design, query optimization | Cloud: AWS (EC2, S3) | Deployment: Vercel, Netlify, Cloudinary | Tools: Linux, Git, Visual Studio, Eclipse, Jupyter Notebook | Concepts: Data Structures, OOP, SDLC, API design | Practices: Debugging, performance optimization, Agile/Scrum",
              "- You may add a JD keyword to skills ONLY if it genuinely fits the candidate's background",
            ].join("\n"),
          },
          {
            role: "user",
            content: `Here is the job description:\n\n${cleanJD}\n\nExtract keywords and tailor the resume sections. Return ONLY the JSON object.`,
          },
        ],
        temperature: 0.1,
        max_tokens: 3000,
      });

      setStatus("Assembling resume...");

      let raw = response.choices[0].message.content.trim();
      raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

      const jsonStart = raw.indexOf("{");
      const jsonEnd = raw.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) raw = raw.substring(jsonStart, jsonEnd + 1);

      // Strip any backslashes before special chars that break JSON
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

      // Build certs block
      const selected = selectCerts(cleanJD, CERTS_POOL);
      const remaining = CERTS_POOL.length - selected.length;
      const certsBlock = selected.map(c => `\\textbf{${c.name}}{: ${c.issuer}, ${c.year}}`).join(" \\\\\n     ")
        + ` \\\\\n     \\textbf{More}{: \\href{https://www.linkedin.com/in/29deveshgautam/details/certifications/}{\\color{blue}${remaining}+ additional certifications on LinkedIn}}`;

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

      const filled = {
        FREELANCE_BLOCK: freelanceBlock,
        LOCKED_EXPERIENCE,
        TRAFFIC_1: wrap(bullets.traffic_1 || "Developed a real-time traffic management simulator using advanced scheduling algorithms to optimize vehicle flow."),
        TRAFFIC_2: wrap(bullets.traffic_2 || "Built a dynamic React-based dashboard to visualize traffic data, improving simulated traffic efficiency by 35%."),
        GOODWILL_1: wrap(bullets.goodwill_1 || "Engineered and deployed an interactive business platform, optimizing page load speeds by 30% through efficient asset management."),
        GOODWILL_2: wrap(bullets.goodwill_2 || "Implemented responsive UI components and fluid animations using Framer Motion, ensuring 100% cross-browser compatibility."),
        SKILLS_BLOCK: skillsBlock,
        CERTS_BLOCK: certsBlock,
      };

      const finalLatex = fillTemplate(LATEX_TEMPLATE, filled);
      setTailoredLatex(finalLatex);
      setScore(scoreResume(keywords, finalLatex));
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
      {status && <p className="status-msg">⚙️ {status}</p>}
      <button onClick={handleTailor} disabled={loading}>
        {loading ? "Tailoring..." : "Tailor My Resume"}
      </button>
    </div>
  );
}

export default JDInput;