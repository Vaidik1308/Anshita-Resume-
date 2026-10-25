"use client";

import { Award, Building2, CalendarDays, ChevronRight, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { monthIndexOf, monthsLabel, roleMonths, rolePeriod, roles, trainings, type Role } from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import { useNow, useOS } from "../context";
import { HireCard } from "./HireCard";
import { AppScroll, NowDot, SectionTitle } from "./shared";

const TRAINING = "training";

function useDuration() {
  const now = useNow(60_000);
  return (r: Role) => (now ? monthsLabel(roleMonths(r, monthIndexOf(now))) : null);
}

function RoleDetail({ role }: { role: Role }) {
  const { compact } = useOS();
  const duration = useDuration()(role);
  const muted = compact ? "text-md-on-surface-variant" : "text-win-text-2";
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">{role.role}</h2>
        <p className={cn("mt-0.5 flex items-center gap-1.5", compact ? "text-md-primary" : "text-win-accent")}>
          <Building2 className="size-4" aria-hidden /> {role.company}
        </p>
        <div className={cn("mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm", muted)}>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4" aria-hidden />
            {rolePeriod(role)}
            {duration && ` · ${duration}`}
          </span>
          {role.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden /> {role.location}
            </span>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {role.current && (
            <Badge compact={compact} className="border-green-500/40 text-green-600 dark:text-green-400">
              <NowDot className="size-1.5" /> Current
            </Badge>
          )}
          <Badge compact={compact}>{role.type}</Badge>
          {role.mode && <Badge compact={compact}>{role.mode}</Badge>}
        </div>
      </div>
      {role.bullets.length > 0 && (
        <ul className="list-disc space-y-1.5 pl-5 leading-relaxed marker:text-current/40">
          {role.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
      {role.tech.length > 0 && (
        <div className="space-y-2">
          <SectionTitle compact={compact}>Skills used</SectionTitle>
          <div className="flex flex-wrap gap-1.5">
            {role.tech.map((t) => (
              <Badge key={t} compact={compact}>
                {t}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TrainingDetail() {
  const { compact } = useOS();
  const muted = compact ? "text-md-on-surface-variant" : "text-win-text-2";
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Workshops & conferences</h2>
      {trainings.map((t) => (
        <Card key={t.title} compact={compact}>
          <p className="font-medium">{t.title}</p>
          <p className={cn("text-sm", muted)}>
            {t.provider} · {t.date}
            {t.mode && ` · ${t.mode}`}
          </p>
          {t.bullets.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
              {t.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
        </Card>
      ))}
    </div>
  );
}

// Desktop: two panes. Android: list that drills into a detail page.
export default function Experience({ arg }: { arg?: string }) {
  const { compact, setNav } = useOS();
  const valid = arg && (arg === TRAINING || roles.some((r) => r.id === arg)) ? arg : null;
  const [selected, setSelected] = useState<string | null>(valid ?? (compact ? null : roles[0]?.id ?? null));
  const duration = useDuration();
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, []);

  useEffect(() => {
    if (!compact) return;
    setNav(selected ? { label: "Experience", onBack: () => setSelected(null) } : null);
    return () => setNav(null);
  }, [compact, selected, setNav]);

  const role = roles.find((r) => r.id === selected);
  const detail = selected === TRAINING ? <TrainingDetail /> : role ? <RoleDetail role={role} /> : null;

  if (compact) {
    if (detail) {
      return (
        <AppScroll compact className="space-y-4">
          <Card compact>{detail}</Card>
          <HireCard />
        </AppScroll>
      );
    }
    return (
      <AppScroll compact className="space-y-3">
        <div className="overflow-hidden rounded-3xl bg-md-surface-container-high">
          {roles.map((r, i) => (
            <button
              key={r.id}
              onClick={() => setSelected(r.id)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-md-on-surface/10",
                i > 0 && "border-t border-md-outline-variant/60"
              )}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-md-secondary-container text-sm font-semibold text-md-on-secondary-container">
                {r.company[0]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 font-medium">
                  <span className="truncate">{r.role}</span>
                  {r.current && <NowDot />}
                </span>
                <span className="block truncate text-sm text-md-on-surface-variant">
                  {r.company} · {r.startLabel}
                  {r.current ? " – Present" : ""}
                </span>
              </span>
              <ChevronRight className="size-5 text-md-on-surface-variant" aria-hidden />
            </button>
          ))}
          <button
            onClick={() => setSelected(TRAINING)}
            className="flex w-full items-center gap-3 border-t border-md-outline-variant/60 px-4 py-3.5 text-left active:bg-md-on-surface/10"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-md-tertiary-container text-md-on-tertiary-container">
              <Award className="size-5" aria-hidden />
            </span>
            <span className="flex-1 font-medium">Workshops & conferences</span>
            <ChevronRight className="size-5 text-md-on-surface-variant" aria-hidden />
          </button>
        </div>
        <HireCard />
      </AppScroll>
    );
  }

  const item = (active: boolean) =>
    cn(
      "relative flex w-full items-start gap-2.5 rounded-[4px] px-3 py-2.5 text-left transition-colors",
      active
        ? "bg-win-accent-soft before:absolute before:left-0 before:top-1/2 before:h-4 before:w-[3px] before:-translate-y-1/2 before:rounded-full before:bg-win-accent"
        : "hover:bg-win-hover"
    );

  return (
    <div className="flex h-full">
      <nav aria-label="Roles" className="scroll-thin w-72 shrink-0 space-y-0.5 overflow-y-auto border-r border-win-stroke p-2">
        {roles.map((r) => {
          const active = r.id === selected;
          return (
            <button
              key={r.id}
              ref={active ? activeRef : undefined}
              aria-current={active || undefined}
              onClick={() => setSelected(r.id)}
              className={item(active)}
            >
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span className="truncate">{r.role}</span>
                  {r.current && <NowDot />}
                </span>
                <span className="block truncate text-xs text-win-text-2">{r.company}</span>
                <span className="block text-xs text-win-text-2">
                  {rolePeriod(r)}
                  {duration(r) && ` · ${duration(r)}`}
                </span>
              </span>
            </button>
          );
        })}
        <div className="mx-2 my-2 border-t border-win-stroke" />
        <button
          ref={selected === TRAINING ? activeRef : undefined}
          aria-current={selected === TRAINING || undefined}
          onClick={() => setSelected(TRAINING)}
          className={item(selected === TRAINING)}
        >
          <Award className="mt-0.5 size-4 text-win-accent" aria-hidden />
          <span className="text-sm font-medium">Workshops & conferences</span>
        </button>
      </nav>
      <AppScroll compact={false} className="flex-1 space-y-6">
        {detail}
        <HireCard />
      </AppScroll>
    </div>
  );
}
