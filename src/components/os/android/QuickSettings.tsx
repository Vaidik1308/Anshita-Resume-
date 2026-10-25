"use client";

import { motion, type PanInfo } from "framer-motion";
import { FileText, Mail, Moon } from "lucide-react";
import type { ComponentType } from "react";
import { FaLinkedin } from "react-icons/fa6";
import { linkFor, profile } from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import { toggleTheme, useIsDark, useNow } from "../context";

type Tile = { key: string; label: string; sub: string; icon: ComponentType<{ className?: string }>; active?: boolean; run: () => void };

export function QuickSettings({ onClose }: { onClose: () => void }) {
  const dark = useIsDark();
  const now = useNow(15_000);
  const resume = linkFor("resume");
  const linkedin = linkFor("linkedin");
  const open = (href: string) => window.open(href, "_blank", "noopener,noreferrer");

  const tiles: Tile[] = [
    { key: "dark", label: "Dark theme", sub: dark ? "On" : "Off", icon: Moon, active: dark, run: toggleTheme },
    { key: "mail", label: "Email", sub: profile.email, icon: Mail, run: () => (window.location.href = `mailto:${profile.email}`) },
    ...(resume ? [{ key: "cv", label: "Résumé", sub: "Open PDF", icon: FileText, run: () => open(resume.href) }] : []),
    ...(linkedin ? [{ key: "li", label: "LinkedIn", sub: "Connect", icon: FaLinkedin, run: () => open(linkedin.href) }] : []),
  ];

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y < -60 || info.velocity.y < -400) onClose();
  };

  return (
    <>
      <motion.div className="fixed inset-0 z-[450] bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div
        role="dialog"
        aria-label="Quick settings"
        className="fixed inset-x-0 top-0 z-[460] rounded-b-[32px] bg-md-surface-container px-4 pb-3 pt-[calc(12px+env(safe-area-inset-top))] text-md-on-surface shadow-2xl"
        initial={{ y: "-100%" }}
        animate={{ y: 0 }}
        exit={{ y: "-100%" }}
        transition={{ type: "spring", stiffness: 380, damping: 38 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.6, bottom: 0.05 }}
        onDragEnd={onDragEnd}
      >
        <div className="flex items-baseline justify-between px-1 pb-4">
          <p className="text-3xl font-normal tabular-nums">{now ? now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : ""}</p>
          <p className="text-sm text-md-on-surface-variant">{now ? now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : ""}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {tiles.map((t) => (
            <button
              key={t.key}
              onClick={t.run}
              aria-pressed={t.key === "dark" ? t.active : undefined}
              className={cn(
                "flex h-16 items-center gap-3 rounded-full px-4 text-left transition-colors",
                t.active ? "bg-md-primary text-md-on-primary" : "bg-md-surface-container-highest text-md-on-surface"
              )}
            >
              <t.icon className="size-5 shrink-0" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{t.label}</span>
                <span className="block truncate text-xs opacity-75">{t.sub}</span>
              </span>
            </button>
          ))}
        </div>
        <button aria-label="Close quick settings" onClick={onClose} className="mx-auto mt-3 block h-6 w-full">
          <span className="mx-auto block h-1 w-9 rounded-full bg-md-on-surface-variant/50" />
        </button>
      </motion.div>
    </>
  );
}
