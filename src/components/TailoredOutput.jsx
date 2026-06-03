import { useState, useRef } from "react";
import ScoreRing from "./ScoreRing";
import CoverLetter from "./CoverLetter";

function TailoredOutput({ tailoredLatex, score, jd }) {
  const [showDiff, setShowDiff] = useState(false);
  const [activeTab, setActiveTab] = useState("resume");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tailoredLatex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const tierPct = (matched, total) => total ? Math.round((matched / total) * 100) : 0;

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
    <div className="card result-card">

      {/* Tab bar */}
      <div className="output-tabs">
        <button
          className={`tab-btn ${activeTab === "resume" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("resume")}
        >
          ✦ Resume
        </button>
        <button
          className={`tab-btn ${activeTab === "cover" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("cover")}
        >
          ✉ Cover Letter
        </button>
      </div>

      {/* Cover Letter Tab */}
      {activeTab === "cover" && (
        <CoverLetter jd={jd} tailoredLatex={tailoredLatex} />
      )}

      {/* Resume Tab */}
      {activeTab === "resume" && (
        <>
          <div className="card-header" style={{ marginTop: "1rem" }}>
            <h2>Tailored Resume</h2>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn-secondary" onClick={() => setShowDiff(!showDiff)}>
                {showDiff ? "Hide Changes" : "Show Changes"}
              </button>
              <button
                className={`btn-secondary btn-copy ${copied ? "btn-copied" : ""}`}
                onClick={handleCopy}
              >
                {copied ? "✓ Copied!" : "Copy LaTeX"}
              </button>
            </div>
          </div>

          {/* Score Panel */}
          {score && (
            <div className="score-panel">
              <div className="score-layout">
                <div className="score-ring-wrap">
                  <ScoreRing score={score.overall} color={scoreColor(score.overall)} />
                </div>
                <div className="score-details">
                  <div className="score-breakdown">
                    <div className="score-row">
                      <span className="score-row-label">T1 Required</span>
                      <div className="score-bar-track">
                        <div className="score-bar-fill" style={{
                          width: `${tierPct(score.tier1.matched, score.tier1.total)}%`,
                          background: tierColor(score.tier1.matched, score.tier1.total),
                        }} />
                      </div>
                      <span style={{ fontSize: "0.72rem", fontFamily: "JetBrains Mono, monospace", color: tierColor(score.tier1.matched, score.tier1.total), minWidth: "36px", textAlign: "right" }}>
                        {score.tier1.matched}/{score.tier1.total}
                      </span>
                    </div>
                    <div className="score-row">
                      <span className="score-row-label">T2 Nice-to-have</span>
                      <div className="score-bar-track">
                        <div className="score-bar-fill" style={{
                          width: `${tierPct(score.tier2.matched, score.tier2.total)}%`,
                          background: tierColor(score.tier2.matched, score.tier2.total),
                        }} />
                      </div>
                      <span style={{ fontSize: "0.72rem", fontFamily: "JetBrains Mono, monospace", color: tierColor(score.tier2.matched, score.tier2.total), minWidth: "36px", textAlign: "right" }}>
                        {score.tier2.matched}/{score.tier2.total}
                      </span>
                    </div>
                    <div className="score-row">
                      <span className="score-row-label">T3 Context</span>
                      <div className="score-bar-track">
                        <div className="score-bar-fill" style={{
                          width: `${tierPct(score.tier3.matched, score.tier3.total)}%`,
                          background: "var(--text-dim)",
                        }} />
                      </div>
                      <span style={{ fontSize: "0.72rem", fontFamily: "JetBrains Mono, monospace", color: "var(--text-muted)", minWidth: "36px", textAlign: "right" }}>
                        {score.tier3.matched}/{score.tier3.total}
                      </span>
                    </div>
                  </div>

                  {score.tier1.missing.length > 0 && (
                    <div className="missing-keywords">
                      <span className="missing-label">⚠ Missing Required</span>
                      {score.tier1.missing.map(w => (
                        <span key={w} className="keyword-tag red">{w}</span>
                      ))}
                    </div>
                  )}

                  {score.tier2.missing.length > 0 && (
                    <div className="missing-keywords">
                      <span className="missing-label">◆ Missing Nice-to-have</span>
                      {score.tier2.missing.map(w => (
                        <span key={w} className="keyword-tag yellow">{w}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {score.skillWarnings?.length > 0 && (
                <div className="verify-warning">
                  <span className="verify-warning-label">
                    ⚠ Verify before submitting — AI added these:
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
                <div style={{ padding: "1rem", color: "var(--text-dim)", fontFamily: "JetBrains Mono, monospace", fontSize: "0.8rem" }}>
                  No changes detected.
                </div>
              ) : (
                score.diff.map((section, i) => {
                  const beforeWords = new Set(section.original.toLowerCase().split(/\s+/));
                  return (
                    <div key={i} style={{ borderBottom: i < score.diff.length - 1 ? "1px solid rgba(249,115,22,0.08)" : "none" }}>
                      <div className="diff-section-title">◆ {section.name}</div>
                      <div className="diff-columns">
                        <div className="diff-col diff-col-before">
                          <span className="diff-col-label">BEFORE</span>
                          {section.original || <span style={{ color: "var(--text-dim)", fontStyle: "italic" }}>— empty —</span>}
                        </div>
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
          <div className="latex-wrap">
            <div className="latex-label">LaTeX Output</div>
            <textarea ref={textareaRef} value={tailoredLatex} readOnly rows={20} />
          </div>
        </>
      )}

    </div>
  );
}

export default TailoredOutput;