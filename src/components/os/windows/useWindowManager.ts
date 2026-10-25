"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { appById, type AppId } from "../registry";

export const TASKBAR_H = 48;

export type Rect = { x: number; y: number; w: number; h: number };
export type Zone = Rect; // fractions (0–1) of the work area
export type WinState = {
  id: AppId;
  arg?: string;
  z: number;
  mode: "normal" | "max" | "min";
  wasMax: boolean; // restore target after minimize
  rect: Rect;
  restore: Rect | null; // pre-snap size, re-applied when a snapped window is dragged
  minTo: { x: number; y: number } | null; // taskbar icon centre the window shrinks into
};

// Measured in event handlers (never during render) so minimize can fly into the icon.
function taskbarTarget(id: AppId) {
  const el = document.querySelector<HTMLElement>(`[data-taskbar-app="${id}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

const subscribe = (cb: () => void) => {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
};

export function useViewport() {
  const key = useSyncExternalStore(subscribe, () => `${window.innerWidth}x${window.innerHeight}`, () => "1440x900");
  const [w, h] = key.split("x").map(Number);
  return { w, h, workH: h - TASKBAR_H };
}

export const zoneRect = (z: Zone, vw: number, workH: number): Rect => ({
  x: Math.round(z.x * vw),
  y: Math.round(z.y * workH),
  w: Math.round(z.w * vw),
  h: Math.round(z.h * workH),
});

const topZ = (list: WinState[]) => Math.max(0, ...list.map((w) => w.z));

// New window at its default size, centred and cascaded after any already open.
function createWin(id: AppId, list: WinState[], vw: number, workH: number, arg?: string): WinState {
  const { size } = appById(id);
  const w = Math.min(size.w, vw - 40);
  const h = Math.min(size.h, workH - 40);
  const step = (list.length % 5) * 28;
  const x = Math.max(8, Math.round((vw - w) / 2) - 60 + step);
  const y = Math.max(8, Math.round((workH - h) / 2) - 30 + step);
  return { id, arg, z: topZ(list) + 1, mode: "normal", wasMax: false, rect: { x, y, w, h }, restore: null, minTo: null };
}

export function useWindowManager(vw: number, workH: number, initial: AppId[] = []) {
  const [wins, setWins] = useState<WinState[]>(() =>
    initial.reduce<WinState[]>((list, id) => [...list, createWin(id, list, vw, workH)], [])
  );

  const focus = useCallback((id: AppId) => {
    setWins((list) => {
      const z = topZ(list) + 1;
      return list.map((w) => (w.id === id ? { ...w, z, mode: w.mode === "min" ? (w.wasMax ? "max" : "normal") : w.mode } : w));
    });
  }, []);

  const open = useCallback(
    (id: AppId, arg?: string) => {
      setWins((list) => {
        const z = topZ(list) + 1;
        const existing = list.find((w) => w.id === id);
        if (existing) {
          return list.map((w) =>
            w.id === id ? { ...w, z, arg: arg ?? w.arg, mode: w.mode === "min" ? (w.wasMax ? "max" : "normal") : w.mode } : w
          );
        }
        return [...list, createWin(id, list, vw, workH, arg)];
      });
    },
    [vw, workH]
  );

  const close = useCallback((id: AppId) => setWins((list) => list.filter((w) => w.id !== id)), []);

  const minimize = useCallback((id: AppId) => {
    const minTo = taskbarTarget(id);
    setWins((list) => list.map((w) => (w.id === id && w.mode !== "min" ? { ...w, mode: "min", wasMax: w.mode === "max", minTo } : w)));
  }, []);

  const toggleMax = useCallback(
    (id: AppId) => setWins((list) => list.map((w) => (w.id === id ? { ...w, mode: w.mode === "max" ? "normal" : "max" } : w))),
    []
  );

  const snap = useCallback(
    (id: AppId, zone: Zone) =>
      setWins((list) =>
        list.map((w) =>
          w.id === id ? { ...w, mode: "normal", restore: w.restore ?? w.rect, rect: zoneRect(zone, vw, workH) } : w
        )
      ),
    [vw, workH]
  );

  const move = useCallback((id: AppId, rect: Rect, unsnap = false) => {
    setWins((list) => list.map((w) => (w.id === id ? { ...w, mode: "normal", rect, restore: unsnap ? null : w.restore } : w)));
  }, []);

  const visible = wins.filter((w) => w.mode !== "min");
  const focused = visible.length ? visible.reduce((a, b) => (b.z > a.z ? b : a)).id : null;

  return { wins, focused, open, focus, close, minimize, toggleMax, snap, move };
}
