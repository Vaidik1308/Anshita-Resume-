"use client";

import { FileText } from "lucide-react";
import type { KeyboardEvent, ReactNode } from "react";
import { linkFor } from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import { AppIcon } from "../AppIcon";
import { useOS } from "../context";
import { APPS } from "../registry";
import type { IconSize } from "./ContextMenu";

type Shortcut = { key: string; label: string; icon: ReactNode; open: () => void };

export function DesktopIcons({ size, selected, setSelected }: { size: IconSize; selected: string | null; setSelected: (k: string | null) => void }) {
  const { openApp } = useOS();
  const resume = linkFor("resume");
  const iconCls = size === "large" ? "size-12" : "size-9";

  const shortcuts: Shortcut[] = [
    ...APPS.map((a) => ({ key: a.id, label: a.title, icon: <AppIcon id={a.id} className={iconCls} />, open: () => openApp(a.id) })),
    ...(resume
      ? [
          {
            key: "resume",
            label: "Résumé",
            icon: (
              <span className={cn("relative grid place-items-center", iconCls)}>
                <FileText className="size-full text-[#d13438] drop-shadow" strokeWidth={1.6} />
              </span>
            ),
            open: () => window.open(resume.href, "_blank", "noopener,noreferrer"),
          },
        ]
      : []),
  ];

  const onKey = (e: KeyboardEvent, s: Shortcut) => {
    if (e.key === "Enter") s.open();
  };

  return (
    <ul className="absolute left-2 top-2 flex max-h-[calc(100%-64px)] flex-col flex-wrap content-start gap-1" aria-label="Desktop shortcuts">
      {shortcuts.map((s) => (
        <li key={s.key}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelected(s.key);
            }}
            onDoubleClick={s.open}
            onKeyDown={(e) => onKey(e, s)}
            aria-label={`${s.label} (double-click to open)`}
            className={cn(
              "flex flex-col items-center gap-1 rounded-[3px] border border-transparent px-1 pb-1.5 pt-2 text-center text-xs leading-tight",
              "text-[#1b1b1b] [text-shadow:0_0_6px_rgb(255_255_255/0.9)] dark:text-white dark:[text-shadow:0_1px_2px_rgb(0_0_0/0.9)]",
              size === "large" ? "w-[84px]" : "w-[76px]",
              selected === s.key
                ? "border-[#99d1ff]/70 bg-[#cce8ff]/40 dark:border-[#99d1ff]/40 dark:bg-[#99d1ff]/25"
                : "hover:border-white/20 hover:bg-white/25 dark:hover:bg-white/10"
            )}
          >
            {s.icon}
            <span className="line-clamp-2">{s.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
