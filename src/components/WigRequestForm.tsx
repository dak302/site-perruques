"use client";

import { useActionState } from "react";
import { createWigRequest, type FormResult } from "@/app/actions";
import { ContactFields, Done, GenericError, NoteField, keepValues, type FormLabels } from "./FormBits";

type L = { title: string; lead: string; when: string; whenHint: string; submit: string; done: string; payOnSite: string };

export function WigRequestForm({ wigId, locale, l, f }: { wigId: number; locale: string; l: L; f: FormLabels }) {
  const [state, action, pending] = useActionState<FormResult | null, FormData>(createWigRequest, null);
  if (state?.ok) return <Done title={l.done} />;
  return (
    <form action={action} onSubmit={keepValues(action)} className="form" noValidate>
      <div style={{ display: "grid", gap: 4 }}>
        <h2 style={{ fontSize: 26 }}>{l.title}</h2>
        <p className="muted">{l.lead}</p>
      </div>
      <input type="hidden" name="wig" value={wigId} />
      <input type="hidden" name="locale" value={locale} />
      <ContactFields f={f} state={state} />
      <div className="field">
        <label htmlFor="when">{l.when} <span className="opt">({f.optional})</span></label>
        <input id="when" name="when" maxLength={120} aria-describedby="when-hint" />
        <span id="when-hint" className="field__hint">{l.whenHint}</span>
      </div>
      <NoteField f={f} />
      <GenericError f={f} state={state} />
      <div style={{ display: "grid", gap: 8 }}>
        <button className="btn btn--primary btn--block" disabled={pending}>{pending ? f.sending : l.submit}</button>
        <span className="field__hint" style={{ textAlign: "center" }}>{l.payOnSite}</span>
      </div>
    </form>
  );
}
