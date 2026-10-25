"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { useReducedMotion } from "../context";
import { appById, type AppId } from "../registry";
import type { NavOverride } from "../context";
import type { Origin } from "./HomeScreen";
import { NavBar } from "./NavBar";

const clip = (o: NonNullable<Origin>) =>
  `inset(${o.top}px ${window.innerWidth - o.left - o.width}px ${window.innerHeight - o.top - o.height}px ${o.left}px round ${o.width / 2}px)`;
const FULL = "inset(0px 0px 0px 0px round 0px)";

// Container transform from the tapped icon; predictive back shrinks the page before it closes.
export function AppView({
  id,
  origin,
  nav,
  onClose,
  children,
}: {
  id: AppId;
  origin: Origin;
  nav: NavOverride;
  onClose: () => void;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const app = appById(id);
  const progress = useMotionValue(0);
  const scale = useTransform(progress, [0, 1], [1, 0.9]);
  const radius = useTransform(progress, [0, 1], [0, 32]);
  const edge = useRef<number | null>(null);

  const from = origin && !reduced ? clip(origin) : "inset(0px 0px 0px 0px round 0px)";

  const back = () => {
    if (nav) {
      nav.onBack();
      return;
    }
    if (reduced) return onClose();
    animate(progress, 1, { duration: 0.14 }).then(onClose);
  };

  // Edge swipe from the left: scale follows the finger, release past 35% goes back.
  const onEdgeDown = (e: PointerEvent) => {
    edge.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onEdgeMove = (e: PointerEvent) => {
    if (edge.current === null) return;
    progress.set(Math.min(Math.max((e.clientX - edge.current) / (window.innerWidth * 0.6), 0), 1));
  };
  const onEdgeUp = () => {
    edge.current = null;
    if (progress.get() > 0.35) back();
    if (nav || progress.get() <= 0.35) animate(progress, 0, { duration: 0.2 });
  };

  return (
    <motion.div
      role="dialog"
      aria-label={app.title}
      className="fixed inset-0 z-[300] flex flex-col overflow-hidden bg-md-surface text-md-on-surface"
      initial={{ clipPath: from, opacity: reduced ? 0 : 1 }}
      animate={{ clipPath: FULL, opacity: 1 }}
      exit={{ clipPath: from, opacity: reduced || !origin ? 0 : 1, transition: { duration: 0.28, ease: [0.3, 0, 0.8, 0.15] } }}
      transition={{ duration: 0.38, ease: [0.05, 0.7, 0.1, 1] }}
      style={{ scale, borderRadius: radius }}
    >
      <motion.header
        className="flex h-16 shrink-0 items-center gap-1 px-1 pt-[calc(28px+env(safe-area-inset-top))] box-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12 }}
      >
        <button aria-label={nav ? `Back to ${nav.label}` : "Back to home"} onClick={back} className="grid size-12 place-items-center rounded-full active:bg-md-on-surface/10">
          <ArrowLeft className="size-6" />
        </button>
        <h2 className="text-[22px] font-normal">{app.title}</h2>
      </motion.header>
      <motion.div className="min-h-0 flex-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        {children}
      </motion.div>
      <div className="shrink-0 pb-[max(4px,env(safe-area-inset-bottom))]">
        <NavBar onHome={onClose} />
      </div>
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-4"
        style={{ touchAction: "none" }}
        onPointerDown={onEdgeDown}
        onPointerMove={onEdgeMove}
        onPointerUp={onEdgeUp}
        onPointerCancel={onEdgeUp}
      />
    </motion.div>
  );
}
