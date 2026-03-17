"use client";
import { useRef, useEffect } from 'react';

/**
 * ClickSparkButton - Button component with ClickSpark animation
 * Creates custom particle effects on click using canvas
 */
export default function ClickSparkButton({
  children,
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  ...props
}) {
  const buttonRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Create canvas for particle effects
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d');
    const particles = [];

    // Particle class
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8 - 2;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.015;
        this.radius = Math.random() * 3 + 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // gravity
        this.life -= this.decay;
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = '#3B82F6';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Animation loop
    let animationFrameId = null;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);

        if (particles[i].life <= 0) {
          particles.splice(i, 1);
        }
      }

      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    const button = buttonRef.current;
    if (!button) return;

    const handleClick = (e) => {
      // Create particles at click position
      for (let i = 0; i < 15; i++) {
        particles.push(new Particle(e.clientX, e.clientY));
      }

      // Start animation
      animate();

      // Call the original onClick handler
      if (onClick) {
        onClick(e);
      }
    };

    button.addEventListener('click', handleClick);

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      button.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [onClick]);

  return (
    <button
      ref={buttonRef}
      type={type}
      className={className}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
