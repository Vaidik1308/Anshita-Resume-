"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BookOpenText, BriefcaseBusiness, CornerDownLeft, FileText, Mail, Search as SearchIcon, Sparkles, Trophy } from "lucide-react";
import { useEffect, useId, useMemo, useState, type ComponentType, type KeyboardEvent } from "react";
import { FaLinkedin } from "react-icons/fa6";
import { allSkills, externalLinks, projects, publications, roles } from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import { useOS } from "./context";
import { AppIcon } from "./AppIcon";
import { APPS, type AppId } from "./registry";

type Item = {
  key: string;
  title: string;
  subtitle: string;
  kind: string;
  icon: ComponentType<{ className?: string }>;
  run: (openApp: (id: AppId, arg?: string) => void) => void;
};

const LINK_ICONS = { email: Mail, linkedin: FaLinkedin, resume: FileText } as const;

const ITEMS: Item[] = [
  ...APPS.map((a) => ({
    key: `app:${a.id}`,
    title: a.title,
    subtitle: "App",
    kind: "App",
    icon: ({ className }: { className?: string }) => <AppIcon id={a.id} className={cn("size-5", className)} />,
    run: (open: (id: AppId) => void) => open(a.id),
  })),
  ...externalLinks.map((l) => ({
    key: `link:${l.id}`,
    title: l.label,
    subtitle: l.href.replace(/^mailto:/, ""),
    kind: "Link",
    icon: LINK_ICONS[l.id],
    run: () => {
      if (l.id === "email") window.location.href = l.href;
      else window.open(l.href, "_blank", "noopener,noreferrer");
    },
  })),
  ...roles.map((r) => ({
    key: `role:${r.id}`,
    title: r.role,
    subtitle: `${r.company} · ${r.startLabel}${r.current ? " – Present" : ""}`,
    kind: "Experience",
    icon: BriefcaseBusiness,
    run: (open: (id: AppId, arg?: string) => void) => open("experience", r.id),
  })),
  ...projects.map((p) => ({
    key: `project:${p.slug}`,
    title: p.name,
    subtitle: `${p.summary} ${p.tech.join(" ")}`,
    kind: "Highlight",
    icon: Trophy,
    run: (open: (id: AppId, arg?: string) => void) => open("projects", p.slug),
  })),
  ...publications.map((p) => ({
    key: `paper:${p.slug}`,
    title: p.title,
    subtitle: `${p.publisher} · ${p.venue}`,
    kind: "Research",
    icon: BookOpenText,
    run: (open: (id: AppId, arg?: string) => void) => open("research", p.slug),
  })),
  ...allSkills.map((s) => ({
    key: `skill:${s}`,
    title: s,
    subtitle: "Skill",
    kind: "Skill",
    icon: Sparkles,
    run: (open: (id: AppId) => void) => open("skills"),
  })),
];

// Ranked: title prefix > title contains > subtitle contains. At most 12.
export function rank(query: string): Item[] {
  const q = query.trim().toLowerCase();
  if (!q) return ITEMS.filter((i) => i.kind === "App" || i.kind === "Link");
  return ITEMS.map((item) => {
    const t = item.title.toLowerCase();
    const score = t.startsWith(q) || t.split(/\s+/).some((w) => w.startsWith(q)) ? 3 : t.includes(q) ? 2 : item.subtitle.toLowerCase().includes(q) ? 1 : 0;
    return { item, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((r) => r.item);
}

function Palette({ onClose }: { onClose: () => void }) {
  const { compact, openApp } = useOS();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const results = useMemo(() => rank(query), [query]);
  const listId = useId();
  const optionId = (i: number) => `${listId}-opt-${i}`;
  const current = Math.min(active, Math.max(results.length - 1, 0));

  const choose = (item: Item | undefined) => {
    if (!item) return;
    onClose();
    item.run(openApp);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((current + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((current - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[current]);
    }
  };

  return (
    <>
      <div className={cn("flex items-center gap-3 px-4", compact ? "h-14" : "h-12 border-b border-win-stroke")}>
        {compact ? (
          <DialogPrimitive.Close aria-label="Close search" className="-ml-1 grid size-10 place-items-center rounded-full">
            <ArrowLeft className="size-5" />
          </DialogPrimitive.Close>
        ) : (
          <SearchIcon className="size-4 text-win-text-2" aria-hidden />
        )}
        <input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search apps, roles, highlights, skills…"
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls={listId}
          aria-activedescendant={results.length ? optionId(current) : undefined}
          aria-autocomplete="list"
          aria-label="Search the portfolio"
          className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:opacity-60 focus-visible:outline-none"
        />
      </div>
      <ul id={listId} role="listbox" aria-label="Results" className="scroll-thin max-h-[min(60dvh,440px)] overflow-y-auto p-2">
        {!query && <li className="px-3 pb-1 pt-1 text-xs font-semibold opacity-60" role="presentation">Suggested</li>}
        {results.map((item, i) => {
          const Icon = item.icon;
          const selected = i === current;
          return (
            <li
              key={item.key}
              id={optionId(i)}
              role="option"
              aria-selected={selected}
              onMouseMove={() => setActive(i)}
              onClick={() => choose(item)}
              className={cn(
                "relative flex cursor-pointer items-center gap-3 px-3 py-2",
                compact ? "rounded-full" : "rounded-[4px]",
                selected &&
                  (compact
                    ? "bg-md-secondary-container text-md-on-secondary-container"
                    : "bg-win-accent-soft before:absolute before:left-0 before:top-1/2 before:h-4 before:w-[3px] before:-translate-y-1/2 before:rounded-full before:bg-win-accent")
              )}
            >
              <Icon className="size-5 shrink-0 opacity-90" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{item.title}</span>
                <span className="block truncate text-xs opacity-65">{item.subtitle}</span>
              </span>
              <span className="shrink-0 text-[11px] opacity-60">{item.kind}</span>
              {selected && !compact && <CornerDownLeft className="size-3.5 opacity-60" aria-hidden />}
            </li>
          );
        })}
        {results.length === 0 && (
          <li role="presentation" className="px-3 py-8 text-center text-sm opacity-70">
            No results for “{query}”
          </li>
        )}
      </ul>
    </>
  );
}

export function Search({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { compact } = useOS();

  // Ctrl+K / ⌘K toggles the palette from anywhere. e.code keeps it layout-independent.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.code === "KeyK") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[950] bg-black/30"
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.22 }}
              />
            </DialogPrimitive.Overlay>
            <div
              className={cn(
                "pointer-events-none fixed inset-0 z-[951] flex justify-center",
                compact ? "items-start p-3 pt-[max(12px,env(safe-area-inset-top))]" : "items-start pt-[14vh]"
              )}
            >
              <DialogPrimitive.Content asChild forceMount aria-describedby={undefined}>
                <motion.div
                  className={cn(
                    "pointer-events-auto w-full overflow-hidden",
                    compact
                      ? "android rounded-[28px] bg-md-surface-container-high font-md text-md-on-surface"
                      : "acrylic max-w-[640px] rounded-lg bg-win-flyout text-win-text shadow-win"
                  )}
                  initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                >
                  <DialogPrimitive.Title className="sr-only">Search</DialogPrimitive.Title>
                  <Palette onClose={() => onOpenChange(false)} />
                </motion.div>
              </DialogPrimitive.Content>
            </div>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
