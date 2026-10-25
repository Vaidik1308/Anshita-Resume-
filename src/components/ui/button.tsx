import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Fluent variants (accent/standard/subtle) for Windows, M3 variants (filled/tonal/outlined/text) for Android.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        accent: "h-8 rounded-[4px] bg-win-accent px-3 text-win-accent-fg hover:opacity-90 active:opacity-80",
        standard:
          "h-8 rounded-[4px] border border-win-stroke bg-win-layer px-3 text-win-text hover:bg-win-hover active:bg-win-pressed",
        subtle: "h-8 rounded-[4px] px-2.5 text-win-text hover:bg-win-hover active:bg-win-pressed",
        filled: "h-10 rounded-full bg-md-primary px-5 font-md text-md-on-primary active:opacity-90",
        tonal:
          "h-10 rounded-full bg-md-secondary-container px-5 font-md text-md-on-secondary-container active:opacity-90",
        outlined: "h-10 rounded-full border border-md-outline px-5 font-md text-md-primary active:bg-md-primary/10",
        text: "h-10 rounded-full px-3 font-md text-md-primary active:bg-md-primary/10",
      },
    },
    defaultVariants: { variant: "standard" },
  }
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;

export function Button({
  className,
  variant,
  asChild = false,
  ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant }), className)} {...props} />;
}
