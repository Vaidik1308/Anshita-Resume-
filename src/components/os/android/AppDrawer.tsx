"use client";

import { motion, type PanInfo } from "framer-motion";
import { Search as SearchIcon } from "lucide-react";
import type { MouseEvent } from "react";
import { AppIcon } from "../AppIcon";
import { useOS } from "../context";
import { APPS, type AppId } from "../registry";
import type { Origin } from "./HomeScreen";

const SORTED = [...APPS].sort((a, b) => a.title.localeCompare(b.title));

export function AppDrawer({ onClose, onLaunch }: { onClose: () => void; onLaunch: (id: AppId, origin: Origin) => void }) {
  const { openSearch } = useOS();
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) onClose();
  };
  const launch = (id: AppId) => (e: MouseEvent) => {
    const r = (e.currentTarget.querySelector("[data-icon]") ?? e.currentTarget).getBoundingClientRect();
    onLaunch(id, { top: r.top, left: r.left, width: r.width, height: r.height });
  };

  return (
    <>
      <motion.div className="fixed inset-0 z-[200] bg-black/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div
        role="dialog"
        aria-label="All apps"
        className="fixed inset-x-0 bottom-0 top-[calc(40px+env(safe-area-inset-top))] z-[210] flex flex-col rounded-t-[28px] bg-md-surface-container-low pb-[env(safe-area-inset-bottom)] text-md-on-surface"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 36 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.05, bottom: 0.7 }}
        onDragEnd={onDragEnd}
      >
        <div className="grid h-7 place-items-center">
          <span className="h-1 w-8 rounded-full bg-md-on-surface-variant/50" />
        </div>
        <div className="px-4">
          <button
            onClick={() => {
              onClose();
              openSearch();
            }}
            className="flex h-12 w-full items-center gap-3 rounded-full bg-md-surface-container-highest px-5 text-left text-md-on-surface-variant"
          >
            <SearchIcon className="size-5" aria-hidden /> Search apps
          </button>
        </div>
        <ul className="grid grid-cols-4 gap-x-2 gap-y-5 overflow-y-auto px-4 pt-6" aria-label="Apps">
          {SORTED.map((a) => (
            <li key={a.id}>
              <button onClick={launch(a.id)} className="flex w-full flex-col items-center gap-1.5">
                <span data-icon>
                  <AppIcon id={a.id} compact />
                </span>
                <span className="w-full truncate text-center text-xs">{a.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </motion.div>
    </>
  );
}
