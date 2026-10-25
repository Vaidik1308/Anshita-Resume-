import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Fluent layer card on desktop, Material 3 filled card on Android.
export function Card({ className, compact, ...props }: ComponentProps<"div"> & { compact?: boolean }) {
  return (
    <div
      className={cn(
        compact
          ? "rounded-3xl bg-md-surface-container-high p-4 font-md text-md-on-surface"
          : "rounded-lg border border-win-stroke bg-win-layer p-4 text-win-text",
        className
      )}
      {...props}
    />
  );
}
