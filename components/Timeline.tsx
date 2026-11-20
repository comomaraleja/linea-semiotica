"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { categories, timeline, type CategoryId, type TimelineItem } from "@/data/timeline";
import { isItem, newId, saveCustom } from "@/lib/custom";
import {
  createAporte,
  deleteAporte,
  loadAportes,
  reloadAportes,
  updateAporte,
  type Store,
} from "@/lib/aportes-client";
import Overview from "./Overview";
import DetailPanel from "./DetailPanel";
import EntryForm from "./EntryForm";
import AboutCarousel from "./AboutCarousel";
import SearchBox from "./SearchBox";
import Logo from "./Logo";

const byYear = (a: TimelineItem, b: TimelineItem) => a.year - b.year;
const baseIds = new Set(timeline.map((i) => i.id));

/** Qué muestra el diálogo: una ficha o el formulario de aporte. */
type View = { kind: "detail"; id: string } | { kind: "form"; editId?: string; key: number };

const SEEN_KEY = "signos-en-juego:visto-intro";

export default function Timeline() {
  // Aportes propios (localStorage); se cargan después de montar para no romper la hidratación
  const [custom, setCustom] = useState<TimelineItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  // "archivos" (.mdx en content/aportes) o "navegador" (respaldo)
  const [store, setStore] = useState<Store>("navegador");
  const [view, setView] = useState<View | null>(null);
  // Última vista: se conserva mientras el diálogo se desvanece al cerrarse
  const [lastView, setLastView] = useState<View>({ kind: "detail", id: timeline[0].id });
  // null = vista general (todas las líneas); si no, solo la línea de esa categoría
  const [focus, setFocus] = useState<CategoryId | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  // Presentación "¿De qué se trata?" (diálogo centrado, aparte del panel lateral)
  const [aboutOpen, setAboutOpen] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const formCounter = useRef(0);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const all = useMemo(() => [...timeline, ...custom].sort(byYear), [custom]);
  const byId = useMemo(() => new Map(all.map((i) => [i.id, i])), [all]);

  // "Dialoga con" en ambos sentidos: lo que el hito cita y lo que lo cita a él
  const relatedOf = useCallback(
    (item: TimelineItem) => {
      const ids = new Set(item.related);
      for (const other of all) if (other.related.includes(item.id)) ids.add(other.id);
      ids.delete(item.id);
      return [...ids].map((id) => byId.get(id)).filter((i): i is TimelineItem => !!i).sort(byYear);
    },
    [all, byId],
  );

  const visible = useMemo(
    () => new Set<CategoryId>(focus ? [focus] : categories.map((c) => c.id)),
    [focus],
  );

  // Hitos en orden de la línea visible (para recorrer con ← →)
  const filtered = useMemo(() => all.filter((item) => visible.has(item.category)), [all, visible]);

  const onLine = useMemo(() => all.filter((i) => visible.has(i.category)), [all, visible]);
  const matches = useMemo(() => new Set(filtered.map((i) => i.id)), [filtered]);

  const selected = view?.kind === "detail" ? (byId.get(view.id) ?? null) : null;
  const relatedItems = useMemo(() => (selected ? relatedOf(selected) : []), [selected, relatedOf]);
  const relatedIds = useMemo(() => new Set(relatedItems.map((i) => i.id)), [relatedItems]);
  const index = selected ? filtered.findIndex((i) => i.id === selected.id) : -1;
  const open = view !== null && (view.kind === "form" || selected !== null);

  const show = useCallback((v: View | null) => {
    setView(v);
    if (v) setLastView(v);
    history.replaceState(
      null,
      "",
      v?.kind === "detail" ? `#${v.id}` : location.pathname + location.search,
    );
  }, []);

  const select = useCallback((id: string) => show({ kind: "detail", id }), [show]);
  const close = useCallback(() => show(null), [show]);
  const openForm = useCallback(
    (editId?: string) => show({ kind: "form", editId, key: ++formCounter.current }),
    [show],
  );

  // Cargar aportes (archivos .mdx o navegador) y, después, resolver el enlace directo (/#bogost)
  useEffect(() => {
    (async () => {
    const { items: saved, store, migrated } = await loadAportes();
    setCustom(saved);
    setStore(store);
    setLoaded(true);
    if (migrated) notify(`Se pasaron ${migrated} aporte${migrated === 1 ? "" : "s"} del navegador a archivos .mdx.`);
    const id = location.hash.slice(1);
    if (id && (baseIds.has(id) || saved.some((i) => i.id === id))) {
      setView({ kind: "detail", id });
      setLastView({ kind: "detail", id });
      return;
    }
    // Primera visita: presentar de qué se trata
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1";
      localStorage.setItem(SEEN_KEY, "1");
    } catch {}
    if (!seen) setAboutOpen(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Al volver a la pestaña, releer la carpeta: aparecen los .mdx agregados o editados a mano
  useEffect(() => {
    if (store !== "archivos") return;
    const onFocus = async () => {
      const items = await reloadAportes();
      if (items) setCustom(items);
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [store]);

  // Si cambia el #hito de la URL (enlace, atrás/adelante), abrir ese hito
  useEffect(() => {
    const onHash = () => {
      const id = location.hash.slice(1);
      if (!id) return setView(null);
      if (byId.has(id)) {
        setView({ kind: "detail", id });
        setLastView({ kind: "detail", id });
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [byId]);

  // Modo navegador: guardar cada cambio en localStorage (en modo archivos lo hace el servidor)
  useEffect(() => {
    if (loaded && store === "navegador" && !saveCustom(custom.filter((i) => i.custom))) {
      notify("No se pudo guardar en este navegador (¿almacenamiento lleno o bloqueado?). Exportá tus aportes.");
    }
  }, [custom, loaded, store, notify]);

  const go = useCallback(
    (delta: number) => {
      if (!filtered.length) return;
      if (!selected) {
        select((delta > 0 ? filtered[0] : filtered[filtered.length - 1]).id);
        return;
      }
      // Si el seleccionado quedó fuera del filtro, saltamos al más cercano en el tiempo
      const from = index === -1 ? filtered.findIndex((i) => i.year >= selected.year) : index;
      const base = from === -1 ? filtered.length - 1 : from;
      const next = filtered[Math.min(Math.max(base + (index === -1 ? 0 : delta), 0), filtered.length - 1)];
      select(next.id);
    },
    [filtered, index, selected, select],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (aboutOpen) return; // la presentación maneja su propio teclado
      if (view?.kind === "form") return; // el formulario se cierra solo con sus botones
      const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if (e.key === "Escape") {
        if (e.target instanceof HTMLInputElement && e.target.value) return; // limpia la búsqueda primero
        close();
        return;
      }
      if (typing) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, close, view, aboutOpen]);

  // Elegir una línea (o volver a la vista general); si la ficha abierta queda fuera, se cierra
  const showOnly = (id: CategoryId | null) => {
    setFocus(id);
    if (id && selected && selected.category !== id) close();
  };

  // ── Aportes ───────────────────────────────────────────────────────────────
  const save = async (data: Omit<TimelineItem, "id"> & { id?: string }) => {
    const editing = !!data.id && custom.some((i) => i.id === data.id);
    const draft: TimelineItem = {
      ...data,
      id: editing ? data.id! : newId(data.short || data.title, new Set(byId.keys())),
      custom: true,
    };
    let item = draft;
    if (store === "archivos") {
      try {
        // El servidor escribe el .mdx y devuelve el aporte como quedó (id final, URL de la foto)
        item = editing ? await updateAporte(draft) : await createAporte(draft);
      } catch (e) {
        return notify(`No se pudo guardar el archivo: ${(e as Error).message}`);
      }
    }
    setCustom((prev) => (editing ? prev.map((i) => (i.id === item.id ? item : i)) : [...prev, item]));
    // Que se vea en la línea aunque haya un filtro activo
    if (focus && focus !== item.category) setFocus(null);
    select(item.id);
    notify(
      store === "archivos"
        ? `${editing ? "Guardado" : "Creado"} en content/aportes/${item.year}-${item.id.replace(/^mi-/, "")}.mdx`
        : editing
          ? "Cambios guardados."
          : "Agregado a la línea.",
    );
  };

  const remove = async (id: string) => {
    if (store === "archivos") {
      try {
        await deleteAporte(id);
      } catch (e) {
        return notify(`No se pudo borrar el archivo: ${(e as Error).message}`);
      }
    }
    setCustom((prev) =>
      prev.filter((i) => i.id !== id).map((i) => ({ ...i, related: i.related.filter((r) => r !== id) })),
    );
    close();
    notify(store === "archivos" ? "Aporte y archivo eliminados." : "Aporte eliminado.");
  };

  const exportCustom = () => {
    if (!custom.length) return notify("Todavía no hay aportes para exportar.");
    const blob = new Blob([JSON.stringify(custom.map(({ custom: _c, ...i }) => i), null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `signos-en-juego-aportes-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const importCustom = async (file: File) => {
    try {
      const data = JSON.parse(await file.text());
      const list: TimelineItem[] = (Array.isArray(data) ? data : []).filter(isItem);
      if (!list.length) return notify("Ese archivo no tiene aportes válidos.");
      if (store === "archivos") {
        // Cada aporte importado se escribe como .mdx (si ya existe, se actualiza)
        const next = [...custom];
        for (const raw of list) {
          let item: TimelineItem = { ...raw, custom: true };
          const i = next.findIndex((p) => p.id === item.id);
          try {
            if (i !== -1) next[i] = await updateAporte(item);
            else {
              if (baseIds.has(item.id)) item = { ...item, id: newId(item.short || item.title, new Set([...baseIds, ...next.map((n) => n.id)])) };
              next.push(await createAporte(item));
            }
          } catch {
            /* se saltea el que falle */
          }
        }
        setCustom(next);
        return notify(`Importados ${list.length} aporte${list.length === 1 ? "" : "s"} como archivos .mdx.`);
      }
      setCustom((prev) => {
        const next = [...prev];
        for (const raw of list) {
          const item = { ...raw, custom: true };
          const i = next.findIndex((p) => p.id === item.id);
          if (i !== -1) next[i] = item; // mismo aporte: se actualiza
          else {
            // si choca con un hito de base, se le da otro id
            if (baseIds.has(item.id)) item.id = newId(item.short || item.title, new Set([...baseIds, ...next.map((n) => n.id)]));
            next.push(item);
          }
        }
        return next;
      });
      notify(`Importados ${list.length} aporte${list.length === 1 ? "" : "s"}.`);
    } catch {
      notify("No se pudo leer el archivo. ¿Es un JSON exportado desde acá?");
    }
  };

  // Contenido del diálogo (la última vista, para que no desaparezca durante el cierre)
  const shownView = view ?? lastView;
  const shownItem = shownView.kind === "detail" ? (byId.get(shownView.id) ?? all[0]) : null;
  const editItem = shownView.kind === "form" && shownView.editId ? byId.get(shownView.editId) : undefined;

  return (
    <main className="flex h-dvh flex-col p-2 md:p-4">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-line bg-night shadow-[0_40px_120px_-40px_rgb(0_0_0/0.8)]">
        {/* Barra superior, parte del mapa */}
        <header className="relative z-50 flex flex-wrap items-center gap-x-4 gap-y-2 bg-gradient-to-b from-panel/80 to-panel/30 px-4 py-3.5 shadow-[0_8px_24px_-12px_rgb(0_0_0/0.6)]">
          <div className="mr-auto flex min-w-0 items-start gap-3">
            <button
              onClick={() => setAboutOpen(true)}
              title="¿De qué se trata?"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-panel to-night text-paper shadow-[0_8px_20px_-8px_rgb(0_0_0/0.7)] ring-1 ring-white/10 transition-transform duration-300 ease-[cubic-bezier(0.34,1.7,0.5,1)] hover:-rotate-6 hover:scale-105 md:h-14 md:w-14"
            >
              <Logo size={34} className="md:h-10 md:w-10" />
            </button>
          <div className="min-w-0">
            <h1 className="font-display text-[24px] font-bold leading-none tracking-[-0.01em] md:text-[30px]">
              Signos{" "}
              <span className="relative -top-[0.08em] mx-0.5 inline-block -rotate-6 rounded-md bg-[#ff7a59] px-1.5 py-0.5 font-label text-[0.62em] text-ink">
                en
              </span>{" "}
              juego
            </h1>
            <p className="mt-2 hidden max-w-[40rem] text-[15.5px] leading-snug text-paper/80 md:block">
              Las teorías del signo, el discurso y el relato que sirven para leer y diseñar videojuegos, de al-Jāḥiẓ
              y Peirce a los game studies.{" "}
              <button
                onClick={() => setAboutOpen(true)}
                className="whitespace-nowrap font-medium text-paper underline decoration-paper/30 underline-offset-[3px] transition-colors hover:decoration-paper"
              >
                ¿De qué se trata?
              </button>
            </p>
            <button
              onClick={() => setAboutOpen(true)}
              className="mt-1 text-xs text-paper/70 underline decoration-paper/30 underline-offset-2 md:hidden"
            >
              ¿De qué se trata?
            </button>
          </div>
          </div>
          <div
            className="scroll-x order-last -mx-4 flex w-[calc(100%+2rem)] items-center gap-1.5 overflow-x-auto px-4 pb-1 md:mx-0 md:w-full md:flex-wrap md:overflow-visible md:px-0 md:pb-0 [&>button]:shrink-0 [&>button]:whitespace-nowrap"
            role="group"
            aria-label="Líneas"
          >
            <button
              onClick={() => showOnly(null)}
              aria-pressed={focus === null}
              aria-label="Ver todas las líneas"
              className={`tag-chip rounded-full border px-3.5 py-1.5 text-[14px] font-medium ${
                focus === null
                  ? "border-paper/40 bg-paper/10 text-paper"
                  : "border-line text-muted hover:border-paper/30 hover:text-paper"
              }`}
            >
              Ver todas
            </button>
            {categories.map((c) => {
              const active = focus === c.id;
              const dimmed = focus !== null && !active;
              return (
                <button
                  key={c.id}
                  // Clic en la línea activa: vuelve a la vista general
                  onClick={() => showOnly(active ? null : c.id)}
                  aria-pressed={active}
                  aria-label={active ? `${c.label}: volver a la vista general` : `Ver solo ${c.label}`}
                  className={`tag-chip flex items-center gap-2 rounded-full border-2 px-4 py-1.5 text-[14px] font-semibold ${
                    active ? "text-ink" : dimmed ? "text-paper/60" : "text-paper"
                  }`}
                  style={
                    {
                      "--c": c.color,
                      background: active ? c.color : `${c.color}${dimmed ? "1a" : "38"}`,
                      borderColor: active ? c.color : `${c.color}${dimmed ? "40" : "aa"}`,
                      boxShadow: active ? `0 0 22px -2px ${c.color}aa` : undefined,
                    } as React.CSSProperties
                  }
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      background: active ? "var(--color-ink)" : c.color,
                      boxShadow: active ? undefined : `0 0 8px ${c.color}`,
                      opacity: dimmed ? 0.5 : 1,
                    }}
                  />
                  {c.short}
                  {active && <span className="-mr-0.5 ml-0.5 opacity-60">✕</span>}
                </button>
              );
            })}
          </div>
          <div className="flex w-full items-center gap-3 sm:w-auto sm:self-start">
            <SearchBox
              items={all}
              onPick={(id) => {
                // Si el hito es de otra tradición que la que se está viendo, volver a la vista general
                const item = byId.get(id);
                if (item && focus && focus !== item.category) setFocus(null);
                select(id);
              }}
            />
            <button
              onClick={() => openForm()}
              className="shrink-0 rounded-full bg-paper px-4 py-2 text-[15px] font-semibold text-ink shadow-[0_6px_16px_-6px_rgb(243_234_216/0.5)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              + Agregar
            </button>
          </div>
        </header>
        {/* Firma: una franja por línea, en proporción a sus hitos */}
        <div className="flex h-[3px] shrink-0" aria-hidden>
          {categories.map((c) => (
            <span
              key={c.id}
              className="transition-[flex-grow,opacity] duration-500"
              style={{
                background: c.color,
                flexGrow: all.filter((i) => i.category === c.id).length,
                opacity: focus && focus !== c.id ? 0.25 : 1,
              }}
            />
          ))}
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col">
          {/* Viñeta y grano: le dan cuerpo a la superficie del mapa */}
          <div aria-hidden className="map-atmosphere pointer-events-none absolute inset-0 z-[25]" />
          <Overview
            items={onLine}
            matches={matches}
            selected={selected}
            related={relatedIds}
            onSelect={select}
            onBackground={close}
          />

          {/* Diálogo flotante dentro del mapa: ficha o formulario */}
          <div
            role="dialog"
            aria-labelledby="detail-title"
            aria-hidden={!open}
            inert={!open}
            data-open={open}
            className="map-dialog"
          >
            {shownView.kind === "form" ? (
              <EntryForm
                key={shownView.key}
                initial={editItem}
                all={all}
                defaultCategory={focus ?? undefined}
                customCount={custom.filter((i) => i.custom).length}
                store={store}
                onSave={save}
                onCancel={() => (editItem ? select(editItem.id) : close())}
                onExport={exportCustom}
                onImport={importCustom}
              />
            ) : (
              shownItem && (
                <DetailPanel
                  key={shownItem.id}
                  item={shownItem}
                  related={relatedOf(shownItem)}
                  onSelect={select}
                  onEdit={shownItem.custom ? () => openForm(shownItem.id) : undefined}
                  onDelete={shownItem.custom ? () => remove(shownItem.id) : undefined}
                  onClose={close}
                  onPrev={open && index > 0 ? () => go(-1) : undefined}
                  onNext={open && index !== -1 && index < filtered.length - 1 ? () => go(1) : undefined}
                />
              )
            )}
          </div>

          {/* Avisos breves */}
          <div
            role="status"
            aria-live="polite"
            className={`pointer-events-none absolute bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-card-line bg-card px-4 py-2 text-sm text-card-ink shadow-xl transition-all duration-300 ${
              toast ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            {toast}
          </div>
        </div>
      </div>

      <AboutCarousel
        open={aboutOpen}
        count={all.length}
        from={all[0]?.year ?? 1900}
        to={all[all.length - 1]?.year ?? 2020}
        onClose={() => setAboutOpen(false)}
        onStart={() => {
          setAboutOpen(false);
          close();
          showOnly(null);
        }}
      />
    </main>
  );
}
