import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface ConfettiCanvasHandle {
  burst: (x?: number, y?: number, count?: number) => void;
  celebrate: () => void;
  showerHearts: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  g: number;
  w: number;
  h: number;
  r: number;
  vr: number;
  color: string;
  kind: 'rect' | 'circle' | 'star' | 'heart';
  life: number;
  maxLife: number;
}

export const ConfettiCanvas = forwardRef<ConfettiCanvasHandle>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const colors = ['#ff6fa5', '#ffd84a', '#6fe3c1', '#5cc8ff', '#b79cff', '#ff9d5c'];

  const spawnParticles = (
    count: number,
    x: number,
    y: number,
    angle: number,
    spread: number,
    power: number,
    kinds: ('rect' | 'circle' | 'star' | 'heart')[] = ['rect', 'circle', 'star', 'heart'],
    gravity = 800
  ) => {
    for (let i = 0; i < count; i++) {
      const a = angle + (Math.random() - 0.5) * spread;
      const sp = power * (0.45 + Math.random() * 0.65);
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        g: gravity,
        w: 8 + Math.random() * 8,
        h: 10 + Math.random() * 8,
        r: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 12,
        color: colors[i % colors.length],
        kind: kinds[i % kinds.length],
        life: 0,
        maxLife: 2.2 + Math.random() * 1.5,
      });
    }

    if (!rafRef.current) {
      lastTimeRef.current = performance.now();
      loop(lastTimeRef.current);
    }
  };

  const loop = (t: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dt = Math.min(0.05, (t - lastTimeRef.current) / 1000);
    lastTimeRef.current = t;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife && p.y < height + 50);

    for (const p of particlesRef.current) {
      p.life += dt;
      p.vy += p.g * dt;
      p.vx *= 1 - 1.2 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.r += p.vr * dt;

      ctx.save();
      const alpha = Math.max(0, Math.min(1, (p.maxLife - p.life) / 0.5));
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.color;
      ctx.strokeStyle = '#2a1a4a';
      ctx.lineWidth = 1.5;

      if (p.kind === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (p.kind === 'heart') {
        const s = p.w * 0.08;
        ctx.scale(s, s);
        ctx.beginPath();
        ctx.moveTo(0, 15);
        ctx.bezierCurveTo(-15, 0, -20, -15, 0, -25);
        ctx.bezierCurveTo(20, -15, 15, 0, 0, 15);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.strokeRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    }

    if (particlesRef.current.length > 0) {
      rafRef.current = requestAnimationFrame(loop);
    } else {
      ctx.clearRect(0, 0, width, height);
      rafRef.current = 0;
    }
  };

  useImperativeHandle(ref, () => ({
    burst: (x, y, count = 40) => {
      const cx = x ?? window.innerWidth / 2;
      const cy = y ?? window.innerHeight / 2;
      spawnParticles(count, cx, cy, -Math.PI / 2, 2.2, 700);
    },
    celebrate: () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      spawnParticles(60, 0, h, -Math.PI / 3, 0.6, 1200);
      spawnParticles(60, w, h, (-2 * Math.PI) / 3, 0.6, 1200);
      setTimeout(() => spawnParticles(70, w / 2, h * 0.5, -Math.PI / 2, 1.8, 900), 250);
    },
    showerHearts: () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          const rx = (0.15 + Math.random() * 0.7) * w;
          spawnParticles(16, rx, h + 10, -Math.PI / 2, 0.8, 950, ['heart', 'star'], 500);
        }, i * 220);
      }
    },
  }));

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40 w-full h-full"
      aria-hidden="true"
    />
  );
});

ConfettiCanvas.displayName = 'ConfettiCanvas';
