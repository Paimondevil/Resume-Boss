import { useState } from "react";

function TailoredOutput({ tailoredLatex, score }) {
  const [showDiff, setShowDiff] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(tailoredLatex);
    alert("LaTeX copied! Paste into Overleaf.");
  };

  const scoreColor = (s) => {
    if (s >= 75) return "#22c55e";
    if (s >= 50) return "#f59e0b";
    return "#ef4444";
  };

  const tierColor = (matched, total) => {
    if (!total) return "#22c55e";
    const r = matched / total;
    if (r >= 0.8) return "#22c55e";
    if (r >= 0.5) return "#f59e0b";
    return "#ef4444";
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
          <div className="score-main" style={{ color: scoreColor(score.overall) }}>
            {score.overall}% ATS Match
          </div>

          <div className="score-breakdown">
            <span>
              Tier 1 (Required):{" "}
              <strong style={{ color: tierColor(score.tier1.matched, score.tier1.total) }}>
                {score.tier1.matched}/{score.tier1.total}
              </strong>
            </span>
            <span>
              Tier 2 (Nice-to-have):{" "}
              <strong style={{ color: tierColor(score.tier2.matched, score.tier2.total) }}>
                {score.tier2.matched}/{score.tier2.total}
              </strong>
            </span>
            <span>
              Tier 3 (Context):{" "}
              <strong>
                {score.tier3.matched}/{score.tier3.total}
              </strong>
            </span>
          </div>

          {score.tier1.missing.length > 0 && (
            <div className="missing-keywords">
              <span className="missing-label">⚠️ Missing Required:</span>
              {score.tier1.missing.map(w => (
                <span key={w} className="keyword-tag red">{w}</span>
              ))}
            </div>
          )}

          {score.tier2.missing.length > 0 && (
            <div className="missing-keywords">
              <span className="missing-label">💡 Missing Nice-to-have:</span>
              {score.tier2.missing.map(w => (
                <span key={w} className="keyword-tag yellow">{w}</span>
              ))}
            </div>
          )}

          {score.skillWarnings?.length > 0 && (
            <div className="missing-keywords" style={{
              marginTop: "0.75rem",
              padding: "0.75rem",
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              borderRadius: "6px"
            }}>
              <span className="missing-label" style={{ color: "#c2410c", fontWeight: 600 }}>
                ⚠️ Verify before submitting — AI added these, make sure you can back them up:
              </span>
              <div style={{ marginTop: "0.4rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {score.skillWarnings.map(w => (
                  <span key={w} className="keyword-tag red">{w}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showDiff && score?.diff && (
        <div style={{
          marginBottom: "1rem",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          overflow: "hidden",
          fontSize: "0.82rem",
        }}>
          <div style={{
            padding: "0.75rem 1rem",
            background: "#f3f4f6",
            fontWeight: 600,
            fontSize: "0.9rem",
            borderBottom: "1px solid #e5e7eb",
            color: "#111827",
          }}>
            What changed
          </div>

          {score.diff.length === 0 ? (
            <p style={{ padding: "1rem", color: "#6b7280" }}>No changes detected.</p>
          ) : (
            score.diff.map((section, i) => {
              // Find words in "after" that are NOT in "before"
              const beforeWords = new Set(section.original.toLowerCase().split(/\s+/));
              const highlightNew = (text) => {
                return text.split(/\s+/).map((word, wi) => {
                  const clean = word.toLowerCase().replace(/[^a-z0-9]/g, "");
                  const isNew = clean.length > 3 && !beforeWords.has(word.toLowerCase()) && !beforeWords.has(clean);
                  return (
                    <span key={wi} style={{
                      background: isNew ? "#bbf7d0" : "transparent",
                      color: "#111827",
                      borderRadius: "2px",
                      padding: isNew ? "0 2px" : "0",
                    }}>
                      {word}{" "}
                    </span>
                  );
                });
              };

              return (
                <div key={i} style={{ borderBottom: i < score.diff.length - 1 ? "1px solid #e5e7eb" : "none" }}>
                  <div style={{
                    padding: "0.5rem 1rem",
                    background: "#f9fafb",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    color: "#374151",
                    borderBottom: "1px solid #e5e7eb",
                  }}>
                    📌 {section.name}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                    {/* BEFORE */}
                    <div style={{
                      padding: "0.75rem",
                      borderRight: "1px solid #e5e7eb",
                      whiteSpace: "pre-wrap",
                      lineHeight: "1.7",
                      color: "#374151",
                      fontFamily: "monospace",
                      overflowY: "auto",
                      maxHeight: "220px",
                      background: "#ffffff",
                    }}>
                      <div style={{ fontWeight: 600, marginBottom: "0.4rem", color: "#6b7280", fontFamily: "sans-serif", fontSize: "0.75rem" }}>BEFORE</div>
                      {section.original}
                    </div>
                    {/* AFTER — highlight new words in green */}
                    <div style={{
                      padding: "0.75rem",
                      whiteSpace: "pre-wrap",
                      lineHeight: "1.7",
                      color: "#111827",
                      fontFamily: "monospace",
                      overflowY: "auto",
                      maxHeight: "220px",
                      background: "#ffffff",
                    }}>
                      <div style={{ fontWeight: 600, marginBottom: "0.4rem", color: "#15803d", fontFamily: "sans-serif", fontSize: "0.75rem" }}>AFTER</div>
                      {section.updated.split("\n").map((line, li) => (
                        <div key={li}>{highlightNew(line)}</div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
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