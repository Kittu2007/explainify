"use client";
/**
 * GlowCursor ΓÇö React Bits-style cursor glow effect
 *
 * Attaches a soft radial-gradient "aura" to the mouse that follows it
 * around inside the parent container. Implemented as a hook + overlay so
 * it never interferes with pointer events on child elements.
 *
 * Usage:
 *   <div style={{ position: "relative" }}>
 *     <GlowCursor color="#9C4DCC" size={350} opacity={0.18} />
 *     ... your content ...
 *   </div>
 */

import { useEffect, useRef } from "react";

export default function GlowCursor({
  color = "#9C4DCC",
  size = 350,
  opacity = 0.18,
  blur = 60,
}) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const parent = overlay.parentElement;
    if (!parent) return;

    // Make sure the parent is a positioning context
    const parentStyle = window.getComputedStyle(parent);
    if (parentStyle.position === "static") {
      parent.style.position = "relative";
    }

    const handleMouseMove = (e) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Move the glow to match cursor ΓÇö GPU-composited transform
      overlay.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px)`;
      overlay.style.opacity = "1";
    };

    const handleMouseLeave = () => {
      overlay.style.opacity = "0";
    };

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [size]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity: 0,
        pointerEvents: "none",
        zIndex: 5,
        filter: `blur(${blur}px)`,
        mixBlendMode: "screen",
        transition: "opacity 0.25s ease",
        willChange: "transform, opacity",
        // Start off-screen so it doesn't flash at 0,0
        transform: `translate(-9999px, -9999px)`,
      }}
    />
  );
}
