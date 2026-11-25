export const waLink = (intl: string, text?: string) =>
  `https://wa.me/${intl}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
