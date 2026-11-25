"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import type { Locale } from "@/lib/config";
import { languageName, locales } from "@/lib/i18n";

type Labels = { wigs: string; services: string; about: string; visit: string; book: string; menu: string; close: string };

export function SiteHeader({ locale, brand, labels }: { locale: Locale; brand: string; labels: Labels }) {
  const pathname = usePathname() || `/${locale}`;
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const rest = pathname.split("/").slice(2).join("/");
  const links = [
    { href: `/${locale}/wigs`, label: labels.wigs },
    { href: `/${locale}#services`, label: labels.services },
    { href: `/${locale}#about`, label: labels.about },
    { href: `/${locale}#visit`, label: labels.visit },
  ];
  const Lang = () => (
    <nav className="lang" aria-label="Language">
      {locales.map((l) => (
        <Link key={l} href={`/${l}/${rest ? `${rest.replace(/\/$/, "")}/` : ""}`} lang={l} hrefLang={l} aria-current={l === locale ? "true" : undefined}>
          {languageName[l]}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="header">
      <div className="wrap header__row">
        <Link href={`/${locale}`} className="brand">
          {brand}
        </Link>
        <nav className="nav" aria-label={labels.menu}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} aria-current={pathname.replace(/\/$/, "") === l.href ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="header__actions">
          <div className="nav"><Lang /></div>
          <Link href={`/${locale}/book`} className="btn btn--primary header__book">
            {labels.book}
          </Link>
          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="drawer"
            aria-label={open ? labels.close : labels.menu}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>
      {open && (
        <div id="drawer" className="drawer wrap">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="drawer__link" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Lang />
        </div>
      )}
    </header>
  );
}
