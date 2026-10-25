"use client";

import { motion, type PanInfo } from "framer-motion";
import { Monitor } from "lucide-react";
import { useEffect } from "react";
import { profile } from "@/lib/portfolio";

// Heads-up notification (phone only), swipe away in any direction.
export function Notification({ onDismiss }: { onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 10_000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 80 || info.offset.y < -30) onDismiss();
  };

  return (
    <motion.div
      role="status"
      className="fixed inset-x-2 top-[calc(8px+env(safe-area-inset-top))] z-[470] flex items-start gap-3 rounded-3xl bg-md-surface-container-highest p-4 text-md-on-surface shadow-xl"
      initial={{ y: -140, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -140, opacity: 0 }}
      transition={{ type: "spring", stiffness: 360, damping: 32 }}
      drag
      dragSnapToOrigin
      dragElastic={0.6}
      onDragEnd={onDragEnd}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-md-primary text-md-on-primary">
        <Monitor className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-md-on-surface-variant">{profile.firstName}&apos;s portfolio · now</p>
        <p className="text-sm font-medium">Try it on a desktop</p>
        <p className="text-sm text-md-on-surface-variant">The full Windows-style experience is best on a laptop or desktop. Swipe to dismiss.</p>
      </div>
    </motion.div>
  );
}
