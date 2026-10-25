"use client";

import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";
import { profile } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

export function Avatar({ size = 64, className }: { size?: number; className?: string }) {
  return (
    <Image
      src={profile.photo}
      alt={profile.name}
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full object-cover", className)}
      style={{ width: size, height: size }}
      priority
    />
  );
}

export function SectionTitle({ compact, children, className }: { compact: boolean; children: ReactNode; className?: string }) {
  return (
    <h3
      className={cn(
        compact ? "px-1 font-md text-sm font-medium text-md-primary" : "text-sm font-semibold text-win-text",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function NowDot({ className }: { className?: string }) {
  return <span aria-hidden className={cn("inline-block size-2 shrink-0 rounded-full bg-green-500 animate-now-pulse", className)} />;
}

// Opens external links in a new tab; mailto/tel stay in place.
export function ExternalA({ href, ...props }: ComponentProps<"a"> & { href: string }) {
  const external = /^https?:/.test(href);
  return <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...props} />;
}

// Shared app body padding, so every app scrolls the same way inside a window or an Android page.
export function AppScroll({ compact, children, className }: { compact: boolean; children: ReactNode; className?: string }) {
  return (
    <div className={cn("h-full overflow-y-auto scroll-thin", compact ? "px-4 pb-6 pt-2 font-md" : "p-6", className)}>
      {children}
    </div>
  );
}
