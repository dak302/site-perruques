import "server-only";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

export const dataDir = path.resolve(process.env.DATA_DIR || "./data");
export const uploadsDir = path.join(dataDir, "uploads");

export type WeekHours = { open: string; close: string } | null;

export type Wig = {
  id: number;
  title: string;
  length_cm: number;
  texture: string;
  color: string;
  price_from: number | null;
  photo: string | null;
  status: "available" | "reserved" | "sold" | "hidden";
  note: string;
  sort: number;
  created_at: string;
};

export type Booking = {
  id: number;
  service_id: string;
  day: string; // AAAA-MM-JJ, heure de Jérusalem
  start: string; // HH:MM
  end: string; // HH:MM
  name: string;
  phone: string;
  note: string;
  locale: string;
  status: "pending" | "confirmed" | "refused" | "cancelled";
  created_at: string;
};

export type WigRequest = {
  id: number;
  wig_id: number;
  name: string;
  phone: string;
  when_text: string;
  note: string;
  locale: string;
  status: "pending" | "confirmed" | "refused" | "done";
  created_at: string;
};

export type GiftRequest = {
  id: number;
  for_name: string;
  from_name: string;
  amount: string;
  phone: string;
  note: string;
  locale: string;
  status: "pending" | "ready" | "done" | "refused";
  created_at: string;
};

const g = globalThis as unknown as { __db?: DatabaseSync };

function open() {
  fs.mkdirSync(uploadsDir, { recursive: true });
  const db = new DatabaseSync(path.join(dataDir, "site.db"));
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS wigs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL DEFAULT '',
      length_cm INTEGER NOT NULL,
      texture TEXT NOT NULL,
      color TEXT NOT NULL,
      price_from INTEGER,
      photo TEXT,
      status TEXT NOT NULL DEFAULT 'available',
      note TEXT NOT NULL DEFAULT '',
      sort INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_id TEXT NOT NULL,
      day TEXT NOT NULL,
      start TEXT NOT NULL,
      end TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      locale TEXT NOT NULL DEFAULT 'he',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS bookings_day ON bookings(day);
    CREATE TABLE IF NOT EXISTS wig_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wig_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      when_text TEXT NOT NULL DEFAULT '',
      note TEXT NOT NULL DEFAULT '',
      locale TEXT NOT NULL DEFAULT 'he',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS gift_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      for_name TEXT NOT NULL,
      from_name TEXT NOT NULL,
      amount TEXT NOT NULL,
      phone TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      locale TEXT NOT NULL DEFAULT 'he',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
  return db;
}

export function db() {
  if (!g.__db) g.__db = open();
  return g.__db;
}

// Les lignes SQLite arrivent comme objets sans prototype : on les recopie en objets simples
// pour pouvoir les passer aux composants client.
const plain = <T>(row: unknown) => ({ ...(row as object) }) as T;
export const all = <T>(sql: string, ...params: (string | number | null)[]) =>
  db().prepare(sql).all(...params).map((r) => plain<T>(r));
export const one = <T>(sql: string, ...params: (string | number | null)[]) => {
  const r = db().prepare(sql).get(...params);
  return r ? plain<T>(r) : undefined;
};
export const run = (sql: string, ...params: (string | number | null)[]) => db().prepare(sql).run(...params);

// ---------- Réglages (horaires, jours fermés) ----------

// Index 0 = dimanche, comme Date.getDay(). Par défaut : dimanche–jeudi 9h–18h, vendredi 9h–13h, samedi fermé.
export const defaultHours: WeekHours[] = [
  { open: "09:00", close: "18:00" },
  { open: "09:00", close: "18:00" },
  { open: "09:00", close: "18:00" },
  { open: "09:00", close: "18:00" },
  { open: "09:00", close: "18:00" },
  { open: "09:00", close: "13:00" },
  null,
];

export function getSetting<T>(key: string, fallback: T): T {
  const row = one<{ value: string }>("SELECT value FROM settings WHERE key = ?", key);
  if (!row) return fallback;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    return fallback;
  }
}

export function setSetting(key: string, value: unknown) {
  run(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    key,
    JSON.stringify(value),
  );
}

export const getHours = () => getSetting<WeekHours[]>("hours", defaultHours);
export const getClosedDays = () => getSetting<string[]>("closedDays", []);
