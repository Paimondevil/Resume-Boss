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
        <div className="resume-tab-content">

          {/* Side-by-side layout */}
          <div className="resume-split">

            {/* LEFT: Score Panel */}
            <div className="split-left">
              <div className="split-label">ATS Score</div>

              {score && (
                <div className="score-panel-left">
                  <div className="score-ring-center">
                    <ScoreRing score={score.overall} color={scoreColor(score.overall)} />
                  </div>

                  <div className="score-breakdown">
                    {[
                      { label: "T1 Required",     ...score.tier1, dimBar: false },
                      { label: "T2 Nice-to-have", ...score.tier2, dimBar: false },
                      { label: "T3 Context",      ...score.tier3, dimBar: true  },
                    ].map(({ label, matched, total, dimBar }) => (
                      <div className="score-row" key={label}>
                        <span className="score-row-label">{label}</span>
                        <div className="score-bar-track">
                          <div className="score-bar-fill" style={{
                            width: `${tierPct(matched, total)}%`,
                            background: dimBar ? "var(--text-dim)" : tierColor(matched, total),
                            color:       dimBar ? "var(--text-dim)" : tierColor(matched, total),
                          }} />
                        </div>
                        <span style={{
                          fontSize: "0.65rem",
                          fontFamily: "Space Mono, monospace",
                          color: dimBar ? "var(--text-muted)" : tierColor(matched, total),
                          minWidth: "36px",
                          textAlign: "right",
                        }}>
                          {matched}/{total}
                        </span>
                      </div>
                    ))}
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

                  {score.skillWarnings?.length > 0 && (
                    <div className="verify-warning">
                      <span className="verify-warning-label">⚠ Verify before submitting</span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                        {score.skillWarnings.map(w => (
                          <span key={w} className="keyword-tag red">{w}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Diff toggle */}
                  <button
                    className="btn-secondary diff-toggle-btn"
                    onClick={() => setShowDiff(!showDiff)}
                    style={{ marginTop: "1rem", width: "100%" }}
                  >
                    {showDiff ? "▲ Hide Changes" : "▼ Show Changes"}
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT: LaTeX output with scan line */}
            <div className="split-right">
              <div className="split-right-header">
                <span className="split-label">LaTeX Output</span>
                <button
                  className={`btn-secondary btn-copy ${copied ? "btn-copied" : ""}`}
                  onClick={handleCopy}
                >
                  {copied ? "✓ Copied!" : "Copy LaTeX"}
                </button>
              </div>
              <div className="latex-panel">
                <div className="latex-scan-line" />
                <textarea
                  ref={textareaRef}
                  value={tailoredLatex}
                  readOnly
                  rows={28}
                  className="latex-output"
                />
              </div>
            </div>
          </div>

          {/* Diff Viewer (full width, below) */}
          {showDiff && score?.diff && (
            <div className="diff-container" style={{ marginTop: "1.5rem" }}>
              <div className="diff-header">// WHAT CHANGED</div>
              {score.diff.length === 0 ? (
                <div style={{ padding: "1rem", color: "var(--text-dim)", fontFamily: "Space Mono, monospace", fontSize: "0.8rem" }}>
                  No changes detected.
                </div>
              ) : (
                score.diff.map((section, i) => {
                  const beforeWords = new Set(section.original.toLowerCase().split(/\s+/));
                  return (
                    <div key={i} style={{ borderBottom: i < score.diff.length - 1 ? "1px solid rgba(0,245,212,0.06)" : "none" }}>
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
        </div>
      )}
    </div>
  );
}

export default TailoredOutput;