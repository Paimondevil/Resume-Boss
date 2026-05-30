import { useState } from "react";
import JDInput from "./components/JDInput";
import TailoredOutput from "./components/TailoredOutput";
import "./index.css";

function App() {
  const [tailoredLatex, setTailoredLatex] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const footerStyle = {
    textAlign: "center",
    padding: "2rem 0 1rem",
    color: "var(--text-dim)",
    fontSize: "0.75rem",
    fontFamily: "monospace",
    borderTop: "1px solid rgba(249, 115, 22, 0.08)",
    marginTop: "2rem",
  };

  const linkStyle = {
    color: "var(--orange-bright)",
    textDecoration: "none",
  };

  const nameStyle = {
    color: "var(--orange)",
    fontWeight: 700,
  };

  return (
    <div className="app">
      <header>
        <div className="header-badge">AI-Powered Resume Tailoring</div>
        <h1>Resume Boss</h1>
        <p>Paste a job description and get a tailored LaTeX resume instantly</p>
      </header>

      <main>
        <JDInput
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

      <footer style={footerStyle}>
        <span style={nameStyle}>Resume Boss</span>
        <span> | Built by </span>
        <a href="https://deveshfolio.vercel.app" target="_blank" rel="noreferrer" style={linkStyle}>
          Devesh Gautam
        </a>
        <span> | Powered by Groq + Llama 3.3</span>
      </footer>
    </div>
  );
}

export default App;