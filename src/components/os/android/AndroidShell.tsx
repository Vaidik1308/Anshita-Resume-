"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { KEYS, readStorage, writeStorage } from "@/lib/storage";
import { APP_COMPONENTS } from "../apps";
import { OSContext, type NavOverride } from "../context";
import type { AppId } from "../registry";
import { Search } from "../Search";
import { AppDrawer } from "./AppDrawer";
import { AppView } from "./AppView";
import { HomeScreen, type Origin } from "./HomeScreen";
import { Notification } from "./Notification";
import { QuickSettings } from "./QuickSettings";
import { StatusBar } from "./StatusBar";

type Open = { id: AppId; arg?: string; origin: Origin; n: number };

export function AndroidShell() {
  const [open, setOpen] = useState<Open | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [shade, setShade] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [nav, setNav] = useState<NavOverride>(null);
  const [hint, setHint] = useState(false);

  const launch = useCallback((id: AppId, origin: Origin, arg?: string) => {
    setDrawer(false);
    setNav(null);
    setOpen((o) => ({ id, arg, origin, n: (o?.n ?? 0) + 1 }));
  }, []);

  const home = useCallback(() => {
    setDrawer(false);
    setNav(null);
    setOpen(null);
  }, []);

  const os = useMemo(
    () => ({
      compact: true,
      openApp: (id: AppId, arg?: string) => launch(id, null, arg),
      openSearch: () => setSearchOpen(true),
      setNav,
    }),
    [launch]
  );

  // Heads-up once after boot, unless dismissed before
  useEffect(() => {
    if (readStorage("local", KEYS.mobileHint)) return;
    const t = setTimeout(() => setHint(true), 2500);
    return () => clearTimeout(t);
  }, []);
  const dismissHint = useCallback(() => {
    setHint(false);
    writeStorage("local", KEYS.mobileHint, "1");
  }, []);

  // Hardware/browser Escape acts as Back
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || searchOpen) return;
      if (shade) setShade(false);
      else if (nav) nav.onBack();
      else if (open || drawer) home();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shade, nav, open, drawer, home, searchOpen]);

  const App = open ? APP_COMPONENTS[open.id] : null;

  return (
    <OSContext.Provider value={os}>
      <main className="android fixed inset-0 overflow-hidden bg-md-background font-md text-md-on-surface">
        {/* Wallpaper (Unsplash, free licence); the dark variant is the same photo dimmed */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[url(/phone-light.jpg)] bg-cover bg-center dark:bg-[url(/phone-dark.jpg)]" />
        <div className="relative h-full">
          <HomeScreen onLaunch={(id, o) => launch(id, o)} onDrawer={() => setDrawer(true)} onHome={home} />
        </div>

        <AnimatePresence>{drawer && <AppDrawer key="drawer" onClose={() => setDrawer(false)} onLaunch={(id, o) => launch(id, o)} />}</AnimatePresence>

        <AnimatePresence>
          {open && App && (
            <AppView key={`${open.id}-${open.n}`} id={open.id} origin={open.origin} nav={nav} onClose={home}>
              <App arg={open.arg} />
            </AppView>
          )}
        </AnimatePresence>

        <StatusBar onPull={() => setShade(true)} />
        <AnimatePresence>{shade && <QuickSettings key="qs" onClose={() => setShade(false)} />}</AnimatePresence>
        <AnimatePresence>{hint && <Notification key="hint" onDismiss={dismissHint} />}</AnimatePresence>
      </main>
      <Search open={searchOpen} onOpenChange={setSearchOpen} />
    </OSContext.Provider>
  );
}
