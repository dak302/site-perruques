import type { Wig } from "@/lib/db";
import { WigArt } from "./WigArt";

export function WigMedia({ wig, alt, eager = false }: { wig: Pick<Wig, "id" | "photo" | "length_cm" | "texture" | "color">; alt: string; eager?: boolean }) {
  if (wig.photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={`/media/${wig.photo}`} alt={alt} width={800} height={1000} loading={eager ? "eager" : "lazy"} decoding="async" />;
  }
  return <WigArt id={wig.id} lengthCm={wig.length_cm} texture={wig.texture} color={wig.color} title={alt} />;
}
