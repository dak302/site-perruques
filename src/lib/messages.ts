import { serviceById, site, type Locale } from "./config";
import { isLocale, localeTag } from "./i18n";

// Messages WhatsApp que la coiffeuse envoie aux clientes, dans la langue où la cliente a réservé.

const L = (l: string): Locale => (isLocale(l) ? l : "he");
const dateText = (l: Locale, day: string) =>
  new Intl.DateTimeFormat(localeTag[l], { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`));
const siteUrl = () => (process.env.SITE_URL || "").replace(/\/$/, "");

export function bookingConfirmed(b: { name: string; locale: string; service_id: string; day: string; start: string }) {
  const l = L(b.locale);
  const s = serviceById(b.service_id)?.name[l] ?? "";
  const date = dateText(l, b.day);
  return {
    he: `שלום ${b.name}, התור אושר: ${s}, ${date} בשעה ${b.start}, ${site.address.he}. נתראה`,
    fr: `Bonjour ${b.name}, votre rendez-vous est confirmé : ${s}, ${date} à ${b.start}, ${site.address.fr}. À bientôt`,
    en: `Hello ${b.name}, your appointment is confirmed: ${s}, ${date} at ${b.start}, ${site.address.en}. See you soon`,
  }[l];
}

export function bookingRefused(b: { name: string; locale: string; day: string; start: string }) {
  const l = L(b.locale);
  const date = dateText(l, b.day);
  const link = siteUrl() ? ` ${siteUrl()}/${l}/book` : "";
  return {
    he: `שלום ${b.name}, השעה ${b.start} ב${date} כבר לא פנויה. אפשר לבחור שעה אחרת כאן:${link}`,
    fr: `Bonjour ${b.name}, le créneau du ${date} à ${b.start} n'est plus disponible. Vous pouvez en choisir un autre ici :${link}`,
    en: `Hello ${b.name}, ${date} at ${b.start} is no longer available. You can choose another time here:${link}`,
  }[l];
}

export function bookingReminder(b: { name: string; locale: string; start: string }) {
  const l = L(b.locale);
  return {
    he: `תזכורת: תור מחר בשעה ${b.start}, ${site.address.he}. משהו השתנה? אפשר לענות להודעה הזו`,
    fr: `Rappel : rendez-vous demain à ${b.start}, ${site.address.fr}. Un empêchement ? Répondez à ce message`,
    en: `Reminder: appointment tomorrow at ${b.start}, ${site.address.en}. Can't make it? Reply to this message`,
  }[l];
}

export function wigReserved(r: { name: string; locale: string }) {
  const l = L(r.locale);
  return {
    he: `שלום ${r.name}, הפאה שמורה עבורך. מתי נוח לבוא? ${site.address.he}`,
    fr: `Bonjour ${r.name}, la perruque est réservée pour vous. Quand pouvez-vous passer ? ${site.address.fr}`,
    en: `Hello ${r.name}, the wig is reserved for you. When can you come by? ${site.address.en}`,
  }[l];
}

export function wigUnavailable(r: { name: string; locale: string }) {
  const l = L(r.locale);
  return {
    he: `שלום ${r.name}, הפאה הזו כבר לא זמינה. אשמח להראות לך דגמים דומים`,
    fr: `Bonjour ${r.name}, cette perruque n'est plus disponible. Je peux vous montrer des modèles proches`,
    en: `Hello ${r.name}, this wig is no longer available. I'd be happy to show you similar ones`,
  }[l];
}

export function giftReady(g: { name: string; locale: string }) {
  const l = L(g.locale);
  return {
    he: `שלום ${g.name}, כרטיס המתנה מוכן. מתי נוח לבוא לאסוף? ${site.address.he}`,
    fr: `Bonjour ${g.name}, la carte cadeau est prête. Quand voulez-vous passer la chercher ? ${site.address.fr}`,
    en: `Hello ${g.name}, the gift card is ready. When would you like to pick it up? ${site.address.en}`,
  }[l];
}
