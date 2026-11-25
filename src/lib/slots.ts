import "server-only";
import { site, serviceById } from "./config";
import { all, getClosedDays, getHours } from "./db";

export const SLOT_STEP = 30; // minutes entre deux débuts de créneau
export const HORIZON_DAYS = 30; // jusqu'où on peut réserver
export const MIN_NOTICE = 60; // minutes minimum avant un rendez-vous le jour même

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
export const toHHMM = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

// Date et heure actuelles à Jérusalem, quel que soit le fuseau du serveur.
export function nowInJerusalem() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: site.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  return { day: `${get("year")}-${get("month")}-${get("day")}`, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

// Les jours sont manipulés en UTC pur pour éviter tout décalage d'heure d'été.
export const addDays = (day: string, n: number) => {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
export const weekday = (day: string) => new Date(`${day}T00:00:00Z`).getUTCDay();

export function bookableDays() {
  const { day: today } = nowInJerusalem();
  const hours = getHours();
  const closed = new Set(getClosedDays());
  const days: string[] = [];
  for (let i = 0; i < HORIZON_DAYS; i++) {
    const d = addDays(today, i);
    if (hours[weekday(d)] && !closed.has(d)) days.push(d);
  }
  return days;
}

export function freeSlots(day: string, serviceId: string): string[] {
  const service = serviceById(serviceId);
  if (!service || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return [];
  if (!bookableDays().includes(day)) return [];
  const h = getHours()[weekday(day)];
  if (!h) return [];

  const taken = all<{ start: string; end: string }>(
    "SELECT start, end FROM bookings WHERE day = ? AND status IN ('pending','confirmed')",
    day,
  ).map((b) => [toMin(b.start), toMin(b.end)] as const);

  const now = nowInJerusalem();
  const earliest = day === now.day ? now.minutes + MIN_NOTICE : 0;
  const open = toMin(h.open);
  const close = toMin(h.close);
  const out: string[] = [];
  for (let s = open; s + service.minutes <= close; s += SLOT_STEP) {
    if (s < earliest) continue;
    const e = s + service.minutes;
    if (taken.some(([ts, te]) => s < te && e > ts)) continue;
    out.push(toHHMM(s));
  }
  return out;
}

export const endOf = (start: string, minutes: number) => toHHMM(toMin(start) + minutes);
