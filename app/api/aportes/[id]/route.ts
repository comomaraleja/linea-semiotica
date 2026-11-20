import { NextResponse, type NextRequest } from "next/server";
import { isSafeId, remove, write } from "@/lib/aportes-files";
import { canWrite, clean } from "../guard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/** Reescribe el archivo de un aporte. */
export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  if (!canWrite(req)) return NextResponse.json({ error: "Solo se puede escribir en local." }, { status: 403 });
  const item = clean(await req.json().catch(() => null));
  if (!item || item.id !== id) return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  return NextResponse.json({ item: await write(item, { create: false }) });
}

/** Borra el archivo (y la foto) de un aporte. */
export async function DELETE(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  if (!canWrite(req)) return NextResponse.json({ error: "Solo se puede escribir en local." }, { status: 403 });
  if (!isSafeId(id)) return NextResponse.json({ error: "Id inválido." }, { status: 400 });
  const ok = await remove(id);
  return ok ? NextResponse.json({ ok }) : NextResponse.json({ error: "No existe." }, { status: 404 });
}
