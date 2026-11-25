"use client";

import { useMemo, useState } from "react";
import { lengthBucket, wigColorHex, wigColors, wigTextures, type WigColor } from "@/lib/config";

type Item = { id: number; length_cm: number; texture: string; color: string; card: React.ReactNode };
type Labels = {
  length: string; texture: string; color: string; all: string; clear: string; noResults: string;
  lengths: Record<string, string>; textures: Record<string, string>; colors: Record<string, string>;
  counts: Record<number, string>;
};

export function WigCatalogue({ items, labels }: { items: Item[]; labels: Labels }) {
  const [len, setLen] = useState<string | null>(null);
  const [tex, setTex] = useState<string | null>(null);
  const [col, setCol] = useState<string | null>(null);

  // On ne propose que les options présentes dans le stock, pour ne jamais tomber sur un filtre vide.
  const present = useMemo(
    () => ({
      len: (["short", "medium", "long"] as const).filter((b) => items.some((i) => lengthBucket(i.length_cm) === b)),
      tex: wigTextures.filter((x) => items.some((i) => i.texture === x)),
      col: wigColors.filter((x) => items.some((i) => i.color === x)),
    }),
    [items],
  );

  const shown = items.filter(
    (i) => (!len || lengthBucket(i.length_cm) === len) && (!tex || i.texture === tex) && (!col || i.color === col),
  );
  const any = len || tex || col;

  const Row = ({ label, names, options, value, set, swatch }: { label: string; names: Record<string, string>; options: readonly string[]; value: string | null; set: (v: string | null) => void; swatch?: boolean }) =>
    options.length > 1 ? (
      <div className="filter-row" role="group" aria-label={label}>
        <span className="filter-row__label">{label}</span>
        <div className="chips">
          {options.map((o) => (
            <button key={o} type="button" className="chip" aria-pressed={value === o} onClick={() => set(value === o ? null : o)}>
              {swatch && <span className="swatch" style={{ background: wigColorHex[o as WigColor] }} aria-hidden="true" />}
              {names[o]}
            </button>
          ))}
        </div>
      </div>
    ) : null;

  return (
    <>
      <div className="filters">
        <Row label={labels.length} names={labels.lengths} options={present.len} value={len} set={setLen} />
        <Row label={labels.texture} names={labels.textures} options={present.tex} value={tex} set={setTex} />
        <Row label={labels.color} names={labels.colors} options={present.col} value={col} set={setCol} swatch />
        <div className="filters__foot">
          <span className="muted small num" aria-live="polite">{labels.counts[shown.length] ?? shown.length}</span>
          {any && (
            <button type="button" className="link" style={{ background: "none", border: 0, cursor: "pointer", padding: 8 }} onClick={() => { setLen(null); setTex(null); setCol(null); }}>
              {labels.clear}
            </button>
          )}
        </div>
      </div>
      {shown.length ? (
        <div className="wig-grid">{shown.map((i) => <div key={i.id}>{i.card}</div>)}</div>
      ) : (
        <div className="empty">
          <p>{labels.noResults}</p>
          <button type="button" className="btn btn--ghost" onClick={() => { setLen(null); setTex(null); setCol(null); }}>{labels.clear}</button>
        </div>
      )}
    </>
  );
}
