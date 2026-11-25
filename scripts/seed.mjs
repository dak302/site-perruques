// Ajoute quelques perruques d'exemple si le catalogue est vide, pour voir le site rempli.
// À supprimer depuis l'admin une fois les vraies perruques ajoutées.
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const dir = path.resolve(process.env.DATA_DIR || "./data");
fs.mkdirSync(path.join(dir, "uploads"), { recursive: true });
const db = new DatabaseSync(path.join(dir, "site.db"));
db.exec(`CREATE TABLE IF NOT EXISTS wigs (
  id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL DEFAULT '', length_cm INTEGER NOT NULL,
  texture TEXT NOT NULL, color TEXT NOT NULL, price_from INTEGER, photo TEXT,
  status TEXT NOT NULL DEFAULT 'available', note TEXT NOT NULL DEFAULT '', sort INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')))`);

const { n } = db.prepare("SELECT COUNT(*) AS n FROM wigs").get();
if (n > 0) {
  console.log(`Le catalogue contient déjà ${n} perruque(s), rien n'est ajouté.`);
} else {
  const rows = [
    [55, "wavy", "chestnut", 2400, "available"],
    [40, "straight", "dark-brown", 1900, "available"],
    [28, "straight", "black", 1600, "available"],
    [60, "curly", "honey", 2800, "available"],
    [45, "wavy", "blonde", 2200, "reserved"],
    [35, "coily", "black", 2000, "available"],
  ];
  const ins = db.prepare("INSERT INTO wigs (length_cm, texture, color, price_from, status, sort) VALUES (?, ?, ?, ?, ?, ?)");
  rows.forEach((r, i) => ins.run(r[0], r[1], r[2], r[3], r[4], i));
  console.log(`${rows.length} perruques d'exemple ajoutées.`);
}
