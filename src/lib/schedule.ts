import { closedDays, hours, site } from "./config";

// Calcul des jours et heures proposés, à l'heure de Jérusalem.
// Sans serveur, le site ne connaît pas les rendez-vous déjà pris :
// la coiffeuse répond sur WhatsApp si l'heure demandée n'est plus libre.

export const SLOT_STEP = 30;
export const HORIZON_DAYS = 30;
export const MIN_NOTICE = 60;

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const toHHMM = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

export function nowInJerusalem() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: site.timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  return { day: `${get("year")}-${get("month")}-${get("day")}`, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export const addDays = (day: string, n: number) => {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
export const weekday = (day: string) => new Date(`${day}T00:00:00Z`).getUTCDay();

export function bookableDays() {
  const { day: today } = nowInJerusalem();
  const out: string[] = [];
  for (let i = 0; i < HORIZON_DAYS; i++) {
    const d = addDays(today, i);
    if (hours[weekday(d)] && !closedDays.includes(d) && slotsFor(d, 30).length) out.push(d);
  }
  return out;
}

export function slotsFor(day: string, minutes: number): string[] {
  const h = hours[weekday(day)];
  if (!h || closedDays.includes(day)) return [];
  const now = nowInJerusalem();
  const earliest = day === now.day ? now.minutes + MIN_NOTICE : 0;
  const out: string[] = [];
  for (let s = toMin(h.open); s + minutes <= toMin(h.close); s += SLOT_STEP) if (s >= earliest) out.push(toHHMM(s));
  return out;
}
