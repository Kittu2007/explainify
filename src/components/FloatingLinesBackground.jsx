import { useEffect, useRef } from "react";

export default function FloatingLinesBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    
    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();

    // Create floating points
    const points = Array.from({ length: 25 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 1,
    }));

    const animate = () => {
      // Clear canvas with transparency
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw points
      points.forEach((point, i) => {
        // Update position
        point.x += point.vx;
        point.y += point.vy;

        // Bounce off walls
        if (point.x - point.radius < 0 || point.x + point.radius > canvas.width) point.vx *= -1;
        if (point.y - point.radius < 0 || point.y + point.radius > canvas.height) point.vy *= -1;

        // Clamp position
        point.x = Math.max(point.radius, Math.min(canvas.width - point.radius, point.x));
        point.y = Math.max(point.radius, Math.min(canvas.height - point.radius, point.y));

        // Draw point
        ctx.fillStyle = `rgba(139, 92, 246, 0.25)`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw lines to nearby points
        for (let j = i + 1; j < points.length; j++) {
          const other = points[j];
          const dist = Math.hypot(point.x - other.x, point.y - other.y);

          if (dist < 150) {
            const opacity = 0.15 * (1 - dist / 150);
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ background: "transparent" }}
    />
  );
}
