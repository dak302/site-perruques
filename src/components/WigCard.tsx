import Link from "next/link";
import type { Locale } from "@/lib/config";
import type { Wig } from "@/data/wigs";
import { formatPrice, type Dict } from "@/lib/i18n";
import { WigMedia } from "./WigMedia";
import { WigTag, wigAlt } from "./WigTag";

export function WigCard({ wig, d, locale }: { wig: Wig; d: Dict; locale: Locale }) {
  const reserved = wig.status === "reserved";
  const alt = wigAlt(d, wig);
  return (
    <Link href={`/${locale}/wigs/${wig.id}`} className={`wig-card${reserved ? " wig-card--reserved" : ""}`}>
      <div className="wig-card__media">
        <WigMedia wig={wig} alt={alt} />
        {reserved && <span className="wig-card__status">{d.wigs.reserved}</span>}
      </div>
      <div className="wig-card__body">
        {wig.title && <span className="wig-card__title">{wig.title}</span>}
        <WigTag d={d} lengthCm={wig.length_cm} texture={wig.texture} color={wig.color} />
        {wig.price_from != null && (
          <span className="wig-card__price num">
            {d.wigs.from}
            {formatPrice(locale, wig.price_from)}
          </span>
        )}
      </div>
    </Link>
  );
}
