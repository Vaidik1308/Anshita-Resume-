"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import { KEYS, writeStorage } from "@/lib/storage";
import type { AppId } from "./registry";

export type NavOverride = { label: string; onBack: () => void } | null;

type OSContextValue = {
  compact: boolean;
  // `arg` deep-links inside an app, e.g. a role id for Experience
  openApp: (id: AppId, arg?: string) => void;
  openSearch: () => void;
  // Android only: lets an app take over Back while showing a sub-page
  setNav: (nav: NavOverride) => void;
};

export const OSContext = createContext<OSContextValue>({
  compact: false,
  openApp: () => {},
  openSearch: () => {},
  setNav: () => {},
});

export const useOS = () => useContext(OSContext);

const noop = () => () => {};

// null on the server and during hydration, so the first client render matches.
export function useMediaQuery(query: string): boolean | null {
  return useSyncExternalStore(
    useCallback(
      (cb: () => void) => {
        const mql = window.matchMedia(query);
        mql.addEventListener("change", cb);
        return () => mql.removeEventListener("change", cb);
      },
      [query]
    ),
    () => window.matchMedia(query).matches,
    () => null
  );
}

// One shared ticking clock per interval; null until mounted.
const clocks = new Map<number, { now: Date; subs: Set<() => void>; timer?: ReturnType<typeof setInterval> }>();

function clock(ms: number) {
  let c = clocks.get(ms);
  if (!c) {
    c = { now: new Date(), subs: new Set() };
    clocks.set(ms, c);
  }
  return c;
}

export function useNow(intervalMs = 15_000): Date | null {
  const subscribe = useCallback(
    (cb: () => void) => {
      const c = clock(intervalMs);
      c.subs.add(cb);
      if (!c.timer) {
        c.now = new Date();
        c.timer = setInterval(() => {
          c.now = new Date();
          c.subs.forEach((f) => f());
        }, intervalMs);
      }
      return () => {
        c.subs.delete(cb);
        if (!c.subs.size) {
          clearInterval(c.timer);
          c.timer = undefined;
        }
      };
    },
    [intervalMs]
  );
  return useSyncExternalStore(subscribe, () => clock(intervalMs).now, () => null);
}

export function useIsDark(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const obs = new MutationObserver(cb);
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      return () => obs.disconnect();
    },
    () => document.documentElement.classList.contains("dark"),
    () => true // dark is the default theme
  );
}

export function setDarkTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
  writeStorage("local", KEYS.theme, dark ? "dark" : "light");
}

export const toggleTheme = () => setDarkTheme(!document.documentElement.classList.contains("dark"));

// Shortcut labels for the visitor's keyboard: ⌘/⌥ on Apple, Ctrl/Alt elsewhere
export function useKeyLabels() {
  const apple = useSyncExternalStore(
    noop,
    () => /Mac|iPhone|iPad/.test(navigator.userAgent),
    () => false
  );
  return apple ? { mod: "⌘", alt: "⌥", apple } : { mod: "Ctrl+", alt: "Alt+", apple };
}

export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)") ?? false;
}
