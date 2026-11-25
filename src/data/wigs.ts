// Le catalogue des perruques. Pour en ajouter une : copier un bloc, changer les valeurs,
// et mettre sa photo dans public/wigs/ (puis écrire son nom dans « photo »).
//
// length_cm : longueur en centimètres
// texture   : "straight" (lisse), "wavy" (ondulée), "curly" (bouclée), "coily" (frisée)
// color     : "black", "dark-brown", "brown", "chestnut", "honey", "blonde", "red", "grey"
// price_from: prix « à partir de » en shekels, ou null pour ne pas l'afficher
// status    : "available" (en vente), "reserved" (réservée), "hidden" (cachée du site)
// photo     : nom du fichier dans public/wigs/, ou null pour l'illustration

export type Wig = {
  id: number;
  title: string;
  length_cm: number;
  texture: string;
  color: string;
  price_from: number | null;
  photo: string | null;
  status: "available" | "reserved" | "hidden";
  note: string;
};

// EXEMPLES : à remplacer par les vraies perruques de Flora Wigs.
export const wigs: Wig[] = [
  { id: 1, title: "", length_cm: 55, texture: "wavy", color: "chestnut", price_from: 2400, photo: null, status: "available", note: "" },
  { id: 2, title: "", length_cm: 40, texture: "straight", color: "dark-brown", price_from: 1900, photo: null, status: "available", note: "" },
  { id: 3, title: "", length_cm: 28, texture: "straight", color: "black", price_from: 1600, photo: null, status: "available", note: "" },
  { id: 4, title: "", length_cm: 60, texture: "curly", color: "honey", price_from: 2800, photo: null, status: "available", note: "" },
  { id: 5, title: "", length_cm: 35, texture: "coily", color: "black", price_from: 2000, photo: null, status: "available", note: "" },
  { id: 6, title: "", length_cm: 45, texture: "wavy", color: "blonde", price_from: 2200, photo: null, status: "reserved", note: "" },
];

export const visibleWigs = () => wigs.filter((w) => w.status !== "hidden");
export const wigById = (id: number) => visibleWigs().find((w) => w.id === id);
