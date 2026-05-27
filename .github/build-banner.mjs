import { readFileSync, writeFileSync } from "node:fs";

const iconB64 = readFileSync("public/web-app-manifest-192x192.png").toString("base64");
const dataUri = `data:image/png;base64,${iconB64}`;

const banner = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 360" width="1200" height="360" role="img" aria-label="Vocumi — your cozy translator">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fdf9f3"/>
      <stop offset="55%" stop-color="#faf2e6"/>
      <stop offset="100%" stop-color="#f4e4cc"/>
    </linearGradient>
    <radialGradient id="glow1" cx="0.15" cy="0.2" r="0.6">
      <stop offset="0%" stop-color="#e89968" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#e89968" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.9" cy="0.95" r="0.55">
      <stop offset="0%" stop-color="#d97742" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#d97742" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f4e4cc"/>
      <stop offset="55%" stop-color="#e89968"/>
      <stop offset="100%" stop-color="#d97742"/>
    </linearGradient>
    <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#5b4632"/>
      <stop offset="60%" stop-color="#5b4632"/>
      <stop offset="100%" stop-color="#d97742"/>
    </linearGradient>
    <filter id="cozyShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#5b4632" flood-opacity="0.18"/>
    </filter>
    <clipPath id="iconClip">
      <rect x="96" y="116" width="128" height="128" rx="28"/>
    </clipPath>
  </defs>

  <!-- Background -->
  <rect width="1200" height="360" fill="url(#bg)"/>
  <rect width="1200" height="360" fill="url(#glow1)"/>
  <rect width="1200" height="360" fill="url(#glow2)"/>

  <!-- Decorative steam curls -->
  <g opacity="0.18" stroke="#5b4632" stroke-width="1.6" fill="none" stroke-linecap="round">
    <path d="M 940 110 q -10 -18 6 -32 q 14 -12 0 -28"/>
    <path d="M 980 120 q -8 -16 4 -28 q 12 -10 -2 -24"/>
    <path d="M 1020 110 q -10 -18 6 -32 q 14 -12 0 -28"/>
  </g>

  <!-- Vocumi icon (AI-generated favicon) -->
  <g filter="url(#cozyShadow)">
    <image href="${dataUri}" x="96" y="116" width="128" height="128" clip-path="url(#iconClip)" preserveAspectRatio="xMidYMid slice"/>
  </g>

  <!-- Brand text -->
  <g font-family="'Fraunces', Georgia, serif">
    <text x="264" y="190" font-size="96" font-weight="600" fill="url(#brandGrad)" letter-spacing="-2">Vocumi</text>
    <text x="268" y="232" font-size="22" font-style="italic" fill="#8a6b4f" letter-spacing="0.5">your cozy translator</text>
  </g>

  <!-- Tagline pill -->
  <g transform="translate(264, 256)">
    <rect x="0" y="0" width="380" height="34" rx="17" fill="#fffaf2" stroke="#e6d4bb" stroke-width="1"/>
    <circle cx="18" cy="17" r="3" fill="#d97742"/>
    <text x="32" y="22" font-family="'Inter', system-ui, sans-serif" font-size="12" fill="#5b4632" letter-spacing="2">100+ LANGUAGES · NO RUSH</text>
  </g>

  <!-- Bottom border accent -->
  <rect x="0" y="356" width="1200" height="4" fill="url(#logoGrad)"/>
</svg>
`;

writeFileSync(".github/banner.svg", banner);
console.log(`Banner written: ${(banner.length / 1024).toFixed(1)} KB`);
