import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, MessageCircle, Navigation } from "lucide-react";
import { services, site, type Locale } from "@/lib/config";
import { all, getClosedDays, getHours, type Wig } from "@/lib/db";
import { formatPrice, isLocale, localeTag, t, type Dict } from "@/lib/i18n";
import { waLink } from "@/lib/phone";
import { nowInJerusalem, weekday } from "@/lib/slots";
import { WigArt } from "@/components/WigArt";
import { WigCard } from "@/components/WigCard";
import { WigTag } from "@/components/WigTag";

export const dynamic = "force-dynamic";

const photo = (name: string) => (fs.existsSync(path.join(process.cwd(), "public", "photos", name)) ? `/photos/${name}` : null);

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale);
  const wigs = all<Wig>("SELECT * FROM wigs WHERE status IN ('available','reserved') ORDER BY status = 'reserved', sort, id DESC LIMIT 6");
  const hero = photo("hero.jpg");
  const portrait = photo("portrait.jpg");
  const featured = wigs.find((w) => w.status === "available");

  return (
    <>
      {/* Haut de page */}
      <section className="hero">
        <div className="wrap hero__grid">
          <div className="hero__text">
            <h1>{d.hero.title}</h1>
            <p>{d.hero.subtitle}</p>
            <div className="hero__actions">
              <Link href={`/${locale}/book`} className="btn btn--primary">{d.hero.primary}</Link>
              <Link href={`/${locale}/wigs`} className="btn btn--ghost">{d.hero.secondary}</Link>
            </div>
            <span className="hero__address">
              <MapPin size={16} strokeWidth={1.5} aria-hidden="true" />
              {site.address[locale]}
            </span>
          </div>
          <div className="hero__visual">
            {hero ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={hero} alt="" fetchPriority="high" />
            ) : (
              <WigArt id="hero" lengthCm={featured?.length_cm ?? 50} texture={featured?.texture ?? "wavy"} color={featured?.color ?? "chestnut"} />
            )}
            {featured && <WigTag d={d} lengthCm={featured.length_cm} texture={featured.texture} color={featured.color} />}
          </div>
        </div>
      </section>

      {/* Perruques disponibles */}
      <section className="section" aria-labelledby="wigs-title">
        <div className="wrap">
          <div className="section-head">
            <h2 id="wigs-title">{d.wigsPreview.title}</h2>
            <p className="lead">{d.wigsPreview.lead}</p>
          </div>
          {wigs.length ? (
            <div className="wig-grid">
              {wigs.map((w) => <WigCard key={w.id} wig={w} d={d} locale={locale} />)}
            </div>
          ) : (
            <p className="muted">{d.wigs.empty}</p>
          )}
          <p style={{ marginTop: 40 }}>
            <Link href={`/${locale}/wigs`} className="link">{d.wigsPreview.all}</Link>
          </p>
        </div>
      </section>

      {/* Prestations */}
      <section id="services" className="section section--alt" aria-labelledby="services-title">
        <div className="wrap">
          <div className="section-head"><h2 id="services-title">{d.services.title}</h2></div>
          <div className="services">
            {(["wigs", "hair"] as const).map((group) => (
              <div key={group} className="service-group">
                <h3>{group === "wigs" ? d.services.wigsGroup : d.services.hairGroup}</h3>
                {services.filter((s) => s.group === group).map((s) => (
                  <div key={s.id} className="service">
                    <span className="service__name">{s.name[locale]}</span>
                    <span className="service__price">
                      {s.priceFrom != null ? `${d.services.from}${formatPrice(locale, s.priceFrom)}` : d.services.onSite}
                    </span>
                    <span className="service__desc">{s.description[locale]}</span>
                    <span className="service__meta">{s.minutes} {d.services.minutes}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça se passe */}
      <section className="section" aria-labelledby="steps-title">
        <div className="wrap">
          <div className="section-head"><h2 id="steps-title">{d.steps.title}</h2></div>
          <ol className="steps" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {d.steps.items.map((s, i) => (
              <li key={i} className="step">
                <span className="step__n num" aria-hidden="true">{i + 1}</span>
                <h3>{s.title}</h3>
                <p className="muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* À propos */}
      <section id="about" className="section section--alt" aria-labelledby="about-title">
        <div className="wrap about">
          {portrait && (
            <div className="about__photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={portrait} alt={site.ownerName[locale] || d.about.title} loading="lazy" />
            </div>
          )}
          <div className="about__text">
            <h2 id="about-title">{d.about.title}</h2>
            {d.about.text.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </section>

      {/* Rendez-vous */}
      <section className="book-band" aria-labelledby="band-title">
        <div className="wrap">
          <div>
            <h2 id="band-title">{d.bookBand.title}</h2>
            <p>{d.bookBand.text}</p>
          </div>
          <Link href={`/${locale}/book`} className="btn btn--light">{d.bookBand.cta}</Link>
        </div>
      </section>

      {/* Venir */}
      <section id="visit" className="section" aria-labelledby="visit-title">
        <div className="wrap visit">
          <div className="visit__info">
            <h2 id="visit-title">{d.visit.title}</h2>
            <p className="visit__line">
              <MapPin size={18} strokeWidth={1.5} aria-hidden="true" />
              <span>{site.address[locale]}</span>
            </p>
            <div>
              <h3 style={{ fontSize: 18, fontFamily: "var(--font-body)", fontWeight: 600, marginBottom: 8 }}>{d.visit.hours}</h3>
              <Hours locale={locale} d={d} />
            </div>
            <div className="hero__actions">
              {site.whatsapp && (
                <a href={waLink(site.whatsapp)} className="btn btn--ghost" target="_blank" rel="noopener">
                  <MessageCircle size={18} strokeWidth={1.5} aria-hidden="true" />
                  {d.visit.whatsapp}
                </a>
              )}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.mapsQuery)}`}
                className="btn btn--ghost"
                target="_blank"
                rel="noopener"
              >
                <Navigation size={18} strokeWidth={1.5} aria-hidden="true" />
                {d.visit.directions}
              </a>
            </div>
          </div>
          <iframe
            className="map"
            title={d.visit.map}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(site.mapsQuery)}&hl=${locale === "he" ? "iw" : locale}&z=16&output=embed`}
          />
        </div>
      </section>

      {/* Carte cadeau */}
      <section className="section" style={{ paddingTop: 0 }} aria-labelledby="gift-title">
        <div className="wrap">
          <div className="gift">
            <div className="gift__card" aria-hidden="true">{site.brand[locale]}</div>
            <div style={{ display: "grid", gap: 8 }}>
              <h2 id="gift-title" style={{ fontSize: 28 }}>{d.gift.title}</h2>
              <p className="muted">{d.gift.text}</p>
            </div>
            <Link href={`/${locale}/gift-card`} className="btn btn--ghost">{d.gift.cta}</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Hours({ locale, d }: { locale: Locale; d: Dict }) {
  const hours = getHours();
  const today = nowInJerusalem().day;
  const todayWd = weekday(today);
  const closedToday = getClosedDays().includes(today);
  // 2023-01-01 est un dimanche : sert juste à obtenir le nom des jours dans chaque langue.
  const name = (i: number) => new Intl.DateTimeFormat(localeTag[locale], { weekday: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2023, 0, 1 + i)));
  return (
    <table className="hours">
      <tbody>
        {hours.map((h, i) => (
          <tr key={i} className={i === todayWd ? "is-today" : undefined}>
            <td>{name(i)}</td>
            <td>{h && !(i === todayWd && closedToday) ? <span dir="ltr">{`${h.open}–${h.close}`}</span> : d.visit.closed}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
