"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { services, type Locale } from "@/lib/config";
import { formatPrice, localeTag, t } from "@/lib/i18n";
import { addDays, bookableDays, nowInJerusalem, slotsFor } from "@/lib/schedule";
import { NameField, NoteField, SendButton, WaDone, openWhatsApp, val, waTo } from "./FormBits";

export function BookingFlow({ locale }: { locale: Locale }) {
  const d = t(locale);
  const l = d.book;
  // Les jours sont calculés dans le navigateur (le site est statique, la date doit être celle du jour).
  const [days, setDays] = useState<string[] | null>(null);
  const [service, setService] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [err, setErr] = useState(false);
  const [sent, setSent] = useState<string | null>(null);

  useEffect(() => {
    const ds = bookableDays();
    setDays(ds);
    setDay(ds[0] ?? null);
    const fromUrl = new URLSearchParams(window.location.search).get("service");
    if (fromUrl && services.some((s) => s.id === fromUrl)) setService(fromUrl);
  }, []);

  const chosen = services.find((s) => s.id === service);
  const slots = useMemo(() => (day && chosen ? slotsFor(day, chosen.minutes) : []), [day, chosen]);
  useEffect(() => setTime(null), [day, service]);

  const fmt = (opts: Intl.DateTimeFormatOptions, x: string) =>
    new Intl.DateTimeFormat(localeTag[locale], { ...opts, timeZone: "UTC" }).format(new Date(`${x}T00:00:00Z`));
  const today = nowInJerusalem().day;
  const tomorrow = addDays(today, 1);
  const longDate = (x: string) => fmt({ weekday: "long", day: "numeric", month: "long" }, x);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chosen || !day || !time) return;
    const fd = new FormData(e.currentTarget);
    const name = val(fd, "name", 80);
    if (name.length < 2) return setErr(true);
    setErr(false);
    const url = waTo(d.wa.booking({ service: chosen.name[locale], date: longDate(day), time, name, note: val(fd, "note", 500) }));
    openWhatsApp(url);
    setSent(url);
  };

  if (sent && chosen && day && time) {
    return (
      <WaDone title={l.done} note={l.doneNote} href={sent} reopen={d.form.reopen}>
        <p className="num">
          {chosen.name[locale]} · {longDate(day)} · <span dir="ltr">{time}</span>
        </p>
      </WaDone>
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
              <span className="choice__name">{s.name[locale]}</span>
              <span className="choice__meta">
                {s.minutes} {d.services.minutes} · {s.priceFrom != null ? d.services.from + formatPrice(locale, s.priceFrom) : d.services.onSite}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {service && days && (
        <fieldset className="bstep" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="bstep__head" style={{ marginBottom: 16 }}>
            <span className="bstep__n num" aria-hidden="true">2</span>
            <h2 style={{ fontSize: 24 }}>{l.step2}</h2>
          </legend>
          <div className="days" role="radiogroup" aria-label={l.day}>
            {days.map((x) => (
              <label key={x} className="day">
                <input type="radio" name="day" className="sr" checked={day === x} onChange={() => setDay(x)} />
                <span className="day__wd">{x === today ? d.days.today : x === tomorrow ? d.days.tomorrow : fmt({ weekday: "short" }, x)}</span>
                <span className="day__d">{fmt({ day: "numeric" }, x)}</span>
                <span className="day__m">{fmt({ month: "short" }, x)}</span>
              </label>
            ))}
          </div>
          {slots.length ? (
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
        </fieldset>
      )}

      {chosen && day && time && (
        <form onSubmit={submit} className="bstep form" noValidate>
          <div className="bstep__head">
            <span className="bstep__n num" aria-hidden="true">3</span>
            <h2 style={{ fontSize: 24 }}>{l.step3}</h2>
          </div>
          <div className="summary num">
            <span>
              {chosen.name[locale]} · {longDate(day)} · <span dir="ltr">{time}</span>
            </span>
          </div>
          <NameField f={d.form} error={err} />
          <NoteField f={d.form} />
          <SendButton label={l.submit} hint={l.sendHint} />
        </form>
      )}
    </div>
  );
}
