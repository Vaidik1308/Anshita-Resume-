"use client";

import { motion } from "framer-motion";
import type { Zone } from "./useWindowManager";

// Each layout is a row of zones; clicking a zone snaps the window there.
const LAYOUTS: { label: string; zones: Zone[] }[] = [
  { label: "Halves", zones: [{ x: 0, y: 0, w: 0.5, h: 1 }, { x: 0.5, y: 0, w: 0.5, h: 1 }] },
  { label: "Two thirds", zones: [{ x: 0, y: 0, w: 2 / 3, h: 1 }, { x: 2 / 3, y: 0, w: 1 / 3, h: 1 }] },
  { label: "Thirds", zones: [{ x: 0, y: 0, w: 1 / 3, h: 1 }, { x: 1 / 3, y: 0, w: 1 / 3, h: 1 }, { x: 2 / 3, y: 0, w: 1 / 3, h: 1 }] },
  {
    label: "Quadrants",
    zones: [
      { x: 0, y: 0, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0, w: 0.5, h: 0.5 },
      { x: 0, y: 0.5, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
    ],
  },
];

const zoneName = (layout: string, i: number) => `${layout}, zone ${i + 1}`;

export function SnapLayouts({ onSnap, onMouseEnter, onMouseLeave }: { onSnap: (z: Zone) => void; onMouseEnter: () => void; onMouseLeave: () => void }) {
  return (
    <motion.div
      role="menu"
      aria-label="Snap layouts"
      className="acrylic absolute right-1 top-9 z-10 grid w-[284px] grid-cols-2 gap-2.5 rounded-lg bg-win-flyout p-3 shadow-win"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.12 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {LAYOUTS.map((l) => (
        <div key={l.label} className="relative h-[58px] rounded-[5px] border border-win-stroke bg-win-layer p-[3px]">
          {l.zones.map((z, i) => (
            <button
              key={i}
              role="menuitem"
              aria-label={zoneName(l.label, i)}
              onClick={() => onSnap(z)}
              className="absolute rounded-[3px] border border-win-stroke bg-win-layer-2 transition-colors hover:border-transparent hover:bg-win-accent"
              style={{
                left: `calc(${z.x * 100}% + 3px)`,
                top: `calc(${z.y * 100}% + 3px)`,
                width: `calc(${z.w * 100}% - 6px)`,
                height: `calc(${z.h * 100}% - 6px)`,
              }}
            />
          ))}
        </div>
      ))}
    </motion.div>
  );
}
