// Tout ce qui est propre à la coiffeuse : nom, adresse, téléphone, prestations.
// Les lignes marquées À COMPLÉTER attendent les vraies informations.

export type Locale = "he" | "fr" | "en";
export type Localized = Record<Locale, string>;

export const site = {
  // À COMPLÉTER : nom de la marque (provisoire, tiré de l'adresse).
  brand: { he: "יפו 153", fr: "Yaffo 153", en: "Yaffo 153" } as Localized,
  // À COMPLÉTER : prénom de la coiffeuse.
  ownerName: { he: "", fr: "", en: "" } as Localized,
  address: {
    he: "רחוב יפו 153, ירושלים",
    fr: "153, rue Jaffa, Jérusalem",
    en: "153 Jaffa Street, Jerusalem",
  } as Localized,
  mapsQuery: "Yafo St 153, Jerusalem",
  // À COMPLÉTER : numéro WhatsApp de la coiffeuse, format international sans + (ex. 972501234567).
  // Tant qu'il est vide, le bouton WhatsApp n'est pas affiché.
  whatsapp: "",
  // À COMPLÉTER : lien Instagram, vide pour le cacher.
  instagram: "",
  timeZone: "Asia/Jerusalem",
};

export type Service = {
  id: string;
  name: Localized;
  description: Localized;
  minutes: number;
  // À COMPLÉTER : prix « à partir de » en shekels, null pour « prix sur place ».
  priceFrom: number | null;
  group: "wigs" | "hair";
};

export const services: Service[] = [
  {
    id: "wig-care",
    group: "wigs",
    minutes: 90,
    priceFrom: 150,
    name: { he: "חפיפה וסירוק פאה", fr: "Lavage et coiffage de perruque", en: "Wig wash and styling" },
    description: {
      he: "חפיפה עדינה, ייבוש וסירוק מחדש, כדי שהפאה תיראה כמו ביום הראשון",
      fr: "Lavage doux, séchage et recoiffage, pour retrouver la perruque comme au premier jour",
      en: "Gentle wash, drying and restyling, so the wig looks like the first day",
    },
  },
  {
    id: "wig-fitting",
    group: "wigs",
    minutes: 45,
    priceFrom: null,
    name: { he: "מדידה והתאמת פאה", fr: "Essayage et pose de perruque", en: "Wig fitting" },
    description: {
      he: "מודדים כמה פאות, ומתאימים את זו שבוחרים לראש ולפנים",
      fr: "On essaie plusieurs perruques et on ajuste celle choisie à la tête et au visage",
      en: "Try on a few wigs and have the one you choose fitted to your head and face",
    },
  },
  {
    id: "cut",
    group: "hair",
    minutes: 60,
    priceFrom: 120,
    name: { he: "תספורת ופן", fr: "Coupe et brushing", en: "Cut and blow-dry" },
    description: {
      he: "תספורת לפי מבנה השיער ופן לסיום",
      fr: "Une coupe adaptée à vos cheveux, avec un brushing pour finir",
      en: "A cut suited to your hair, finished with a blow-dry",
    },
  },
  {
    id: "colour",
    group: "hair",
    minutes: 120,
    priceFrom: 250,
    name: { he: "צבע", fr: "Couleur", en: "Colour" },
    description: {
      he: "צבע מלא או חידוש שורשים, עם פן",
      fr: "Couleur complète ou racines, avec brushing",
      en: "Full colour or roots, with a blow-dry",
    },
  },
];

export const serviceById = (id: string) => services.find((s) => s.id === id);

// Options des fiches perruque. Les libellés sont dans les dictionnaires (i18n.ts).
export const wigTextures = ["straight", "wavy", "curly", "coily"] as const;
export const wigColors = ["black", "dark-brown", "brown", "chestnut", "honey", "blonde", "red", "grey"] as const;
export type WigTexture = (typeof wigTextures)[number];
export type WigColor = (typeof wigColors)[number];

// Teinte utilisée pour l'illustration quand une perruque n'a pas encore de photo.
export const wigColorHex: Record<WigColor, string> = {
  black: "#231d19",
  "dark-brown": "#3b2a20",
  brown: "#5a3b26",
  chestnut: "#7a4a2a",
  honey: "#a8743f",
  blonde: "#c9a36a",
  red: "#8c3f24",
  grey: "#8d867d",
};

export const lengthBucket = (cm: number) => (cm < 30 ? "short" : cm <= 45 ? "medium" : "long");
