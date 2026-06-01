import { useEffect, useRef } from "react";

export default function ScoreRing({ score, color }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const SIZE = 148;
    const DPR = window.devicePixelRatio || 1;
    canvas.width = SIZE * DPR;
    canvas.height = SIZE * DPR;
    canvas.style.width = SIZE + "px";
    canvas.style.height = SIZE + "px";
    ctx.scale(DPR, DPR);

    const cx = SIZE / 2, cy = SIZE / 2, R = 56, LW = 9;
    const target = score / 100;
    let current = 0;
    let animId;

    const hex = color === "var(--green)" ? "#22c55e"
              : color === "var(--amber)" ? "#fbbf24"
              : "#ef4444";
    const glow = color === "var(--green)" ? "rgba(34,197,94,0.6)"
               : color === "var(--amber)" ? "rgba(251,191,36,0.6)"
               : "rgba(239,68,68,0.6)";

    function draw(frac) {
      ctx.clearRect(0, 0, SIZE, SIZE);

      ctx.beginPath();
      ctx.arc(cx, cy, R + 14, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.lineWidth = LW;
      ctx.lineCap = "round";
      ctx.stroke();

      if (frac > 0.01) {
        ctx.save();
        ctx.shadowColor = glow;
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac);
        ctx.strokeStyle = hex;
        ctx.lineWidth = LW;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();

        ctx.beginPath();
        ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac);
        ctx.strokeStyle = hex;
        ctx.lineWidth = LW;
        ctx.lineCap = "round";
        ctx.stroke();

        const angle = -Math.PI / 2 + Math.PI * 2 * frac;
        const dx = cx + Math.cos(angle) * R;
        const dy = cy + Math.sin(angle) * R;
        ctx.beginPath();
        ctx.arc(dx, dy, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.shadowColor = glow;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = hex;
      ctx.font = `bold ${SIZE * 0.2}px 'JetBrains Mono', monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = glow;
      ctx.shadowBlur = 14;
      ctx.fillText(`${Math.round(frac * 100)}%`, cx, cy - 7);
      ctx.shadowBlur = 0;

      ctx.fillStyle = "rgba(148,163,184,0.75)";
      ctx.font = `500 10px 'Syne', sans-serif`;
      ctx.fillText("ATS MATCH", cx, cy + 13);
    }

    function animate() {
      current += (target - current) * 0.055;
      draw(current);
      if (Math.abs(target - current) > 0.001) {
        animId = requestAnimationFrame(animate);
      } else {
        draw(target);
      }
    }
    animate();
    return () => cancelAnimationFrame(animId);
  }, [score, color]);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
}