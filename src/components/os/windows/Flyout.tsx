"use client";

import { useEffect } from "react";

// Transparent layer that closes a flyout on outside press. Stops above the
// taskbar so its buttons can toggle the flyout themselves.
export function Backdrop({ onClose, z = 590, coverTaskbar = false }: { onClose: () => void; z?: number; coverTaskbar?: boolean }) {
  return (
    <div
      className="fixed inset-x-0 top-0"
      style={{ zIndex: z, bottom: coverTaskbar ? 0 : 48 }}
      onPointerDown={onClose}
      onContextMenu={(e) => {
        e.preventDefault();
        onClose();
      }}
    />
  );
}

export function useEscape(active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onClose]);
}
