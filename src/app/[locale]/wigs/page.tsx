import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { visibleWigs } from "@/data/wigs";
import { isLocale, t } from "@/lib/i18n";
import { WigCard } from "@/components/WigCard";
import { WigCatalogue } from "@/components/WigCatalogue";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: t(locale).wigs.title } : {};
}

export default async function WigsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale);
  const wigs = [...visibleWigs()].sort((a, b) => Number(a.status === "reserved") - Number(b.status === "reserved"));
  const counts = Object.fromEntries(Array.from({ length: wigs.length + 1 }, (_, n) => [n, d.wigs.count(n)]));
  return (
    <div className="wrap" style={{ paddingBottom: 80 }}>
      <div className="page-head">
        <h1>{d.wigs.title}</h1>
        <p className="lead">{d.wigs.lead}</p>
      </div>
      {wigs.length ? (
        <WigCatalogue
          items={wigs.map((w) => ({ id: w.id, length_cm: w.length_cm, texture: w.texture, color: w.color, card: <WigCard wig={w} d={d} locale={locale} /> }))}
          labels={{
            length: d.wigs.length, texture: d.wigs.texture, color: d.wigs.color, all: d.wigs.all, clear: d.wigs.clear,
            noResults: d.wigs.noResults, lengths: d.wigs.lengths, textures: d.wigs.textures, colors: d.wigs.colors, counts,
          }}
        />
      ) : (
        <p className="muted">{d.wigs.empty}</p>
      )}
    </div>
  );
}
