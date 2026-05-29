import { useState } from "react";
import JDInput from "./components/JDInput";
import TailoredOutput from "./components/TailoredOutput";
import "./index.css";

function App() {
  const [tailoredLatex, setTailoredLatex] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="app">
      <header>
        <h1>Resume Boss</h1>
        <p>Paste a job description — get a tailored LaTeX resume instantly</p>
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
    </div>
  );
}

export default App;