/**
 * Generates the local SVG artwork used by the seed data.
 * Run with `npm run art:generate` after changing a palette or motif.
 *
 * Keeping the artwork as committed SVGs means the catalogue, galleries, and
 * artisan profiles work offline and without third-party image licensing.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const outDir = resolve(process.cwd(), "public");
const craftsDir = join(outDir, "crafts");
const artisansDir = join(outDir, "artisans");

const palette = {
  jamdani: {
    from: "#18233d",
    to: "#31456b",
    accent: "#c0603c",
    cream: "#f1e4ce",
    ink: "#101828",
  },
  "clay-pottery": {
    from: "#7f331d",
    to: "#b85c32",
    accent: "#e0b06a",
    cream: "#f5e6cf",
    ink: "#3a1c10",
  },
  "jute-crafts": {
    from: "#6f6231",
    to: "#a98a45",
    accent: "#40502e",
    cream: "#f4e8c8",
    ink: "#2f2a15",
  },
  "nakshi-kantha": {
    from: "#742b2b",
    to: "#a64a3f",
    accent: "#d69a45",
    cream: "#f6ead7",
    ink: "#3a1717",
  },
  "brass-ware": {
    from: "#4a3414",
    to: "#8a6420",
    accent: "#d9a441",
    cream: "#f4e6c6",
    ink: "#2a1d09",
  },
  "bamboo-cane": {
    from: "#3f4b2a",
    to: "#6f7d43",
    accent: "#c6aa62",
    cream: "#f1ead2",
    ink: "#252b17",
  },
  woodcraft: {
    from: "#3e2a1d",
    to: "#775038",
    accent: "#c08a55",
    cream: "#f1e2c9",
    ink: "#241710",
  },
  "shital-pati": {
    from: "#264a3b",
    to: "#3f6b53",
    accent: "#bcae74",
    cream: "#f0ead7",
    ink: "#16281f",
  },
};

const crafts = [
  {
    slug: "jamdani",
    lines: ["JAMDANI", "WEAVING"],
    label: "Jamdani Weaving",
    motif: "lotus",
  },
  {
    slug: "clay-pottery",
    lines: ["CLAY POTTERY", "& TERRACOTTA"],
    label: "Clay Pottery & Terracotta",
    motif: "pot",
  },
  {
    slug: "jute-crafts",
    lines: ["JUTE", "CRAFTS"],
    label: "Jute Crafts",
    motif: "weave",
  },
  {
    slug: "nakshi-kantha",
    lines: ["NAKSHI", "KANTHA"],
    label: "Nakshi Kantha",
    motif: "stitch",
  },
  {
    slug: "brass-ware",
    lines: ["BRASS &", "BELL METAL"],
    label: "Brass & Bell Metal",
    motif: "vessel",
  },
  {
    slug: "bamboo-cane",
    lines: ["BAMBOO", "& CANE"],
    label: "Bamboo & Cane",
    motif: "lattice",
  },
  {
    slug: "woodcraft",
    lines: ["WOOD", "CRAFT"],
    label: "Woodcraft",
    motif: "grain",
  },
  {
    slug: "shital-pati",
    lines: ["SHITAL", "PATI"],
    label: "Shital Pati",
    motif: "chevron",
  },
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function motif(kind, { cream, accent }, scale = 1) {
  const common = `fill="none" stroke="${cream}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"`;
  const thin = `fill="none" stroke="${cream}" stroke-width="2.5" stroke-linecap="round"`;
  const fill = `fill="${cream}"`;
  const accentFill = `fill="${accent}"`;

  const shapes = {
    lotus: `
      <g ${thin} opacity=".55">
        <circle cx="0" cy="0" r="150" stroke-dasharray="2 12"/>
        <circle cx="0" cy="0" r="112" stroke-dasharray="2 9"/>
      </g>
      <g ${fill} opacity=".95">
        <ellipse cx="0" cy="-58" rx="30" ry="86"/>
        <ellipse cx="-58" cy="-24" rx="28" ry="78" transform="rotate(-38 -58 -24)"/>
        <ellipse cx="58" cy="-24" rx="28" ry="78" transform="rotate(38 58 -24)"/>
        <ellipse cx="-94" cy="28" rx="24" ry="62" transform="rotate(-72 -94 28)"/>
        <ellipse cx="94" cy="28" rx="24" ry="62" transform="rotate(72 94 28)"/>
      </g>
      <circle cx="0" cy="18" r="27" ${accentFill}/>
      <path d="M-150 150 Q0 220 150 150" ${common}/>
      <path d="M-150 174 Q0 244 150 174" ${thin} opacity=".6"/>
      <g ${thin} opacity=".8">
        <path d="M-18 96 q18 -22 36 0 q-18 22 -36 0Z"/>
        <path d="M0 96 v58"/>
      </g>`,
    pot: `
      <path d="M-86 -104 q86 44 172 0 l-14 42 q-14 26 -16 52 q-4 76 -56 106 q-52 -30 -56 -106 q-2 -26 -16 -52 Z"
        ${fill} opacity=".92"/>
      <path d="M-60 -50 q60 28 120 0" ${common} stroke="${accent}" opacity=".9"/>
      <path d="M-74 22 q74 34 148 0" ${thin} opacity=".7"/>
      <path d="M-58 86 q58 28 116 0" ${thin} opacity=".55"/>
      <path d="M-104 -140 q104 36 208 0" ${common}/>
      <path d="M-72 -158 q72 24 144 0" ${thin} opacity=".6"/>
      <g ${thin} opacity=".55">
        <circle cx="0" cy="-18" r="150" stroke-dasharray="3 11"/>
        <path d="M-140 138 h280"/>
      </g>`,
    weave: `
      <g ${thin} opacity=".5">
        ${Array.from({ length: 11 }, (_, i) => `<path d="M-165 ${-150 + i * 30} H165"/>`).join("")}
        ${Array.from({ length: 11 }, (_, i) => `<path d="M${-150 + i * 30} -165 V165"/>`).join("")}
      </g>
      <g ${fill} opacity=".92">
        <rect x="-118" y="-118" width="236" height="236" rx="22" fill="none" stroke="${cream}" stroke-width="12"/>
        <path d="M-118 -38 h236 M-118 38 h236" stroke="${cream}" stroke-width="9" opacity=".9"/>
        <path d="M-38 -118 v236 M38 -118 v236" stroke="${cream}" stroke-width="9" opacity=".9"/>
      </g>
      <circle cx="0" cy="0" r="26" ${accentFill}/>
      <rect x="-152" y="-152" width="304" height="304" rx="38" ${thin} opacity=".7"/>`,
    stitch: `
      <g ${thin} opacity=".55">
        ${Array.from({ length: 7 }, (_, i) => `<path d="M-165 ${-120 + i * 40} q34 -18 68 0 t68 0 t68 0 t68 0" stroke-dasharray="8 9"/>`).join("")}
      </g>
      <g ${fill} opacity=".95">
        <path d="M-92 34 q34 -58 92 -58 q58 0 92 58 q-34 58 -92 58 q-58 0 -92 -58Z"/>
        <path d="M-92 34 l-46 -36 v72Z"/>
      </g>
      <circle cx="52" cy="24" r="7" fill="${accent}"/>
      <path d="M-150 132 q150 34 300 0" ${common}/>
      <path d="M-150 156 q150 34 300 0" ${thin} opacity=".55"/>`,
    vessel: `
      <g ${thin} opacity=".5">
        <path d="M-170 170 q170 -330 340 0" stroke-dasharray="4 10"/>
        <path d="M-140 170 q140 -260 280 0" stroke-dasharray="4 10"/>
      </g>
      <path d="M-48 -150 q48 -34 96 0 l-8 42 q54 48 54 118 q0 94 -94 118 q-94 -24 -94 -118 q0 -70 54 -118Z"
        ${fill} opacity=".94"/>
      <path d="M-58 -50 q58 26 116 0" ${common} stroke="${accent}"/>
      <path d="M-96 70 q96 40 192 0" ${thin} opacity=".6"/>
      <path d="M-26 -184 h52" ${common}/>
      <circle cx="0" cy="-206" r="16" ${accentFill}/>`,
    lattice: `
      <g ${thin} opacity=".5">
        ${Array.from({ length: 9 }, (_, i) => `<path d="M${-180 + i * 45} -180 l360 360"/>`).join("")}
        ${Array.from({ length: 9 }, (_, i) => `<path d="M${-180 + i * 45} 180 l360 -360"/>`).join("")}
      </g>
      <g ${fill} opacity=".92">
        <path d="M-104 -160 q104 30 208 0 q-30 104 0 208 q-104 -30 -208 0 q30 -104 0 -208Z"/>
      </g>
      <path d="M0 -132 q52 132 0 264 q-52 -132 0 -264Z" fill="${accent}" opacity=".85"/>
      <path d="M-132 0 q132 -52 264 0 q-132 52 -264 0Z" ${thin} opacity=".8"/>`,
    grain: `
      <g ${thin} opacity=".55">
        ${Array.from({ length: 9 }, (_, i) => `<path d="M-190 ${-140 + i * 34} q95 -30 190 0 t190 0" stroke-dasharray="3 8"/>`).join("")}
      </g>
      <g ${fill} opacity=".92">
        <path d="M-118 -140 h236 q40 0 40 40 v200 q0 40 -40 40 h-236 q-40 0 -40 -40 v-200 q0 -40 40 -40Z"/>
      </g>
      <g ${thin} stroke="${accent}" stroke-width="7" opacity=".9">
        <path d="M-70 -80 l70 70 l70 -70 M-70 80 l70 -70 l70 70"/>
        <path d="M-118 0 h236"/>
      </g>
      <circle cx="0" cy="0" r="16" fill="${accent}"/>`,
    chevron: `
      <g ${thin} opacity=".55">
        ${Array.from({ length: 8 }, (_, i) => `<path d="M-180 ${-140 + i * 40} l180 -34 l180 34"/>`).join("")}
      </g>
      <g ${fill} opacity=".94">
        <path d="M-150 60 l150 -70 l150 70 v46 l-150 -70 l-150 70Z"/>
        <path d="M-150 132 l150 -70 l150 70 v46 l-150 -70 l-150 70Z"/>
      </g>
      <g ${accentFill} opacity=".8">
        <path d="M-150 -26 l150 70 l150 -70 v40 l-150 70 l-150 -70Z"/>
      </g>
      <rect x="-164" y="-164" width="328" height="328" rx="10" ${thin} opacity=".7"/>`,
  };

  return `<g transform="translate(400 380) scale(${scale})">${shapes[kind]}</g>`;
}

function mainSvg(craft) {
  const p = palette[craft.slug];
  const [line1, line2] = craft.lines;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" role="img" aria-label="${esc(craft.label)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p.from}"/>
      <stop offset="1" stop-color="${p.to}"/>
    </linearGradient>
    <pattern id="weave" width="42" height="42" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <path d="M0 21 H42" stroke="${p.cream}" stroke-width="1.2" opacity=".1"/>
      <path d="M21 0 V42" stroke="${p.cream}" stroke-width="1.2" opacity=".06"/>
    </pattern>
  </defs>
  <rect width="800" height="1000" fill="url(#bg)"/>
  <rect width="800" height="1000" fill="url(#weave)"/>
  <rect x="26" y="26" width="748" height="948" fill="none" stroke="${p.cream}" stroke-width="1.5" opacity=".35"/>
  ${motif(craft.motif, p, 1.05)}
  <text x="400" y="812" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="58" letter-spacing="7" fill="${p.cream}">${esc(line1)}</text>
  <text x="400" y="878" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="58" letter-spacing="7" fill="${p.cream}">${esc(line2)}</text>
  <path d="M320 908 H480" stroke="${p.accent}" stroke-width="2"/>
  <text x="400" y="948" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" letter-spacing="5" fill="${p.cream}" opacity=".72">CRAFT BD · BANGLADESH</text>
</svg>
`;
}

function detailSvg(craft) {
  const p = palette[craft.slug];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" role="img" aria-label="${esc(craft.label)} material detail">
  <defs>
    <linearGradient id="bg" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="${p.to}"/>
      <stop offset="1" stop-color="${p.from}"/>
    </linearGradient>
    <pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
      <path d="M0 13 H26" stroke="${p.cream}" stroke-width="1" opacity=".14"/>
    </pattern>
  </defs>
  <rect width="800" height="800" fill="url(#bg)"/>
  <rect width="800" height="800" fill="url(#grid)"/>
  ${motif(craft.motif, p, 1.35)}
  <rect x="24" y="24" width="752" height="752" fill="none" stroke="${p.cream}" stroke-width="1.5" opacity=".4"/>
  <text x="60" y="720" font-family="Arial, sans-serif" font-size="14" letter-spacing="5" fill="${p.cream}" opacity=".75">MATERIAL STUDY</text>
  <text x="740" y="720" text-anchor="end" font-family="Georgia, 'Times New Roman', serif" font-size="22" fill="${p.cream}">${esc(craft.label)}</text>
  <text x="60" y="750" font-family="Arial, sans-serif" font-size="12" letter-spacing="4" fill="${p.cream}" opacity=".55">CRAFT BD · HANDMADE IN BANGLADESH</text>
</svg>
`;
}

const artisanPalette = {
  "rahima-begum": ["#4b3555", "#8a5a75"],
  "shafiqul-islam": ["#334a5e", "#5f7f93"],
  "gouranga-chandra-pal": ["#7a3b22", "#b86a3d"],
  "momena-khatun": ["#7c3030", "#b45a4b"],
  "abdul-karim-miah": ["#4a3414", "#9a7428"],
  "sufia-akter": ["#5d5a2b", "#978b48"],
  "nirmal-chandra-das": ["#35462d", "#6c7f4a"],
  "jamal-uddin": ["#402c1e", "#80583a"],
  "anwara-begum": ["#264a3b", "#5c8267"],
};

const artisans = [
  ["rahima-begum", "Rahima Begum", "RB", "Jamdani weaver · Narayanganj"],
  ["shafiqul-islam", "Shafiqul Islam", "SI", "Jamdani · Sonargaon"],
  ["gouranga-chandra-pal", "Gouranga Chandra Pal", "GP", "Potter · Dhamrai"],
  ["momena-khatun", "Momena Khatun", "MK", "Kantha stitcher · Jamalpur"],
  ["abdul-karim-miah", "Abdul Karim Miah", "AK", "Metalsmith · Dhamrai"],
  ["sufia-akter", "Sufia Akter", "SA", "Jute weaver · Faridpur"],
  ["nirmal-chandra-das", "Nirmal Chandra Das", "ND", "Cane weaver · Sylhet"],
  ["jamal-uddin", "Jamal Uddin", "JU", "Woodcarver · Rajshahi"],
  ["anwara-begum", "Anwara Begum", "AB", "Pati weaver · Sylhet"],
];

function avatarSvg(slug, name, initials, subtitle) {
  const [from, to] = artisanPalette[slug];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="${esc(name)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
    <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.4" fill="#f4ead8" opacity=".18"/>
    </pattern>
  </defs>
  <rect width="600" height="600" fill="url(#bg)"/>
  <rect width="600" height="600" fill="url(#dots)"/>
  <circle cx="300" cy="254" r="142" fill="#f4ead8" opacity=".95"/>
  <text x="300" y="292" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="104" fill="${from}">${initials}</text>
  <text x="300" y="470" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="30" fill="#f4ead8">${esc(name)}</text>
  <text x="300" y="506" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" letter-spacing="3" fill="#f4ead8" opacity=".75">${esc(subtitle.toUpperCase())}</text>
  <path d="M230 536 H370" stroke="#f4ead8" stroke-width="2" opacity=".5"/>
</svg>
`;
}

mkdirSync(craftsDir, { recursive: true });
mkdirSync(artisansDir, { recursive: true });

for (const craft of crafts) {
  writeFileSync(join(craftsDir, `${craft.slug}.svg`), mainSvg(craft), "utf8");
  writeFileSync(
    join(craftsDir, `${craft.slug}-detail.svg`),
    detailSvg(craft),
    "utf8",
  );
}

for (const [slug, name, initials, subtitle] of artisans) {
  writeFileSync(
    join(artisansDir, `${slug}.svg`),
    avatarSvg(slug, name, initials, subtitle),
    "utf8",
  );
}

console.log(
  `Generated ${crafts.length * 2} craft images and ${artisans.length} artisan avatars.`,
);
