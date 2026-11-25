import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { services } from "@/lib/config";
import { formatPrice, isLocale, localeTag, t } from "@/lib/i18n";
import { bookableDays } from "@/lib/slots";
import { BookingFlow } from "@/components/BookingFlow";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: t(locale).book.title } : {};
}

export default async function BookPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ service?: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { service } = await searchParams;
  const d = t(locale);
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>{d.book.title}</h1>
        <p className="lead">{d.book.lead}</p>
      </div>
      <BookingFlow
        locale={locale}
        localeTag={localeTag[locale]}
        initialService={service}
        days={bookableDays()}
        services={services.map((s) => ({
          id: s.id,
          name: s.name[locale],
          meta: `${s.minutes} ${d.services.minutes} · ${s.priceFrom != null ? d.services.from + formatPrice(locale, s.priceFrom) : d.services.onSite}`,
        }))}
        l={{ ...d.book, today: d.days.today, tomorrow: d.days.tomorrow }}
        f={d.form}
      />
    </div>
  );
}
