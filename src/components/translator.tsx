"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftRight,
  Clock,
  Copy,
  Eraser,
  Loader2,
  Sparkles,
  Star,
  Volume2,
  Check,
} from "lucide-react";
import { LanguageSelector } from "./language-selector";
import { HistoryPanel } from "./history-panel";
import { findLanguage } from "@/lib/languages";
import {
  appendHistory,
  clearHistory,
  loadHistory,
  removeHistory,
  type HistoryEntry,
} from "@/lib/storage";
import { cn } from "@/lib/utils";

const MAX_INPUT = 5000;

export function Translator() {
  const [source, setSource] = useState("auto");
  const [target, setTarget] = useState("es");
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [detected, setDetected] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const translate = useCallback(
    async (text: string, src: string, tgt: string) => {
      if (!text.trim() || !tgt || src === tgt) {
        setTranslatedText("");
        setDetected(null);
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, source: src, target: tgt }),
          signal: controller.signal,
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error ?? "Translation failed");
        }
        setTranslatedText(data.translatedText ?? "");
        setDetected(data.detectedSourceLang ?? null);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError((err as Error).message);
        setTranslatedText("");
      } finally {
        if (abortRef.current === controller) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const handle = setTimeout(() => {
      translate(sourceText, source, target);
    }, 500);
    return () => clearTimeout(handle);
  }, [sourceText, source, target, translate]);

  const handleSwap = () => {
    if (source === "auto") return;
    const newSource = target;
    const newTarget = source;
    const newSourceText = translatedText;
    setSource(newSource);
    setTarget(newTarget);
    setSourceText(newSourceText);
    setTranslatedText(sourceText);
  };

  const handleClear = () => {
    setSourceText("");
    setTranslatedText("");
    setError(null);
    setDetected(null);
  };

  const handleCopy = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  const handleSpeak = (text: string, lang: string) => {
    if (!text || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === "auto" ? "en" : lang;
    window.speechSynthesis.speak(utter);
  };

  const handleSave = () => {
    if (!sourceText.trim() || !translatedText.trim() || error) return;
    const updated = appendHistory({
      sourceLang: detected ?? (source === "auto" ? "en" : source),
      targetLang: target,
      sourceText,
      translatedText,
    });
    setHistory(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const handleSelectHistory = (entry: HistoryEntry) => {
    setSource(entry.sourceLang);
    setTarget(entry.targetLang);
    setSourceText(entry.sourceText);
    setTranslatedText(entry.translatedText);
    setHistoryOpen(false);
  };

  const detectedLang = useMemo(
    () => (detected ? findLanguage(detected) : null),
    [detected],
  );

  const charsLeft = MAX_INPUT - sourceText.length;
  const overLimit = charsLeft < 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-card relative overflow-hidden rounded-[28px] p-6 sm:p-8"
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <LanguageSelector
              value={source}
              onChange={setSource}
              label="Translate from"
            />
          </div>

          <div className="flex justify-center sm:justify-start sm:pb-1">
            <motion.button
              type="button"
              onClick={handleSwap}
              disabled={source === "auto"}
              whileHover={source === "auto" ? {} : { rotate: 180, scale: 1.05 }}
              whileTap={source === "auto" ? {} : { scale: 0.92 }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl border border-cocoa-100/60 bg-white/80 text-cocoa-600 shadow-sm transition-colors",
                source !== "auto" && "hover:border-amber-warm/40 hover:text-amber-warm",
                source === "auto" && "cursor-not-allowed opacity-40",
              )}
              aria-label="Swap languages"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </motion.button>
          </div>

          <div className="flex-1">
            <LanguageSelector
              value={target}
              onChange={setTarget}
              label="Into"
              excludeAuto
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <PanelArea
            label="Original"
            text={sourceText}
            placeholder="Type or paste something cozy…"
            onChange={(v) => setSourceText(v.slice(0, MAX_INPUT))}
            editable
            footerLeft={
              <div className="flex items-center gap-3 text-xs text-cocoa-400">
                <span>
                  {sourceText.length}/{MAX_INPUT}
                </span>
                {detectedLang && source === "auto" && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-warm/10 px-2.5 py-1 text-amber-warm">
                    <Sparkles className="h-3 w-3" />
                    Detected: {detectedLang.name}
                  </span>
                )}
              </div>
            }
            footerRight={
              <div className="flex items-center gap-1">
                <IconButton
                  label="Listen"
                  onClick={() => handleSpeak(sourceText, source === "auto" ? (detected ?? "en") : source)}
                  disabled={!sourceText}
                >
                  <Volume2 className="h-4 w-4" />
                </IconButton>
                <IconButton
                  label="Clear"
                  onClick={handleClear}
                  disabled={!sourceText && !translatedText}
                >
                  <Eraser className="h-4 w-4" />
                </IconButton>
              </div>
            }
          />

          <PanelArea
            label="Translation"
            text={translatedText}
            placeholder="Your translation will appear here…"
            editable={false}
            loading={loading}
            error={error}
            footerLeft={
              <div className="text-xs text-cocoa-400">
                {translatedText && !loading && !error
                  ? `${translatedText.length} characters`
                  : loading
                    ? "Translating…"
                    : ""}
              </div>
            }
            footerRight={
              <div className="flex items-center gap-1">
                <IconButton
                  label="Listen"
                  onClick={() => handleSpeak(translatedText, target)}
                  disabled={!translatedText}
                >
                  <Volume2 className="h-4 w-4" />
                </IconButton>
                <IconButton
                  label={copied ? "Copied" : "Copy"}
                  onClick={handleCopy}
                  disabled={!translatedText}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-amber-warm" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </IconButton>
                <IconButton
                  label={saved ? "Saved" : "Save"}
                  onClick={handleSave}
                  disabled={!translatedText || loading || !!error}
                >
                  {saved ? (
                    <Check className="h-4 w-4 text-amber-warm" />
                  ) : (
                    <Star className="h-4 w-4" />
                  )}
                </IconButton>
              </div>
            }
          />
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-xs text-cocoa-400">
            Translations stream automatically as you type.
          </p>
          <button
            onClick={() => setHistoryOpen(true)}
            className="ghost-button"
          >
            <Clock className="h-4 w-4" />
            History
            {history.length > 0 && (
              <span className="ml-1 rounded-full bg-amber-warm/15 px-2 py-0.5 text-[10px] font-semibold text-amber-warm">
                {history.length}
              </span>
            )}
          </button>
        </div>
      </motion.div>

      <HistoryPanel
        open={historyOpen}
        history={history}
        onClose={() => setHistoryOpen(false)}
        onSelect={handleSelectHistory}
        onRemove={(id) => setHistory(removeHistory(id))}
        onClear={() => {
          clearHistory();
          setHistory([]);
        }}
      />
    </>
  );
}

type PanelAreaProps = {
  label: string;
  text: string;
  placeholder: string;
  editable: boolean;
  onChange?: (value: string) => void;
  loading?: boolean;
  error?: string | null;
  footerLeft?: React.ReactNode;
  footerRight?: React.ReactNode;
};

function PanelArea({
  label,
  text,
  placeholder,
  editable,
  onChange,
  loading,
  error,
  footerLeft,
  footerRight,
}: PanelAreaProps) {
  return (
    <div className="relative flex flex-col rounded-2xl border border-cocoa-100/40 bg-white/55 shadow-inset transition-colors focus-within:border-amber-warm/40 focus-within:bg-white/80">
      <div className="px-5 pt-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cocoa-400">
          {label}
        </span>
      </div>
      <div className="relative flex-1 px-5 py-3">
        {editable ? (
          <textarea
            value={text}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="scrollbar-thin h-56 w-full resize-none bg-transparent font-serif text-lg leading-relaxed text-cocoa-800 placeholder:font-sans placeholder:text-base placeholder:text-cocoa-400/70 focus:outline-none sm:h-64"
            spellCheck
          />
        ) : (
          <div className="scrollbar-thin h-56 w-full overflow-y-auto sm:h-64">
            <AnimatePresence mode="wait">
              {loading && !text ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full items-center justify-center"
                >
                  <Loader2 className="h-5 w-5 animate-spin text-amber-warm" />
                </motion.div>
              ) : error ? (
                <motion.p
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-500"
                >
                  {error}
                </motion.p>
              ) : text ? (
                <motion.p
                  key={text}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-cocoa-800"
                >
                  {text}
                </motion.p>
              ) : (
                <motion.p
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-base text-cocoa-400/70"
                >
                  {placeholder}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-cocoa-100/40 px-4 py-2.5">
        <div>{footerLeft}</div>
        <div>{footerRight}</div>
      </div>
    </div>
  );
}

function IconButton({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-xl text-cocoa-600 transition-all",
        disabled
          ? "opacity-30 cursor-not-allowed"
          : "hover:bg-amber-warm/10 hover:text-amber-warm",
      )}
    >
      {children}
    </button>
  );
}
