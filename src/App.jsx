import { useState, useEffect } from "react";
import JDInput from "./components/JDInput";
import TailoredOutput from "./components/TailoredOutput";
import { checkJobFit } from "./utils/scoring";
import "./index.css";

const DEFAULT_LATEX = `% Paste your LaTeX resume code here and it will be saved automatically`;

function App() {
  const [latexCode, setLatexCode] = useState(() => localStorage.getItem("resumeLatex") || DEFAULT_LATEX);
  const [tailoredLatex, setTailoredLatex] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingLatex, setEditingLatex] = useState(false);
  const [fitWarning, setFitWarning] = useState(null);
  const [jdValue, setJdValue] = useState("");

  useEffect(() => {
    if (latexCode !== DEFAULT_LATEX) {
      localStorage.setItem("resumeLatex", latexCode);
    }
  }, [latexCode]);

  // Check job fit whenever JD changes
  useEffect(() => {
    if (!jdValue.trim() || latexCode === DEFAULT_LATEX) {
      setFitWarning(null);
      return;
    }
    const { fitScore, missing, warning } = checkJobFit(jdValue, latexCode);
    if (warning) {
      setFitWarning({ fitScore, missing, warning });
    } else {
      setFitWarning(null);
    }
  }, [jdValue, latexCode]);

  return (
    <div className="app">
      <header>
        <h1>Resume Boss</h1>
        <p>Tailor your LaTeX resume to any job description instantly</p>
      </header>
      <main>
        <div className="card">
          <div className="card-header">
            <h2>Your LaTeX Resume</h2>
            <button className="btn-secondary" onClick={() => setEditingLatex(!editingLatex)}>
              {editingLatex ? "Done Editing" : "Edit Resume"}
            </button>
          </div>
          {editingLatex ? (
            <textarea
              value={latexCode}
              onChange={(e) => setLatexCode(e.target.value)}
              rows={15}
              placeholder="Paste your LaTeX resume code here..."
              style={{ fontFamily: "monospace", fontSize: "0.8rem" }}
            />
          ) : (
            <div className="resume-loaded">
              <p>{latexCode === DEFAULT_LATEX ? "⚠️ No resume pasted yet — click Edit Resume" : "✅ LaTeX resume loaded and saved"}</p>
            </div>
          )}
        </div>

        {fitWarning && (
          <div className={`fit-warning ${fitWarning.warning}`}>
            <div className="fit-warning-header">
              {fitWarning.warning === "strong"
                ? "🔴 Strong Mismatch — This job may not be worth applying to"
                : "🟡 Moderate Mismatch — Some required skills are missing"}
            </div>
            <p>Your resume matches only <strong>{fitWarning.fitScore}%</strong> of the required skills for this role.</p>
            <p>Missing skills: {fitWarning.missing.slice(0, 8).map((k, i) => (
              <span key={i} className="keyword-tag">{k}</span>
            ))}</p>
            <p style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#888" }}>
              You can still tailor and apply, but managing expectations is advised.
            </p>
          </div>
        )}

        <JDInput
          latexCode={latexCode}
          setTailoredLatex={setTailoredLatex}
          setScore={setScore}
          setLoading={setLoading}
          loading={loading}
          jdValue={jdValue}
          setJdValue={setJdValue}
        />

        {tailoredLatex && (
          <TailoredOutput
            tailoredLatex={tailoredLatex}
            score={score}
          />
        )}
      </main>
    </div>
  );
}

export default App;