import { useState, useRef } from "react";
import Groq from "groq-sdk";

const FIXED_HEADER = {
  name: "Devesh Gautam",
  address: "Antigonish, Nova Scotia, Canada",
  phone: "(+1) 902-338-2913",
  email: "29deveshgautam@gmail.com",
  portfolio: "https://deveshfolio.vercel.app",
  linkedin: "https://linkedin.com/in/29deveshgautam",
};

// Exact bullets from the resume — AI picks the most relevant ones
const RESUME_ACHIEVEMENTS = `
SIEMENS TECH. AND SERVICES LTD. — Software Development Engineer (Oct 2021 – Sep 2022):
- Engineered PLC-based automation for conveyor systems using C#, .NET, and TIA Portal, increasing throughput and reclaiming 40+ hours/month via workflow automation.
- Spearheaded software feasibility studies and effort estimations, resulting in a 20% reduction in project delays and a 15% boost in on-time delivery rates.
- Modularized system architectures within an Agile/Scrum environment, reducing debugging time by 25% and significantly improving production stability.

SOLARTIS LLC — Associate Software Engineer (Apr 2021 – Oct 2021):
- Refactored backend logic and optimized SQL (MySQL) queries, cutting load times by 40% and reducing post-release bug reports by 40%.
- Architected Jenkins CI/CD pipelines, lowering deployment errors by 70% and reclaiming 15+ hours/week for the core engineering team.
- Orchestrated cross-functional collaboration on a global campaign, increasing customer acquisition by 25% and contributing $1.5M in revenue impact.

PROJECTS:
- Resume Boss: AI-powered resume tailoring web app (React, Vite, Groq API, JavaScript) — automated keyword extraction, LaTeX generation, ATS scoring. Live at bossresume.vercel.app
- Data Hub: Full-stack data management app (Python, Flask, SQLite) — REST APIs, CRUD operations.
- Traffic Controller System: Real-time traffic management app (React, JavaScript) — live at traffic-controll-neon.vercel.app
- GoodWill Enterprises Website: Corporate site (React, Tailwind CSS, Framer Motion) — live at goodwill-enterprises.vercel.app

EDUCATION:
- Master of Applied Computer Science, StFX University (Jan 2023 – May 2025)
- B.Tech in Computer Science, Amity University (2017 – 2021)

SKILLS: Python, JavaScript, C#, Java, C, C++, SQL, Kotlin, React.js, HTML, CSS, Tailwind CSS, .NET, Django, Flask, REST APIs, MySQL, SQLite, AWS (EC2, S3), Vercel, Git, Linux, Agile/Scrum, TDD, CI/CD, Jenkins
`;

function getGroqClient() {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error("VITE_GROQ_API_KEY is not set.");
  return new Groq({ apiKey, dangerouslyAllowBrowser: true });
}

function todayFormatted() {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default function CoverLetter({ jd, tailoredLatex }) {
  const [letterData, setLetterData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const printRef = useRef(null);

  const generate = async () => {
    if (!jd?.trim()) return;
    setLoading(true);
    setLetterData(null);
    setStatus("Analyzing job description...");

    try {
      const client = getGroqClient();

      const prompt = `You are a professional cover letter writer. Study the candidate's EXACT resume bullets below and write a cover letter body that references their REAL achievements — never invent metrics or experiences.

CANDIDATE'S EXACT RESUME BULLETS:
${RESUME_ACHIEVEMENTS}

JOB DESCRIPTION:
${jd}

Output ONLY a valid JSON object with NO markdown, NO backticks:

{
  "company_name": "Full company name from JD",
  "company_address": "Full address if found in JD, else empty string",
  "role_title": "Exact job title from JD",
  "re_line": "RE: [Exact Job Title from JD] – [Company Name] ([team or department if mentioned, else omit])",
  "salutation": "Dear Hiring Team,",
  "opening_paragraph": "2 sentences maximum. Sentence 1: Name the specific role and company, then give ONE concrete reason this opportunity interests you — pick something real and specific from the JD (a tech challenge, the team structure, a product, or a business goal). Do NOT paraphrase the JD back at them. Sentence 2: One direct statement connecting your background to that specific thing. Do NOT start with 'I'. Do NOT use phrases like 'the opportunity to', 'I am excited', 'truly', 'compelling', or 'resonates with'.",
  "bullet_1": "One tight sentence. Lead with the result/metric first, then what you did. Example format: 'Cutting load times by 40% at Solartis required refactoring backend logic and optimizing MySQL queries across a high-traffic policy platform.' Keep the exact metric. No filler words after the metric.",
  "bullet_2": "One tight sentence about a DIFFERENT company or project than bullet_1. Lead with the result or action, not the skill label. Keep the exact metric. No filler.",
  "bullet_3": "One tight sentence. Can use a project if it matches a JD requirement. Be specific about what was built and why it matters for this role. No filler.",
  "closing_paragraph": "2 sentences. Sentence 1: Reference ONE specific thing from the JD — a team structure, product, or technical challenge — and connect it directly to something from your background. Sentence 2: Express readiness to discuss further, simply and confidently. No filler like 'I would be thrilled' or 'I am passionate'."
}

STRICT RULES:
- Every bullet MUST use a metric that EXISTS in the resume bullets above — do not invent numbers
- Bullets must each be ONE sentence, specific and punchy, zero filler after the metric
- opening_paragraph must NOT start with 'I' as the first word
- NEVER use hyphens (-) or em-dashes (—) as separators or connectors anywhere in the letter — they are a strong AI-writing signal that ATS systems flag. Use periods or commas instead
- NEVER use these filler phrases anywhere: "truly", "compelling", "resonates", "I am passionate", "I would be thrilled", "I am excited", "the opportunity to", "demonstrating my ability to", "showcasing my proficiency", "aligns with my"
- Write like a confident human, not a language model
- company_address: only include if explicitly stated in JD, otherwise empty string`;

      setStatus("Writing cover letter...");

      const response = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a professional cover letter writer. Output ONLY valid JSON, no markdown, no backticks, no explanation whatsoever.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.25,
        max_tokens: 1000,
      });

      let raw = response.choices[0].message.content.trim();
      raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
      const s = raw.indexOf("{"), e = raw.lastIndexOf("}");
      if (s !== -1 && e !== -1) raw = raw.substring(s, e + 1);

      const data = JSON.parse(raw);
      data.date = todayFormatted();
      setLetterData(data);
      setStatus("");
    } catch (err) {
      console.error(err);
      alert("Cover letter generation failed: " + err.message);
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintPDF = () => {
    if (!letterData) return;
    const addr = letterData.company_address
      ? `${letterData.company_name}\n${letterData.company_address}`
      : letterData.company_name;

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Cover Letter – ${letterData.company_name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, serif; font-size: 11pt; line-height: 1.7; color: #111; padding: 52px 64px; max-width: 760px; margin: 0 auto; }
    .name { font-size: 14pt; font-weight: bold; margin-bottom: 3px; }
    .contact { font-size: 9.5pt; color: #444; margin-bottom: 2px; }
    .divider { border: none; border-top: 1px solid #ccc; margin: 14px 0; }
    .date { margin-bottom: 14px; }
    .recipient { margin-bottom: 14px; line-height: 1.5; }
    .re { font-weight: bold; margin-bottom: 14px; }
    .salutation { margin-bottom: 14px; }
    p { margin-bottom: 13px; text-align: justify; hyphens: auto; }
    ul { padding-left: 20px; margin-bottom: 13px; }
    li { margin-bottom: 7px; text-align: justify; hyphens: auto; }
    .sign { margin-top: 18px; }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="name">${FIXED_HEADER.name}</div>
  <div class="contact">${FIXED_HEADER.address}</div>
  <div class="contact">${FIXED_HEADER.phone} &nbsp;·&nbsp; ${FIXED_HEADER.email}</div>
  <div class="contact">${FIXED_HEADER.portfolio} &nbsp;·&nbsp; ${FIXED_HEADER.linkedin}</div>
  <hr class="divider">
  <div class="date">${letterData.date}</div>
  <div class="recipient">
    Hiring Manager<br>
    ${addr.replace(/\n/g, '<br>')}
  </div>
  <div class="re">${letterData.re_line}</div>
  <p class="salutation">${letterData.salutation}</p>
  <p>${letterData.opening_paragraph}</p>
  <p>My background directly addresses your key requirements:</p>
  <ul>
    <li>${letterData.bullet_1}</li>
    <li>${letterData.bullet_2}</li>
    <li>${letterData.bullet_3}</li>
  </ul>
  <p>${letterData.closing_paragraph}</p>
  <p>Thank you for your time and consideration. I look forward to the opportunity to discuss how my background can contribute to your team.</p>
  <div class="sign">
    <p>Sincerely,</p>
    <p><strong>${FIXED_HEADER.name}</strong></p>
  </div>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
  };

  const handleCopy = async () => {
    if (!letterData) return;
    const text = buildPlainText(letterData);
    await navigator.clipboard.writeText(text);
  };

  const buildPlainText = (d) => {
    const addr = d.company_address ? `${d.company_name}\n${d.company_address}` : d.company_name;
    return `${FIXED_HEADER.name}
${FIXED_HEADER.address}
${FIXED_HEADER.phone}
${FIXED_HEADER.email}
Portfolio: ${FIXED_HEADER.portfolio} | LinkedIn: ${FIXED_HEADER.linkedin}

${d.date}

Hiring Manager
${addr}

${d.re_line}

${d.salutation}

${d.opening_paragraph}

My background directly addresses your key requirements:

  • ${d.bullet_1}
  • ${d.bullet_2}
  • ${d.bullet_3}

${d.closing_paragraph}

Thank you for your time and consideration. I look forward to the opportunity to discuss how my background can contribute to your team.

Sincerely,
${FIXED_HEADER.name}`;
  };

  return (
    <>

      <div className="cover-letter-wrap">
        {!letterData ? (
          <div className="cl-generate-area">
            <div className="cl-intro">
              <div className="cl-intro-icon">✉</div>
              <p className="cl-intro-title">AI Cover Letter Generator</p>
              <p className="cl-intro-sub">
                Tailored to the job description using your exact resume achievements and metrics.
                Follows Harvard &amp; Stanford career center guidelines.
              </p>
            </div>
            <button className="btn-primary" onClick={generate} disabled={loading || !jd}>
              {loading ? "Writing..." : "⚡ Generate Cover Letter"}
            </button>
            {status && <p className="status-msg">{status}</p>}
          </div>
        ) : (
          <div className="cl-output-area">
            <div className="cl-toolbar">
              <button className="btn-secondary" onClick={generate} disabled={loading}>
                {loading ? "Regenerating..." : "↻ Regenerate"}
              </button>
              <button className="btn-secondary" onClick={handleCopy}>
                Copy Text
              </button>
              <button className="btn-secondary btn-download" onClick={handlePrintPDF}>
                ↓ Download PDF
              </button>
            </div>
            {status && <p className="status-msg">{status}</p>}

            {/* On-screen preview */}
            <div className="cl-preview">
              <div className="cl-letter">
                <div className="cl-sender">
                  <strong>{FIXED_HEADER.name}</strong>
                  <span>{FIXED_HEADER.address}</span>
                  <span>{FIXED_HEADER.phone} · {FIXED_HEADER.email}</span>
                  <span>{FIXED_HEADER.portfolio} · {FIXED_HEADER.linkedin}</span>
                </div>

                <p className="cl-date">{letterData.date}</p>

                <div className="cl-recipient">
                  <span>Hiring Manager</span>
                  <span>{letterData.company_name}</span>
                  {letterData.company_address && <span>{letterData.company_address}</span>}
                </div>

                <p className="cl-re">{letterData.re_line}</p>
                <p className="cl-salutation">{letterData.salutation}</p>
                <p className="cl-para">{letterData.opening_paragraph}</p>
                <p className="cl-para">My background directly addresses your key requirements:</p>
                <ul className="cl-bullets">
                  <li>{letterData.bullet_1}</li>
                  <li>{letterData.bullet_2}</li>
                  <li>{letterData.bullet_3}</li>
                </ul>
                <p className="cl-para">{letterData.closing_paragraph}</p>
                <p className="cl-para">Thank you for your time and consideration. I look forward to the opportunity to discuss how my background can contribute to your team.</p>
                <div className="cl-sign">
                  <p>Sincerely,</p>
                  <strong>{FIXED_HEADER.name}</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}