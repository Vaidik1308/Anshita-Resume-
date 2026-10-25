"use client";

import { motion } from "framer-motion";
import { Calendar } from "../widgets";
import { useNow } from "../context";

export function CalendarFlyout() {
  const now = useNow(60_000);
  return (
    <motion.div
      role="dialog"
      aria-label="Calendar"
      className="acrylic fixed bottom-[60px] right-3 z-[610] w-[340px] overflow-hidden rounded-lg bg-win-flyout text-win-text shadow-win"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 420, damping: 36 }}
    >
      <p className="border-b border-win-stroke px-4 py-3 text-sm font-semibold">
        {now ? now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : " "}
      </p>
      <Calendar className="p-3" />
    </motion.div>
  );
}
