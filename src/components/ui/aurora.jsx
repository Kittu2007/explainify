import { useEffect, useRef } from "react";

// Enhanced Aurora animated background
export default function Aurora() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // More vibrant Aurora blobs with better colors
    const blobs = [
      { x: width * 0.2, y: height * 0.3, r: 300, color: "rgba(139,92,246,0.25)", dx: 0.3, dy: 0.2 },
      { x: width * 0.8, y: height * 0.5, r: 250, color: "rgba(59,130,246,0.22)", dx: -0.4, dy: 0.3 },
      { x: width * 0.6, y: height * 0.8, r: 200, color: "rgba(236,72,153,0.2)", dx: 0.2, dy: -0.25 },
      { x: width * 0.1, y: height * 0.7, r: 180, color: "rgba(34,197,94,0.18)", dx: 0.35, dy: 0.15 },
    ];

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Add a subtle gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "rgba(15, 23, 42, 0.9)");
      gradient.addColorStop(0.5, "rgba(30, 41, 59, 0.8)");
      gradient.addColorStop(1, "rgba(15, 23, 42, 0.9)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      blobs.forEach(blob => {
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        ctx.fillStyle = blob.color;
        ctx.shadowColor = blob.color;
        ctx.shadowBlur = 100;
        ctx.fill();
        blob.x += blob.dx;
        blob.y += blob.dy;
        if (blob.x < -blob.r || blob.x > width + blob.r) blob.dx *= -1;
        if (blob.y < -blob.r || blob.y > height + blob.r) blob.dy *= -1;
      });
      ctx.shadowBlur = 0;
      requestAnimationFrame(animate);
    }
    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" style={{ pointerEvents: "none" }} />
  );
}
