import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "@fontsource/frank-ruhl-libre/400.css";
import "@fontsource/frank-ruhl-libre/500.css";
import "@fontsource/assistant/400.css";
import "@fontsource/assistant/500.css";
import "@fontsource/assistant/600.css";
import { site } from "@/lib/config";
import { dirOf, isLocale, locales, t } from "@/lib/i18n";
import { SiteHeader } from "@/components/SiteHeader";
import { StickyBook } from "@/components/StickyBook";
import "../globals.css";



export const generateStaticParams = () => locales.map((locale) => ({ locale }));
export const dynamicParams = false;

export const viewport: Viewport = { themeColor: "#f7f3ea" };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = t(locale);
  return {
    title: { default: `${site.brand[locale]} · ${d.hero.title}`, template: `%s · ${site.brand[locale]}` },
    description: d.hero.subtitle,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])) },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale);
  return (
    <html lang={locale} dir={dirOf(locale)}>
      <body className="has-sticky">
        <a href="#main" className="skip">{d.nav.skip}</a>
        <SiteHeader locale={locale} brand={site.brand[locale]} labels={d.nav} />
        <main id="main">{children}</main>
        <footer className="footer">
          <div className="wrap">
            <span>{site.brand[locale]} · {site.address[locale]}</span>
            <span>© {new Date().getFullYear()} · {d.footer.rights}</span>
          </div>
        </footer>
        <StickyBook href={`/${locale}/book`} label={d.nav.book} />
      </body>
    </html>
  );
}
