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

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function rand(a, b) { return Math.random() * (b - a) + a; }

    class Star {
      constructor(init) { this.reset(init); }
      reset(init) {
        this.x = rand(0, W);
        this.y = init ? rand(0, H) : H + 5;
        this.r = rand(0.3, 1.8);
        this.vy = rand(0.08, 0.35);
        this.vx = rand(-0.08, 0.08);
        this.alpha = rand(0.1, 0.65);
        this.da = rand(0.002, 0.006) * (Math.random() > 0.5 ? 1 : -1);
        this.orange = Math.random() > 0.78;
      }
      tick() {
        this.y -= this.vy;
        this.x += this.vx;
        this.alpha += this.da;
        if (this.alpha < 0.05 || this.alpha > 0.7) this.da *= -1;
        if (this.y < -5) this.reset(false);
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.orange
          ? `rgba(249,115,22,${this.alpha})`
          : `rgba(255,255,255,${this.alpha})`;
        ctx.fill();
      }
    }

    function spawnShoot() {
      shootingStar = {
        x: rand(W * 0.05, W * 0.75),
        y: rand(H * 0.02, H * 0.35),
        len: rand(90, 200),
        speed: rand(10, 18),
        angle: rand(22, 48) * (Math.PI / 180),
        alpha: 1,
      };
    }

    function drawShoot() {
      if (!shootingStar) return;
      const s = shootingStar;
      const tx = s.x - Math.cos(s.angle) * s.len;
      const ty = s.y - Math.sin(s.angle) * s.len;
      const g = ctx.createLinearGradient(s.x, s.y, tx, ty);
      g.addColorStop(0, `rgba(255,255,255,${s.alpha})`);
      g.addColorStop(0.35, `rgba(249,115,22,${s.alpha * 0.55})`);
      g.addColorStop(1, `rgba(249,115,22,0)`);
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(tx, ty);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.alpha -= 0.022;
      if (s.alpha <= 0 || s.x > W + 100 || s.y > H + 100) shootingStar = null;
    }

    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 130; i++) particles.push(new Star(true));

    function loop() {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) { p.tick(); p.draw(); }
      shootTimer++;
      if (!shootingStar && shootTimer > 280 && Math.random() < 0.006) {
        spawnShoot();
        shootTimer = 0;
      }
      drawShoot();
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