"use client";

import { startTransition, type FormEvent } from "react";
import { CircleCheck } from "lucide-react";
import type { FormResult } from "@/app/actions";

export type FormLabels = {
  name: string; phone: string; phoneHint: string; message: string; optional: string; sending: string;
  errName: string; errPhone: string; errGeneric: string;
};

const err = (state: FormResult | null, field: "name" | "phone") => (state && !state.ok && state.field === field ? state.error : null);

export function ContactFields({ f, state, nameLabel }: { f: FormLabels; state: FormResult | null; nameLabel?: string }) {
  const nameErr = err(state, "name");
  const phoneErr = err(state, "phone");
  return (
    <>
      <div className="field">
        <label htmlFor="name">{nameLabel ?? f.name}</label>
        <input id="name" name="name" autoComplete="name" required minLength={2} maxLength={80} aria-invalid={!!nameErr} aria-describedby={nameErr ? "name-err" : undefined} />
        {nameErr && <span id="name-err" className="field__error" role="alert">{f.errName}</span>}
      </div>
      <div className="field">
        <label htmlFor="phone">{f.phone}</label>
        <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" required aria-invalid={!!phoneErr} aria-describedby={phoneErr ? "phone-err" : "phone-hint"} />
        {phoneErr ? (
          <span id="phone-err" className="field__error" role="alert">{f.errPhone}</span>
        ) : (
          <span id="phone-hint" className="field__hint">{f.phoneHint}</span>
        )}
      </div>
      {/* champ piège pour les robots, invisible pour les personnes */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
    </>
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

export function GenericError({ f, state }: { f: FormLabels; state: FormResult | null }) {
  return state && !state.ok && state.error === "generic" ? <p className="field__error" role="alert">{f.errGeneric}</p> : null;
}

export function Done({ title, note, children }: { title: string; note?: string; children?: React.ReactNode }) {
  return (
    <div className="done" role="status">
      <CircleCheck size={28} strokeWidth={1.5} aria-hidden="true" />
      <h2 style={{ fontSize: 26 }}>{title}</h2>
      {note && <p className="muted">{note}</p>}
      {children}
    </div>
  );
}

// Envoie le formulaire sans le vider : si une erreur s'affiche, la cliente garde ce qu'elle a tapé.
export const keepValues = (action: (fd: FormData) => void) => (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  startTransition(() => action(fd));
};
