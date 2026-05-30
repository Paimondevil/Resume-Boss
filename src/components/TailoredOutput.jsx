import { useState } from "react";

function TailoredOutput({ tailoredLatex, score }) {
  const [showDiff, setShowDiff] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(tailoredLatex);
    alert("LaTeX copied! Paste into Overleaf.");
  };

  const scoreColor = (s) => {
    if (s >= 75) return "var(--green)";
    if (s >= 50) return "var(--amber)";
    return "var(--red)";
  };

  const tierColor = (matched, total) => {
    if (!total) return "var(--green)";
    const r = matched / total;
    if (r >= 0.8) return "var(--green)";
    if (r >= 0.5) return "var(--amber)";
    return "var(--red)";
  };

  const highlightNew = (line, beforeWords) => {
    return line.split(/\s+/).map((word, wi) => {
      const clean = word.toLowerCase().replace(/[^a-z0-9]/g, "");
      const isNew = clean.length > 3 && !beforeWords.has(word.toLowerCase()) && !beforeWords.has(clean);
      return isNew
        ? <span key={wi} className="diff-highlight">{word} </span>
        : <span key={wi}>{word} </span>;
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Tailored Resume</h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="btn-secondary" onClick={() => setShowDiff(!showDiff)}>
            {showDiff ? "Hide Changes" : "Show Changes"}
          </button>
          <button className="btn-secondary" onClick={handleCopy}>
            Copy LaTeX
          </button>
        </div>
      </div>

      {score && (
        <div className="score-panel">
          {/* Main Score */}
          <div className="score-main" style={{ color: scoreColor(score.overall) }}>
            {score.overall}%
            <span style={{
              fontSize: "1rem",
              fontWeight: 400,
              color: "var(--text-muted)",
              marginLeft: "0.5rem",
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              ATS Match
            </span>
          </div>

          {/* Tier Breakdown */}
          <div className="score-breakdown">
            <span>
              T1 Required:{" "}
              <strong style={{ color: tierColor(score.tier1.matched, score.tier1.total) }}>
                {score.tier1.matched}/{score.tier1.total}
              </strong>
            </span>
            <span>
              T2 Nice-to-have:{" "}
              <strong style={{ color: tierColor(score.tier2.matched, score.tier2.total) }}>
                {score.tier2.matched}/{score.tier2.total}
              </strong>
            </span>
            <span>
              T3 Context:{" "}
              <strong style={{ color: "var(--text-muted)" }}>
                {score.tier3.matched}/{score.tier3.total}
              </strong>
            </span>
          </div>

          {/* Missing Required */}
          {score.tier1.missing.length > 0 && (
            <div className="missing-keywords">
              <span className="missing-label">⚠️ Missing Required:</span>
              {score.tier1.missing.map(w => (
                <span key={w} className="keyword-tag red">{w}</span>
              ))}
            </div>
          )}

          {/* Missing Nice-to-have */}
          {score.tier2.missing.length > 0 && (
            <div className="missing-keywords">
              <span className="missing-label">💡 Missing Nice-to-have:</span>
              {score.tier2.missing.map(w => (
                <span key={w} className="keyword-tag yellow">{w}</span>
              ))}
            </div>
          )}

          {/* Skill Warnings */}
          {score.skillWarnings?.length > 0 && (
            <div className="verify-warning" style={{ marginTop: "0.75rem" }}>
              <span className="verify-warning-label">
                ⚠️ Verify before submitting — AI added these, make sure you can back them up:
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {score.skillWarnings.map(w => (
                  <span key={w} className="keyword-tag red">{w}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Diff Viewer */}
      {showDiff && score?.diff && (
        <div className="diff-container">
          <div className="diff-header">// WHAT CHANGED</div>

          {score.diff.length === 0 ? (
            <div style={{ padding: "1rem", color: "var(--text-dim)", fontFamily: "'Space Mono', monospace", fontSize: "0.8rem" }}>
              No changes detected.
            </div>
          ) : (
            score.diff.map((section, i) => {
              const beforeWords = new Set(
                section.original.toLowerCase().split(/\s+/)
              );

              return (
                <div key={i} style={{
                  borderBottom: i < score.diff.length - 1
                    ? "1px solid rgba(249, 115, 22, 0.08)"
                    : "none"
                }}>
                  <div className="diff-section-title">
                    ◆ {section.name}
                  </div>
                  <div className="diff-columns">
                    {/* BEFORE */}
                    <div className="diff-col diff-col-before">
                      <span className="diff-col-label">BEFORE</span>
                      {section.original || (
                        <span style={{ color: "var(--text-dim)", fontStyle: "italic" }}>
                          — empty —
                        </span>
                      )}
                    </div>
                    {/* AFTER */}
                    <div className="diff-col diff-col-after">
                      <span className="diff-col-label">AFTER</span>
                      {section.updated.split("\n").map((line, li) => (
                        <div key={li}>{highlightNew(line, beforeWords)}</div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* LaTeX Output */}
      <textarea
        value={tailoredLatex}
        readOnly
        rows={20}
      />
    </div>
  );
}

export default TailoredOutput;