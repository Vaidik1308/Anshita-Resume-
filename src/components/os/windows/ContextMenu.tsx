"use client";

import { motion } from "framer-motion";
import { Check, ChevronRight, FileText, LayoutGrid, Palette, RefreshCw } from "lucide-react";
import { useState, type ReactNode } from "react";
import { linkFor } from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import { toggleTheme, useIsDark } from "../context";

export type IconSize = "large" | "medium";

const item = "flex h-8 w-full items-center gap-3 rounded-[4px] px-3 text-left text-[13px] hover:bg-win-hover focus-visible:bg-win-hover";

function Item({ icon, children, onClick, right }: { icon: ReactNode; children: ReactNode; onClick?: () => void; right?: ReactNode }) {
  return (
    <button role="menuitem" className={item} onClick={onClick}>
      <span className="grid w-4 place-items-center">{icon}</span>
      <span className="flex-1">{children}</span>
      {right}
    </button>
  );
}

export function ContextMenu({
  at,
  onClose,
  onRefresh,
  iconSize,
  setIconSize,
  showIcons,
  setShowIcons,
}: {
  at: { x: number; y: number };
  onClose: () => void;
  onRefresh: () => void;
  iconSize: IconSize;
  setIconSize: (s: IconSize) => void;
  showIcons: boolean;
  setShowIcons: (v: boolean) => void;
}) {
  const [viewOpen, setViewOpen] = useState(false);
  const dark = useIsDark();
  const resume = linkFor("resume");
  const run = (fn: () => void) => () => {
    fn();
    onClose();
  };
  const W = 248;
  // Keep the menu (and its submenu) on screen
  const x = Math.min(at.x, window.innerWidth - W - 8);
  const y = Math.min(at.y, window.innerHeight - 220);
  const subLeft = x + W * 2 + 8 > window.innerWidth;

  return (
    <motion.div
      role="menu"
      aria-label="Desktop"
      className="acrylic fixed z-[700] rounded-lg bg-win-flyout p-1 text-win-text shadow-win"
      style={{ left: x, top: y, width: W }}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      transition={{ duration: 0.14 }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="relative" onMouseEnter={() => setViewOpen(true)} onMouseLeave={() => setViewOpen(false)}>
        <Item icon={<LayoutGrid className="size-4" />} onClick={() => setViewOpen((v) => !v)} right={<ChevronRight className="size-4 opacity-70" />}>
          View
        </Item>
        {viewOpen && (
          <div
            role="menu"
            aria-label="View"
            className={cn("acrylic absolute top-0 w-56 rounded-lg bg-win-flyout p-1 shadow-win", subLeft ? "right-full mr-1" : "left-full ml-1")}
          >
            {(["large", "medium"] as const).map((s) => (
              <Item key={s} icon={iconSize === s ? <span className="size-1.5 rounded-full bg-win-text" /> : null} onClick={run(() => setIconSize(s))}>
                {s === "large" ? "Large icons" : "Medium icons"}
              </Item>
            ))}
            <div className="mx-2 my-1 border-t border-win-stroke" />
            <Item icon={showIcons ? <Check className="size-4" /> : null} onClick={run(() => setShowIcons(!showIcons))}>
              Show desktop icons
            </Item>
          </div>
        )}
      </div>
      <Item icon={<RefreshCw className="size-4" />} onClick={run(onRefresh)}>
        Refresh
      </Item>
      <div className="mx-2 my-1 border-t border-win-stroke" />
      <Item icon={<Palette className="size-4" />} onClick={run(toggleTheme)} right={<span className="text-xs text-win-text-2">{dark ? "Light" : "Dark"} mode</span>}>
        Personalize
      </Item>
      {resume && (
        <Item icon={<FileText className="size-4" />} onClick={run(() => window.open(resume.href, "_blank", "noopener,noreferrer"))}>
          Open Résumé
        </Item>
      )}
    </motion.div>
  );
}
