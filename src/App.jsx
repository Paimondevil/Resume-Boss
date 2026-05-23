import { useState, useEffect } from "react";
import JDInput from "./components/JDInput";
import TailoredOutput from "./components/TailoredOutput";
import "./index.css";

const DEFAULT_LATEX = `% Paste your LaTeX resume code here and it will be saved automatically`;

function App() {
  const [latexCode, setLatexCode] = useState(() => localStorage.getItem("resumeLatex") || DEFAULT_LATEX);
  const [tailoredLatex, setTailoredLatex] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingLatex, setEditingLatex] = useState(false);

  useEffect(() => {
    if (latexCode !== DEFAULT_LATEX) {
      localStorage.setItem("resumeLatex", latexCode);
    }
  }, [latexCode]);

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

        <JDInput
          latexCode={latexCode}
          setTailoredLatex={setTailoredLatex}
          setScore={setScore}
          setLoading={setLoading}
          loading={loading}
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