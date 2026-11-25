"use server";

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { wigColors, wigTextures } from "@/lib/config";
import { checkPassword, endSession, requireAdmin, startSession } from "@/lib/auth";
import { one, run, setSetting, uploadsDir, type WeekHours, type Wig } from "@/lib/db";

// Petit frein contre les essais de mot de passe à répétition.
const attempts = new Map<string, { n: number; until: number }>();

export async function login(_: string | null, fd: FormData): Promise<string | null> {
  const key = "admin";
  const a = attempts.get(key);
  if (a && a.until > Date.now()) return "Trop d'essais. Réessayez dans quelques minutes.";
  if (!checkPassword(String(fd.get("password") ?? ""))) {
    const n = (a?.n ?? 0) + 1;
    attempts.set(key, { n, until: n >= 5 ? Date.now() + 5 * 60_000 : 0 });
    return "Mot de passe incorrect.";
  }
  attempts.delete(key);
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

const done = (tab: string) => {
  revalidatePath("/admin");
  revalidatePath("/", "layout");
  redirect(`/admin?tab=${tab}`);
};

export async function setBookingStatus(fd: FormData) {
  await requireAdmin();
  const status = String(fd.get("status"));
  if (!["confirmed", "refused", "cancelled"].includes(status)) return;
  run("UPDATE bookings SET status = ? WHERE id = ?", status, Number(fd.get("id")));
  done("rdv");
}

export async function setWigRequestStatus(fd: FormData) {
  await requireAdmin();
  const status = String(fd.get("status"));
  if (!["confirmed", "refused", "done"].includes(status)) return;
  const id = Number(fd.get("id"));
  run("UPDATE wig_requests SET status = ? WHERE id = ?", status, id);
  const req = one<{ wig_id: number }>("SELECT wig_id FROM wig_requests WHERE id = ?", id);
  if (req && status === "confirmed") run("UPDATE wigs SET status = 'reserved' WHERE id = ?", req.wig_id);
  if (req && status === "done") run("UPDATE wigs SET status = 'sold' WHERE id = ?", req.wig_id);
  done("reservations");
}

export async function setGiftStatus(fd: FormData) {
  await requireAdmin();
  const status = String(fd.get("status"));
  if (!["ready", "done", "refused"].includes(status)) return;
  run("UPDATE gift_requests SET status = ? WHERE id = ?", status, Number(fd.get("id")));
  done("cadeaux");
}

// Vérifie le vrai format du fichier (et pas seulement son nom) avant de l'enregistrer.
function sniff(buf: Buffer): string | null {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return ".jpg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return ".png";
  if (buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP") return ".webp";
  return null;
}

export async function saveWig(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id")) || null;
  const length = Math.round(Number(fd.get("length_cm")));
  const texture = String(fd.get("texture"));
  const color = String(fd.get("color"));
  const priceRaw = String(fd.get("price_from") ?? "").trim();
  const price = priceRaw ? Math.round(Number(priceRaw)) : null;
  const status = String(fd.get("status"));
  if (!(length > 0 && length < 150) || !wigTextures.includes(texture as never) || !wigColors.includes(color as never)) return;
  if (price != null && !(price >= 0)) return;
  if (!["available", "reserved", "sold", "hidden"].includes(status)) return;

  let photo: string | null | undefined; // undefined = on garde la photo actuelle
  const file = fd.get("photo");
  if (file instanceof File && file.size > 0) {
    if (file.size > 10 * 1024 * 1024) return;
    const buf = Buffer.from(await file.arrayBuffer());
    const ext = sniff(buf);
    if (!ext) return;
    photo = crypto.randomBytes(12).toString("hex") + ext;
    fs.writeFileSync(path.join(uploadsDir, photo), buf);
  }
  if (fd.get("remove_photo") === "on") photo = null;

  const title = String(fd.get("title") ?? "").trim().slice(0, 80);
  const note = String(fd.get("note") ?? "").trim().slice(0, 500);
  const sort = Math.round(Number(fd.get("sort")) || 0);

  if (id) {
    const old = one<Wig>("SELECT * FROM wigs WHERE id = ?", id);
    if (!old) return;
    run(
      "UPDATE wigs SET title=?, length_cm=?, texture=?, color=?, price_from=?, status=?, note=?, sort=?, photo=? WHERE id=?",
      title, length, texture, color, price, status, note, sort, photo === undefined ? old.photo : photo, id,
    );
    if (photo !== undefined && old.photo) fs.rmSync(path.join(uploadsDir, old.photo), { force: true });
  } else {
    run(
      "INSERT INTO wigs (title, length_cm, texture, color, price_from, status, note, sort, photo) VALUES (?,?,?,?,?,?,?,?,?)",
      title, length, texture, color, price, status, note, sort, photo ?? null,
    );
  }
  done("perruques");
}

export async function deleteWig(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const old = one<Wig>("SELECT * FROM wigs WHERE id = ?", id);
  if (!old) return;
  run("DELETE FROM wigs WHERE id = ?", id);
  if (old.photo) fs.rmSync(path.join(uploadsDir, old.photo), { force: true });
  done("perruques");
}

const hhmm = /^([01]\d|2[0-3]):[0-5]\d$/;

export async function saveHours(fd: FormData) {
  await requireAdmin();
  const hours: WeekHours[] = Array.from({ length: 7 }, (_, i) => {
    if (fd.get(`open_${i}`) !== "on") return null;
    const open = String(fd.get(`from_${i}`));
    const close = String(fd.get(`to_${i}`));
    return hhmm.test(open) && hhmm.test(close) && open < close ? { open, close } : null;
  });
  setSetting("hours", hours);
  const closed = `${fd.get("closed") ?? ""} ${fd.get("add_closed") ?? ""}`
    .split(/[\s,]+/)
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));
  setSetting("closedDays", [...new Set(closed)].sort());
  done("horaires");
}
