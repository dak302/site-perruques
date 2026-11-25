// Préfixe les fichiers de /public avec l'adresse du site (nécessaire sur GitHub Pages).
export const asset = (p: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${p}`;
