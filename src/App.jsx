import { useState, useRef, useEffect } from "react";
import JDInput from "./components/JDInput";
import TailoredOutput from "./components/TailoredOutput";
import ParticleField from "./components/ParticleField";
import "./index.css";

// 3D tilt + mouse-follow shine on cards
function useTilt() {
  useEffect(() => {
    const cards = document.querySelectorAll(".card");
    const handlers = [];

    cards.forEach((card) => {
      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const rx = -dy * 4;
        const ry = dx * 4;
        const mx = ((e.clientX - rect.left) / rect.width) * 100;
        const my = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--rx", `${rx}deg`);
        card.style.setProperty("--ry", `${ry}deg`);
        card.style.setProperty("--mx", `${mx}%`);
        card.style.setProperty("--my", `${my}%`);
      };
      const onLeave = () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
        card.style.transition = "transform 0.5s ease";
        setTimeout(() => { card.style.transition = ""; }, 500);
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      handlers.push({ card, onMove, onLeave });
    });

    return () => {
      handlers.forEach(({ card, onMove, onLeave }) => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    };
  });
}

function App() {
  const [tailoredLatex, setTailoredLatex] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jd, setJd] = useState("");
  const outputRef = useRef(null);

  useTilt();

  const handleResult = (latex, scoreData, rawJd) => {
    setTailoredLatex(latex);
    setScore(scoreData);
    setJd(rawJd);
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
            setTailoredLatex={(l) => {}}
            setScore={(s) => {}}
            setLoading={setLoading}
            loading={loading}
            onResult={handleResult}
          />
          {tailoredLatex && (
            <div ref={outputRef}>
              <TailoredOutput tailoredLatex={tailoredLatex} score={score} jd={jd} />
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