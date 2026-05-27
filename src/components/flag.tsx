import { Sparkles, Globe } from "lucide-react";
import type { Language } from "@/lib/languages";
import { cn } from "@/lib/utils";

type FlagProps = {
  lang: Language | undefined;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE_CLASSES: Record<NonNullable<FlagProps["size"]>, string> = {
  sm: "h-3.5 w-5",
  md: "h-4 w-6",
  lg: "h-5 w-7",
};

const ICON_SIZE: Record<NonNullable<FlagProps["size"]>, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function Flag({ lang, size = "md", className }: FlagProps) {
  if (!lang) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-sm bg-cream-100 text-cocoa-400",
          SIZE_CLASSES[size],
          className,
        )}
      >
        <Globe className={ICON_SIZE[size]} />
      </span>
    );
  }

  if (lang.code === "auto") {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-sm bg-gradient-to-br from-amber-warm/20 to-amber-warm/10 text-amber-warm",
          SIZE_CLASSES[size],
          className,
        )}
      >
        <Sparkles className={ICON_SIZE[size]} />
      </span>
    );
  }

  if (!lang.country) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-sm bg-cream-100 text-cocoa-400",
          SIZE_CLASSES[size],
          className,
        )}
      >
        <Globe className={ICON_SIZE[size]} />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "fi shrink-0 rounded-sm shadow-[0_0_0_1px_rgba(91,70,50,0.08)]",
        `fi-${lang.country}`,
        SIZE_CLASSES[size],
        className,
      )}
      aria-hidden
    />
  );
}
