function TailoredOutput({ tailoredLatex, score }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(tailoredLatex);
    alert("Copied! Paste it in Overleaf.");
  };

  return (
    <div className="card">
      <h2>Tailored Resume — LaTeX</h2>
      {score !== null && (
        <div className="score-section">
          <div className={`score ${score.overall >= 85 ? "good" : score.overall >= 65 ? "okay" : "low"}`}>
            <span>Overall ATS Score</span>
            <strong>{score.overall}%</strong>
          </div>
          <div className="score-breakdown">
            <div className="score-item">
              <span>Tech Keywords</span>
              <strong>{score.techScore}%</strong>
            </div>
            <div className="score-item">
              <span>Action Verbs</span>
              <strong>{score.actionScore}%</strong>
            </div>
            <div className="score-item">
              <span>Soft Skills</span>
              <strong>{score.softScore}%</strong>
            </div>
          </div>
          {score.missingTech.length > 0 && (
            <div className="missing-keywords">
              <span>Missing tech: </span>
              {score.missingTech.map((k, i) => (
                <span key={i} className="keyword-tag">{k}</span>
              ))}
            </div>
          )}
          {score.missingSoft.length > 0 && (
            <div className="missing-keywords" style={{marginTop: "0.5rem"}}>
              <span>Missing soft skills: </span>
              {score.missingSoft.map((k, i) => (
                <span key={i} className="keyword-tag" style={{borderColor: "#854d0e", color: "#fcd34d"}}>{k}</span>
              ))}
            </div>
          )}
        </div>
      )}
      <textarea
        value={tailoredLatex}
        onChange={() => {}}
        rows={20}
        readOnly
        style={{ fontFamily: "monospace", fontSize: "0.8rem" }}
      />
      <button onClick={handleCopy}>Copy LaTeX → Paste in Overleaf</button>
    </div>
  );
}

export default TailoredOutput;