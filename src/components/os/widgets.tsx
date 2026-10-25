"use client";

import {
  ChevronDown,
  ChevronUp,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  FileText,
  Moon,
  Send,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { createElement, useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { currentRole, experienceStats, linkFor, monthIndexOf, profile } from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import { describeWeather, fetchWeather, type Weather, type WeatherKind } from "@/lib/weather";
import { ExternalA, NowDot, Avatar } from "./apps/shared";
import { useNow, useOS } from "./context";

export function WidgetShell({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  const { compact } = useOS();
  return (
    <section
      aria-label={title}
      className={cn(
        "p-4",
        compact ? "rounded-[28px] bg-md-surface-container/85 font-md text-md-on-surface backdrop-blur-xl" : "rounded-lg border border-win-stroke bg-win-layer",
        className
      )}
    >
      {title && (
        <h3 className={cn("mb-2 text-xs font-semibold", compact ? "text-md-primary" : "text-win-text-2")}>{title}</h3>
      )}
      {children}
    </section>
  );
}

export function ProfileWidget({ className }: { className?: string }) {
  const { compact, openApp } = useOS();
  const resume = linkFor("resume");
  return (
    <WidgetShell className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center gap-3">
        <Avatar size={compact ? 60 : 56} />
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">{profile.name}</p>
          <p className={cn("text-sm leading-snug", compact ? "text-md-on-surface-variant" : "text-win-text-2")}>{profile.role}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant={compact ? "filled" : "accent"} className="flex-1" onClick={() => openApp("contact")}>
          <Send /> Hire me
        </Button>
        {resume && (
          <Button variant={compact ? "tonal" : "standard"} className="flex-1" asChild>
            <ExternalA href={resume.href}>
              <FileText /> Résumé
            </ExternalA>
          </Button>
        )}
      </div>
    </WidgetShell>
  );
}

export function NowWidget({ className }: { className?: string }) {
  const { compact, openApp } = useOS();
  const role = currentRole;
  if (!role) return null;
  return (
    <WidgetShell className={className}>
      <button onClick={() => openApp("experience", role.id)} className="block w-full text-left">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">
          <NowDot /> Now
        </span>
        <span className="mt-1.5 block text-base font-semibold leading-snug">{role.role}</span>
        <span className={cn("block text-sm", compact ? "text-md-on-surface-variant" : "text-win-text-2")}>
          {role.company} · Since {role.startLabel}
        </span>
      </button>
    </WidgetShell>
  );
}

const SEGMENTS = ["#60a5fa", "#f59e0b", "#a78bfa", "#34d399", "#f472b6", "#22d3ee"];

export function ExperienceWidget({ className }: { className?: string }) {
  const { compact, openApp } = useOS();
  const now = useNow(60_000);
  const stats = experienceStats(now ? monthIndexOf(now) : undefined);
  const total = stats.companies.reduce((s, c) => s + c.months, 0);
  return (
    <WidgetShell title="Experience" className={className}>
      <button onClick={() => openApp("experience")} className="block w-full text-left" aria-label="Open Experience">
        <span className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold">{stats.label}</span>
          <span className={cn("text-sm", compact ? "text-md-on-surface-variant" : "text-win-text-2")}>
            · {stats.companies.length} organisations
          </span>
        </span>
        <span className="mt-3 flex h-2.5 gap-0.5 overflow-hidden rounded-full">
          {stats.companies.map((c, i) => (
            <span key={c.name} style={{ flexGrow: c.months / total, background: SEGMENTS[i % SEGMENTS.length] }} />
          ))}
        </span>
        <span className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
          {stats.companies.map((c, i) => (
            <span key={c.name} className={cn("flex items-center gap-1.5 text-xs", compact ? "text-md-on-surface-variant" : "text-win-text-2")}>
              <span className="size-2 rounded-full" style={{ background: SEGMENTS[i % SEGMENTS.length] }} />
              {c.name}
            </span>
          ))}
        </span>
      </button>
    </WidgetShell>
  );
}

const DOW = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export function Calendar({ className }: { className?: string }) {
  const { compact } = useOS();
  const now = useNow(60_000);
  const [offset, setOffset] = useState(0);
  if (!now) return <div className={cn("h-64", className)} />;

  const view = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const lead = (view.getDay() + 6) % 7; // Monday-first grid
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(view.getFullYear(), view.getMonth(), i - lead + 1);
    return { d, inMonth: d.getMonth() === view.getMonth(), today: d.toDateString() === now.toDateString() };
  }).slice(0, lead + days > 35 ? 42 : 35);

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold">{view.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
        <div className="flex">
          {[
            { d: -1, Icon: ChevronUp, label: "Previous month" },
            { d: 1, Icon: ChevronDown, label: "Next month" },
          ].map(({ d, Icon, label }) => (
            <button
              key={d}
              onClick={() => setOffset((o) => o + d)}
              aria-label={label}
              className={cn("grid size-7 place-items-center", compact ? "rounded-full" : "rounded-[4px] hover:bg-win-hover")}
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-0.5 text-center text-xs">
        {DOW.map((d) => (
          <span key={d} className="py-1 font-medium opacity-70">
            {d}
          </span>
        ))}
        {cells.map(({ d, inMonth, today }) => (
          <span
            key={d.toISOString()}
            aria-current={today ? "date" : undefined}
            className={cn(
              "mx-auto grid size-8 place-items-center rounded-full",
              !inMonth && "opacity-35",
              today && (compact ? "bg-md-primary font-semibold text-md-on-primary" : "bg-win-accent font-semibold text-win-accent-fg")
            )}
          >
            {d.getDate()}
          </span>
        ))}
      </div>
    </div>
  );
}

export function CalendarWidget({ className }: { className?: string }) {
  return (
    <WidgetShell className={className}>
      <Calendar />
    </WidgetShell>
  );
}

// Open-Meteo, refreshed every 15 minutes. null while loading or offline.
export function useWeather() {
  const [weather, setWeather] = useState<Weather | null>(null);
  useEffect(() => {
    const ctrl = new AbortController();
    const load = () =>
      fetchWeather(profile.coords.lat, profile.coords.lon, ctrl.signal)
        .then(setWeather)
        .catch(() => {});
    load();
    const t = setInterval(load, 15 * 60_000);
    return () => {
      ctrl.abort();
      clearInterval(t);
    };
  }, []);
  return weather;
}

const ICONS: Record<WeatherKind, [day: LucideIcon, night: LucideIcon]> = {
  clear: [Sun, Moon],
  partly: [CloudSun, CloudMoon],
  cloudy: [Cloud, Cloud],
  fog: [CloudFog, CloudFog],
  drizzle: [CloudDrizzle, CloudDrizzle],
  rain: [CloudRain, CloudRain],
  snow: [CloudSnow, CloudSnow],
  storm: [CloudLightning, CloudLightning],
};

export function WeatherIcon({ weather, className, strokeWidth }: { weather: Weather | null; className?: string; strokeWidth?: number }) {
  const icon = weather ? ICONS[describeWeather(weather.code).kind][weather.isDay ? 0 : 1] : Cloud;
  return createElement(icon, { className, strokeWidth, "aria-hidden": true });
}

export const city = profile.location.split(",")[0];

export function WeatherWidget({ className }: { className?: string }) {
  const weather = useWeather();
  const day = weather?.isDay ?? true;
  return (
    <section
      aria-label={`Weather in ${city}`}
      className={cn("flex flex-col justify-between rounded-lg p-4 text-white", className)}
      style={{
        background: day
          ? "linear-gradient(160deg, #3b9cf2 0%, #6ab8f7 55%, #a7d3f5 100%)"
          : "linear-gradient(160deg, #0f1c3d 0%, #243b74 60%, #44558f 100%)",
      }}
    >
      <p className="text-sm font-medium opacity-90">{city}</p>
      {weather ? (
        <div className="flex items-end justify-between">
          <div>
            <p className="text-4xl font-light leading-none">{weather.temp}°</p>
            <p className="mt-1 text-sm">{describeWeather(weather.code).label}</p>
            <p className="text-xs opacity-80">
              H {weather.high}° · L {weather.low}°
            </p>
          </div>
          <WeatherIcon weather={weather} className="size-12 drop-shadow" strokeWidth={1.5} />
        </div>
      ) : (
        <p className="text-sm opacity-80">Loading weather…</p>
      )}
    </section>
  );
}

export function ClockWidget({ className }: { className?: string }) {
  const now = useNow(1_000);
  const { compact } = useOS();
  return (
    <WidgetShell className={cn("flex flex-col justify-center", className)}>
      <p className="text-4xl font-light tabular-nums tracking-tight">
        {now ? now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" }) : " "}
      </p>
      <p className={cn("mt-1 text-sm", compact ? "text-md-on-surface-variant" : "text-win-text-2")}>
        {now ? now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : " "}
      </p>
    </WidgetShell>
  );
}
