import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, t } from "@/lib/i18n";
import { GiftForm } from "@/components/GiftForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: t(locale).giftPage.title } : {};
}

export default async function GiftPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale);
  return (
    <div className="wrap" style={{ paddingBottom: 80 }}>
      <div className="page-head">
        <h1>{d.giftPage.title}</h1>
        <p className="lead">{d.giftPage.lead}</p>
      </div>
      <GiftForm locale={locale} l={d.giftPage} f={d.form} />
    </div>
  );
}
