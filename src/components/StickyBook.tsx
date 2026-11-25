"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Bouton de réservation fixe sur téléphone. Il apparaît une fois le haut de page dépassé
// (le haut de page a déjà son propre bouton) et disparaît sur les pages de formulaire.
export function StickyBook({ href, label }: { href: string; label: string }) {
  const p = usePathname() || "";
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const on = () => setShown(window.scrollY > 480);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  if (/\/(book|gift-card)\/?$/.test(p) || /\/wigs\/\d+/.test(p)) return null;
  return (
    <div className="sticky-book" data-shown={shown} aria-hidden={!shown}>
      <Link href={href} className="btn btn--primary btn--block" tabIndex={shown ? 0 : -1}>
        {label}
      </Link>
    </div>
  );
}
