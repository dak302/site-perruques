import type { Locale, WigColor, WigTexture } from "./config";

export const locales: Locale[] = ["he", "fr", "en"];
export const defaultLocale: Locale = "he";
export const isLocale = (v: string): v is Locale => (locales as string[]).includes(v);
export const dirOf = (l: Locale) => (l === "he" ? "rtl" : "ltr");
export const localeTag: Record<Locale, string> = { he: "he-IL", fr: "fr-FR", en: "en-GB" };
export const languageName: Record<Locale, string> = { he: "עברית", fr: "Français", en: "English" };

type Dict = {
  nav: { wigs: string; services: string; about: string; visit: string; book: string; menu: string; close: string; skip: string };
  hero: { title: string; subtitle: string; primary: string; secondary: string };
  wigsPreview: { title: string; lead: string; all: string };
  services: { title: string; wigsGroup: string; hairGroup: string; from: string; onSite: string; minutes: string; book: string };
  steps: { title: string; items: { title: string; text: string }[] };
  about: { title: string; text: string[] };
  bookBand: { title: string; text: string; cta: string };
  visit: { title: string; hours: string; closed: string; whatsapp: string; map: string; directions: string };
  gift: { title: string; text: string; cta: string };
  footer: { rights: string };
  wigs: {
    title: string; lead: string; length: string; texture: string; color: string; all: string;
    lengths: Record<"short" | "medium" | "long", string>;
    textures: Record<WigTexture, string>; colors: Record<WigColor, string>;
    cm: string; from: string; reserve: string; payOnSite: string; reserved: string; reservedNote: string;
    noResults: string; clear: string; count: (n: number) => string; back: string; empty: string; details: string;
  };
  reserveWig: { title: string; lead: string; when: string; whenHint: string; submit: string; done: string };
  book: {
    title: string; lead: string; step1: string; step2: string; step3: string; day: string; time: string;
    noSlots: string; pickService: string; pickTime: string; selected: string; change: string;
    submit: string; done: string; doneNote: string; again: string; taken: string;
  };
  form: {
    name: string; phone: string; phoneHint: string; message: string; optional: string; sending: string;
    errName: string; errPhone: string; errGeneric: string;
  };
  giftPage: { title: string; lead: string; forWhom: string; fromWhom: string; amount: string; amountHint: string; submit: string; done: string };
  days: { today: string; tomorrow: string };
};

const he: Dict = {
  nav: { wigs: "פאות", services: "שירותים", about: "קצת עליי", visit: "איך מגיעים", book: "קביעת תור", menu: "תפריט", close: "סגירה", skip: "דילוג לתוכן" },
  hero: {
    title: "פאות ותסרוקות, ברחוב יפו 153",
    subtitle: "פאות מוכנות, חפיפה וסירוק פאות, ותספורת – בסטודיו הביתי שלי בירושלים",
    primary: "קביעת תור",
    secondary: "לראות את הפאות",
  },
  wigsPreview: { title: "הפאות שזמינות עכשיו", lead: "כל פאה מחכה לכם כאן. משריינים באתר, באים למדוד ומשלמים אצלי.", all: "לכל הפאות" },
  services: { title: "שירותים", wigsGroup: "פאות", hairGroup: "שיער", from: "החל מ־", onSite: "המחיר נקבע במקום", minutes: "דק׳", book: "קביעת תור" },
  steps: {
    title: "איך זה עובד",
    items: [
      { title: "בוחרים", text: "פאה מהקטלוג או שירות, ושעה שמתאימה" },
      { title: "מקבלים אישור", text: "אני מאשרת את התור בוואטסאפ" },
      { title: "באים אליי", text: "מודדים, מסדרים ומשלמים במקום. אין תשלום באתר" },
    ],
  },
  about: {
    title: "קצת עליי",
    text: [
      "אני מקבלת בבית, ברחוב יפו 153, בסטודיו שקט ופרטי.",
      "אני מוכרת פאות מוכנות, חופפת ומסרקת פאות, ומספרת וצובעת.",
    ],
  },
  bookBand: { title: "קביעת תור", text: "בוחרים שירות ושעה. אני מאשרת בוואטסאפ.", cta: "לבחירת שעה" },
  visit: { title: "איך מגיעים", hours: "שעות פתיחה", closed: "סגור", whatsapp: "כתבו לי בוואטסאפ", map: "מפה: רחוב יפו 153, ירושלים", directions: "ניווט" },
  gift: { title: "כרטיס מתנה", text: "מזמינים באתר, משלמים אצלי, ואני מכינה את הכרטיס ליום שקובעים.", cta: "בקשת כרטיס מתנה" },
  footer: { rights: "כל הזכויות שמורות" },
  wigs: {
    title: "פאות", lead: "פאות מוכנות שזמינות עכשיו. משריינים כאן ומשלמים אצלי כשבאים לקחת.",
    length: "אורך", texture: "מרקם", color: "צבע", all: "הכול",
    lengths: { short: "קצרה", medium: "בינונית", long: "ארוכה" },
    textures: { straight: "חלקה", wavy: "גלית", curly: "מתולתלת", coily: "מקורזלת" },
    colors: { black: "שחור", "dark-brown": "חום כהה", brown: "חום", chestnut: "ערמוני", honey: "דבש", blonde: "בלונד", red: "אדמוני", grey: "אפור" },
    cm: "ס״מ", from: "החל מ־", reserve: "לשריין את הפאה", payOnSite: "משלמים אצלי, כשבאים לקחת",
    reserved: "שמורה", reservedNote: "הפאה הזו כבר שמורה. אפשר לכתוב לי ואמצא דגם דומה.",
    noResults: "אין פאה שמתאימה לסינון הזה. אפשר להסיר סינון ולראות עוד.", clear: "ניקוי הסינון",
    count: (n) => (n === 1 ? "פאה אחת" : `${n} פאות`), back: "חזרה לפאות",
    empty: "הקטלוג מתעדכן. בינתיים אפשר לקבוע תור למדידה.", details: "פרטים",
  },
  reserveWig: {
    title: "שריון הפאה", lead: "שולחים בקשה, ואני חוזרת אליכם בוואטסאפ כדי לקבוע מתי לבוא.",
    when: "מתי נוח לבוא", whenHint: "לדוגמה: יום שלישי אחר הצהריים", submit: "שליחת הבקשה",
    done: "הבקשה נשלחה. אחזור אליכם בוואטסאפ כדי לקבוע מתי לבוא.",
  },
  book: {
    title: "קביעת תור", lead: "בוחרים שירות ושעה. התור נקבע אחרי שאני מאשרת אותו בוואטסאפ.",
    step1: "שירות", step2: "יום ושעה", step3: "הפרטים שלכם", day: "יום", time: "שעה",
    noSlots: "אין שעות פנויות ביום הזה. אפשר לבחור יום אחר.", pickService: "בחרו שירות", pickTime: "בחרו שעה",
    selected: "נבחר", change: "שינוי", submit: "שליחת הבקשה",
    done: "הבקשה נשלחה", doneNote: "אאשר את התור בוואטסאפ.", again: "בקשה נוספת",
    taken: "השעה הזו נתפסה הרגע. אפשר לבחור שעה אחרת.",
  },
  form: {
    name: "שם", phone: "טלפון", phoneHint: "לדוגמה: 050-1234567", message: "הערה", optional: "לא חובה", sending: "שולחים…",
    errName: "צריך לכתוב שם.", errPhone: "המספר לא נראה מלא. לדוגמה: 050-1234567", errGeneric: "משהו השתבש. אפשר לנסות שוב.",
  },
  giftPage: {
    title: "כרטיס מתנה", lead: "ממלאים את הבקשה, משלמים אצלי, ואני מכינה את הכרטיס ליום שקובעים.",
    forWhom: "למי המתנה", fromWhom: "ממי", amount: "סכום או שירות", amountHint: "לדוגמה: 300 ₪, או חפיפה וסירוק פאה",
    submit: "שליחת הבקשה", done: "הבקשה נשלחה. אחזור אליכם בוואטסאפ כדי לקבוע מתי לאסוף את הכרטיס.",
  },
  days: { today: "היום", tomorrow: "מחר" },
};

const fr: Dict = {
  nav: { wigs: "Perruques", services: "Prestations", about: "À propos", visit: "Venir", book: "Prendre rendez-vous", menu: "Menu", close: "Fermer", skip: "Aller au contenu" },
  hero: {
    title: "Perruques et coiffure, rue Jaffa à Jérusalem",
    subtitle: "Perruques prêtes à porter, entretien et coiffure, dans mon atelier à la maison",
    primary: "Prendre rendez-vous",
    secondary: "Voir les perruques",
  },
  wigsPreview: { title: "Les perruques disponibles", lead: "Vous réservez ici, vous venez l'essayer et vous payez sur place.", all: "Toutes les perruques" },
  services: { title: "Prestations", wigsGroup: "Perruques", hairGroup: "Cheveux", from: "À partir de ", onSite: "Prix sur place", minutes: "min", book: "Prendre rendez-vous" },
  steps: {
    title: "Comment ça se passe",
    items: [
      { title: "Vous choisissez", text: "Une perruque du catalogue ou une prestation, et l'heure qui vous va" },
      { title: "Je confirme", text: "Je valide votre rendez-vous par WhatsApp" },
      { title: "Vous venez", text: "On essaie, on ajuste et vous payez sur place. Aucun paiement en ligne" },
    ],
  },
  about: {
    title: "À propos",
    text: [
      "Je vous reçois chez moi, au 153 rue Jaffa, dans un atelier calme et privé.",
      "Je vends des perruques prêtes à porter, je lave et recoiffe les perruques, et je coupe et colore les cheveux.",
    ],
  },
  bookBand: { title: "Prendre rendez-vous", text: "Choisissez une prestation et un horaire. Je vous confirme par WhatsApp.", cta: "Choisir un horaire" },
  visit: { title: "Venir", hours: "Horaires", closed: "Fermé", whatsapp: "M'écrire sur WhatsApp", map: "Carte : 153 rue Jaffa, Jérusalem", directions: "Itinéraire" },
  gift: { title: "Carte cadeau", text: "Vous la demandez ici, vous la payez sur place, et je la prépare pour le jour convenu.", cta: "Demander une carte cadeau" },
  footer: { rights: "Tous droits réservés" },
  wigs: {
    title: "Perruques", lead: "Des perruques prêtes à porter, disponibles maintenant. Vous réservez ici et vous payez sur place en venant la chercher.",
    length: "Longueur", texture: "Texture", color: "Couleur", all: "Toutes",
    lengths: { short: "Courte", medium: "Mi-longue", long: "Longue" },
    textures: { straight: "Lisse", wavy: "Ondulée", curly: "Bouclée", coily: "Frisée" },
    colors: { black: "Noir", "dark-brown": "Brun foncé", brown: "Brun", chestnut: "Châtain", honey: "Miel", blonde: "Blond", red: "Roux", grey: "Gris" },
    cm: "cm", from: "À partir de ", reserve: "Réserver cette perruque", payOnSite: "Vous payez sur place, quand vous venez la chercher",
    reserved: "Réservée", reservedNote: "Celle-ci est déjà réservée. Écrivez-moi pour un modèle proche.",
    noResults: "Aucune perruque ne correspond à ces filtres. Retirez-en un pour en voir plus.", clear: "Effacer les filtres",
    count: (n) => (n === 1 ? "1 perruque" : `${n} perruques`), back: "Retour aux perruques",
    empty: "Le catalogue est en cours de mise à jour. En attendant, vous pouvez prendre rendez-vous pour un essayage.", details: "Détails",
  },
  reserveWig: {
    title: "Réserver la perruque", lead: "Envoyez la demande, je vous réponds sur WhatsApp pour fixer le moment où vous passez.",
    when: "Quand pouvez-vous passer", whenHint: "Par exemple : mardi après-midi", submit: "Envoyer la demande",
    done: "Demande envoyée. Je vous réponds sur WhatsApp pour fixer le moment où vous passez.",
  },
  book: {
    title: "Prendre rendez-vous", lead: "Choisissez une prestation et un horaire. Le rendez-vous est confirmé quand je le valide par WhatsApp.",
    step1: "Prestation", step2: "Jour et heure", step3: "Vos coordonnées", day: "Jour", time: "Heure",
    noSlots: "Plus de créneau libre ce jour-là. Choisissez un autre jour.", pickService: "Choisissez une prestation", pickTime: "Choisissez une heure",
    selected: "Choisi", change: "Modifier", submit: "Envoyer la demande",
    done: "Demande envoyée", doneNote: "Je vous confirme le rendez-vous par WhatsApp.", again: "Nouvelle demande",
    taken: "Ce créneau vient d'être pris. Choisissez une autre heure.",
  },
  form: {
    name: "Nom", phone: "Téléphone", phoneHint: "Exemple : 050-123-4567", message: "Remarque", optional: "facultatif", sending: "Envoi…",
    errName: "Indiquez votre nom.", errPhone: "Ce numéro semble incomplet. Exemple : 050-123-4567", errGeneric: "Un problème est survenu. Réessayez.",
  },
  giftPage: {
    title: "Carte cadeau", lead: "Remplissez la demande, vous payez sur place et je prépare la carte pour le jour convenu.",
    forWhom: "Pour qui", fromWhom: "De la part de", amount: "Montant ou prestation", amountHint: "Par exemple : 300 ₪, ou un lavage et coiffage de perruque",
    submit: "Envoyer la demande", done: "Demande envoyée. Je vous réponds sur WhatsApp pour fixer quand récupérer la carte.",
  },
  days: { today: "Aujourd'hui", tomorrow: "Demain" },
};

const en: Dict = {
  nav: { wigs: "Wigs", services: "Services", about: "About", visit: "Visit", book: "Book an appointment", menu: "Menu", close: "Close", skip: "Skip to content" },
  hero: {
    title: "Wigs and hair, on Jaffa Street in Jerusalem",
    subtitle: "Ready-to-wear wigs, wig care and haircuts, in my home studio",
    primary: "Book an appointment",
    secondary: "See the wigs",
  },
  wigsPreview: { title: "Wigs available now", lead: "Reserve here, come and try it on, and pay in person.", all: "All wigs" },
  services: { title: "Services", wigsGroup: "Wigs", hairGroup: "Hair", from: "From ", onSite: "Priced in person", minutes: "min", book: "Book" },
  steps: {
    title: "How it works",
    items: [
      { title: "You choose", text: "A wig from the catalogue or a service, and a time that suits you" },
      { title: "I confirm", text: "I confirm your appointment on WhatsApp" },
      { title: "You come over", text: "We try, adjust, and you pay in person. No online payment" },
    ],
  },
  about: {
    title: "About",
    text: [
      "I welcome you at my home, 153 Jaffa Street, in a calm and private studio.",
      "I sell ready-to-wear wigs, wash and restyle wigs, and cut and colour hair.",
    ],
  },
  bookBand: { title: "Book an appointment", text: "Choose a service and a time. I confirm on WhatsApp.", cta: "Choose a time" },
  visit: { title: "Visit", hours: "Opening hours", closed: "Closed", whatsapp: "Message me on WhatsApp", map: "Map: 153 Jaffa Street, Jerusalem", directions: "Directions" },
  gift: { title: "Gift card", text: "Request it here, pay in person, and I prepare it for the day we agree on.", cta: "Request a gift card" },
  footer: { rights: "All rights reserved" },
  wigs: {
    title: "Wigs", lead: "Ready-to-wear wigs, available now. Reserve here and pay in person when you pick it up.",
    length: "Length", texture: "Texture", color: "Colour", all: "All",
    lengths: { short: "Short", medium: "Medium", long: "Long" },
    textures: { straight: "Straight", wavy: "Wavy", curly: "Curly", coily: "Coily" },
    colors: { black: "Black", "dark-brown": "Dark brown", brown: "Brown", chestnut: "Chestnut", honey: "Honey", blonde: "Blonde", red: "Red", grey: "Grey" },
    cm: "cm", from: "From ", reserve: "Reserve this wig", payOnSite: "You pay in person when you pick it up",
    reserved: "Reserved", reservedNote: "This one is already reserved. Message me for a similar one.",
    noResults: "No wig matches these filters. Remove one to see more.", clear: "Clear filters",
    count: (n) => (n === 1 ? "1 wig" : `${n} wigs`), back: "Back to wigs",
    empty: "The catalogue is being updated. Meanwhile, you can book a fitting.", details: "Details",
  },
  reserveWig: {
    title: "Reserve this wig", lead: "Send the request and I'll reply on WhatsApp to set a time for you to come by.",
    when: "When can you come", whenHint: "For example: Tuesday afternoon", submit: "Send request",
    done: "Request sent. I'll reply on WhatsApp to set a time for you to come by.",
  },
  book: {
    title: "Book an appointment", lead: "Choose a service and a time. Your appointment is set once I confirm it on WhatsApp.",
    step1: "Service", step2: "Day and time", step3: "Your details", day: "Day", time: "Time",
    noSlots: "No free time left that day. Choose another day.", pickService: "Choose a service", pickTime: "Choose a time",
    selected: "Selected", change: "Change", submit: "Send request",
    done: "Request sent", doneNote: "I'll confirm your appointment on WhatsApp.", again: "New request",
    taken: "This time was just taken. Choose another time.",
  },
  form: {
    name: "Name", phone: "Phone", phoneHint: "Example: 050-123-4567", message: "Note", optional: "optional", sending: "Sending…",
    errName: "Enter your name.", errPhone: "This number looks incomplete. Example: 050-123-4567", errGeneric: "Something went wrong. Try again.",
  },
  giftPage: {
    title: "Gift card", lead: "Fill in the request, pay in person, and I'll prepare the card for the day we agree on.",
    forWhom: "For", fromWhom: "From", amount: "Amount or service", amountHint: "For example: ₪300, or a wig wash and styling",
    submit: "Send request", done: "Request sent. I'll reply on WhatsApp to set when to pick up the card.",
  },
  days: { today: "Today", tomorrow: "Tomorrow" },
};

const dicts: Record<Locale, Dict> = { he, fr, en };
export const t = (l: Locale) => dicts[l];
export type { Dict };

export const formatPrice = (l: Locale, n: number) =>
  new Intl.NumberFormat(localeTag[l], { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n);
