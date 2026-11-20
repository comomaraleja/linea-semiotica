import type { TimelineItem } from "@/data/timeline";

/** Respaldo en el navegador (localStorage), para cuando no se puede escribir en archivos. */
const KEY = "signos-en-juego:aportes-v1";

export function loadCustom(): TimelineItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter(isItem).map((i) => ({ ...i, custom: true })) : [];
  } catch {
    return [];
  }
}

export function saveCustom(items: TimelineItem[]): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
    return true;
  } catch {
    return false; // sin espacio o almacenamiento bloqueado
  }
}

export function clearCustom() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

export function isItem(x: unknown): x is TimelineItem {
  const i = x as TimelineItem;
  return (
    !!i &&
    typeof i.id === "string" &&
    typeof i.title === "string" &&
    typeof i.year === "number" &&
    typeof i.category === "string" &&
    Array.isArray(i.related) &&
    Array.isArray(i.concepts)
  );
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);

export const newId = (base: string, taken: Set<string>) => {
  const root = `mi-${slug(base) || "hito"}`;
  let id = root;
  for (let n = 2; taken.has(id); n++) id = `${root}-${n}`;
  return id;
};

/** Achica una imagen a un cuadrado de 160px (JPEG) para guardarla liviana. */
export function resizeImage(file: File, size = 160): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      const side = Math.min(img.width, img.height);
      // recorte centrado, un poco hacia arriba (las caras suelen estar arriba)
      const sx = (img.width - side) / 2;
      const sy = Math.max(0, (img.height - side) * 0.25);
      ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen"));
    };
    img.src = url;
  });
}
