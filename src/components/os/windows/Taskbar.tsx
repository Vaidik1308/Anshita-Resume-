"use client";

import { motion } from "framer-motion";
import { BatteryFull, LayoutPanelLeft, Moon, Search as SearchIcon, Sun, Volume2, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppIcon } from "../AppIcon";
import { toggleTheme, useIsDark, useNow } from "../context";
import { APPS, type AppId } from "../registry";
import type { WinState } from "./useWindowManager";

export type FlyoutId = "start" | "widgets" | "calendar" | null;

// Original four-tile mark: rounded tiles with a gradient, evoking (not copying) a Start button.
export function StartLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <linearGradient id="start-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5ad1ff" />
          <stop offset="1" stopColor="#1f6fff" />
        </linearGradient>
      </defs>
      {[
        [2, 2],
        [13, 2],
        [2, 13],
        [13, 13],
      ].map(([x, y]) => (
        <rect key={`${x}${y}`} x={x} y={y} width="9" height="9" rx="2.2" fill="url(#start-g)" />
      ))}
    </svg>
  );
}

const btn = "relative grid h-10 place-items-center rounded-[4px] transition-colors hover:bg-win-hover active:bg-win-pressed";

export function Taskbar({
  wins,
  focused,
  flyout,
  setFlyout,
  onAppClick,
  onSearch,
}: {
  wins: WinState[];
  focused: AppId | null;
  flyout: FlyoutId;
  setFlyout: (f: FlyoutId) => void;
  onAppClick: (id: AppId) => void;
  onSearch: () => void;
}) {
  const now = useNow(15_000);
  const dark = useIsDark();
  const toggle = (f: Exclude<FlyoutId, null>) => setFlyout(flyout === f ? null : f);

  return (
    <nav
      aria-label="Taskbar"
      className="acrylic fixed inset-x-0 bottom-0 z-[600] flex h-12 items-center border-t border-win-stroke bg-win-taskbar px-2 text-win-text"
    >
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        <button aria-label="Start" aria-expanded={flyout === "start"} onClick={() => toggle("start")} className={cn(btn, "w-10")}>
          <StartLogo className="size-6" />
        </button>
        <button
          onClick={onSearch}
          aria-label="Search"
          className="mx-1 flex h-8 w-10 items-center justify-center gap-2 rounded-full border border-win-stroke bg-win-layer text-sm text-win-text-2 hover:bg-win-hover lg:w-52 lg:justify-start lg:px-3"
        >
          <SearchIcon className="size-4" aria-hidden /> <span className="hidden lg:inline">Search</span>
        </button>
        <button aria-label="Widgets" aria-expanded={flyout === "widgets"} onClick={() => toggle("widgets")} className={cn(btn, "w-10")}>
          <LayoutPanelLeft className="size-5 text-win-accent" />
        </button>
        {APPS.map((a) => {
          const win = wins.find((w) => w.id === a.id);
          const isFocused = focused === a.id && flyout === null;
          return (
            <button
              key={a.id}
              data-taskbar-app={a.id}
              aria-label={`${a.title}${win ? " (open)" : ""}`}
              aria-pressed={isFocused}
              onClick={() => onAppClick(a.id)}
              className={cn(btn, "w-10", isFocused && "bg-win-hover")}
            >
              <AppIcon id={a.id} className="size-6" />
              {win && (
                <motion.span
                  layout
                  className={cn("absolute bottom-0.5 left-1/2 h-[3px] rounded-full", isFocused ? "bg-win-accent" : "bg-win-text-2")}
                  initial={false}
                  animate={{ width: isFocused ? 16 : 6 }}
                  style={{ x: "-50%" }}
                />
              )}
            </button>
          );
        })}
      </div>
      <div className="flex flex-1 items-center justify-end gap-1">
        <button aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} title="Theme" onClick={toggleTheme} className={cn(btn, "w-9")}>
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
        <div className={cn(btn, "flex gap-2.5 px-2.5")} aria-label="Wi-Fi connected, volume on, battery full" role="img">
          <Wifi className="size-4" aria-hidden />
          <Volume2 className="size-4" aria-hidden />
          <BatteryFull className="size-4" aria-hidden />
        </div>
        <button
          aria-label="Clock and calendar"
          aria-expanded={flyout === "calendar"}
          onClick={() => toggle("calendar")}
          className={cn(btn, "min-w-20 px-2 text-right text-xs leading-tight")}
        >
          <span suppressHydrationWarning>
            {now ? now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : " "}
            <br />
            {now ? now.toLocaleDateString("en-GB") : " "}
          </span>
        </button>
      </div>
    </nav>
  );
}
