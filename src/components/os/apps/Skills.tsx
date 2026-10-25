"use client";

import { Card } from "@/components/ui/card";
import { skills } from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import { useOS } from "../context";
import { AppScroll } from "./shared";

export default function Skills() {
  const { compact } = useOS();
  return (
    <AppScroll compact={compact}>
      <div className={cn("grid gap-3", !compact && "grid-cols-2")}>
        {skills.map((g) => (
          <Card key={g.group} compact={compact}>
            <h3 className={cn("mb-3 text-sm font-semibold", compact ? "text-md-primary" : "text-win-text")}>{g.group}</h3>
            <ul className="flex flex-wrap gap-1.5">
              {g.items.map((s) => (
                <li
                  key={s}
                  className={cn(
                    "text-sm",
                    compact
                      ? "rounded-lg bg-md-secondary-container px-3 py-1.5 text-md-on-secondary-container"
                      : "rounded-[4px] border border-win-stroke bg-win-layer-2 px-2.5 py-1"
                  )}
                >
                  {s}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </AppScroll>
  );
}
