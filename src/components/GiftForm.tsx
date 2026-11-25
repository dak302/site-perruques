"use client";

import { useState, type FormEvent } from "react";
import type { Locale } from "@/lib/config";
import { t } from "@/lib/i18n";
import { NameField, NoteField, SendButton, WaDone, openWhatsApp, val, waTo, type FormLabels } from "./FormBits";

type L = { forWhom: string; fromWhom: string; amount: string; amountHint: string; submit: string; done: string; doneNote: string };

export function GiftForm({ l, f, locale }: { l: L; f: FormLabels; locale: Locale }) {
  const [err, setErr] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = val(fd, "name", 80);
    if (name.length < 2) return setErr(true);
    setErr(false);
    const url = waTo(t(locale).wa.gift({ forName: val(fd, "for", 80), amount: val(fd, "amount", 120), name, note: val(fd, "note", 500) }));
    openWhatsApp(url);
    setSent(url);
  };
  if (sent) return <WaDone title={l.done} note={l.doneNote} href={sent} reopen={f.reopen} />;
  return (
    <form onSubmit={submit} className="form" noValidate>
      <div className="field">
        <label htmlFor="for">{l.forWhom}</label>
        <input id="for" name="for" maxLength={80} />
      </div>
      <div className="field">
        <label htmlFor="amount">{l.amount}</label>
        <input id="amount" name="amount" maxLength={120} aria-describedby="amount-hint" />
        <span id="amount-hint" className="field__hint">{l.amountHint}</span>
      </div>
      <NameField f={f} error={err} label={l.fromWhom} />
      <NoteField f={f} />
      <SendButton label={l.submit} />
    </form>
  );
}
