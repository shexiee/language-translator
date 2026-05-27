# Vocumi — your cozy translator

> *Translate the world, cozy as a kitchen window.*

A warm, premium translator across 100+ languages. Built to feel like sunlight through a curtain — soft, slow, deliberate. Powered by Next.js 15 and ready to deploy to Vercel with zero config.

## Design

Vocumi's look is built on three feelings: **warm**, **calm**, **considered**.

**Palette**
- `cream` — paper-white background that warms toward amber at the edges
- `amber` — the gentle sienna accent used for focus, highlights, and the brand mark
- `cocoa` — soft brown ink used in place of harsh black

**Typography**
- **Fraunces** — a soft, slightly bookish serif used for headings, brand, and the translation text itself (the *content* feels editorial)
- **Inter** — a clean sans used for UI chrome (buttons, labels, captions)

**Surfaces & motion**
- Glassmorphic translator card with a subtle inset highlight and a *cozy* shadow (long, soft, low-opacity)
- A faint grain texture and two warm radial gradients in the background
- Framer Motion drives every transition — selector reveals, swap-button rotation, panel slides, translation crossfades
- Selection highlight, scrollbars, and focus rings are all tinted amber to keep the palette consistent end-to-end

**Iconography**
- [Lucide](https://lucide.dev) for outline icons
- [flag-icons](https://github.com/lipis/flag-icons) for crisp SVG country flags that render identically on Windows, macOS, and Linux (sidesteps the missing-flag-emoji problem on Windows)
- A custom SVG mark for the Vocumi logo — a stylized teacup wrapped in a speech curve

## Stack

- **Next.js 15** — App Router, edge-runtime API routes
- **React 19** + **TypeScript** (strict)
- **Tailwind CSS** — custom cozy palette, custom shadows, custom keyframes
- **Framer Motion** — page, panel, and micro-interaction animations
- **Lucide** + **flag-icons** — icons and flags
- **Fraunces** + **Inter** via `next/font/google` (zero-CLS, self-hosted)

## Features

- ✦ **Translate-as-you-type** with debounce — no "Translate" button needed
- ✦ **Auto language detection** with a live "Detected: …" badge
- ✦ **100+ languages** in a searchable selector with SVG flags
- ✦ **One-click swap** between source and target (with translated-text carry-over)
- ✦ **Text-to-speech** for both source and translation
- ✦ **Copy / Save / Clear** actions with subtle confirmation states
- ✦ **History drawer** — saved translations persist in `localStorage`, with restore + remove + clear-all
- ✦ **Resilient translation** — Google's public endpoint primary, MyMemory automatic fallback
- ✦ **Accessible & responsive** — works from 320px to 4K, full keyboard support, ARIA labels

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # lint
```

## Deploy to Vercel

```bash
# Easiest: import this repo on vercel.com — defaults work out of the box.
# Or via CLI:
npm i -g vercel
vercel
```

No environment variables required.

## Project layout

```
src/
├── app/
│   ├── api/translate/route.ts   # edge-runtime translation endpoint (Google + MyMemory)
│   ├── layout.tsx               # fonts, metadata, viewport
│   ├── page.tsx                 # hero + translator
│   └── globals.css              # cozy theme, glass card, scrollbars, grain
├── components/
│   ├── translator.tsx           # main interactive UI (state, debounce, actions)
│   ├── language-selector.tsx    # searchable language picker with motion
│   ├── history-panel.tsx        # slide-out history drawer
│   ├── flag.tsx                 # SVG flag with auto-detect & globe fallbacks
│   └── logo.tsx                 # Vocumi brand mark
└── lib/
    ├── languages.ts             # 100+ languages with ISO country codes
    ├── storage.ts               # localStorage history helpers
    └── utils.ts                 # cn(), debounce, timestamp formatting
```

## Credits

Translation via Google Translate's public endpoint with [MyMemory](https://mymemory.translated.net) as a graceful fallback. Both are free and require no API keys.

— *brewed with care.*
