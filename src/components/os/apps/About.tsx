"use client";

import { GraduationCap, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { companyCount, education, experienceStats, monthIndexOf, profile, projects, publications } from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import { useNow, useOS } from "../context";
import { AppIcon } from "../AppIcon";
import type { AppId } from "../registry";
import { appById } from "../registry";
import { AppScroll, Avatar, SectionTitle } from "./shared";

const JUMPS: AppId[] = ["experience", "projects", "research", "contact"];

export default function About() {
  const { compact, openApp } = useOS();
  const now = useNow(60_000);
  const stats = experienceStats(now ? monthIndexOf(now) : undefined);

  const tiles = [
    { label: "Experience", value: stats.label },
    { label: "Organisations", value: String(companyCount) },
    { label: "Highlights", value: String(projects.length) },
    { label: "Papers", value: String(publications.length) },
  ];

  return (
    <AppScroll compact={compact} className="space-y-5">
      <header className={cn("flex items-center gap-4", compact && "flex-col text-center")}>
        <Avatar size={compact ? 96 : 84} className={compact ? "" : "ring-2 ring-win-stroke"} />
        <div className="min-w-0">
          <h2 className={cn("font-semibold tracking-tight", compact ? "text-2xl" : "text-2xl")}>{profile.name}</h2>
          <p className={compact ? "text-md-on-surface-variant" : "text-win-text-2"}>{profile.role}</p>
          <p
            className={cn(
              "mt-1 flex items-center gap-1 text-sm",
              compact ? "justify-center text-md-on-surface-variant" : "text-win-text-2"
            )}
          >
            <MapPin className="size-3.5" aria-hidden /> {profile.location}
          </p>
          {profile.status && (
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
              <span className="size-1.5 rounded-full bg-green-500" /> {profile.status}
            </span>
          )}
        </div>
      </header>

      <p className={cn("leading-relaxed", compact ? "text-md-on-surface" : "text-[15px] text-win-text")}>{profile.bio}</p>

      <div className={cn("grid gap-2", compact ? "grid-cols-2" : "grid-cols-4")}>
        {tiles.map((t) => (
          <Card key={t.label} compact={compact} className={compact ? "p-3" : "p-3"}>
            <p className={cn("text-lg font-semibold", compact && "text-md-primary")}>{t.value}</p>
            <p className={cn("text-xs", compact ? "text-md-on-surface-variant" : "text-win-text-2")}>{t.label}</p>
          </Card>
        ))}
      </div>

      <section className="space-y-2">
        <SectionTitle compact={compact}>Education</SectionTitle>
        {education.map((e) => (
          <Card key={e.institution} compact={compact} className="flex items-start gap-3">
            <GraduationCap className={cn("mt-0.5 size-5 shrink-0", compact ? "text-md-primary" : "text-win-accent")} aria-hidden />
            <div>
              <p className="font-medium">{e.institution}</p>
              <p className={cn("text-sm", compact ? "text-md-on-surface-variant" : "text-win-text-2")}>{e.degree}</p>
              <p className={cn("text-sm", compact ? "text-md-on-surface-variant" : "text-win-text-2")}>
                {e.years} · {e.grade}
              </p>
            </div>
          </Card>
        ))}
      </section>

      <section className="space-y-2">
        <SectionTitle compact={compact}>Explore</SectionTitle>
        <div className={cn("grid gap-2", compact ? "grid-cols-2" : "grid-cols-4")}>
          {JUMPS.map((id) => (
            <button
              key={id}
              onClick={() => openApp(id)}
              className={cn(
                "flex items-center gap-3 p-3 text-left text-sm font-medium transition-colors",
                compact
                  ? "rounded-2xl bg-md-surface-container active:bg-md-surface-container-highest"
                  : "rounded-lg border border-win-stroke bg-win-layer-2 hover:bg-win-hover"
              )}
            >
              <AppIcon id={id} compact={compact} className={compact ? "size-9" : "size-7"} />
              {appById(id).title}
            </button>
          ))}
        </div>
      </section>
    </AppScroll>
  );
}
