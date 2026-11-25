// Normalise un numéro saisi par une cliente en format international sans « + ».
// 050-123-4567 → 972501234567 ; +33 6 12 34 56 78 → 33612345678.
export function normalizePhone(input: string): string | null {
  const raw = input.trim();
  let digits = raw.replace(/[^\d]/g, "");
  if (raw.startsWith("+")) {
    // déjà international
  } else if (digits.startsWith("00")) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0")) {
    digits = "972" + digits.slice(1); // numéro israélien local
  }
  if (digits.length < 10 || digits.length > 15) return null;
  if (digits.startsWith("972") && digits.length !== 12 && digits.length !== 11) return null;
  return digits;
}

export const displayPhone = (intl: string) => {
  if (intl.startsWith("972")) {
    const local = "0" + intl.slice(3);
    return local.length === 10 ? `${local.slice(0, 3)}-${local.slice(3, 6)}-${local.slice(6)}` : local;
  }
  return "+" + intl;
};

export const waLink = (intl: string, text?: string) =>
  `https://wa.me/${intl}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
