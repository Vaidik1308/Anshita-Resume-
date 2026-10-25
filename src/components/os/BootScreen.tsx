"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { profile } from "@/lib/portfolio";
import { Avatar } from "./apps/shared";
import { useReducedMotion } from "./context";

const DURATION = 4500;

// Windows-style loader: five dots chasing each other around a circle.
function SpinningDots() {
  return (
    <div className="relative size-10" role="progressbar" aria-label="Loading">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="absolute inset-0"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 1.8, ease: [0.55, 0.15, 0.45, 0.85], repeat: Infinity, delay: i * 0.12 }}
        >
          <span className="absolute left-1/2 top-0 size-[5px] -translate-x-1/2 rounded-full bg-white" />
        </motion.span>
      ))}
    </div>
  );
}

export function BootScreen({ variant, onDone }: { variant: "windows" | "android"; onDone: () => void }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const t = setTimeout(onDone, reduced ? 1200 : DURATION);
    const skip = () => onDone();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [onDone, reduced]);

  if (variant === "android") {
    return (
      <motion.div
        className="android fixed inset-0 z-[2000] flex flex-col items-center justify-center gap-6 bg-md-background font-md text-md-on-surface"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="relative grid size-56 place-items-center">
          {!reduced &&
            [0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute inset-0 m-auto size-28 rounded-full border-2 border-md-primary"
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
              />
            ))}
          <motion.span
            className="absolute inset-0 m-auto size-36 bg-md-primary-container"
            animate={reduced ? undefined : { borderRadius: ["50%", "38%", "50%", "44%", "50%"], rotate: [0, 45, 90, 135, 180] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ borderRadius: "50%" }}
          />
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}>
            <Avatar size={112} />
          </motion.div>
        </div>
        <motion.div className="text-center" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <p className="text-2xl font-medium">{profile.name}</p>
          <p className="mt-1 text-sm text-md-on-surface-variant">Tap anywhere to skip</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-black text-white"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
        <Avatar size={160} className="ring-1 ring-white/20" />
      </motion.div>
      <motion.p className="mt-6 text-3xl font-light" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
        {profile.name}
      </motion.p>
      <motion.div className="mt-14" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        <SpinningDots />
      </motion.div>
      <p className="absolute bottom-10 text-sm text-white/60">Welcome · press any key to skip</p>
    </motion.div>
  );
}
