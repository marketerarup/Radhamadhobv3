import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  baseSize: number;
  speedX: number;
  speedY: number;
  opacity: number;
  maxOpacity: number;
  pulseSpeed: number;
  colorType: 'gold' | 'amber' | 'crimson' | 'emerald';
}

export const Cinematic3DCanvas: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates for subtle 3D parallax
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Initialize 3D particles with z-depth
    const particleCount = Math.min(65, Math.floor((width * height) / 22000));
    const particles: Particle[] = [];

    const colors = {
      gold: '212, 175, 55',
      amber: '253, 230, 138',
      crimson: '204, 0, 0',
      emerald: '15, 81, 50',
    };

    for (let i = 0; i < particleCount; i++) {
      const typeRand = Math.random();
      const colorType: 'gold' | 'amber' | 'crimson' | 'emerald' =
        typeRand < 0.65 ? 'gold' : typeRand < 0.85 ? 'amber' : typeRand < 0.95 ? 'crimson' : 'emerald';

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.8 + 0.2, // 3D depth layer
        size: Math.random() * 2.2 + 0.8,
        baseSize: Math.random() * 2.2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: -Math.random() * 0.45 - 0.1, // gently rising like sacred embers
        opacity: Math.random() * 0.5 + 0.1,
        maxOpacity: Math.random() * 0.5 + 0.3,
        pulseSpeed: Math.random() * 0.015 + 0.005,
        colorType,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.01;

      // Smooth mouse damping
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const parallaxX = (mouseX / width - 0.5) * 35;
      const parallaxY = (mouseY / height - 0.5) * 35;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle ambient volumetric light spots
      const grad1 = ctx.createRadialGradient(
        width * 0.25 - parallaxX * 0.5,
        height * 0.3 - parallaxY * 0.5,
        0,
        width * 0.25,
        height * 0.3,
        width * 0.45
      );
      grad1.addColorStop(0, 'rgba(153, 0, 0, 0.07)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(
        width * 0.75 + parallaxX * 0.5,
        height * 0.65 + parallaxY * 0.5,
        0,
        width * 0.75,
        height * 0.65,
        width * 0.5
      );
      grad2.addColorStop(0, 'rgba(212, 175, 55, 0.06)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw 3D Floating Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Motion
        p.x += p.speedX * p.z;
        p.y += p.speedY * p.z;

        // Wrap around screen
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Pulse opacity
        p.opacity += Math.sin(time * 2 + i) * p.pulseSpeed;
        const currentOpacity = Math.max(0.08, Math.min(p.maxOpacity, p.opacity));

        // Depth perspective calculation
        const px = p.x + parallaxX * p.z;
        const py = p.y + parallaxY * p.z;
        const currentSize = p.baseSize * p.z;

        // Glow ring
        ctx.beginPath();
        const rgb = colors[p.colorType];
        const glowGrad = ctx.createRadialGradient(
          px,
          py,
          0,
          px,
          py,
          currentSize * 3.5
        );
        glowGrad.addColorStop(0, `rgba(${rgb}, ${currentOpacity})`);
        glowGrad.addColorStop(0.5, `rgba(${rgb}, ${currentOpacity * 0.35})`);
        glowGrad.addColorStop(1, `rgba(${rgb}, 0)`);
        ctx.fillStyle = glowGrad;
        ctx.arc(px, py, currentSize * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Core star point
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.9})`;
        ctx.arc(px, py, Math.max(0.6, currentSize * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
    />
  );
};
