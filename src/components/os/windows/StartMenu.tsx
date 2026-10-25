"use client";

import { motion } from "framer-motion";
import { BookOpenText, BriefcaseBusiness, FileText, Mail, Power, Search as SearchIcon, Trophy } from "lucide-react";
import type { ComponentType } from "react";
import { FaLinkedin } from "react-icons/fa6";
import { currentRole, linkFor, profile, projects, publications } from "@/lib/portfolio";
import { Avatar } from "../apps/shared";
import { AppIcon } from "../AppIcon";
import { useOS } from "../context";
import { APPS } from "../registry";

type Rec = { key: string; title: string; sub: string; icon: ComponentType<{ className?: string }>; run: () => void };

export function StartMenu({ onClose, onSearch, onRestart }: { onClose: () => void; onSearch: () => void; onRestart: () => void }) {
  const { openApp } = useOS();
  const resume = linkFor("resume");
  const linkedin = linkFor("linkedin");
  const go = (fn: () => void) => () => {
    onClose();
    fn();
  };
  const openExternal = (href: string) => window.open(href, "_blank", "noopener,noreferrer");

  const role = currentRole;
  const recommended: Rec[] = [
    ...(resume ? [{ key: "resume", title: "Résumé", sub: "Google Drive · PDF", icon: FileText, run: () => openExternal(resume.href) }] : []),
    ...(role
      ? [{ key: "role", title: role.role, sub: `${role.company} · Latest role`, icon: BriefcaseBusiness, run: () => openApp("experience", role.id) }]
      : []),
    ...publications.slice(0, 1).map((p) => ({ key: p.slug, title: `${p.kind} paper`, sub: p.title, icon: BookOpenText, run: () => openApp("research", p.slug) })),
    ...projects.slice(0, 3).map((p) => ({ key: p.slug, title: p.name, sub: "Highlight", icon: Trophy, run: () => openApp("projects", p.slug) })),
  ].slice(0, 6);

  return (
    <motion.div
      role="dialog"
      aria-label="Start"
      className="acrylic fixed bottom-[60px] left-1/2 z-[610] flex max-h-[calc(100dvh-72px)] w-[min(640px,calc(100vw-24px))] flex-col overflow-hidden rounded-lg bg-win-flyout text-win-text shadow-win"
      style={{ x: "-50%" }}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 60, transition: { duration: 0.16 } }}
      transition={{ type: "spring", stiffness: 420, damping: 36 }}
    >
      <div className="scroll-thin flex-1 overflow-y-auto px-8 pb-4 pt-6">
        <button
          onClick={go(onSearch)}
          className="flex h-9 w-full items-center gap-2.5 rounded-full border border-win-stroke border-b-win-accent bg-win-layer px-4 text-sm text-win-text-2 hover:bg-win-hover"
        >
          <SearchIcon className="size-4" aria-hidden /> Search for apps, roles, highlights…
        </button>

        <h2 className="mb-2 mt-6 text-sm font-semibold">Pinned</h2>
        <div className="grid grid-cols-6 gap-1">
          {APPS.map((a) => (
            <button key={a.id} onClick={go(() => openApp(a.id))} className="flex flex-col items-center gap-1.5 rounded-[4px] px-1 py-3 text-xs hover:bg-win-hover">
              <AppIcon id={a.id} className="size-8" />
              <span className="truncate">{a.title}</span>
            </button>
          ))}
          {[
            { key: "mail", label: "Email", icon: Mail, href: `mailto:${profile.email}` },
            ...(linkedin ? [{ key: "li", label: "LinkedIn", icon: FaLinkedin, href: linkedin.href }] : []),
            ...(resume ? [{ key: "cv", label: "Résumé", icon: FileText, href: resume.href }] : []),
          ].map(({ key, label, icon: Icon, href }) => (
            <button
              key={key}
              onClick={go(() => (href.startsWith("mailto:") ? (window.location.href = href) : openExternal(href)))}
              className="flex flex-col items-center gap-1.5 rounded-[4px] px-1 py-3 text-xs hover:bg-win-hover"
            >
              <span className="grid size-8 place-items-center rounded-[22%] bg-win-layer text-win-accent ring-1 ring-win-stroke">
                <Icon className="size-[18px]" />
              </span>
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>

        <h2 className="mb-2 mt-5 text-sm font-semibold">Recommended</h2>
        <div className="grid grid-cols-2 gap-1">
          {recommended.map((r) => (
            <button key={r.key} onClick={go(r.run)} className="flex min-w-0 items-center gap-3 rounded-[4px] px-3 py-2 text-left hover:bg-win-hover">
              <r.icon className="size-6 shrink-0 text-win-accent" />
              <span className="min-w-0">
                <span className="block truncate text-xs font-medium">{r.title}</span>
                <span className="block truncate text-xs text-win-text-2">{r.sub}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <footer className="flex h-16 shrink-0 items-center justify-between border-t border-win-stroke bg-win-layer-2 px-12">
        <button onClick={go(() => openApp("about"))} className="flex items-center gap-3 rounded-[4px] px-2 py-1.5 hover:bg-win-hover">
          <Avatar size={32} />
          <span className="text-xs font-medium">{profile.name}</span>
        </button>
        <button aria-label="Restart (replay boot screen)" title="Restart" onClick={go(onRestart)} className="grid size-9 place-items-center rounded-[4px] hover:bg-win-hover">
          <Power className="size-4" />
        </button>
      </footer>
    </motion.div>
  );
}
