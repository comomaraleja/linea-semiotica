import type { NextRequest } from "next/server";
import { categories, type TimelineItem } from "@/data/timeline";
import { isItem } from "@/lib/custom";
import { isSafeId } from "@/lib/aportes-files";

/**
 * Solo se puede escribir cuando la app corre en la propia computadora (localhost).
 * Así, si alguien publica la app en un servidor, nadie puede crear archivos ahí.
 * Para permitirlo igual: APORTES_ESCRITURA=abierta en el entorno.
 */
export function canWrite(req: NextRequest) {
  if (process.env.APORTES_ESCRITURA === "abierta") return true;
  const host = (req.headers.get("host") ?? "").replace(/:\d+$/, "");
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}

const catIds = new Set<string>(categories.map((c) => c.id));

/** Valida y limpia lo que llega del formulario. */
export function clean(body: unknown): TimelineItem | null {
  if (!isItem(body) || !isSafeId(body.id) || !catIds.has(body.category)) return null;
  const s = (v: unknown, max = 4000) => (typeof v === "string" ? v.slice(0, max) : "");
  return {
    id: body.id,
    kind: body.kind === "acontecimiento" ? "acontecimiento" : "autor",
    year: Math.round(body.year),
    title: s(body.title, 300),
    author: s(body.author, 300),
    short: s(body.short, 60),
    category: body.category,
    summary: s(body.summary),
    concepts: body.concepts.map((c) => s(c, 120)).filter(Boolean).slice(0, 30),
    gameDesign: s(body.gameDesign),
    prompt: s(body.prompt, 600) || undefined,
    related: body.related.filter((r): r is string => typeof r === "string" && isSafeId(r)).slice(0, 40),
    reference: s(body.reference, 1000),
    // data URL de una foto nueva (máx. ~2 MB) o la URL de la ya guardada
    photo: typeof body.photo === "string" && body.photo.length < 2_800_000 ? body.photo : undefined,
    custom: true,
  };
}
