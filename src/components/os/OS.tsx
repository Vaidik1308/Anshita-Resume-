"use client";

import { AnimatePresence, MotionConfig } from "framer-motion";
import { useCallback, useState, useSyncExternalStore } from "react";
import { KEYS, readStorage, writeStorage } from "@/lib/storage";
import { AndroidShell } from "./android/AndroidShell";
import { BootScreen } from "./BootScreen";
import { useMediaQuery } from "./context";
import { Desktop } from "./windows/Desktop";

const noop = () => () => {};

// Windows desktop at ≥768px, Android below. Neutral splash until mounted so
// server and client markup match.
export function OS() {
  const desktop = useMediaQuery("(min-width: 768px)");
  const bootedThisSession = useSyncExternalStore(noop, () => readStorage("session", KEYS.booted) === "1", () => true);
  const [boot, setBoot] = useState<"auto" | "done" | "replay">("auto");
  const showBoot = boot === "replay" || (boot === "auto" && !bootedThisSession);

  const finishBoot = useCallback(() => {
    writeStorage("session", KEYS.booted, "1");
    setBoot("done");
  }, []);

  if (desktop === null) return <div className="fixed inset-0 bg-black" aria-hidden />;

  return (
    <MotionConfig reducedMotion="user">
      {desktop ? <Desktop onRestart={() => setBoot("replay")} /> : <AndroidShell />}
      <AnimatePresence>{showBoot && <BootScreen key="boot" variant={desktop ? "windows" : "android"} onDone={finishBoot} />}</AnimatePresence>
    </MotionConfig>
  );
}
