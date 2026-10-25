"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Copy, Minus, Square, X } from "lucide-react";
import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AppIcon } from "../AppIcon";
import { useReducedMotion } from "../context";
import { appById } from "../registry";
import { SnapLayouts } from "./SnapLayouts";
import type { Rect, WinState, Zone } from "./useWindowManager";

type Props = {
  win: WinState;
  focused: boolean;
  viewport: { w: number; workH: number };
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMax: () => void;
  onSnap: (z: Zone) => void;
  onMove: (r: Rect, unsnap?: boolean) => void;
  children: ReactNode;
};

const SPRING = { type: "spring", stiffness: 520, damping: 42, mass: 0.8 } as const;

export function Window({ win, focused, viewport, onFocus, onClose, onMinimize, onToggleMax, onSnap, onMove, children }: Props) {
  const app = appById(win.id);
  const reduced = useReducedMotion();
  const [dragging, setDragging] = useState(false);
  const [snapOpen, setSnapOpen] = useState(false);
  const snapTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const drag = useRef<{ px: number; py: number; rect: Rect; unsnap: boolean } | null>(null);

  const max = win.mode === "max";
  const min = win.mode === "min";
  const rect: Rect = max ? { x: 0, y: 0, w: viewport.w, h: viewport.workH } : win.rect;

  const hoverSnap = (show: boolean) => {
    clearTimeout(snapTimer.current);
    snapTimer.current = setTimeout(() => setSnapOpen(show), show ? 350 : 220);
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest("button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    // Dragging a maximized or snapped window restores its size under the cursor.
    const base = max ? { ...win.rect, x: e.clientX - win.rect.w / 2, y: 0 } : win.restore ? { ...win.restore, x: e.clientX - win.restore.w / 2, y: win.rect.y } : rect;
    drag.current = { px: e.clientX, py: e.clientY, rect: base, unsnap: max || !!win.restore };
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    if (!dragging && Math.hypot(e.clientX - d.px, e.clientY - d.py) < 4) return;
    setDragging(true);
    const x = d.rect.x + e.clientX - d.px;
    const y = Math.min(Math.max(0, d.rect.y + e.clientY - d.py), viewport.workH - 40);
    onMove({ ...d.rect, x: Math.min(Math.max(x, 80 - d.rect.w), viewport.w - 80), y }, d.unsnap);
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    const wasDragging = dragging;
    drag.current = null;
    setDragging(false);
    if (wasDragging && e.clientY <= 2) onToggleMax(); // drag to the top edge maximizes
  };

  const target = min && win.minTo;
  return (
    <motion.section
      role="dialog"
      aria-label={app.title}
      aria-hidden={min || undefined}
      className={cn(
        "acrylic absolute left-0 top-0 flex flex-col overflow-hidden bg-win-mica text-win-text",
        max ? "rounded-none" : "rounded-lg",
        focused ? "shadow-win" : "shadow-[0_8px_24px_rgb(0_0_0/0.25)]",
        min && "pointer-events-none"
      )}
      style={{ zIndex: 10 + win.z, transformOrigin: "center" }}
      initial={reduced ? { opacity: 0, x: rect.x, y: rect.y, width: rect.w, height: rect.h } : { opacity: 0, scale: 0.94, x: rect.x, y: rect.y, width: rect.w, height: rect.h }}
      animate={
        target
          ? { opacity: 0, scale: reduced ? 1 : 0.12, x: target.x - rect.w / 2, y: target.y - rect.h / 2, width: rect.w, height: rect.h }
          : { opacity: min ? 0 : 1, scale: 1, x: rect.x, y: rect.y, width: rect.w, height: rect.h }
      }
      exit={{ opacity: 0, scale: reduced ? 1 : 0.94, transition: { duration: 0.15 } }}
      transition={dragging ? { duration: 0 } : min || target ? { duration: 0.28, ease: [0.4, 0, 0.6, 1] } : SPRING}
      onPointerDownCapture={onFocus}
    >
      <header
        className={cn("flex h-8 shrink-0 select-none items-center", focused ? "text-win-text" : "text-win-text-2")}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onDoubleClick={(e) => !(e.target as HTMLElement).closest("button") && onToggleMax()}
      >
        <AppIcon id={win.id} className="ml-3 size-4 rounded-[4px]" />
        <h2 className="ml-2.5 flex-1 truncate text-xs">{app.title}</h2>
        <div className="relative flex h-full">
          <button aria-label="Minimize" onClick={onMinimize} className="grid h-full w-[46px] place-items-center hover:bg-win-hover">
            <Minus className="size-4" strokeWidth={1.5} />
          </button>
          <button
            aria-label={max ? "Restore" : "Maximize"}
            aria-haspopup="menu"
            onClick={onToggleMax}
            onMouseEnter={() => hoverSnap(true)}
            onMouseLeave={() => hoverSnap(false)}
            className="grid h-full w-[46px] place-items-center hover:bg-win-hover"
          >
            {max ? <Copy className="size-3.5 -scale-x-100" strokeWidth={1.5} /> : <Square className="size-3.5" strokeWidth={1.5} />}
          </button>
          <button aria-label="Close" onClick={onClose} className="grid h-full w-[46px] place-items-center hover:bg-[#c42b1c] hover:text-white">
            <X className="size-4" strokeWidth={1.5} />
          </button>
          <AnimatePresence>
            {snapOpen && (
              <SnapLayouts
                onMouseEnter={() => hoverSnap(true)}
                onMouseLeave={() => hoverSnap(false)}
                onSnap={(z) => {
                  setSnapOpen(false);
                  onSnap(z);
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </header>
      <div className="min-h-0 flex-1 border-t border-win-stroke bg-win-layer-2">{children}</div>
    </motion.section>
  );
}
