import type { Dict } from "@/lib/i18n";
import type { WigColor, WigTexture } from "@/lib/config";

// Le détail signature : une petite étiquette de boutique accrochée à chaque perruque.
export function WigTag({ d, lengthCm, texture, color, className = "" }: { d: Dict; lengthCm: number; texture: string; color: string; className?: string }) {
  const parts = [`${lengthCm} ${d.wigs.cm}`, d.wigs.textures[texture as WigTexture] ?? texture, d.wigs.colors[color as WigColor] ?? color];
  return (
    <span className={`wig-tag ${className}`}>
      {parts.map((p, i) => (
        <span key={i}>
          {i > 0 && <span className="wig-tag__sep" aria-hidden="true">· </span>}
          {p}
        </span>
      ))}
    </span>
  );
}

export const wigAlt = (d: Dict, w: { length_cm: number; texture: string; color: string }) =>
  `${d.wigs.textures[w.texture as WigTexture] ?? ""} · ${d.wigs.colors[w.color as WigColor] ?? ""} · ${w.length_cm} ${d.wigs.cm}`;
