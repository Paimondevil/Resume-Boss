import { useState, useRef } from "react";
import JDInput from "./components/JDInput";
import TailoredOutput from "./components/TailoredOutput";
import ParticleField from "./components/ParticleField";
import "./index.css";

function App() {
  const [tailoredLatex, setTailoredLatex] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const outputRef = useRef(null);

  const handleResult = (latex, scoreData) => {
    setTailoredLatex(latex);
    setScore(scoreData);
    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  return (
    <>
      <ParticleField />
      <div className="app">
        <header>
          <div className="header-eyebrow">
            <span className="eyebrow-dot" />
            AI-Powered · ATS Optimized · LaTeX Ready
          </div>
          <h1>Resume<span className="title-accent">Boss</span></h1>
          <p className="hero-sub">
            Paste a job description. Get a precision-tailored LaTeX resume in seconds.
          </p>
          <div className="hero-divider" />
          <div className="hero-stats">
            <span className="hero-stat"><strong>Groq</strong> · llama-3.3-70b</span>
            <span className="hero-stat"><strong>3-tier</strong> ATS scoring</span>
            <span className="hero-stat"><strong>LaTeX</strong> · Overleaf ready</span>
          </div>
        </header>

        <main>
          <JDInput
            setTailoredLatex={() => {}}
            setScore={() => {}}
            setLoading={setLoading}
            loading={loading}
            onResult={handleResult}
          />
          {tailoredLatex && (
            <div ref={outputRef}>
              <TailoredOutput tailoredLatex={tailoredLatex} score={score} />
            </div>
          )}
        </main>

        <footer className="site-footer">
          <div className="footer-inner">
            <span className="footer-brand">Resume Boss</span>
            <span className="footer-sep">·</span>
            <span>Built by </span>
            <a href="https://deveshfolio.vercel.app" target="_blank" rel="noreferrer">
              Devesh Gautam
            </a>
            <span className="footer-sep">·</span>
            <span>Powered by Groq + Llama 3.3</span>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;