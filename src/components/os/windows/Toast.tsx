"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { profile } from "@/lib/portfolio";
import { Avatar } from "../apps/shared";
import { useKeyLabels } from "../context";

export function Toast({ onClose, onAction }: { onClose: () => void; onAction: () => void }) {
  const keys = useKeyLabels();
  useEffect(() => {
    const t = setTimeout(onClose, 9000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      role="status"
      className="acrylic fixed bottom-[60px] right-3 z-[580] w-[364px] rounded-lg bg-win-flyout p-4 text-win-text shadow-win"
      initial={{ opacity: 0, x: 120 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 120 }}
      transition={{ type: "spring", stiffness: 360, damping: 34 }}
    >
      <div className="mb-3 flex items-center gap-2 text-xs text-win-text-2">
        <Avatar size={16} />
        <span className="flex-1">{profile.name} · Portfolio</span>
        <button aria-label="Dismiss notification" onClick={onClose} className="grid size-6 place-items-center rounded-[4px] hover:bg-win-hover">
          <X className="size-3.5" />
        </button>
      </div>
      <button onClick={onAction} className="block w-full text-left">
        <p className="text-sm font-semibold">👋 Welcome to {profile.firstName}&apos;s desktop</p>
        <p className="mt-0.5 text-sm text-win-text-2">
          Press <kbd className="rounded border border-win-stroke bg-win-layer px-1 text-xs">{keys.mod}K</kbd> to search everything.
        </p>
      </button>
    </motion.div>
  );
}
