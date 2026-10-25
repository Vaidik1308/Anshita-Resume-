"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

// Radix handles focus trapping and Esc; framer-motion handles enter/exit.
export function Dialog({
  open,
  onOpenChange,
  children,
  className,
  compact,
  label = "Close",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
  compact?: boolean;
  label?: string;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[900] bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </DialogPrimitive.Overlay>
            <div className="pointer-events-none fixed inset-0 z-[901] flex items-center justify-center p-4">
              <DialogPrimitive.Content asChild forceMount>
                <motion.div
                  className={cn(
                    "scroll-thin pointer-events-auto relative max-h-[88dvh] w-full max-w-2xl overflow-y-auto",
                    compact
                      ? "rounded-[28px] bg-md-surface-container-high p-5 font-md text-md-on-surface"
                      : "acrylic rounded-lg bg-win-flyout p-6 text-win-text shadow-win",
                    className
                  )}
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: 4 }}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                >
                  {children}
                  <DialogPrimitive.Close
                    aria-label={label}
                    className={cn(
                      "absolute right-3 top-3 grid size-8 place-items-center",
                      compact ? "rounded-full hover:bg-md-on-surface/10" : "rounded-[4px] hover:bg-win-hover"
                    )}
                  >
                    <X className="size-4" />
                  </DialogPrimitive.Close>
                </motion.div>
              </DialogPrimitive.Content>
            </div>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
