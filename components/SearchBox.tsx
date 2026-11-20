"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { categories, type TimelineItem } from "@/data/timeline";
import Avatar from "./Avatar";

const catById = new Map(categories.map((c) => [c.id, c]));
const MAX = 8;

/** Minúsculas y sin tildes, carácter por carácter (mantiene las posiciones para resaltar). */
const fold = (s: string) =>
  Array.from(s)
    .map((ch) => ch.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")[0] ?? "")
    .join("");

/** ¿Empieza alguna palabra del texto con la búsqueda? (q ya viene sin tildes ni mayúsculas) */
const wordStart = (text: string, q: string) => {
  const t = fold(text);
  for (let i = t.indexOf(q); i !== -1; i = t.indexOf(q, i + 1)) {
    if (i === 0 || /[^a-z0-9ñ]/.test(t[i - 1])) return true;
  }
  return false;
};

interface Result {
  item: TimelineItem;
  rank: number;
  /** Por qué aparece, cuando no es por nombre o título */
  reason?: string;
}

function search(items: TimelineItem[], raw: string): Result[] {
  const q = fold(raw.trim());
  if (!q) return [];
  const out: Result[] = [];
  for (const item of items) {
    const names = `${item.short} ${item.author}`;
    let r: Result | null = null;
    if (wordStart(names, q)) r = { item, rank: 0 };
    else if (fold(names).includes(q)) r = { item, rank: 1 };
    else if (fold(item.title).includes(q)) r = { item, rank: 2 };
    else {
      const concept = item.concepts.find((c) => wordStart(c, q));
      if (concept) r = { item, rank: 3, reason: `concepto: ${concept}` };
      else if (String(item.year).startsWith(q)) r = { item, rank: 3, reason: `año ${item.year}` };
      else if (q.length >= 3 && wordStart(`${item.summary} ${item.gameDesign}`, q))
        r = { item, rank: 4, reason: "aparece en el texto" };
    }
    if (r) out.push(r);
  }
  return out.sort((a, b) => a.rank - b.rank || a.item.year - b.item.year);
}

/** Resalta la parte del texto que coincide con la búsqueda. */
function Mark({ text, q }: { text: string; q: string }) {
  const i = q ? fold(text).indexOf(fold(q.trim())) : -1;
  if (i < 0) return <>{text}</>;
  const n = fold(q.trim()).length;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-[3px] bg-[#ffc94a]/35 px-px text-inherit">{text.slice(i, i + n)}</mark>
      {text.slice(i + n)}
    </>
  );
}

interface Props {
  items: TimelineItem[];
  onPick: (id: string) => void;
}

/** Buscador con lista desplegable: autores, obras, conceptos y acontecimientos. */
export default function SearchBox({ items, onPick }: Props) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => search(items, q), [items, q]);
  const shown = results.slice(0, MAX);
  const show = open && q.trim().length > 0;

  useEffect(() => setActive(0), [q]);

  // Mantener visible la opción activa al moverse con el teclado
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  // Cerrar al hacer clic afuera
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  const pick = (id: string) => {
    onPick(id);
    setQ("");
    setOpen(false);
    (document.activeElement as HTMLElement | null)?.blur();
  };

  return (
    <div ref={wrapRef} className="relative w-full sm:w-72">
      <span aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] text-muted">
        ⌕
      </span>
      <input
        type="text"
        role="combobox"
        aria-expanded={show}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={show && shown[active] ? `${listId}-${active}` : undefined}
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setActive((a) => Math.min(a + 1, shown.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
          } else if (e.key === "Enter" && show && shown[active]) {
            e.preventDefault();
            pick(shown[active].item.id);
          } else if (e.key === "Escape") {
            // Esc limpia la búsqueda; no cierra la ficha abierta
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            if (q) setQ("");
            else (e.target as HTMLInputElement).blur();
            setOpen(false);
          }
        }}
        placeholder="Buscar autor, obra, concepto…"
        className="w-full rounded-full border border-line bg-panel py-2 pl-9 pr-4 text-[15px] placeholder:text-muted focus:border-paper/40 focus:outline-none"
      />

      {show && (
        <div className="paper animate-rise absolute right-0 top-full z-50 mt-2 w-[min(26rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line shadow-[0_24px_60px_-20px_rgb(0_0_0/0.8)]">
          {shown.length ? (
            <ul ref={listRef} id={listId} role="listbox" className="scroll-x max-h-[min(26rem,60dvh)] overflow-y-auto p-1.5">
              {shown.map(({ item, reason }, i) => {
                const cat = catById.get(item.category) ?? categories[0];
                const on = i === active;
                return (
                  <li
                    key={item.id}
                    id={`${listId}-${i}`}
                    data-index={i}
                    role="option"
                    aria-selected={on}
                    onMouseEnter={() => setActive(i)}
                    onMouseDown={(e) => {
                      e.preventDefault(); // que el input no pierda el foco antes del clic
                      pick(item.id);
                    }}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border-l-4 px-3 py-2 transition-colors"
                    style={{ borderColor: cat.color, background: on ? `${cat.color}2e` : undefined }}
                  >
                    <Avatar item={item} color={cat.ink} size={40} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-2">
                        <span className="truncate font-display text-[16px] font-semibold">
                          <Mark text={item.short} q={q} />
                        </span>
                        <span
                          className="shrink-0 rounded-full px-1.5 font-label text-[12.5px] leading-[1.4]"
                          style={{ background: cat.color, color: "var(--color-ink)" }}
                        >
                          {item.year}
                        </span>
                      </span>
                      <span className="block truncate text-[13px] italic text-paper/75">
                        <Mark text={item.title} q={q} />
                      </span>
                      <span className="block truncate text-[12px]" style={{ color: cat.ink }}>
                        {reason ? <Mark text={reason} q={q} /> : cat.label}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-4 py-4 text-[14px] text-muted">
              Sin resultados para «{q.trim()}».
            </p>
          )}
          {results.length > MAX && (
            <p className="border-t border-line px-4 py-2 text-[12.5px] text-muted">
              Y {results.length - MAX} más: seguí escribiendo para afinar.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
