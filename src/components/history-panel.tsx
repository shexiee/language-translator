"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Clock, Trash2, X } from "lucide-react";
import { findLanguage } from "@/lib/languages";
import { Flag } from "./flag";
import type { HistoryEntry } from "@/lib/storage";
import { formatTimestamp } from "@/lib/utils";

type HistoryPanelProps = {
  open: boolean;
  history: HistoryEntry[];
  onClose: () => void;
  onSelect: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
};

export function HistoryPanel({
  open,
  history,
  onClose,
  onSelect,
  onRemove,
  onClear,
}: HistoryPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-cocoa-900/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-cocoa-100/60 bg-cream-50 shadow-cozyHover"
          >
            <header className="flex items-center justify-between border-b border-cocoa-100/60 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-warm/15 text-amber-warm">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-semibold text-cocoa-800">
                    History
                  </h2>
                  <p className="text-xs text-cocoa-400">
                    {history.length} saved translation{history.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl p-2 text-cocoa-400 transition-colors hover:bg-cream-100 hover:text-cocoa-800"
                aria-label="Close history"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="scrollbar-thin flex-1 overflow-y-auto px-4 py-4">
              {history.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cream-100">
                    <Clock className="h-7 w-7 text-cocoa-400/60" />
                  </div>
                  <p className="font-serif text-lg text-cocoa-600">
                    Nothing here yet
                  </p>
                  <p className="mt-1 max-w-[240px] text-sm text-cocoa-400">
                    Your saved translations will appear here, cozy and ready to revisit.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {history.map((entry) => {
                    const src = findLanguage(entry.sourceLang);
                    const tgt = findLanguage(entry.targetLang);
                    return (
                      <li key={entry.id}>
                        <motion.button
                          layout
                          onClick={() => onSelect(entry)}
                          whileHover={{ y: -2 }}
                          className="group block w-full rounded-2xl border border-cocoa-100/40 bg-white/70 p-4 text-left shadow-sm transition-all hover:border-amber-warm/40 hover:shadow-cozy"
                        >
                          <div className="mb-2 flex items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2 text-cocoa-600">
                              <Flag lang={src} size="sm" />
                              <span className="font-medium">{src?.name ?? entry.sourceLang}</span>
                              <ArrowRight className="h-3 w-3 text-cocoa-400" />
                              <Flag lang={tgt} size="sm" />
                              <span className="font-medium">{tgt?.name ?? entry.targetLang}</span>
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-cocoa-400">
                              {formatTimestamp(entry.timestamp)}
                            </span>
                          </div>
                          <p className="line-clamp-2 text-sm text-cocoa-800">
                            {entry.sourceText}
                          </p>
                          <p className="mt-1 line-clamp-2 text-sm italic text-cocoa-400">
                            {entry.translatedText}
                          </p>
                          <div className="mt-3 flex justify-end">
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemove(entry.id);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.stopPropagation();
                                  onRemove(entry.id);
                                }
                              }}
                              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-cocoa-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                            >
                              <Trash2 className="h-3 w-3" />
                              Remove
                            </span>
                          </div>
                        </motion.button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {history.length > 0 && (
              <footer className="border-t border-cocoa-100/60 px-6 py-4">
                <button
                  onClick={onClear}
                  className="ghost-button w-full justify-center text-red-500 hover:bg-red-50 hover:border-red-200"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear all history
                </button>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
