import { useState } from "react";
import Groq from "groq-sdk";
import { extractJDKeywords, scoreResume } from "../utils/scoring";

const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

function JDInput({ latexCode, setTailoredLatex, setScore, setLoading, loading, jdValue, setJdValue }) {
  const [jd, setJd] = useState("");

  const handleTailor = async () => {
    if (!jdValue.trim()) return alert("Please paste a job description.");
    if (!latexCode.trim()) return alert("Please paste your LaTeX resume code first.");
    setLoading(true);

    const { techMatches, actionMatches } = extractJDKeywords(jdValue);
    const keywordsToHit = [...techMatches, ...actionMatches].slice(0, 25).join(", ");

    try {
      const response = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: [
              "You are an expert ATS resume optimizer working with LaTeX resumes.",
              "",
              "ABSOLUTE RULES — NEVER VIOLATE:",
              "- Return the COMPLETE LaTeX file unchanged EXCEPT \\resumeItem content in Experience/Projects and skill values in Technical Skills",
              "- NEVER add any text before the first % comment — output must start with %-------------------------",
              "- NEVER change LaTeX commands, company names, job titles, dates, or education",
              "- NEVER add or remove \\resumeItem lines — same count always",
              "- NEVER append keywords at the end of bullets — rewrite the whole bullet naturally",
              "- NEVER make any bullet longer than 2 lines when rendered — if longer, shorten it",
              "- Do NOT add the \\textbf{Practices} line — it is intentionally removed",
              "- Total output must be same length or shorter than input — never longer",
              "",
              "LATEX SYNTAX — CRITICAL:",
              "- Always write C\\# not C# — the backslash is required in LaTeX",
              "- Always write \\$1.5M not $1.5M",
              "- Always write 40\\% not 40% inside resumeItems",
              "- Never use unescaped # $ % characters outside LaTeX commands",
              "",
              "METRICS ARE SACRED — NEVER REMOVE:",
              "- These must survive unchanged: 40\\%, 20\\%, 15\\%, 25\\%, 70\\%, 35\\%, 30\\%, \\$1.5M, 15+ hours/week, 40+ hours/month",
              "- When rewriting a bullet containing a metric, keep the metric and rewrite surrounding words only",
              "- Good example: Engineered backend services using C\\# and .NET, reclaiming 40+ hours/month via workflow automation",
              "- Bad example: Improved system performance (metric dropped)",
              "",
              "CONTEXT-AWARE PLACEMENT — STRICTLY FOLLOW:",
              "- Maritime Inn (hotel front desk): ONLY soft skills — collaborative, reliable, resolving issues, communication, continuous improvement. ZERO programming languages or tools",
              "- Siemens (Software Development Engineer): tech keywords allowed — C\\#, .NET, ASP.NET Core, microservices, REST APIs, Azure, CI/CD, Agile/Scrum",
              "- Solartis (Associate Software Engineer): tech keywords allowed — SQL, MySQL, NoSQL, CI/CD, Jenkins, Git, bug fixing, backend",
              "- Projects: tech keywords allowed — React, JavaScript, REST APIs, Docker, frontend",
              "- Technical Skills: reorder to put JD-relevant skills first, add missing JD keywords only if honestly applicable",
              "",
              "WHAT TO DO:",
              "- Rewrite Siemens and Solartis bullets to include JD tech keywords naturally while keeping all metrics",
              "- Rewrite Maritime Inn bullets with soft skills only",
              "- Rewrite Project bullets to emphasize relevant tech",
              "- Reorder Technical Skills to prioritize JD keywords",
              `- Include these keywords where honest: ${keywordsToHit}`,
              "",
              "TARGET: 85%+ score through honest keyword matching with all metrics preserved.",
            ].join("\n"),
          },
          {
            role: "user",
            content: `Here is my LaTeX resume:\n\n${latexCode}\n\nHere is the job description:\n\n${jdValue}\n\nTailor only the \\resumeItem content and Technical Skills values. Keep ALL metrics. Return the complete LaTeX file starting with %-------------------------`,
          },
        ],
        temperature: 0.2,
        max_tokens: 3000,
      });

      let tailored = response.choices[0].message.content;
      tailored = tailored.replace(/^```latex\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
      tailored = tailored.replace(/^[\s\S]*?(?=%-)/, "");
      tailored = tailored.replace(/(?<!\\)C#/g, "C\\#");

      setTailoredLatex(tailored);
      setScore(scoreResume(jdValue, tailored, latexCode));
    } catch (err) {
      alert("Something went wrong: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Job Description</h2>
      <textarea
        placeholder="Paste the job description here..."
        value={jdValue}
        onChange={(e) => setJdValue(e.target.value)}
        rows={10}
      />
      <button onClick={handleTailor} disabled={loading}>
        {loading ? "Tailoring..." : "Tailor My Resume"}
      </button>
    </div>
  );
}

export default JDInput;