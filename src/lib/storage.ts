// Storage can throw (private mode, blocked cookies), so every access is guarded.
type Area = "local" | "session";

const area = (a: Area) => (a === "local" ? window.localStorage : window.sessionStorage);

export function readStorage(a: Area, key: string): string | null {
  try {
    return area(a).getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(a: Area, key: string, value: string | null) {
  try {
    if (value === null) area(a).removeItem(key);
    else area(a).setItem(key, value);
  } catch {
    // Ignore: the UI still works, it just won't remember.
  }
}

export const KEYS = {
  theme: "ad-theme",
  booted: "ad-booted",
  mobileHint: "ad-mobile-hint-dismissed",
} as const;
