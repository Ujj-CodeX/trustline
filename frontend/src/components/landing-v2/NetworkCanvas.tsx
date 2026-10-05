"use client";

import { useEffect, useRef } from "react";

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

export default function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrame = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = String(width) + "px";
      canvas.style.height = String(height) + "px";
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const count = width < 640 ? 18 : width < 1024 ? 28 : 38;
    const nodes: NodePoint[] = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: reducedMotion ? 0 : (Math.random() - 0.5) * 0.08,
      vy: reducedMotion ? 0 : (Math.random() - 0.5) * 0.08,
      radius: index % 7 === 0 ? 1.8 : 1.15,
      alpha: 0.16 + Math.random() * 0.2,
      color: index % 5 === 0 ? "45,212,191" : "166,194,186",
    }));

    const render = () => {
      context.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 155) continue;

          const opacity = (1 - distance / 155) * 0.055;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.strokeStyle = "rgba(176, 204, 198, " + String(opacity) + ")";
          context.lineWidth = 0.7;
          context.stroke();
        }
      }

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < -20 || node.x > width + 20) node.vx *= -1;
        if (node.y < -20 || node.y > height + 20) node.vy *= -1;

        const gradient = context.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          8
        );

        gradient.addColorStop(
          0,
          "rgba(" + node.color + ", " + String(node.alpha * 1.5) + ")"
        );
        gradient.addColorStop(1, "rgba(" + node.color + ", 0)");

        context.fillStyle = gradient;
        context.beginPath();
        context.arc(node.x, node.y, 8, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = "rgba(" + node.color + ", " + String(node.alpha) + ")";
        context.beginPath();
        context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        context.fill();
      }

      if (!reducedMotion) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-80"
    />
  );
}
