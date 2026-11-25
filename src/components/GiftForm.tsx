"use client";

import { useActionState } from "react";
import { createGiftRequest, type FormResult } from "@/app/actions";
import { ContactFields, Done, GenericError, NoteField, keepValues, type FormLabels } from "./FormBits";

type L = { forWhom: string; fromWhom: string; amount: string; amountHint: string; submit: string; done: string };

export function GiftForm({ locale, l, f }: { locale: string; l: L; f: FormLabels }) {
  const [state, action, pending] = useActionState<FormResult | null, FormData>(createGiftRequest, null);
  if (state?.ok) return <Done title={l.done} />;
  return (
    <form action={action} onSubmit={keepValues(action)} className="form" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <div className="field">
        <label htmlFor="for">{l.forWhom}</label>
        <input id="for" name="for" required maxLength={80} />
      </div>
      <div className="field">
        <label htmlFor="amount">{l.amount}</label>
        <input id="amount" name="amount" required maxLength={120} aria-describedby="amount-hint" />
        <span id="amount-hint" className="field__hint">{l.amountHint}</span>
      </div>
      <ContactFields f={f} state={state} nameLabel={l.fromWhom} />
      <NoteField f={f} />
      <GenericError f={f} state={state} />
      <button className="btn btn--primary btn--block" disabled={pending}>{pending ? f.sending : l.submit}</button>
    </form>
  );
}
