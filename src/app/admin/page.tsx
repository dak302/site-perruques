import Link from "next/link";
import { ExternalLink, LogOut, MessageCircle } from "lucide-react";
import { serviceById, site, wigColors, wigTextures } from "@/lib/config";
import { requireAdmin } from "@/lib/auth";
import { all, getClosedDays, getHours, one, type Booking, type GiftRequest, type Wig, type WigRequest } from "@/lib/db";
import { t } from "@/lib/i18n";
import { bookingConfirmed, bookingRefused, bookingReminder, giftReady, wigReserved, wigUnavailable } from "@/lib/messages";
import { displayPhone, waLink } from "@/lib/phone";
import { addDays, nowInJerusalem } from "@/lib/slots";
import { WigMedia } from "@/components/WigMedia";
import { deleteWig, logout, saveHours, saveWig, setBookingStatus, setGiftStatus, setWigRequestStatus } from "./actions";

export const dynamic = "force-dynamic";

const fr = t("fr");
const tabs = [
  { id: "rdv", label: "Rendez-vous" },
  { id: "reservations", label: "Perruques réservées" },
  { id: "cadeaux", label: "Cartes cadeaux" },
  { id: "perruques", label: "Catalogue" },
  { id: "horaires", label: "Horaires" },
] as const;

const dayFr = (d: string) =>
  new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${d}T00:00:00Z`));
const langFr: Record<string, string> = { he: "hébreu", fr: "français", en: "anglais" };

export default async function Admin({ searchParams }: { searchParams: Promise<{ tab?: string; edit?: string }> }) {
  await requireAdmin();
  const { tab = "rdv", edit } = await searchParams;
  const count = (sql: string) => one<{ n: number }>(sql)?.n ?? 0;
  const pending = {
    rdv: count("SELECT COUNT(*) n FROM bookings WHERE status = 'pending'"),
    reservations: count("SELECT COUNT(*) n FROM wig_requests WHERE status = 'pending'"),
    cadeaux: count("SELECT COUNT(*) n FROM gift_requests WHERE status = 'pending'"),
  } as Record<string, number>;

  return (
    <>
      <header className="admin-top">
        <div className="wrap">
          <span className="brand">{site.brand.fr}</span>
          <span className="muted small">Admin</span>
          <Link href="/fr" className="link small" style={{ marginInlineStart: "auto", display: "inline-flex", gap: 6, alignItems: "center" }} target="_blank">
            Voir le site <ExternalLink size={14} strokeWidth={1.5} aria-hidden="true" />
          </Link>
          <form action={logout}>
            <button className="btn btn--ghost" style={{ minHeight: 40, padding: "0 12px" }} aria-label="Se déconnecter">
              <LogOut size={16} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </form>
        </div>
      </header>
      <div className="wrap" style={{ paddingBlock: "24px 80px" }}>
        <nav className="tabs" aria-label="Sections">
          {tabs.map((x) => (
            <Link key={x.id} href={`/admin?tab=${x.id}`} aria-current={tab === x.id ? "page" : undefined}>
              {x.label}
              {pending[x.id] ? <span className="badge" aria-label={`${pending[x.id]} à traiter`}>{pending[x.id]}</span> : null}
            </Link>
          ))}
        </nav>
        {tab === "rdv" && <Bookings />}
        {tab === "reservations" && <WigRequests />}
        {tab === "cadeaux" && <Gifts />}
        {tab === "perruques" && <Catalogue edit={edit} />}
        {tab === "horaires" && <Hours />}
      </div>
    </>
  );
}

function Wa({ phone, text, label }: { phone: string; text: string; label: string }) {
  return (
    <a className="btn btn--primary" href={waLink(phone, text)} target="_blank" rel="noopener">
      <MessageCircle size={18} strokeWidth={1.5} aria-hidden="true" />
      {label}
    </a>
  );
}

function StatusButton({ action, id, status, label, kind = "ghost" }: { action: (fd: FormData) => Promise<void>; id: number; status: string; label: string; kind?: "primary" | "ghost" | "danger" }) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button className={`btn btn--${kind}`}>{label}</button>
    </form>
  );
}

function Contact({ name, phone, locale }: { name: string; phone: string; locale: string }) {
  return (
    <span className="muted">
      {name} · <a href={`tel:+${phone}`} className="link num" dir="ltr">{displayPhone(phone)}</a> · en {langFr[locale] ?? locale}
    </span>
  );
}

// ---------- Rendez-vous ----------
function Bookings() {
  const today = nowInJerusalem().day;
  const tomorrow = addDays(today, 1);
  const pending = all<Booking>("SELECT * FROM bookings WHERE status = 'pending' AND day >= ? ORDER BY day, start", today);
  const upcoming = all<Booking>("SELECT * FROM bookings WHERE status = 'confirmed' AND day >= ? ORDER BY day, start", today);
  const recent = all<Booking>(
    "SELECT * FROM bookings WHERE status IN ('refused','cancelled') OR day < ? ORDER BY day DESC, start DESC LIMIT 20",
    today,
  );
  const Card = ({ b, children }: { b: Booking; children?: React.ReactNode }) => (
    <div className="a-card">
      <div className="a-card__head">
        <span className="a-card__title">{serviceById(b.service_id)?.name.fr ?? b.service_id}</span>
        <span className="num">{dayFr(b.day)} · {b.start}–{b.end}</span>
      </div>
      <Contact name={b.name} phone={b.phone} locale={b.locale} />
      {b.note && <p>« {b.note} »</p>}
      {children}
    </div>
  );
  return (
    <>
      <section className="a-section">
        <h2>À valider</h2>
        {pending.length ? pending.map((b) => (
          <Card key={b.id} b={b}>
            <div className="a-actions">
              <StatusButton action={setBookingStatus} id={b.id} status="confirmed" label="Valider" kind="primary" />
              <StatusButton action={setBookingStatus} id={b.id} status="refused" label="Refuser" kind="danger" />
            </div>
            <p className="field__hint">Après avoir validé ou refusé, un bouton prépare le message WhatsApp pour la cliente.</p>
          </Card>
        )) : <p className="a-empty">Aucune demande en attente.</p>}
      </section>
      <section className="a-section">
        <h2>À venir</h2>
        {upcoming.length ? upcoming.map((b) => (
          <Card key={b.id} b={b}>
            <div className="a-actions">
              <Wa phone={b.phone} text={bookingConfirmed(b)} label="Envoyer la confirmation" />
              {b.day === tomorrow && <Wa phone={b.phone} text={bookingReminder(b)} label="Envoyer le rappel" />}
              <StatusButton action={setBookingStatus} id={b.id} status="cancelled" label="Annuler" kind="danger" />
            </div>
          </Card>
        )) : <p className="a-empty">Aucun rendez-vous confirmé.</p>}
      </section>
      <section className="a-section">
        <h2>Refusés et passés</h2>
        {recent.length ? recent.map((b) => (
          <Card key={b.id} b={b}>
            <div className="a-actions">
              <span className={`pill ${b.status === "confirmed" ? "pill--ok" : ""}`}>
                {{ pending: "Jamais validé", confirmed: "Passé", refused: "Refusé", cancelled: "Annulé" }[b.status]}
              </span>
              {b.status === "refused" && b.day >= today && <Wa phone={b.phone} text={bookingRefused(b)} label="Prévenir la cliente" />}
            </div>
          </Card>
        )) : <p className="a-empty">Rien pour l'instant.</p>}
      </section>
    </>
  );
}

// ---------- Réservations de perruques ----------
function WigRequests() {
  const rows = all<WigRequest & { length_cm: number; texture: string; color: string; title: string; photo: string | null }>(
    `SELECT r.*, w.length_cm, w.texture, w.color, w.title, w.photo FROM wig_requests r JOIN wigs w ON w.id = r.wig_id
     ORDER BY r.status = 'pending' DESC, r.status = 'confirmed' DESC, r.id DESC LIMIT 60`,
  );
  if (!rows.length) return <p className="a-empty">Aucune demande de réservation pour l'instant.</p>;
  return (
    <section className="a-section">
      {rows.map((r) => (
        <div key={r.id} className="a-card">
          <div className="wig-row">
            <div className="wig-row__thumb"><WigMedia wig={{ id: r.wig_id, photo: r.photo, length_cm: r.length_cm, texture: r.texture, color: r.color }} alt="" /></div>
            <div style={{ display: "grid", gap: 8 }}>
              <div className="a-card__head">
                <span className="a-card__title">
                  {r.title || `Perruque n°${r.wig_id}`} · {r.length_cm} cm · {fr.wigs.textures[r.texture as "straight"]} · {fr.wigs.colors[r.color as "black"]}
                </span>
                <span className={`pill ${r.status === "pending" ? "pill--warn" : r.status === "confirmed" ? "pill--ok" : ""}`}>
                  {{ pending: "À valider", confirmed: "Réservée", refused: "Refusée", done: "Vendue" }[r.status]}
                </span>
              </div>
              <Contact name={r.name} phone={r.phone} locale={r.locale} />
              {r.when_text && <p>Disponibilités : « {r.when_text} »</p>}
              {r.note && <p>« {r.note} »</p>}
              <div className="a-actions">
                {r.status === "pending" && (
                  <>
                    <StatusButton action={setWigRequestStatus} id={r.id} status="confirmed" label="Réserver la perruque" kind="primary" />
                    <StatusButton action={setWigRequestStatus} id={r.id} status="refused" label="Refuser" kind="danger" />
                  </>
                )}
                {r.status === "confirmed" && (
                  <>
                    <Wa phone={r.phone} text={wigReserved(r)} label="Prévenir la cliente" />
                    <StatusButton action={setWigRequestStatus} id={r.id} status="done" label="Vendue" />
                  </>
                )}
                {r.status === "refused" && <Wa phone={r.phone} text={wigUnavailable(r)} label="Prévenir la cliente" />}
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

// ---------- Cartes cadeaux ----------
function Gifts() {
  const rows = all<GiftRequest>("SELECT * FROM gift_requests ORDER BY status = 'pending' DESC, status = 'ready' DESC, id DESC LIMIT 60");
  if (!rows.length) return <p className="a-empty">Aucune demande de carte cadeau pour l'instant.</p>;
  return (
    <section className="a-section">
      {rows.map((g) => (
        <div key={g.id} className="a-card">
          <div className="a-card__head">
            <span className="a-card__title">{g.amount} · pour {g.for_name}</span>
            <span className={`pill ${g.status === "pending" ? "pill--warn" : g.status === "ready" ? "pill--ok" : ""}`}>
              {{ pending: "À préparer", ready: "Prête", done: "Payée et remise", refused: "Refusée" }[g.status]}
            </span>
          </div>
          <Contact name={g.from_name} phone={g.phone} locale={g.locale} />
          {g.note && <p>« {g.note} »</p>}
          <div className="a-actions">
            {g.status === "pending" && (
              <>
                <StatusButton action={setGiftStatus} id={g.id} status="ready" label="Carte prête" kind="primary" />
                <StatusButton action={setGiftStatus} id={g.id} status="refused" label="Refuser" kind="danger" />
              </>
            )}
            {g.status === "ready" && (
              <>
                <Wa phone={g.phone} text={giftReady({ name: g.from_name, locale: g.locale })} label="Prévenir la cliente" />
                <StatusButton action={setGiftStatus} id={g.id} status="done" label="Payée et remise" />
              </>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

// ---------- Catalogue ----------
const statusFr: Record<Wig["status"], string> = { available: "En vente", reserved: "Réservée", sold: "Vendue", hidden: "Cachée" };

function WigForm({ wig }: { wig?: Wig }) {
  return (
    <form action={saveWig} className="form" style={{ maxWidth: "none" }}>
      {wig && <input type="hidden" name="id" value={wig.id} />}
      <div className="grid-2">
        <div className="field">
          <label htmlFor={`title-${wig?.id ?? "new"}`}>Nom du modèle <span className="opt">(facultatif)</span></label>
          <input id={`title-${wig?.id ?? "new"}`} name="title" defaultValue={wig?.title} maxLength={80} />
        </div>
        <div className="field">
          <label htmlFor={`len-${wig?.id ?? "new"}`}>Longueur (cm)</label>
          <input id={`len-${wig?.id ?? "new"}`} name="length_cm" type="number" min={5} max={149} required defaultValue={wig?.length_cm} inputMode="numeric" />
        </div>
        <div className="field">
          <label htmlFor={`tex-${wig?.id ?? "new"}`}>Texture</label>
          <select id={`tex-${wig?.id ?? "new"}`} name="texture" defaultValue={wig?.texture ?? "straight"}>
            {wigTextures.map((x) => <option key={x} value={x}>{fr.wigs.textures[x]}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor={`col-${wig?.id ?? "new"}`}>Couleur</label>
          <select id={`col-${wig?.id ?? "new"}`} name="color" defaultValue={wig?.color ?? "brown"}>
            {wigColors.map((x) => <option key={x} value={x}>{fr.wigs.colors[x]}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor={`price-${wig?.id ?? "new"}`}>Prix « à partir de » en ₪ <span className="opt">(facultatif)</span></label>
          <input id={`price-${wig?.id ?? "new"}`} name="price_from" type="number" min={0} defaultValue={wig?.price_from ?? ""} inputMode="numeric" />
        </div>
        <div className="field">
          <label htmlFor={`st-${wig?.id ?? "new"}`}>État</label>
          <select id={`st-${wig?.id ?? "new"}`} name="status" defaultValue={wig?.status ?? "available"}>
            {Object.entries(statusFr).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor={`photo-${wig?.id ?? "new"}`}>Photo {wig?.photo ? <span className="opt">(en choisir une autre pour la remplacer)</span> : null}</label>
        <input id={`photo-${wig?.id ?? "new"}`} name="photo" type="file" accept="image/jpeg,image/png,image/webp" />
        <span className="field__hint">Photo verticale de préférence. JPG, PNG ou WebP, 10 Mo maximum.</span>
        {wig?.photo && (
          <label className="check"><input type="checkbox" name="remove_photo" /> Retirer la photo</label>
        )}
      </div>
      <div className="field">
        <label htmlFor={`note-${wig?.id ?? "new"}`}>Remarque affichée sur la fiche <span className="opt">(facultatif)</span></label>
        <textarea id={`note-${wig?.id ?? "new"}`} name="note" defaultValue={wig?.note} maxLength={500} />
      </div>
      <div className="field" style={{ maxWidth: 200 }}>
        <label htmlFor={`sort-${wig?.id ?? "new"}`}>Ordre d'affichage</label>
        <input id={`sort-${wig?.id ?? "new"}`} name="sort" type="number" defaultValue={wig?.sort ?? 0} />
        <span className="field__hint">Plus petit = plus haut</span>
      </div>
      <div className="a-actions">
        <button className="btn btn--primary">{wig ? "Enregistrer" : "Ajouter la perruque"}</button>
        {wig && <Link href="/admin?tab=perruques" className="btn btn--ghost">Fermer</Link>}
      </div>
    </form>
  );
}

function Catalogue({ edit }: { edit?: string }) {
  const wigs = all<Wig>("SELECT * FROM wigs ORDER BY status = 'sold', sort, id DESC");
  return (
    <>
      <section className="a-section">
        <details className="a-card" open={!wigs.length}>
          <summary className="a-card__title">+ Ajouter une perruque</summary>
          <WigForm />
        </details>
      </section>
      <section className="a-section">
        <h2>Perruques ({wigs.length})</h2>
        {wigs.length ? (
          <div className="wig-rows">
            {wigs.map((w) => (
              <div key={w.id} className="a-card">
                <div className="wig-row">
                  <div className="wig-row__thumb"><WigMedia wig={w} alt="" /></div>
                  <div style={{ display: "grid", gap: 8 }}>
                    <div className="a-card__head">
                      <span className="a-card__title">
                        {w.title || `Perruque n°${w.id}`} · {w.length_cm} cm · {fr.wigs.textures[w.texture as "straight"]} · {fr.wigs.colors[w.color as "black"]}
                      </span>
                      <span className={`pill ${w.status === "available" ? "pill--ok" : ""}`}>{statusFr[w.status]}</span>
                    </div>
                    <span className="muted num">{w.price_from != null ? `À partir de ${w.price_from} ₪` : "Sans prix affiché"}{w.photo ? "" : " · pas encore de photo"}</span>
                    <div className="a-actions">
                      {String(w.id) !== edit && <Link href={`/admin?tab=perruques&edit=${w.id}`} className="btn btn--ghost">Modifier</Link>}
                      <Link href={`/fr/wigs/${w.id}`} className="btn btn--ghost" target="_blank">Voir sur le site</Link>
                      <details>
                        <summary className="btn btn--danger">Supprimer</summary>
                        <form action={deleteWig} style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                          <input type="hidden" name="id" value={w.id} />
                          <span className="small">Supprimer définitivement ?</span>
                          <button className="btn btn--danger">Oui, supprimer</button>
                        </form>
                      </details>
                    </div>
                  </div>
                </div>
                {String(w.id) === edit && <WigForm wig={w} />}
              </div>
            ))}
          </div>
        ) : <p className="a-empty">Le catalogue est vide.</p>}
      </section>
    </>
  );
}

// ---------- Horaires ----------
function Hours() {
  const hours = getHours();
  const closed = getClosedDays();
  const name = (i: number) => new Intl.DateTimeFormat("fr-FR", { weekday: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2023, 0, 1 + i)));
  return (
    <form action={saveHours} className="a-section" style={{ maxWidth: 640 }}>
      <h2>Horaires d'ouverture</h2>
      <p className="muted">Les clientes ne peuvent réserver que dans ces horaires, sur les 30 prochains jours.</p>
      <div className="hours-form">
        {hours.map((h, i) => (
          <div key={i} className="hours-row">
            <label className="check">
              <input type="checkbox" name={`open_${i}`} defaultChecked={!!h} />
              <span style={{ textTransform: "capitalize" }}>{name(i)}</span>
            </label>
            <div className="hours-row__times">
              <input type="time" name={`from_${i}`} defaultValue={h?.open ?? "09:00"} aria-label={`${name(i)}, ouverture`} step={1800} />
              <span aria-hidden="true">–</span>
              <input type="time" name={`to_${i}`} defaultValue={h?.close ?? "18:00"} aria-label={`${name(i)}, fermeture`} step={1800} />
            </div>
          </div>
        ))}
      </div>
      <h2 style={{ marginTop: 24 }}>Jours fermés exceptionnels</h2>
      <p className="muted">Vacances, fêtes : ces jours-là, personne ne peut réserver.</p>
      <div className="field" style={{ maxWidth: 240 }}>
        <label htmlFor="add_closed">Ajouter un jour</label>
        <input id="add_closed" name="add_closed" type="date" />
      </div>
      <div className="field">
        <label htmlFor="closed">Jours déjà fermés</label>
        <textarea id="closed" name="closed" defaultValue={closed.join("\n")} aria-describedby="closed-hint" dir="ltr" />
        <span id="closed-hint" className="field__hint">Une date par ligne (année-mois-jour). Effacez une ligne pour rouvrir ce jour.</span>
      </div>
      <div><button className="btn btn--primary">Enregistrer les horaires</button></div>
    </form>
  );
}
