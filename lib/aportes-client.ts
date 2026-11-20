import type { TimelineItem } from "@/data/timeline";
import { clearCustom, loadCustom } from "./custom";

/**
 * Dónde se guardan los aportes:
 * - "archivos": la app corre en la propia computadora → cada aporte es un .mdx en content/aportes/.
 * - "navegador": no hay servidor que pueda escribir (p. ej. sitio publicado) → localStorage, como respaldo.
 */
export type Store = "archivos" | "navegador";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`);
  return data as T;
}

/** Lee todos los aportes. Si hay aportes viejos en el navegador y se puede escribir, los pasa a archivos. */
export async function loadAportes(): Promise<{ items: TimelineItem[]; store: Store; migrated: number }> {
  const local = loadCustom();
  try {
    const { items, writable } = await api<{ items: TimelineItem[]; writable: boolean }>("/api/aportes");
    if (!writable) {
      // Los .mdx del proyecto se ven pero no se editan; lo nuevo va al navegador
      return { items: [...items.map((i) => ({ ...i, custom: false })), ...local], store: "navegador", migrated: 0 };
    }
    // Migración única: lo que estaba en el navegador pasa a archivos
    let migrated = 0;
    const all = [...items];
    for (const item of local) {
      if (all.some((i) => i.id === item.id)) continue;
      try {
        const saved = await createAporte(item);
        all.push(saved);
        migrated++;
      } catch {
        /* si uno falla, queda en el navegador */
      }
    }
    if (migrated === local.length) clearCustom();
    return { items: all, store: "archivos", migrated };
  } catch {
    return { items: local, store: "navegador", migrated: 0 };
  }
}

/** Vuelve a leer la carpeta (para ver archivos agregados o editados a mano). */
export async function reloadAportes(): Promise<TimelineItem[] | null> {
  try {
    const { items, writable } = await api<{ items: TimelineItem[]; writable: boolean }>("/api/aportes");
    return writable ? items : null;
  } catch {
    return null;
  }
}

export const createAporte = async (item: TimelineItem) =>
  (await api<{ item: TimelineItem }>("/api/aportes", { method: "POST", body: JSON.stringify(item) })).item;

export const updateAporte = async (item: TimelineItem) =>
  (
    await api<{ item: TimelineItem }>(`/api/aportes/${encodeURIComponent(item.id)}`, {
      method: "PUT",
      body: JSON.stringify(item),
    })
  ).item;

export const deleteAporte = async (id: string) => {
  await api(`/api/aportes/${encodeURIComponent(id)}`, { method: "DELETE" });
};
