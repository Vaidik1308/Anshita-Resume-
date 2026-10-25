"use client";

import { FileText, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { linkFor, profile } from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import { useOS } from "../context";
import { ExternalA } from "./shared";

export function HireCard({ className }: { className?: string }) {
  const { compact, openApp } = useOS();
  const resume = linkFor("resume");
  return (
    <div
      className={cn(
        compact
          ? "rounded-3xl bg-md-primary-container p-5 text-md-on-primary-container"
          : "rounded-lg border border-win-stroke bg-win-accent-soft p-4",
        className
      )}
    >
      <p className={cn("font-semibold", compact ? "text-lg" : "text-base")}>Hiring {profile.hireAs}?</p>
      <p className={cn("mt-1 text-sm", compact ? "opacity-80" : "text-win-text-2")}>
        Get in touch with {profile.firstName}{resume ? " or grab the résumé" : ""}.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant={compact ? "filled" : "accent"} onClick={() => openApp("contact")}>
          <Send /> Hire me
        </Button>
        {resume && (
          <Button variant={compact ? "outlined" : "standard"} asChild>
            <ExternalA href={resume.href}>
              <FileText /> Résumé
            </ExternalA>
          </Button>
        )}
      </div>
    </div>
  );
}
