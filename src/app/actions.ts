"use server";

import { serviceById, site } from "@/lib/config";
import { one, run, type Wig } from "@/lib/db";
import { isLocale } from "@/lib/i18n";
import { notifyOwner } from "@/lib/notify";
import { displayPhone, normalizePhone } from "@/lib/phone";
import { endOf, freeSlots } from "@/lib/slots";

export type FormResult = { ok: true } | { ok: false; field?: "name" | "phone" | "slot"; error: "name" | "phone" | "taken" | "generic" };

const clean = (v: FormDataEntryValue | null, max = 300) => String(v ?? "").trim().slice(0, max);

// Champ piège invisible : les robots le remplissent, les personnes non.
const isBot = (fd: FormData) => clean(fd.get("website")).length > 0;

function contact(fd: FormData): { name: string; phone: string } | FormResult {
  const name = clean(fd.get("name"), 80);
  if (name.length < 2) return { ok: false, field: "name", error: "name" };
  const phone = normalizePhone(clean(fd.get("phone"), 30));
  if (!phone) return { ok: false, field: "phone", error: "phone" };
  return { name, phone };
}

export async function getSlots(day: string, serviceId: string) {
  return freeSlots(day, serviceId);
}

export async function createBooking(_: FormResult | null, fd: FormData): Promise<FormResult> {
  if (isBot(fd)) return { ok: true };
  const c = contact(fd);
  if ("ok" in c) return c;
  const service = serviceById(clean(fd.get("service")));
  const day = clean(fd.get("day"), 10);
  const start = clean(fd.get("start"), 5);
  const locale = clean(fd.get("locale"), 2);
  if (!service || !isLocale(locale)) return { ok: false, error: "generic" };
  // On revérifie le créneau au moment d'enregistrer : quelqu'un a pu le prendre entre-temps.
  if (!freeSlots(day, service.id).includes(start)) return { ok: false, field: "slot", error: "taken" };
  run(
    "INSERT INTO bookings (service_id, day, start, end, name, phone, note, locale) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    service.id,
    day,
    start,
    endOf(start, service.minutes),
    c.name,
    c.phone,
    clean(fd.get("note"), 500),
    locale,
  );
  await notifyOwner(`Nouvelle demande de RDV : ${service.name.fr}, ${day} à ${start}. ${c.name}, ${displayPhone(c.phone)}`);
  return { ok: true };
}

export async function createWigRequest(_: FormResult | null, fd: FormData): Promise<FormResult> {
  if (isBot(fd)) return { ok: true };
  const c = contact(fd);
  if ("ok" in c) return c;
  const wigId = Number(fd.get("wig"));
  const locale = clean(fd.get("locale"), 2);
  const wig = one<Wig>("SELECT * FROM wigs WHERE id = ? AND status = 'available'", wigId);
  if (!wig || !isLocale(locale)) return { ok: false, error: "generic" };
  run(
    "INSERT INTO wig_requests (wig_id, name, phone, when_text, note, locale) VALUES (?, ?, ?, ?, ?, ?)",
    wig.id,
    c.name,
    c.phone,
    clean(fd.get("when"), 120),
    clean(fd.get("note"), 500),
    locale,
  );
  await notifyOwner(
    `Demande de réservation : perruque n°${wig.id} (${wig.length_cm} cm). ${c.name}, ${displayPhone(c.phone)}`,
  );
  return { ok: true };
}

export async function createGiftRequest(_: FormResult | null, fd: FormData): Promise<FormResult> {
  if (isBot(fd)) return { ok: true };
  const c = contact(fd);
  if ("ok" in c) return c;
  const locale = clean(fd.get("locale"), 2);
  const forName = clean(fd.get("for"), 80);
  const amount = clean(fd.get("amount"), 120);
  if (!isLocale(locale) || !forName || !amount) return { ok: false, error: "generic" };
  run(
    "INSERT INTO gift_requests (for_name, from_name, amount, phone, note, locale) VALUES (?, ?, ?, ?, ?, ?)",
    forName,
    c.name,
    amount,
    c.phone,
    clean(fd.get("note"), 500),
    locale,
  );
  await notifyOwner(`Demande de carte cadeau ${site.brand.fr} : ${amount}, pour ${forName}. ${c.name}, ${displayPhone(c.phone)}`);
  return { ok: true };
}
