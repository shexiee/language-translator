"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Search } from "lucide-react";
import { LANGUAGES, type Language, findLanguage } from "@/lib/languages";
import { Flag } from "./flag";
import { cn } from "@/lib/utils";

type LanguageSelectorProps = {
  value: string;
  onChange: (code: string) => void;
  label: string;
  excludeAuto?: boolean;
};

export function LanguageSelector({
  value,
  onChange,
  label,
  excludeAuto = false,
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected: Language = useMemo(
    () => findLanguage(value) ?? LANGUAGES[0],
    [value],
  );

  const filtered = useMemo(() => {
    const list = excludeAuto
      ? LANGUAGES.filter((l) => l.code !== "auto")
      : LANGUAGES;
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(
      (l) => l.name.toLowerCase().includes(q) || l.code.toLowerCase().includes(q),
    );
  }, [query, excludeAuto]);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-cocoa-400">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-200",
          "border border-cocoa-100/60 bg-white/60 hover:border-amber-warm/40 hover:bg-white/80",
          open && "border-amber-warm/60 bg-white/90 shadow-cozy",
        )}
      >
        <span className="flex items-center gap-3 min-w-0">
          <Flag lang={selected} size="lg" />
          <span className="truncate font-medium text-cocoa-800">
            {selected.name}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-cocoa-400 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-cocoa-100/60 bg-white/95 shadow-cozyHover backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 border-b border-cocoa-100/60 px-3 py-2.5">
              <Search className="h-4 w-4 text-cocoa-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search language…"
                className="w-full bg-transparent text-sm text-cocoa-800 placeholder:text-cocoa-400 focus:outline-none"
              />
            </div>
            <div className="scrollbar-thin max-h-72 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-cocoa-400">
                  No languages found
                </div>
              ) : (
                filtered.map((lang) => {
                  const isSelected = lang.code === value;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onChange(lang.code);
                        setOpen(false);
                        setQuery("");
                      }}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors duration-150",
                        isSelected
                          ? "bg-amber-warm/10 text-cocoa-800"
                          : "text-cocoa-600 hover:bg-cream-100/80",
                      )}
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <Flag lang={lang} size="md" />
                        <span className="truncate">{lang.name}</span>
                      </span>
                      {isSelected && (
                        <Check className="h-4 w-4 shrink-0 text-amber-warm" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
