import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, compact, ...props }: ComponentProps<"span"> & { compact?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap text-xs font-medium",
        compact
          ? "h-7 rounded-lg border border-md-outline-variant px-2.5 font-md text-md-on-surface-variant"
          : "h-6 rounded-[4px] border border-win-stroke bg-win-layer px-2 text-win-text-2",
        className
      )}
      {...props}
    />
  );
}
