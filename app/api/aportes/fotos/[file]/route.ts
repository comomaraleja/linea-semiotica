import { promises as fs } from "node:fs";
import path from "node:path";
import { PHOTO_DIR } from "@/lib/aportes-files";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

/** Sirve las fotos de content/aportes/fotos (fuera de public/, así funcionan también con `npm start`). */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const m = file.match(/^([a-z0-9][a-z0-9-]{0,60})\.(jpg|png|webp)$/);
  if (!m) return new Response("No encontrado", { status: 404 });
  try {
    const data = await fs.readFile(path.join(PHOTO_DIR, file));
    return new Response(new Uint8Array(data), {
      headers: { "Content-Type": TYPES[m[2]], "Cache-Control": "private, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("No encontrado", { status: 404 });
  }
}
