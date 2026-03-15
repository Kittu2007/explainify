import { useEffect, useRef } from "react";

// Simple Aurora animated background (React Bits style)
export default function Aurora() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Aurora blobs
    const blobs = [
      { x: width * 0.3, y: height * 0.4, r: 220, color: "rgba(139,92,246,0.18)", dx: 0.4, dy: 0.2 },
      { x: width * 0.7, y: height * 0.6, r: 180, color: "rgba(59,130,246,0.15)", dx: -0.3, dy: 0.2 },
      { x: width * 0.5, y: height * 0.7, r: 160, color: "rgba(236,72,153,0.13)", dx: 0.2, dy: -0.3 },
    ];

    function animate() {
      ctx.clearRect(0, 0, width, height);
      blobs.forEach(blob => {
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        ctx.fillStyle = blob.color;
        ctx.shadowColor = blob.color;
        ctx.shadowBlur = 80;
        ctx.fill();
        blob.x += blob.dx;
        blob.y += blob.dy;
        if (blob.x < 0 || blob.x > width) blob.dx *= -1;
        if (blob.y < 0 || blob.y > height) blob.dy *= -1;
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
