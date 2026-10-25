"use client";

import { ExternalLink, FolderKanban } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatMonth, parseMonth, profile, projects, publications } from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import { useOS } from "../context";
import { AppScroll, ExternalA, SectionTitle } from "./shared";

export default function Research({ arg }: { arg?: string }) {
  const { compact, openApp } = useOS();
  const muted = compact ? "text-md-on-surface-variant" : "text-win-text-2";
  // Deep-linked paper first; the rest follow in data order.
  const list = [...publications].sort((a, b) => Number(b.slug === arg) - Number(a.slug === arg));

  return (
    <AppScroll compact={compact} className="space-y-6">
      {list.map((p) => {
        const project = projects.find((x) => x.publication === p.slug);
        return (
          <article key={p.slug} className="space-y-4">
            <div className="flex flex-wrap gap-1.5">
              <Badge compact={compact} className={compact ? "border-transparent bg-md-primary-container text-md-on-primary-container" : "bg-win-accent-soft text-win-accent"}>
                {p.kind} · {p.publisher}
              </Badge>
              <Badge compact={compact}>{formatMonth(parseMonth(p.published))}</Badge>
            </div>
            <h2 className={cn("font-semibold leading-snug tracking-tight", compact ? "text-xl" : "text-2xl")}>{p.title}</h2>
            <p className={cn("text-sm", muted)}>
              In <span className="italic">{p.venue}</span>
              {p.series && ` · ${p.series}`}
              {p.pages && ` · pp. ${p.pages}`}
            </p>
            {p.authors.length > 0 && <p className="text-sm">
              {p.authors.map((a, i) => (
                <span key={a}>
                  {i > 0 && ", "}
                  <span className={a === profile.name ? cn("font-semibold", compact ? "text-md-primary" : "text-win-accent") : ""}>{a}</span>
                </span>
              ))}
            </p>}
            <div className="flex flex-wrap gap-2 empty:hidden">
              {p.url && (
                <Button variant={compact ? "filled" : "accent"} asChild>
                  <ExternalA href={p.url}>
                    <ExternalLink /> Read the paper
                  </ExternalA>
                </Button>
              )}
              {p.doiUrl && (
                <Button variant={compact ? "outlined" : "standard"} asChild>
                  <ExternalA href={p.doiUrl}>DOI {p.doi}</ExternalA>
                </Button>
              )}
              {project && (
                <Button variant={compact ? "text" : "subtle"} onClick={() => openApp("projects", project.slug)}>
                  <FolderKanban /> Project: {project.name}
                </Button>
              )}
            </div>

            <Card compact={compact}>
              <p className="leading-relaxed">{p.summary}</p>
            </Card>

            {p.highlights.length > 0 && <section className="space-y-2">
              <SectionTitle compact={compact}>What the paper covers</SectionTitle>
              <ul className={cn("grid gap-2", !compact && "grid-cols-2")}>
                {p.highlights.map((h) => (
                  <li
                    key={h}
                    className={cn(
                      "rounded-lg p-3 text-sm leading-relaxed",
                      compact ? "rounded-2xl bg-md-surface-container" : "border border-win-stroke bg-win-layer-2"
                    )}
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </section>}

            {p.images.length > 0 && (
              <section className="space-y-2">
                <SectionTitle compact={compact}>From the build</SectionTitle>
                <div className={cn("grid gap-2", compact ? "grid-cols-2" : "grid-cols-3")}>
                  {p.images.map((img) => (
                    <Image
                      key={img.src}
                      src={img.src}
                      alt={img.alt}
                      width={480}
                      height={360}
                      className={cn("aspect-[4/3] w-full object-cover", compact ? "rounded-2xl" : "rounded-md")}
                    />
                  ))}
                </div>
              </section>
            )}
          </article>
        );
      })}
    </AppScroll>
  );
}
