"use client";

import { Activity, Dna, Hospital, Trophy, type LucideIcon } from "lucide-react";
import { createElement, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Illustrative cover art for each highlight. Decorative only.
const W = 480;
const H = 270;

type Scene = { icon: LucideIcon; label: string; from: string; to: string };

const SCENES: Record<string, Scene> = {
  "safe-a-thon": { icon: Trophy, label: "1st Place · Regional Prelims", from: "#f59e0b", to: "#b45309" },
  "clinical-workflows": { icon: Hospital, label: "Hospital operations", from: "#0ea5e9", to: "#1e40af" },
  "epidemiological-analysis": { icon: Activity, label: "Epidemiology · R", from: "#10b981", to: "#065f46" },
  "molecular-biology": { icon: Dna, label: "Molecular biology lab", from: "#a855f7", to: "#5b21b6" },
};

export function ScaledMockup({ slug, className }: { slug: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scene = SCENES[slug];
  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("relative w-full overflow-hidden rounded-md bg-neutral-900", className)}
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      {scale > 0 && scene && (
        <div
          className="absolute left-0 top-0 flex origin-top-left flex-col items-center justify-center gap-4 text-white"
          style={{
            width: W,
            height: H,
            transform: `scale(${scale})`,
            background: `radial-gradient(circle at 30% 20%, rgb(255 255 255 / 0.18), transparent 55%), linear-gradient(135deg, ${scene.from}, ${scene.to})`,
          }}
        >
          <span className="grid size-24 place-items-center rounded-full bg-white/15 ring-1 ring-white/25">
            {createElement(scene.icon, { className: "size-12", strokeWidth: 1.5 })}
          </span>
          <span className="rounded-full bg-black/20 px-4 py-1.5 text-sm font-medium tracking-wide">{scene.label}</span>
        </div>
      )}
    </div>
  );
}
