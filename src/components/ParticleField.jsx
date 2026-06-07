import { useEffect, useRef } from "react";

export default function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let W, H;
    const particles = [];
    let shootingStar = null;
    let shootTimer = 0;
    let mouse = { x: -9999, y: -9999 };
    let frame = 0;

    // Planets — fixed positions, drawn once
    const PLANETS = [
      { xPct: 0.88, yPct: 0.14, r: 22, color: "#1a0a3a", ring: true,  ringColor: "rgba(123,47,255,0.35)", tilt: 0.38 },
      { xPct: 0.07, yPct: 0.78, r: 14, color: "#0a1f2a", ring: false, glow: "rgba(0,212,255,0.3)" },
      { xPct: 0.92, yPct: 0.65, r: 9,  color: "#1a0f08", ring: false, glow: "rgba(255,107,53,0.25)" },
    ];

    // Mini galaxies — spiral arms
    const GALAXIES = [
      { xPct: 0.15, yPct: 0.2,  arms: 3, armLen: 55, particles: 70,  hue: "0,245,212", alpha: 0.18 },
      { xPct: 0.82, yPct: 0.82, arms: 2, armLen: 40, particles: 50,  hue: "123,47,255", alpha: 0.14 },
    ];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function rand(a, b) { return Math.random() * (b - a) + a; }

    // Pre-build galaxy point lists
    const galaxyPoints = GALAXIES.map(g => {
      const pts = [];
      for (let i = 0; i < g.particles; i++) {
        const arm = Math.floor(Math.random() * g.arms);
        const t = Math.random();
        const angle = arm * (Math.PI * 2 / g.arms) + t * Math.PI * 2.2;
        const spread = rand(-12, 12);
        const dist = t * g.armLen;
        pts.push({
          x: Math.cos(angle) * dist + spread * (1 - t),
          y: Math.sin(angle) * dist * 0.5 + spread * 0.5 * (1 - t),
          r: rand(0.5, 1.8),
          alpha: rand(0.3, 1) * g.alpha,
        });
      }
      return pts;
    });

    function drawGalaxies() {
      GALAXIES.forEach((g, gi) => {
        const cx = g.xPct * W;
        const cy = g.yPct * H;
        const rot = frame * 0.0003 * (gi % 2 === 0 ? 1 : -1);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);

        // Core glow
        const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 18);
        coreGrad.addColorStop(0, `rgba(${g.hue},${g.alpha * 3})`);
        coreGrad.addColorStop(1, `rgba(${g.hue},0)`);
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();

        galaxyPoints[gi].forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${g.hue},${p.alpha})`;
          ctx.fill();
        });
        ctx.restore();
      });
    }

    function drawPlanets() {
      PLANETS.forEach(p => {
        const x = p.xPct * W;
        const y = p.yPct * H;

        // Outer atmosphere glow
        if (p.glow) {
          const grad = ctx.createRadialGradient(x, y, p.r * 0.8, x, y, p.r * 2.5);
          grad.addColorStop(0, p.glow);
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.beginPath();
          ctx.arc(x, y, p.r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Planet body
        const bodyGrad = ctx.createRadialGradient(x - p.r * 0.28, y - p.r * 0.28, 0, x, y, p.r);
        bodyGrad.addColorStop(0, lighten(p.color, 0.3));
        bodyGrad.addColorStop(1, p.color);
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = bodyGrad;
        ctx.fill();

        // Surface shimmer line
        ctx.beginPath();
        ctx.arc(x - p.r * 0.1, y - p.r * 0.4, p.r * 0.65, Math.PI * 1.15, Math.PI * 1.85);
        ctx.strokeStyle = "rgba(255,255,255,0.07)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Ring
        if (p.ring) {
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(1, p.tilt);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r * 2.2, p.r * 0.6, 0, 0, Math.PI * 2);
          ctx.strokeStyle = p.ringColor;
          ctx.lineWidth = 3;
          ctx.stroke();
          // Inner ring
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r * 1.65, p.r * 0.4, 0, 0, Math.PI * 2);
          ctx.strokeStyle = p.ringColor.replace("0.35", "0.15");
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();

          // Re-draw planet front half to cover ring
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, p.r, 0, Math.PI * 2);
          ctx.clip();
          ctx.beginPath();
          ctx.arc(x, y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = bodyGrad;
          ctx.fill();
          ctx.restore();
        }
      });
    }

    function lighten(hex, amt) {
      const n = parseInt(hex.replace("#", ""), 16);
      const r = Math.min(255, ((n >> 16) & 0xff) + Math.round(amt * 80));
      const g = Math.min(255, ((n >> 8)  & 0xff) + Math.round(amt * 80));
      const b = Math.min(255, (n & 0xff) + Math.round(amt * 80));
      return `rgb(${r},${g},${b})`;
    }

    class Particle {
      constructor(init) { this.reset(init); }
      reset(init) {
        this.x = rand(0, W);
        this.y = init ? rand(0, H) : rand(0, H);
        this.r = rand(0.4, 2.4);
        this.vx = rand(-0.1, 0.1);
        this.vy = rand(-0.18, -0.04);
        this.baseAlpha = rand(0.08, 0.6);
        this.alpha = this.baseAlpha;
        this.pulse = rand(0, Math.PI * 2);
        this.pulseSpeed = rand(0.012, 0.04);
        this.type = Math.random(); // 0-0.58 white, 0.58-0.82 cyan, 0.82-1 purple
        this.scattered = false;
        this.scatterVx = 0;
        this.scatterVy = 0;
      }
      tick() {
        this.pulse += this.pulseSpeed;
        this.alpha = this.baseAlpha + Math.sin(this.pulse) * 0.1;

        // Mouse repulsion
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const REPEL = 130;

        if (dist < REPEL) {
          const force = Math.pow((REPEL - dist) / REPEL, 1.6) * 2.8;
          this.scatterVx += (dx / dist) * force;
          this.scatterVy += (dy / dist) * force;
          this.scattered = true;
        }

        // Dampen scatter
        this.scatterVx *= 0.88;
        this.scatterVy *= 0.88;

        this.x += this.vx + this.scatterVx;
        this.y += this.vy + this.scatterVy;

        if (this.y < -8 || this.x < -40 || this.x > W + 40) this.reset(false);
      }
      draw() {
        const a = Math.max(0.02, Math.min(0.8, this.alpha));
        let color;
        if (this.type < 0.58)      color = `rgba(210,235,255,${a})`;
        else if (this.type < 0.82) color = `rgba(0,245,212,${a})`;
        else                       color = `rgba(160,100,255,${a})`;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Glow halo on larger colored stars
        if (this.type > 0.58 && this.r > 1.3) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.r * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = this.type < 0.82
            ? `rgba(0,245,212,${a * 0.12})`
            : `rgba(160,100,255,${a * 0.12})`;
          ctx.fill();
        }
      }
    }

    function drawConnections() {
      const MAX = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX) {
            const alpha = (1 - d / MAX) * 0.08;
            const bothCyan = a.type > 0.58 && a.type < 0.82 && b.type > 0.58 && b.type < 0.82;
            const bothPurp = a.type > 0.82 && b.type > 0.82;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = bothCyan
              ? `rgba(0,245,212,${alpha})`
              : bothPurp
              ? `rgba(160,100,255,${alpha})`
              : `rgba(150,200,220,${alpha * 0.55})`;
            ctx.lineWidth = 0.55;
            ctx.stroke();
          }
        }
      }
    }

    function spawnShoot() {
      const fromLeft = Math.random() > 0.5;
      shootingStar = {
        x: fromLeft ? rand(W * 0.05, W * 0.4) : rand(W * 0.6, W * 0.95),
        y: rand(H * 0.02, H * 0.32),
        len: rand(130, 280),
        speed: rand(14, 26),
        angle: (fromLeft ? rand(-20, 20) : rand(160, 200)) * (Math.PI / 180),
        alpha: 1,
        type: Math.random() > 0.45 ? "cyan" : "white",
        width: rand(1, 2.2),
      };
    }

    function drawShoot() {
      if (!shootingStar) return;
      const s = shootingStar;
      const tx = s.x - Math.cos(s.angle) * s.len;
      const ty = s.y - Math.sin(s.angle) * s.len;
      const g = ctx.createLinearGradient(s.x, s.y, tx, ty);
      if (s.type === "cyan") {
        g.addColorStop(0, `rgba(0,245,212,${s.alpha})`);
        g.addColorStop(0.25, `rgba(0,212,255,${s.alpha * 0.55})`);
        g.addColorStop(1, "rgba(0,245,212,0)");
      } else {
        g.addColorStop(0, `rgba(255,255,255,${s.alpha})`);
        g.addColorStop(0.35, `rgba(200,225,255,${s.alpha * 0.4})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
      }
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(tx, ty);
      ctx.strokeStyle = g;
      ctx.lineWidth = s.width;
      ctx.stroke();

      // Tip flare
      const flareSz = 3.5 * (0.7 + Math.sin(frame * 0.3) * 0.3);
      ctx.beginPath();
      ctx.arc(s.x, s.y, flareSz, 0, Math.PI * 2);
      ctx.fillStyle = s.type === "cyan"
        ? `rgba(0,245,212,${s.alpha})`
        : `rgba(255,255,255,${s.alpha})`;
      ctx.shadowColor = s.type === "cyan" ? "#00f5d4" : "#ffffff";
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.alpha -= 0.016;
      if (s.alpha <= 0 || s.x > W + 250 || s.y > H + 250 || s.x < -250) shootingStar = null;
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    // 220 particles — plenty to see scattering
    for (let i = 0; i < 220; i++) particles.push(new Particle(true));

    function loop() {
      ctx.clearRect(0, 0, W, H);
      drawGalaxies();
      drawPlanets();
      drawConnections();
      for (const p of particles) { p.tick(); p.draw(); }
      shootTimer++;
      if (!shootingStar && shootTimer > 180 && Math.random() < 0.01) {
        spawnShoot();
        shootTimer = 0;
      }
      drawShoot();
      frame++;
      animId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
    />
  );
}