"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { createBooking, getSlots, type FormResult } from "@/app/actions";
import { ContactFields, Done, GenericError, NoteField, keepValues, type FormLabels } from "./FormBits";

type ServiceOpt = { id: string; name: string; meta: string };
type L = {
  step1: string; step2: string; step3: string; day: string; time: string; noSlots: string; pickService: string; pickTime: string;
  submit: string; done: string; doneNote: string; again: string; taken: string; change: string; today: string; tomorrow: string;
};

export function BookingFlow({
  locale, localeTag, services, days, initialService, l, f,
}: { locale: string; localeTag: string; services: ServiceOpt[]; days: string[]; initialService?: string; l: L; f: FormLabels }) {
  const [service, setService] = useState<string | null>(services.some((s) => s.id === initialService) ? initialService! : null);
  const [day, setDay] = useState<string | null>(days[0] ?? null);
  const [slots, setSlots] = useState<string[] | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [loading, startLoading] = useTransition();
  const [state, action, pending] = useActionState<FormResult | null, FormData>(createBooking, null);

  const load = (d: string | null, s: string | null) => {
    setTime(null);
    if (!d || !s) return setSlots(null);
    startLoading(async () => setSlots(await getSlots(d, s)));
  };
  useEffect(() => load(day, service), [day, service]); // eslint-disable-line react-hooks/exhaustive-deps
  // Créneau pris entre-temps : on recharge les heures libres.
  useEffect(() => {
    if (state && !state.ok && state.error === "taken") load(day, service);
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  const fmt = (opts: Intl.DateTimeFormatOptions, d: string) => new Intl.DateTimeFormat(localeTag, { ...opts, timeZone: "UTC" }).format(new Date(`${d}T00:00:00Z`));
  const chosen = services.find((s) => s.id === service);

  if (state?.ok && chosen && day && time) {
    return (
      <Done title={l.done} note={l.doneNote}>
        <p className="num">
          {chosen.name} · {fmt({ weekday: "long", day: "numeric", month: "long" }, day)} · <span dir="ltr">{time}</span>
        </p>
        <a href={`/${locale}/book`} className="link">{l.again}</a>
      </Done>
    );
  }

  return (
    <div className="booking">
      <fieldset className="bstep" style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="bstep__head" style={{ marginBottom: 16 }}>
          <span className="bstep__n num" aria-hidden="true">1</span>
          <h2 style={{ fontSize: 24 }}>{l.step1}</h2>
        </legend>
        <div className="choice-list">
          {services.map((s) => (
            <label key={s.id} className="choice">
              <input type="radio" name="svc" className="sr" checked={service === s.id} onChange={() => setService(s.id)} />
              <span className="choice__name">{s.name}</span>
              <span className="choice__meta">{s.meta}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {service && (
        <fieldset className="bstep" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="bstep__head" style={{ marginBottom: 16 }}>
            <span className="bstep__n num" aria-hidden="true">2</span>
            <h2 style={{ fontSize: 24 }}>{l.step2}</h2>
          </legend>
          <div className="days" role="radiogroup" aria-label={l.day}>
            {days.map((d) => (
              <label key={d} className="day">
                <input type="radio" name="day" className="sr" checked={day === d} onChange={() => setDay(d)} />
                <span className="day__wd">{isToday(d) ? l.today : isTomorrow(d) ? l.tomorrow : fmt({ weekday: "short" }, d)}</span>
                <span className="day__d">{fmt({ day: "numeric" }, d)}</span>
                <span className="day__m">{fmt({ month: "short" }, d)}</span>
              </label>
            ))}
          </div>
          <div aria-live="polite" aria-busy={loading}>
            {slots === null || loading ? (
              <div className="times" aria-hidden="true">
                {Array.from({ length: 6 }, (_, i) => <span key={i} className="time" style={{ opacity: 0.35 }} />)}
              </div>
            ) : slots.length ? (
              <div className="times" role="radiogroup" aria-label={l.time}>
                {slots.map((s) => (
                  <label key={s} className="time">
                    <input type="radio" name="time" className="sr" checked={time === s} onChange={() => setTime(s)} />
                    <span dir="ltr">{s}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="muted">{l.noSlots}</p>
            )}
            {state && !state.ok && state.error === "taken" && <p className="field__error" role="alert" style={{ marginTop: 12 }}>{l.taken}</p>}
          </div>
        </fieldset>
      )}

      {service && day && time && (
        <form action={action} onSubmit={keepValues(action)} className="bstep form" noValidate>
          <div className="bstep__head">
            <span className="bstep__n num" aria-hidden="true">3</span>
            <h2 style={{ fontSize: 24 }}>{l.step3}</h2>
          </div>
          <div className="summary num">
            <span>
              {chosen?.name} · {fmt({ weekday: "long", day: "numeric", month: "long" }, day)} · <span dir="ltr">{time}</span>
            </span>
          </div>
          <input type="hidden" name="service" value={service} />
          <input type="hidden" name="day" value={day} />
          <input type="hidden" name="start" value={time} />
          <input type="hidden" name="locale" value={locale} />
          <ContactFields f={f} state={state} />
          <NoteField f={f} />
          <GenericError f={f} state={state} />
          <button className="btn btn--primary btn--block" disabled={pending}>{pending ? f.sending : l.submit}</button>
        </form>
      )}
    </div>
  );
}

// Le premier jour réservable peut être aujourd'hui ou plus tard (jour fermé) : on compare à la date de Jérusalem.
const jerusalemToday = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const isToday = (d: string) => d === jerusalemToday();
const isTomorrow = (d: string) => {
  const t = new Date(`${jerusalemToday()}T00:00:00Z`);
  t.setUTCDate(t.getUTCDate() + 1);
  return d === t.toISOString().slice(0, 10);
};
