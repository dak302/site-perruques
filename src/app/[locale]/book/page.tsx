import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, t } from "@/lib/i18n";
import { BookingFlow } from "@/components/BookingFlow";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: t(locale).book.title } : {};
}

export default async function BookPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale);
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>{d.book.title}</h1>
        <p className="lead">{d.book.lead}</p>
      </div>
      <BookingFlow locale={locale} />
    </div>
  );
}
