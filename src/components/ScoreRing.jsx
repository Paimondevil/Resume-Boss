import { useEffect, useRef } from "react";

export default function ScoreRing({ score, color }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const SIZE = 152;
    const DPR = window.devicePixelRatio || 1;
    canvas.width = SIZE * DPR;
    canvas.height = SIZE * DPR;
    canvas.style.width = SIZE + "px";
    canvas.style.height = SIZE + "px";
    ctx.scale(DPR, DPR);

    const cx = SIZE / 2, cy = SIZE / 2, R = 56, LW = 10;
    const target = score / 100;
    let current = 0;
    let animId;
    let pulse = 0;

    const hex   = color === "var(--green)" ? "#00f5a0"
                : color === "var(--amber)" ? "#ffcc44"
                : "#ff4d6d";
    const glow  = color === "var(--green)" ? "rgba(0,245,160,0.7)"
                : color === "var(--amber)" ? "rgba(255,204,68,0.7)"
                : "rgba(255,77,109,0.7)";
    const hex2  = color === "var(--green)" ? "#00d4ff"
                : color === "var(--amber)" ? "#ff9a44"
                : "#ff2d6d";

    function draw(frac) {
      ctx.clearRect(0, 0, SIZE, SIZE);
      pulse += 0.04;

      // Outer decorative ring
      ctx.beginPath();
      ctx.arc(cx, cy, R + 18, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,255,255,0.03)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Tick marks
      for (let i = 0; i < 36; i++) {
        const angle = (i / 36) * Math.PI * 2 - Math.PI / 2;
        const inner = R + 13, outer = R + 17;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
        ctx.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer);
        ctx.strokeStyle = i % 9 === 0
          ? `rgba(0,245,212,0.3)`
          : `rgba(255,255,255,0.06)`;
        ctx.lineWidth = i % 9 === 0 ? 1.5 : 0.5;
        ctx.stroke();
      }

      // Track
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = LW;
      ctx.lineCap = "round";
      ctx.stroke();

      if (frac > 0.005) {
        // Gradient arc
        const grad = ctx.createConicalGradient
          ? null
          : null;

        ctx.save();
        ctx.shadowColor = glow;
        ctx.shadowBlur = 22;

        // Multi-pass for thick glow
        for (let pass = 0; pass < 3; pass++) {
          ctx.beginPath();
          ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac);
          ctx.strokeStyle = pass === 0 ? glow : hex;
          ctx.lineWidth = pass === 0 ? LW + 8 : LW;
          ctx.globalAlpha = pass === 0 ? 0.15 : 1;
          ctx.lineCap = "round";
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.restore();

        // Animated tip dot
        const tipPulse = 1 + Math.sin(pulse) * 0.3;
        const angle = -Math.PI / 2 + Math.PI * 2 * frac;
        const dx = cx + Math.cos(angle) * R;
        const dy = cy + Math.sin(angle) * R;

        ctx.save();
        ctx.shadowColor = glow;
        ctx.shadowBlur = 20 * tipPulse;
        ctx.beginPath();
        ctx.arc(dx, dy, 5 * tipPulse, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.restore();
      }

      // Score text
      ctx.save();
      ctx.shadowColor = glow;
      ctx.shadowBlur = 20;
      ctx.fillStyle = hex;
      ctx.font = `700 ${SIZE * 0.21}px 'Space Mono', monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${Math.round(frac * 100)}%`, cx, cy - 8);
      ctx.restore();

      ctx.fillStyle = "rgba(107,138,154,0.8)";
      ctx.font = `500 9px 'Space Grotesk', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.letterSpacing = "2px";
      ctx.fillText("ATS MATCH", cx, cy + 12);
    }

    function animate() {
      current += (target - current) * 0.048;
      draw(current);
      if (Math.abs(target - current) > 0.0005) {
        animId = requestAnimationFrame(animate);
      } else {
        // Keep pulsing the tip
        function pulse_loop() {
          draw(target);
          animId = requestAnimationFrame(pulse_loop);
        }
        pulse_loop();
      }
    }
    animate();
    return () => cancelAnimationFrame(animId);
  }, [score, color]);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
}