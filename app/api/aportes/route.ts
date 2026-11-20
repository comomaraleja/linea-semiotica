import { NextResponse, type NextRequest } from "next/server";
import { readAll, write } from "@/lib/aportes-files";
import { canWrite, clean } from "./guard";

// Lee los archivos en cada pedido: lo que se agregue a la carpeta aparece al recargar
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Todos los aportes de content/aportes. */
export async function GET(req: NextRequest) {
  const items = (await readAll()).map((e) => e.item);
  return NextResponse.json({ items, writable: canWrite(req) });
}

/** Crea un aporte nuevo (un archivo .mdx). */
export async function POST(req: NextRequest) {
  if (!canWrite(req)) return NextResponse.json({ error: "Solo se puede escribir en local." }, { status: 403 });
  const item = clean(await req.json().catch(() => null));
  if (!item) return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  return NextResponse.json({ item: await write(item, { create: true }) }, { status: 201 });
}
