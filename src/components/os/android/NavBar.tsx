"use client";

import { useRef } from "react";

// Gesture navigation handle: tap or swipe up to go home.
export function NavBar({ onHome }: { onHome: () => void }) {
  const start = useRef<number | null>(null);
  return (
    <button
      aria-label="Home"
      className="flex h-6 w-full shrink-0 items-center justify-center"
      style={{ touchAction: "none" }}
      onPointerDown={(e) => (start.current = e.clientY)}
      onPointerUp={(e) => {
        if (start.current !== null && start.current - e.clientY > 20) onHome();
        start.current = null;
      }}
      onClick={onHome}
    >
      <span className="h-1 w-28 rounded-full bg-md-on-surface/70 shadow-[0_0_0_1px_rgb(255_255_255/0.15)]" />
    </button>
  );
}
