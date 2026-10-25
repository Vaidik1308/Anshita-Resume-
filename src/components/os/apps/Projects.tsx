"use client";

import { BookOpenText, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { projects, type Project } from "@/lib/portfolio";
import type { ProjectStatus } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useOS } from "../context";
import { ScaledMockup } from "./mockups";
import { AppScroll, ExternalA } from "./shared";

const STATUS: Record<ProjectStatus, string> = {
  Award: "border-amber-500/40 text-amber-600 dark:text-amber-400",
  Academic: "",
};

function ProjectLinks({ project, compact, onLeave }: { project: Project; compact: boolean; onLeave?: () => void }) {
  const { openApp } = useOS();
  return (
    <>
      {project.paper && (
        <Button variant={compact ? "tonal" : "standard"} onClick={() => {
            onLeave?.();
            openApp("research", project.paper!.slug);
          }}>
          <BookOpenText /> Paper
        </Button>
      )}
      {project.live && (
        <Button variant={compact ? "filled" : "accent"} asChild>
          <ExternalA href={project.live}>
            <ExternalLink /> Live
          </ExternalA>
        </Button>
      )}
    </>
  );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const { compact } = useOS();
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden transition-colors",
        compact
          ? "rounded-3xl bg-md-surface-container-high"
          : "rounded-lg border border-win-stroke bg-win-layer hover:bg-win-hover"
      )}
    >
      <button onClick={onOpen} className="block p-2 pb-0 text-left" aria-label={`Open ${project.name} details`}>
        <ScaledMockup slug={project.slug} className={compact ? "rounded-2xl" : ""} />
      </button>
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-snug">{project.name}</h3>
          <Badge compact={compact} className={STATUS[project.status]}>
            {project.status}
          </Badge>
        </div>
        {project.paper && (
          <p className={cn("-mt-1 text-xs font-medium", compact ? "text-md-primary" : "text-win-accent")}>
            Published · {project.paper.publisher}
          </p>
        )}
        <p className={cn("line-clamp-2 text-sm", compact ? "text-md-on-surface-variant" : "text-win-text-2")}>
          {project.summary}
        </p>
        <button
          onClick={onOpen}
          className={cn("-mt-1 self-start text-sm font-medium hover:underline", compact ? "text-md-primary" : "text-win-accent")}
        >
          Read more
        </button>
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <Badge key={t} compact={compact}>
              {t}
            </Badge>
          ))}
        </div>
        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <ProjectLinks project={project} compact={compact} />
          <Button variant={compact ? "text" : "subtle"} onClick={onOpen}>
            Details
          </Button>
        </div>
      </div>
    </article>
  );
}

// `arg` is a project slug to open straight into its dialog (from search or Research).
export default function Projects({ arg }: { arg?: string }) {
  const { compact } = useOS();
  const [openSlug, setOpenSlug] = useState<string | null>(projects.some((p) => p.slug === arg) ? arg! : null);
  const open = projects.find((p) => p.slug === openSlug);

  return (
    <AppScroll compact={compact}>
      {!compact && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Highlights</h2>
          <p className="text-sm text-win-text-2">Achievements and hands-on academic work across hospital operations, public health and the lab.</p>
        </div>
      )}
      <div className={cn("grid gap-4", compact ? "grid-cols-1" : "grid-cols-[repeat(auto-fill,minmax(270px,1fr))]")}>
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} onOpen={() => setOpenSlug(p.slug)} />
        ))}
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpenSlug(null)} compact={compact} className="max-w-3xl">
        {open && (
          <div className="space-y-4">
            <ScaledMockup slug={open.slug} className={compact ? "mt-8 rounded-2xl" : "mt-6"} />
            <div className="flex flex-wrap items-center gap-2">
              <DialogTitle className="text-xl font-semibold">{open.name}</DialogTitle>
              <Badge compact={compact} className={STATUS[open.status]}>
                {open.status}
              </Badge>
            </div>
            <DialogDescription className={cn("text-sm", compact ? "text-md-on-surface-variant" : "text-win-text-2")}>
              {open.summary}
            </DialogDescription>
            <div className="space-y-2 leading-relaxed">
              {open.description.map((d) => (
                <p key={d}>{d}</p>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {open.tech.map((t) => (
                <Badge key={t} compact={compact}>
                  {t}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <ProjectLinks project={open} compact={compact} onLeave={() => setOpenSlug(null)} />
            </div>
          </div>
        )}
      </Dialog>
    </AppScroll>
  );
}
