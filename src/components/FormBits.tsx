"use client";

import { CircleCheck, MessageCircle } from "lucide-react";
import { site } from "@/lib/config";
import { waLink } from "@/lib/phone";

export type FormLabels = { name: string; message: string; optional: string; errName: string; reopen: string };

export const waTo = (text: string) => waLink(site.whatsapp, text);

// Ouvre WhatsApp avec le message prêt. Sur téléphone, l'application s'ouvre directement.
export function openWhatsApp(url: string) {
  // (pas d'option « noopener » ici : avec elle, window.open renvoie toujours null)
  const w = window.open(url, "_blank");
  if (w) w.opener = null;
  else window.location.href = url;
}

export function NameField({ f, error, label }: { f: FormLabels; error: boolean; label?: string }) {
  return (
    <div className="field">
      <label htmlFor="name">{label ?? f.name}</label>
      <input id="name" name="name" autoComplete="name" required maxLength={80} aria-invalid={error} aria-describedby={error ? "name-err" : undefined} />
      {error && <span id="name-err" className="field__error" role="alert">{f.errName}</span>}
    </div>
  );
}

export function NoteField({ f, label }: { f: FormLabels; label?: string }) {
  return (
    <div className="field">
      <label htmlFor="note">
        {label ?? f.message} <span className="opt">({f.optional})</span>
      </label>
      <textarea id="note" name="note" maxLength={500} />
    </div>
  );
}

export function SendButton({ label, hint }: { label: string; hint?: string }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <button className="btn btn--primary btn--block">
        <MessageCircle size={18} strokeWidth={1.5} aria-hidden="true" />
        {label}
      </button>
      {hint && <span className="field__hint" style={{ textAlign: "center" }}>{hint}</span>}
    </div>
  );
}

export function WaDone({ title, note, href, reopen, children }: { title: string; note: string; href: string; reopen: string; children?: React.ReactNode }) {
  return (
    <div className="done" role="status">
      <CircleCheck size={28} strokeWidth={1.5} aria-hidden="true" />
      <h2 style={{ fontSize: 26 }}>{title}</h2>
      <p className="muted">{note}</p>
      {children}
      <a href={href} target="_blank" rel="noopener" className="btn btn--ghost">
        <MessageCircle size={18} strokeWidth={1.5} aria-hidden="true" />
        {reopen}
      </a>
    </div>
  );
}

export const val = (fd: FormData, k: string, max = 300) => String(fd.get(k) ?? "").trim().slice(0, max);
