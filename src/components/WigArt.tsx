import { lengthBucket, wigColorHex, type WigColor } from "@/lib/config";

const shade = (hex: string, k: number) =>
  "#" + [1, 3, 5].map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - k)).toString(16).padStart(2, "0")).join("");

// Illustration d'une perruque sur une tête de mannequin, affichée tant qu'une perruque n'a pas de photo.
// La couleur, la longueur et la texture viennent de la fiche, donc chaque carte reste différente.
export function WigArt({ id, lengthCm, texture, color, title }: { id: string | number; lengthCm: number; texture: string; color: string; title?: string }) {
  const hair = wigColorHex[color as WigColor] ?? "#5a3b26";
  const L = { short: 300, medium: 380, long: 462 }[lengthBucket(lengthCm)];
  const wave = { straight: 0, wavy: 7, curly: 13, coily: 18 }[texture as "straight"] ?? 0;
  const fid = `w${id}`;
  const back = `M200,70 C118,70 94,140 98,214 C101,282 92,${L - 44} 84,${L} Q200,${L + 20} 316,${L} C308,${L - 44} 299,282 302,214 C306,140 282,70 200,70 Z`;
  // mèches qui encadrent le visage, de chaque côté, jusqu'à la longueur de la perruque
  const sides = `M126,150 C112,200 116,260 122,${L - 30} C124,${L - 10} 104,${L} 96,${L} C100,300 96,200 118,140 Z M274,150 C288,200 284,260 278,${L - 30} C276,${L - 10} 296,${L} 304,${L} C300,300 304,200 282,140 Z`;
  const fringe = "M200,80 C136,80 112,128 116,192 C146,154 178,130 216,118 C244,134 270,156 286,192 C290,128 264,80 200,80 Z";
  return (
    <svg viewBox="0 0 400 500" role="img" aria-label={title} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${fid}bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ebe1cf" />
          <stop offset="1" stopColor="#dccdb4" />
        </linearGradient>
        <linearGradient id={`${fid}skin`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e9dcc6" />
          <stop offset="0.6" stopColor="#f3eadb" />
          <stop offset="1" stopColor="#e2d3ba" />
        </linearGradient>
        <linearGradient id={`${fid}hair`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={hair} stopOpacity="0.92" />
          <stop offset="0.5" stopColor={hair} />
          <stop offset="1" stopColor={shade(hair, 0.45)} />
        </linearGradient>
        {wave > 0 && (
          <filter id={`${fid}tx`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="turbulence" baseFrequency={texture === "wavy" ? "0.012 0.03" : "0.035 0.045"} numOctaves="2" seed={Number(String(id).replace(/\D/g, "")) || 3} />
            <feDisplacementMap in="SourceGraphic" scale={wave} />
          </filter>
        )}
      </defs>
      <rect width="400" height="500" fill={`url(#${fid}bg)`} />
      <g filter={wave > 0 ? `url(#${fid}tx)` : undefined}>
        <path d={back} fill={`url(#${fid}hair)`} />
      </g>
      {/* cou et socle du mannequin, devant les cheveux du dos */}
      <path d="M170,268 C172,330 166,372 150,404 C132,440 110,470 96,500 L304,500 C290,470 268,440 250,404 C234,372 228,330 230,268 Z" fill={`url(#${fid}skin)`} />
      <path d="M170,300 C186,318 214,318 230,300" stroke="#000" strokeOpacity="0.06" strokeWidth="10" fill="none" />
      <ellipse cx="200" cy="196" rx="74" ry="96" fill={`url(#${fid}skin)`} />
      <g filter={wave > 0 ? `url(#${fid}tx)` : undefined}>
        <path d={sides} fill={hair} />
        <path d={fringe} fill={hair} />
        <path d="M214,120 C236,150 250,210 246,280 M196,122 C170,160 160,220 164,290" stroke="#fff" strokeOpacity="0.1" strokeWidth="3" fill="none" />
      </g>
    </svg>
  );
}
