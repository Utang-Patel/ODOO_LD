import React, { useEffect, useState } from "react";

const CursorGlow = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("gt-card")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: isHovered ? "50px" : "30px",
        height: isHovered ? "50px" : "30px",
        borderRadius: "50%",
        pointerEvents: "none",
        transform: `translate3d(${position.x - (isHovered ? 25 : 15)}px, ${position.y - (isHovered ? 25 : 15)}px, 0)`,
        background: isHovered
          ? "radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, rgba(124, 58, 237, 0.15) 70%, transparent 100%)"
          : "radial-gradient(circle, rgba(124, 58, 237, 0.35) 0%, transparent 70%)",
        border: isHovered ? "1px solid rgba(236, 72, 153, 0.5)" : "none",
        transition: "width 0.2s ease, height 0.2s ease, background 0.2s ease, border 0.2s ease, transform 0.06s ease-out",
        zIndex: 9999
      }}
    />
  );
};

export default CursorGlow;
