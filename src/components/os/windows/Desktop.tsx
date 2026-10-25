"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { profile } from "@/lib/portfolio";
import { APP_COMPONENTS } from "../apps";
import { OSContext } from "../context";
import type { AppId } from "../registry";
import { Search } from "../Search";
import { CalendarFlyout } from "./CalendarFlyout";
import { ContextMenu, type IconSize } from "./ContextMenu";
import { DesktopIcons } from "./DesktopIcons";
import { Backdrop, useEscape } from "./Flyout";
import { StartMenu } from "./StartMenu";
import { Taskbar, type FlyoutId } from "./Taskbar";
import { Toast } from "./Toast";
import { useViewport, useWindowManager } from "./useWindowManager";
import { Wallpaper } from "./Wallpaper";
import { WidgetsBoard } from "./WidgetsBoard";
import { Window } from "./Window";

export function Desktop({ onRestart }: { onRestart: () => void }) {
  const viewport = useViewport();
  // Recruiters land on About; mobile starts on the home screen instead.
  const wm = useWindowManager(viewport.w, viewport.workH, ["about"]);
  const [flyout, setFlyout] = useState<FlyoutId>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [iconSize, setIconSize] = useState<IconSize>("medium");
  const [showIcons, setShowIcons] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [toast, setToast] = useState(false);

  const closeFlyout = useCallback(() => setFlyout(null), []);
  useEscape(flyout !== null, closeFlyout);
  useEscape(menu !== null, () => setMenu(null));

  const openApp = useCallback(
    (id: AppId, arg?: string) => {
      setFlyout(null);
      wm.open(id, arg);
    },
    [wm]
  );

  const os = useMemo(
    () => ({ compact: false, openApp, openSearch: () => setSearchOpen(true), setNav: () => {} }),
    [openApp]
  );

  // Toast once, a few seconds after the desktop appears
  useEffect(() => {
    const t = setTimeout(() => setToast(true), 3000);
    return () => clearTimeout(t);
  }, []);

  // Alt+W close, Alt+M minimize, Alt+` cycle. Win+… and Ctrl+W belong to the OS/browser.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.code === "KeyW" && wm.focused) wm.close(wm.focused);
      else if (e.code === "KeyM" && wm.focused) wm.minimize(wm.focused);
      else if (e.code === "Backquote" && wm.wins.length) {
        const order = [...wm.wins].sort((a, b) => a.z - b.z);
        wm.focus(order[0].id); // bring the bottom-most window to the front
      } else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [wm]);

  const onTaskbarApp = (id: AppId) => {
    setFlyout(null);
    const win = wm.wins.find((w) => w.id === id);
    if (!win) wm.open(id);
    else if (win.mode === "min") wm.focus(id);
    else if (wm.focused === id) wm.minimize(id);
    else wm.focus(id);
  };

  return (
    <OSContext.Provider value={os}>
      <main
        className="fixed inset-0 overflow-hidden font-win"
        onPointerDown={() => setSelected(null)}
        onContextMenu={(e) => {
          if ((e.target as HTMLElement).closest("[role=dialog],nav")) return;
          e.preventDefault();
          setFlyout(null);
          setMenu({ x: e.clientX, y: e.clientY });
        }}
      >
        <Wallpaper />
        <h1 className="sr-only">{profile.name} — portfolio desktop</h1>

        <AnimatePresence>
          {showIcons && (
            <motion.div key={refreshKey} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DesktopIcons size={iconSize} selected={selected} setSelected={setSelected} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {wm.wins.map((w) => {
            const App = APP_COMPONENTS[w.id];
            return (
              <Window
                key={w.id}
                win={w}
                focused={wm.focused === w.id}
                viewport={viewport}
                onFocus={() => wm.focus(w.id)}
                onClose={() => wm.close(w.id)}
                onMinimize={() => wm.minimize(w.id)}
                onToggleMax={() => wm.toggleMax(w.id)}
                onSnap={(z) => wm.snap(w.id, z)}
                onMove={(r, unsnap) => wm.move(w.id, r, unsnap)}
              >
                <App key={w.arg ?? ""} arg={w.arg} />
              </Window>
            );
          })}
        </AnimatePresence>
      </main>

      {flyout && <Backdrop onClose={closeFlyout} />}
      <AnimatePresence>
        {flyout === "start" && <StartMenu key="start" onClose={closeFlyout} onSearch={() => setSearchOpen(true)} onRestart={onRestart} />}
        {flyout === "widgets" && <WidgetsBoard key="widgets" />}
        {flyout === "calendar" && <CalendarFlyout key="calendar" />}
      </AnimatePresence>

      {menu && <Backdrop onClose={() => setMenu(null)} z={690} coverTaskbar />}
      <AnimatePresence>
        {menu && (
          <ContextMenu
            at={menu}
            onClose={() => setMenu(null)}
            onRefresh={() => setRefreshKey((k) => k + 1)}
            iconSize={iconSize}
            setIconSize={setIconSize}
            showIcons={showIcons}
            setShowIcons={setShowIcons}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <Toast
            onClose={() => setToast(false)}
            onAction={() => {
              setToast(false);
              setSearchOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      <Taskbar
        wins={wm.wins}
        focused={wm.focused}
        flyout={flyout}
        setFlyout={setFlyout}
        onAppClick={onTaskbarApp}
        onSearch={() => {
          setFlyout(null);
          setSearchOpen(true);
        }}
      />
      <Search open={searchOpen} onOpenChange={setSearchOpen} />
    </OSContext.Provider>
  );
}
