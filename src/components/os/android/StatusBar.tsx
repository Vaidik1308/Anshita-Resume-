"use client";

import { BatteryFull, Signal, Wifi } from "lucide-react";
import { useRef } from "react";
import { useNow } from "../context";

// Time on the left, radios on the right. Pull down (or tap) to open Quick Settings.
export function StatusBar({ onPull }: { onPull: () => void }) {
  const now = useNow(15_000);
  const start = useRef<number | null>(null);
  return (
    <button
      aria-label="Open quick settings"
      className="fixed inset-x-0 top-0 z-[400] flex h-[calc(28px+env(safe-area-inset-top))] items-end justify-between px-5 pb-1 text-[13px] font-medium text-md-on-surface"
      style={{ touchAction: "none" }}
      onPointerDown={(e) => (start.current = e.clientY)}
      onPointerMove={(e) => {
        if (start.current !== null && e.clientY - start.current > 24) {
          start.current = null;
          onPull();
        }
      }}
      onPointerUp={() => (start.current = null)}
      onClick={onPull}
    >
      <span className="tabular-nums">{now ? now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).replace(/\s?[AP]M/, "") : ""}</span>
      <span className="flex items-center gap-1.5" aria-hidden>
        <Wifi className="size-3.5" strokeWidth={2.5} />
        <Signal className="size-3.5" strokeWidth={2.5} />
        <BatteryFull className="size-4" strokeWidth={2} />
      </span>
    </button>
  );
}
