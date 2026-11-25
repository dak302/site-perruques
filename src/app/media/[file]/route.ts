import fs from "node:fs";
import path from "node:path";
import { uploadsDir } from "@/lib/db";

const types: Record<string, string> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };

// Sert les photos envoyées depuis l'admin (elles vivent dans DATA_DIR, pas dans le code).
export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!/^[\w-]+\.(jpe?g|png|webp)$/i.test(file)) return new Response("Not found", { status: 404 });
  const p = path.join(uploadsDir, file);
  if (!fs.existsSync(p)) return new Response("Not found", { status: 404 });
  return new Response(fs.readFileSync(p), {
    headers: { "Content-Type": types[path.extname(file).toLowerCase()], "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
