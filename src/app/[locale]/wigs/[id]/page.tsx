import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { site } from "@/lib/config";
import { one, type Wig } from "@/lib/db";
import { formatPrice, isLocale, t } from "@/lib/i18n";
import { waLink } from "@/lib/phone";
import { WigMedia } from "@/components/WigMedia";
import { WigTag, wigAlt } from "@/components/WigTag";
import { WigRequestForm } from "@/components/WigRequestForm";

export const dynamic = "force-dynamic";

const getWig = (id: string) => one<Wig>("SELECT * FROM wigs WHERE id = ? AND status IN ('available','reserved')", Number(id) || 0);

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  const wig = getWig(id);
  if (!isLocale(locale) || !wig) return {};
  return { title: wig.title || wigAlt(t(locale), wig) };
}

export default async function WigPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const wig = getWig(id);
  if (!wig) notFound();
  const d = t(locale);
  const alt = wigAlt(d, wig);
  return (
    <div className="wrap">
      <Link href={`/${locale}/wigs`} className="back" style={{ marginTop: 16 }}>
        <ArrowLeft size={18} strokeWidth={1.5} className="flip" aria-hidden="true" />
        {d.wigs.back}
      </Link>
      <div className="wig-page">
        <div className="wig-page__media"><WigMedia wig={wig} alt={alt} eager /></div>
        <div className="wig-page__info">
          <h1 style={{ fontSize: "clamp(30px, 5vw, 44px)" }}>{wig.title || d.wigs.title}</h1>
          <WigTag d={d} lengthCm={wig.length_cm} texture={wig.texture} color={wig.color} />
          {wig.price_from != null && <p className="lead num">{d.wigs.from}{formatPrice(locale, wig.price_from)}</p>}
          {wig.note && <p className="muted">{wig.note}</p>}
          {wig.status === "reserved" ? (
            <div className="notice" style={{ display: "grid", gap: 12, justifyItems: "start" }}>
              <p>{d.wigs.reservedNote}</p>
              {site.whatsapp && (
                <a className="btn btn--ghost" href={waLink(site.whatsapp)} target="_blank" rel="noopener">
                  <MessageCircle size={18} strokeWidth={1.5} aria-hidden="true" />
                  {d.visit.whatsapp}
                </a>
              )}
            </div>
          ) : (
            <WigRequestForm wigId={wig.id} locale={locale} l={{ ...d.reserveWig, payOnSite: d.wigs.payOnSite }} f={d.form} />
          )}
        </div>
      </div>
    </div>
  );
}
