"use client";

import { motion } from "framer-motion";
import { useNow } from "../context";
import { CalendarWidget, ClockWidget, ExperienceWidget, NowWidget, ProfileWidget, WeatherWidget } from "../widgets";

export function WidgetsBoard() {
  const now = useNow(15_000);
  return (
    <motion.aside
      aria-label="Widgets"
      className="acrylic fixed bottom-[60px] left-3 top-3 z-[610] flex w-[min(720px,calc(100vw-24px))] flex-col overflow-hidden rounded-lg bg-win-flyout text-win-text shadow-win"
      initial={{ opacity: 0, x: -80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80, transition: { duration: 0.18 } }}
      transition={{ type: "spring", stiffness: 380, damping: 36 }}
    >
      <header className="flex items-baseline gap-3 px-6 pb-2 pt-5">
        <p className="text-2xl font-light tabular-nums">
          {now ? now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : " "}
        </p>
        <p className="text-sm text-win-text-2">{now ? now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : ""}</p>
      </header>
      <div className="scroll-thin grid flex-1 auto-rows-min grid-cols-2 gap-3 overflow-y-auto px-6 pb-6">
        <ProfileWidget />
        <NowWidget />
        <ExperienceWidget />
        <WeatherWidget className="min-h-36" />
        {/* Lower row hides on short screens so nothing collides with the taskbar */}
        <CalendarWidget className="[@media(max-height:800px)]:hidden" />
        <ClockWidget className="[@media(max-height:800px)]:hidden" />
      </div>
    </motion.aside>
  );
}
