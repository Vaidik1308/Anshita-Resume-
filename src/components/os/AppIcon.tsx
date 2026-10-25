import { cn } from "@/lib/utils";
import { appById, type AppId } from "./registry";
import { FluentIcon } from "./windows/FluentIcons";

// Fluent glyph on Windows; on Android, Pixel "themed icons": one tonal colour for every app.
export function AppIcon({ id, compact, className }: { id: AppId; compact?: boolean; className?: string }) {
  if (!compact) return <FluentIcon id={id} className={cn("size-8 shrink-0", className)} />;
  const Icon = appById(id).icon;
  return (
    <span className={cn("grid size-14 place-items-center rounded-full bg-md-primary-container text-md-on-primary-container", className)}>
      <Icon className="size-[45%]" strokeWidth={2} aria-hidden />
    </span>
  );
}
