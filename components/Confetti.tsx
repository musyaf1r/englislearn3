"use client";

import { useMemo } from "react";

const COLORS = ["#e97878", "#f5c45e", "#42a995", "#78acc7", "#9d8bd4", "#d98bb0"];

export default function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        duration: 2.5 + Math.random() * 2,
        size: 6 + Math.random() * 8,
        color: COLORS[i % COLORS.length],
        round: i % 3 === 0,
      })),
    [],
  );

  return (
    <div
      aria-hidden
      className="confetti-layer pointer-events-none fixed inset-0 z-40 overflow-hidden"
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.4,
            backgroundColor: p.color,
            borderRadius: p.round ? "9999px" : "2px",
            animation: `confetti ${p.duration}s linear ${p.delay}s both`,
          }}
        />
      ))}
    </div>
  );
}
