import { argbFromHex, hexFromArgb, themeFromSourceColor, type Scheme } from "@material/material-color-utilities";

// Material You tonal palette from a single seed, emitted as CSS variables (--md-*).
const ROLES = [
  "primary",
  "onPrimary",
  "primaryContainer",
  "onPrimaryContainer",
  "secondary",
  "onSecondary",
  "secondaryContainer",
  "onSecondaryContainer",
  "tertiary",
  "onTertiary",
  "tertiaryContainer",
  "onTertiaryContainer",
  "error",
  "background",
  "onBackground",
  "surface",
  "onSurface",
  "surfaceVariant",
  "onSurfaceVariant",
  "outline",
  "outlineVariant",
  "inverseSurface",
  "inverseOnSurface",
] as const;

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

function vars(scheme: Scheme, extra: Record<string, number>) {
  const json = scheme.toJSON() as Record<string, number>;
  const lines = ROLES.map((r) => `--md-${kebab(r)}:${hexFromArgb(json[r])};`);
  for (const [k, v] of Object.entries(extra)) lines.push(`--md-${k}:${hexFromArgb(v)};`);
  return lines.join("");
}

export function materialCss(seed: string) {
  const theme = themeFromSourceColor(argbFromHex(seed));
  const n = theme.palettes.neutral;
  // Surface-container tones from the M3 spec (not in the legacy Scheme object)
  const light = { "surface-container-low": n.tone(96), "surface-container": n.tone(94), "surface-container-high": n.tone(92), "surface-container-highest": n.tone(90) };
  const dark = { "surface-container-low": n.tone(10), "surface-container": n.tone(12), "surface-container-high": n.tone(17), "surface-container-highest": n.tone(22) };
  return `:root{${vars(theme.schemes.light, light)}}.dark{${vars(theme.schemes.dark, dark)}}`;
}
