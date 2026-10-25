"use client";

import { Check, Copy, FileText, Mail, MapPin } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { FaLinkedin } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { linkFor, profile } from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import { useNow, useOS } from "../context";
import { AppScroll, ExternalA } from "./shared";

function useLocalTime() {
  const now = useNow(15_000);
  if (!now) return null;
  const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-IN", { timeZone: profile.timeZone, ...o }).format(now);
  return {
    time: fmt({ hour: "numeric", minute: "2-digit" }),
    day: fmt({ weekday: "long", day: "numeric", month: "short" }),
    zone: fmt({ timeZoneName: "shortOffset" }).split(" ").pop(),
  };
}

export default function Contact() {
  const { compact } = useOS();
  const [copied, setCopied] = useState(false);
  const local = useLocalTime();
  const linkedin = linkFor("linkedin");
  const resume = linkFor("resume");
  const muted = compact ? "text-md-on-surface-variant" : "text-win-text-2";

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const row = (icon: ReactNode, title: string, sub: string, actions: ReactNode) => (
    <Card compact={compact} className="flex flex-wrap items-center gap-3">
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center",
          compact ? "rounded-full bg-md-primary-container text-md-on-primary-container" : "rounded-md bg-win-accent-soft text-win-accent"
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium">{title}</p>
        <p className={cn("truncate text-sm", muted)}>{sub}</p>
      </div>
      <div className="flex gap-2">{actions}</div>
    </Card>
  );

  return (
    <AppScroll compact={compact} className="space-y-3">
      {!compact && (
        <div className="mb-1">
          <h2 className="text-xl font-semibold">Get in touch</h2>
          <p className="text-sm text-win-text-2">Email is the fastest way to reach {profile.firstName}.</p>
        </div>
      )}
      {row(
        <Mail className="size-5" aria-hidden />,
        "Email",
        profile.email,
        <>
          <Button variant={compact ? "tonal" : "standard"} onClick={copy} aria-label="Copy email address" aria-live="polite">
            {copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant={compact ? "filled" : "accent"} asChild>
            <a href={`mailto:${profile.email}`}>Send</a>
          </Button>
        </>
      )}
      {linkedin &&
        row(
          <FaLinkedin className="size-5" aria-hidden />,
          "LinkedIn",
          linkedin.href.replace(/^https?:\/\/(www\.)?/, ""),
          <Button variant={compact ? "tonal" : "standard"} asChild>
            <ExternalA href={linkedin.href}>Connect</ExternalA>
          </Button>
        )}
      {resume &&
        row(
          <FileText className="size-5" aria-hidden />,
          "Résumé",
          "Google Drive · PDF",
          <Button variant={compact ? "tonal" : "standard"} asChild>
            <ExternalA href={resume.href}>Open</ExternalA>
          </Button>
        )}
      {row(
        <MapPin className="size-5" aria-hidden />,
        profile.location,
        local ? `${local.time} local time · ${local.day} · ${local.zone}` : profile.timeZone,
        null
      )}
    </AppScroll>
  );
}
