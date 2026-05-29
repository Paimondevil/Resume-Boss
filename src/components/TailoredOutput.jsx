function TailoredOutput({ tailoredLatex, score }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(tailoredLatex);
    alert("LaTeX copied! Paste into Overleaf.");
  };

  const color = (n, t) => n / t >= 0.8 ? "#22c55e" : n / t >= 0.5 ? "#f59e0b" : "#ef4444";

  return (
    <div className="card">
      <div className="card-header">
        <h2>Tailored Resume</h2>
        <button className="btn-secondary" onClick={handleCopy}>Copy LaTeX</button>
      </div>

      {score && (
        <div className="score-panel">
          <div className="score-main" style={{ color: score.overall >= 75 ? "#22c55e" : score.overall >= 55 ? "#f59e0b" : "#ef4444" }}>
            {score.overall}% ATS Match
          </div>

          <div className="score-breakdown">
            <span>Tier 1 (Required): <strong style={{ color: color(score.tier1.matched, score.tier1.total) }}>{score.tier1.matched}/{score.tier1.total}</strong></span>
            <span>Tier 2 (Nice-to-have): <strong style={{ color: color(score.tier2.matched, score.tier2.total) }}>{score.tier2.matched}/{score.tier2.total}</strong></span>
            <span>Tier 3 (Context): <strong>{score.tier3.matched}/{score.tier3.total}</strong></span>
          </div>

          {score.tier1.missing.length > 0 && (
            <div className="missing-keywords">
              <span className="missing-label">⚠️ Missing Required:</span>
              {score.tier1.missing.map(w => <span key={w} className="keyword-tag red">{w}</span>)}
            </div>
          )}
          {score.tier2.missing.length > 0 && (
            <div className="missing-keywords">
              <span className="missing-label">💡 Missing Nice-to-have:</span>
              {score.tier2.missing.map(w => <span key={w} className="keyword-tag yellow">{w}</span>)}
            </div>
          )}
        </div>
      )}

      <textarea
        value={tailoredLatex}
        readOnly
        rows={20}
        style={{ fontFamily: "monospace", fontSize: "0.75rem" }}
      />
    </div>
  );
}

export default TailoredOutput;