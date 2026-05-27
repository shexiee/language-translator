import { Translator } from "@/components/translator";
import { Logo } from "@/components/logo";

export default function Home() {
  return (
    <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-10 sm:px-8 sm:py-14">
      <header className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={44} />
          <div>
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-cocoa-800">
              Vocumi
            </h1>
            <p className="text-xs text-cocoa-400">your cozy translator</p>
          </div>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden text-xs font-medium text-cocoa-400 transition-colors hover:text-amber-warm sm:inline-flex"
        >
          Made with warmth ✦
        </a>
      </header>

      <section className="mb-10 text-center sm:mb-14">
        <h2 className="mx-auto max-w-3xl text-balance font-serif text-4xl font-medium leading-[1.1] tracking-tight text-cocoa-800 sm:text-5xl md:text-6xl">
          Translate the world,
          <span className="bg-gradient-to-r from-amber-warm to-amber-glow bg-clip-text text-transparent">
            {" "}cozy as a kitchen window.
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-balance text-base text-cocoa-600 sm:text-lg">
          A warm, premium translator across 100+ languages — instant, beautiful,
          and quietly powerful.
        </p>
      </section>

      <Translator />

      <footer className="mt-16 flex flex-col items-center justify-between gap-3 text-center text-xs text-cocoa-400 sm:flex-row sm:text-left">
        <p>
          Vocumi · brewed with care · {new Date().getFullYear()}
        </p>
        <p>Translation by Google · MyMemory fallback</p>
      </footer>
    </main>
  );
}
