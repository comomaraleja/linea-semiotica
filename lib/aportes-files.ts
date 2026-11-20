import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { categories, type CategoryId, type TimelineItem } from "@/data/timeline";

/**
 * Aportes guardados como archivos .mdx en content/aportes/.
 *
 * Cada archivo tiene un encabezado (frontmatter) con los datos y el texto en secciones:
 *
 *   ---
 *   id: mi-lanzamiento-de-pong
 *   tipo: acontecimiento
 *   año: 1972
 *   título: Lanzamiento de Pong
 *   línea: juego
 *   ...
 *   ---
 *   ## Resumen
 *   ...
 *   ## En el diseño de videojuegos
 *   ...
 *
 * Se pueden crear o editar a mano: al abrir la app se leen todos.
 */

export const DIR = path.join(process.cwd(), "content", "aportes");
export const PHOTO_DIR = path.join(DIR, "fotos");

const SECTION_SUMMARY = "Resumen";
const SECTION_DESIGN = "En el diseño de videojuegos";

const categoryIds = new Set<string>(categories.map((c) => c.id));

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

/** Solo ids seguros (sin barras ni puntos): evita escribir fuera de la carpeta. */
export const isSafeId = (id: string) => /^[a-z0-9][a-z0-9-]{0,60}$/.test(id);

const list = (v: unknown): string[] =>
  Array.isArray(v) ? v.map(String).map((s) => s.trim()).filter(Boolean) : typeof v === "string" && v.trim() ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];

const str = (v: unknown) => (v == null ? "" : v instanceof Date ? v.toISOString() : String(v).trim());

/** Separa el cuerpo en secciones "## Título". */
function sections(body: string) {
  const out = new Map<string, string>();
  let current = "";
  let buf: string[] = [];
  const flush = () => {
    if (current) out.set(current.toLowerCase(), buf.join("\n").trim());
  };
  for (const line of body.split(/\r?\n/)) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) {
      flush();
      current = m[1];
      buf = [];
    } else if (!/^#\s/.test(line)) {
      buf.push(line);
    }
  }
  flush();
  return out;
}

/** Lee un .mdx y lo convierte en un hito. Tolera archivos escritos a mano e incompletos. */
function parse(file: string, raw: string): TimelineItem | null {
  const { data, content } = matter(raw);
  const base = path.basename(file, path.extname(file));
  const year = Number(data["año"] ?? data.anio ?? data.year ?? base.match(/^(\d{3,4})-/)?.[1]);
  const title = str(data["título"] ?? data.titulo ?? data.title);
  if (!Number.isFinite(year) || !title) return null; // sin año o título no se puede ubicar

  const idFromName = `mi-${slug(base.replace(/^\d{3,4}-/, ""))}`;
  const id = str(data.id) || idFromName;
  if (!isSafeId(id)) return null;

  const kind = str(data.tipo ?? data.kind) === "acontecimiento" ? "acontecimiento" : "autor";
  const rawCat = slug(str(data["línea"] ?? data.linea ?? data.categoria ?? data.category));
  const category = (categoryIds.has(rawCat) ? rawCat : "juego") as CategoryId;
  const author = str(data.autor ?? data.author);
  const sec = sections(content);
  const photo = str(data.foto ?? data.photo);

  return {
    id,
    kind,
    year: Math.round(year),
    title,
    author,
    short:
      str(data.etiqueta ?? data.short) ||
      (kind === "autor" && author ? author.split(/\s+y\s+/).map((n) => n.split(/\s+/).pop()).join(" y ") : title),
    category,
    summary: sec.get(SECTION_SUMMARY.toLowerCase()) ?? (sec.size === 0 ? content.trim() : ""),
    concepts: list(data.conceptos ?? data.concepts),
    gameDesign: sec.get(SECTION_DESIGN.toLowerCase()) ?? "",
    prompt: str(data.pregunta ?? data.prompt) || undefined,
    related: list(data.dialoga_con ?? data.related),
    reference: str(data.referencia ?? data.reference),
    photo: photo || undefined,
    custom: true,
  };
}

/** Convierte un hito en el texto del .mdx. */
function serialize(item: TimelineItem, extra: Record<string, string>) {
  const data: Record<string, unknown> = {
    id: item.id,
    tipo: item.kind ?? "autor",
    año: item.year,
    título: item.title,
    ...(item.author ? { autor: item.author } : {}),
    etiqueta: item.short,
    línea: item.category,
    conceptos: item.concepts,
    dialoga_con: item.related,
    ...(item.reference ? { referencia: item.reference } : {}),
    ...(item.prompt ? { pregunta: item.prompt } : {}),
    ...(item.photo ? { foto: item.photo } : {}),
    ...extra,
  };
  const body = [
    `# ${item.title}`,
    "",
    `## ${SECTION_SUMMARY}`,
    "",
    item.summary || "",
    "",
    `## ${SECTION_DESIGN}`,
    "",
    item.gameDesign || "",
    "",
  ].join("\n");
  return matter.stringify(body, data);
}

const fileNameFor = (item: TimelineItem) => `${item.year}-${item.id.replace(/^mi-/, "")}.mdx`;

async function files() {
  try {
    const names = await fs.readdir(DIR);
    return names.filter((n) => /\.mdx?$/i.test(n)).map((n) => path.join(DIR, n));
  } catch {
    return []; // la carpeta todavía no existe
  }
}

/** Todos los aportes de content/aportes (con el archivo de origen de cada uno). */
export async function readAll() {
  const out: { item: TimelineItem; file: string; meta: Record<string, string> }[] = [];
  const seen = new Set<string>();
  for (const file of await files()) {
    try {
      const raw = await fs.readFile(file, "utf8");
      const item = parse(file, raw);
      if (!item || seen.has(item.id)) continue; // ids repetidos: gana el primero
      seen.add(item.id);
      const { data } = matter(raw);
      out.push({ item, file, meta: { creado: str(data.creado) } });
    } catch {
      // un archivo roto no debe romper la línea entera
    }
  }
  return out;
}

/** Guarda la foto (data URL) en content/aportes/fotos y devuelve su URL pública. */
async function savePhoto(id: string, dataUrl: string) {
  const m = dataUrl.match(/^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/);
  if (!m) return undefined;
  await fs.mkdir(PHOTO_DIR, { recursive: true });
  const ext = m[1] === "jpeg" ? "jpg" : m[1];
  await removePhotos(id);
  await fs.writeFile(path.join(PHOTO_DIR, `${id}.${ext}`), Buffer.from(m[2], "base64"));
  return `/api/aportes/fotos/${id}.${ext}?v=${Date.now()}`;
}

async function removePhotos(id: string) {
  for (const ext of ["jpg", "png", "webp"]) await fs.rm(path.join(PHOTO_DIR, `${id}.${ext}`), { force: true });
}

/** Crea o reemplaza el archivo de un aporte. Devuelve el hito tal como quedó guardado. */
export async function write(input: TimelineItem, { create }: { create: boolean }) {
  await fs.mkdir(DIR, { recursive: true });
  const existing = await readAll();
  const taken = new Set(existing.map((e) => e.item.id));

  let id = input.id;
  if (create) {
    // si el id ya existe, se numera: mi-autor, mi-autor-2…
    for (let n = 2; taken.has(id); n++) id = `${input.id}-${n}`;
  }
  const prev = existing.find((e) => e.item.id === id);

  let photo = input.photo;
  if (photo?.startsWith("data:")) photo = await savePhoto(id, photo);
  else if (!photo) await removePhotos(id);

  const item: TimelineItem = { ...input, id, photo, custom: true };
  const now = new Date().toISOString();
  const text = serialize(item, { creado: prev?.meta.creado || now, actualizado: now });

  const target = path.join(DIR, fileNameFor(item));
  await fs.writeFile(target, text, "utf8");
  // si cambió el año o el nombre, se borra el archivo viejo
  if (prev && prev.file !== target) await fs.rm(prev.file, { force: true });
  return item;
}

export async function remove(id: string) {
  const found = (await readAll()).find((e) => e.item.id === id);
  if (!found) return false;
  await fs.rm(found.file, { force: true });
  await removePhotos(id);
  return true;
}
