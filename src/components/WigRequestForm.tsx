"use client";

import { useState, type FormEvent } from "react";
import type { Locale } from "@/lib/config";
import { t } from "@/lib/i18n";
import { NameField, NoteField, SendButton, WaDone, openWhatsApp, val, waTo, type FormLabels } from "./FormBits";

type L = { title: string; lead: string; when: string; whenHint: string; submit: string; done: string; doneNote: string; payOnSite: string };

export function WigRequestForm({ desc, l, f, locale }: { desc: string; l: L; f: FormLabels; locale: Locale }) {
  const [err, setErr] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = val(fd, "name", 80);
    if (name.length < 2) return setErr(true);
    setErr(false);
    const url = waTo(t(locale).wa.wig({ desc, url: window.location.href, name, when: val(fd, "when", 120), note: val(fd, "note", 500) }));
    openWhatsApp(url);
    setSent(url);
  };
  if (sent) return <WaDone title={l.done} note={l.doneNote} href={sent} reopen={f.reopen} />;
  return (
    <form onSubmit={submit} className="form" noValidate>
      <div style={{ display: "grid", gap: 4 }}>
        <h2 style={{ fontSize: 26 }}>{l.title}</h2>
        <p className="muted">{l.lead}</p>
      </div>
      <NameField f={f} error={err} />
      <div className="field">
        <label htmlFor="when">{l.when} <span className="opt">({f.optional})</span></label>
        <input id="when" name="when" maxLength={120} aria-describedby="when-hint" />
        <span id="when-hint" className="field__hint">{l.whenHint}</span>
      </div>
      <NoteField f={f} />
      <SendButton label={l.submit} hint={l.payOnSite} />
    </form>
  );
}
