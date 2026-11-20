"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { categories, eras, type TimelineItem } from "@/data/timeline";
import Avatar, { peopleOf } from "./Avatar";

const MIN_YEAR = 1895; // rango mínimo; se amplía si hay hitos fuera de él
const MAX_YEAR = 2025;
const BIN = 5; // la escala se arma por quinquenios
const BIN_BASE = 130; // ancho mínimo de un quinquenio sin hitos
const BIN_PER_ITEM = 115; // ancho extra por cada hito del quinquenio
const PAD_LEFT = 80;
const PAD_RIGHT = 540; // aire al final para que la ficha no tape los últimos hitos
const AV = 60; // diámetro del avatar
const ERA_H = 52; // franja superior con los nombres de las eras
const FOOT_H = 60; // franja inferior reservada para el nombre grande de cada era
const MAX_TIERS = 14;
const TITLE_MAX = 210; // ancho máximo del título de la obra bajo el nombre
const BIN_EMPTY = 70; // ancho de un quinquenio sin hitos (junto a otros con hitos)
const GAP_MIN_BINS = 3; // a partir de 15 años seguidos sin hitos, el tramo se comprime…
const GAP_W = 150; // …y ocupa este ancho, con un corte en el eje

type Scale = (year: number) => number;

const colorOf = new Map(categories.map((c) => [c.id, c.color]));

/** Ancho aproximado que ocupa un hito: avatar(es) + tarjeta con nombre, título y año. */
export const itemWidth = (item: TimelineItem) =>
  AV +
  (peopleOf(item).length - 1) * AV * 0.6 +
  12 +
  Math.max(item.short.length * 10.5 + 56, Math.min(item.title.length * 7, TITLE_MAX)) +
  28;

/**
 * Reparte los hitos en niveles alternando arriba y abajo del eje (1, -1, 2, -2…),
 * de modo que ninguno se pise con su vecino.
 */
function layout(items: TimelineItem[], x: Scale) {
  const order = Array.from({ length: MAX_TIERS }, (_, i) => (i % 2 ? -(i + 1) / 2 : i / 2 + 1));
  const busyUntil = new Map<number, number>();
  const tier = new Map<string, number>();
  for (const item of items) {
    const start = x(item.year) - AV / 2;
    const end = start + itemWidth(item);
    const t = order.find((t) => start >= (busyUntil.get(t) ?? -Infinity) + 16) ?? order[order.length - 1];
    busyUntil.set(t, end);
    tier.set(item.id, t);
  }
  const values = [...tier.values()];
  const side = Math.max(1, ...values.map(Math.abs));
  return { tier, side };
}

interface Props {
  items: TimelineItem[];
  matches: Set<string>;
  selected: TimelineItem | null;
  /** Hitos que dialogan con el seleccionado (en ambos sentidos) */
  related: Set<string>;
  onSelect: (id: string) => void;
  /** Clic en una zona vacía de la línea */
  onBackground: () => void;
}

export default function Overview({ items, matches, selected, related, onSelect, onBackground }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(600);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  // Escala por quinquenios: cada tramo de 5 años es más ancho cuantos más hitos tiene.
  // Así los períodos vacíos no ocupan media pantalla y los densos tienen aire.
  const { x, trackW, minYear, maxYear, gaps, compressed } = useMemo(() => {
    const years = items.map((i) => i.year);
    const minYear = Math.min(
      MIN_YEAR,
      ...years.map((y) => Math.floor((y - 3) / BIN) * BIN),
      ...eras.filter((e) => years.some((y) => y >= e.from && y < e.to)).map((e) => e.from),
    );
    const maxYear = Math.max(MAX_YEAR, ...years.map((y) => Math.ceil((y + 3) / BIN) * BIN));
    const nBins = Math.ceil((maxYear - minYear) / BIN);
    const counts = new Array(nBins).fill(0);
    for (const y of years) counts[Math.min(nBins - 1, Math.floor((y - minYear) / BIN))]++;
    const widths = counts.map((c) => (c ? BIN_BASE + c * BIN_PER_ITEM : BIN_EMPTY));
    // Tramos largos sin hitos (p. ej. entre Ibn Khaldūn y Peirce): se comprimen a GAP_W
    const gapRuns: { from: number; to: number }[] = [];
    const compressed = new Set<number>();
    for (let i = 0; i < nBins; ) {
      if (counts[i]) {
        i++;
        continue;
      }
      let j = i;
      while (j < nBins && !counts[j]) j++;
      // se deja un quinquenio de aire a cada lado del corte
      const a = i === 0 ? 0 : i + 1;
      const b = j === nBins ? nBins : j - 1;
      if (b - a >= GAP_MIN_BINS) {
        for (let k = a; k < b; k++) {
          widths[k] = GAP_W / (b - a);
          compressed.add(k);
        }
        gapRuns.push({ from: a, to: b });
      }
      i = j;
    }
    const starts: number[] = [];
    let acc = PAD_LEFT;
    for (const w of widths) {
      starts.push(acc);
      acc += w;
    }
    const gaps = gapRuns.map((g) => ({
      x: starts[g.from],
      w: starts[g.to - 1] + widths[g.to - 1] - starts[g.from],
      years: (g.to - g.from) * BIN,
      fromYear: minYear + g.from * BIN,
      toYear: minYear + g.to * BIN,
    }));
    const x: Scale = (year) => {
      const pos = (year - minYear) / BIN;
      const i = Math.max(0, Math.min(nBins - 1, Math.floor(pos)));
      return starts[i] + (pos - i) * widths[i];
    };
    return { x, trackW: acc + PAD_RIGHT, minYear, maxYear, gaps, compressed };
  }, [items]);
  const { tier, side } = useMemo(() => layout(items, x), [items, x]);

  // Los niveles se espacian según el alto disponible
  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.clientHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const half = (height - ERA_H - FOOT_H - 32) / 2;
  const tierH = Math.min(140, Math.max(80, half / (side + 0.35)));
  // Mismo margen que en `half`: así el contenido entra justo en el alto visible
  const contentH = Math.max(height, ERA_H + FOOT_H + 32 + 2 * (side + 0.35) * tierH);
  // El eje queda centrado entre las dos franjas de las eras; ningún hito invade la de abajo
  const axisY = ERA_H + (contentH - ERA_H - FOOT_H) / 2;

  // Rueda vertical del mouse -> desplazamiento horizontal
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (el.scrollHeight > el.clientHeight + 1) return; // si hay scroll vertical, se respeta
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Llevar el hito seleccionado a la zona visible que no tapa la ficha
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !selected) return;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const reserve = wide ? Math.min(480, el.clientWidth - 32) + 32 : 0;
    const free = el.clientWidth - reserve;
    const cx = x(selected.year);
    if (cx < el.scrollLeft + 80 || cx + itemWidth(selected) > el.scrollLeft + free - 40) {
      el.scrollTo({ left: cx - free / 2, behavior: "smooth" });
    }
  }, [selected, x]);

  // Al cambiar de línea, ir al primer hito de la que quedó visible
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) return void (firstRender.current = false);
    const el = scrollerRef.current;
    if (!el || selected || !items.length) return;
    el.scrollTo({ left: x(items[0].year) - 120, behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // El eje cambia de color con cada era (y se apaga en los extremos)
  const axisGradient = useMemo(() => {
    const pct = (year: number) => `${((x(year) / trackW) * 100).toFixed(2)}%`;
    const stops = eras.flatMap((e) => [`${e.tint}cc ${pct(e.from)}`, `${e.tint}cc ${pct(e.to)}`]);
    return `linear-gradient(90deg, transparent 0%, ${eras[0].tint}55 ${pct(eras[0].from - 4)}, ${stops.join(", ")}, transparent ${pct(eras[eras.length - 1].to + 8)})`;
  }, [x, trackW]);

  const ticks: number[] = [];
  for (let y = Math.ceil(minYear / 5) * 5; y <= maxYear; y += 5) {
    // sin marcas dentro de los tramos comprimidos (quedarían encimadas)
    if (!compressed.has(Math.floor((y - minYear) / BIN))) ticks.push(y);
  }

  const scrollToYear = (year: number) =>
    scrollerRef.current?.scrollTo({ left: x(year) - 40, behavior: "smooth" });

  return (
    <div
      ref={scrollerRef}
      className="scroll-x relative min-h-0 flex-1 cursor-grab overflow-auto active:cursor-grabbing"
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse" || (e.target as HTMLElement).closest("button")) return;
        drag.current = { x: e.clientX, left: e.currentTarget.scrollLeft, moved: false };
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        const dx = e.clientX - d.x;
        if (Math.abs(dx) > 4) d.moved = true;
        if (d.moved) e.currentTarget.scrollLeft = d.left - dx;
      }}
      onPointerUp={() => {
        suppressClick.current = !!drag.current?.moved;
        drag.current = null;
      }}
      onPointerLeave={() => (drag.current = null)}
      onClick={(e) => {
        if (suppressClick.current) return void (suppressClick.current = false);
        if (!(e.target as HTMLElement).closest("button")) onBackground();
      }}
    >
      <div className="relative select-none" style={{ width: trackW, height: contentH }}>
        {/* Eras: bandas de fondo + nombre arriba */}
        {eras.map((era, i) => (
          <div
            key={era.label}
            className="absolute inset-y-0 border-l"
            style={{
              left: x(era.from),
              width: x(era.to) - x(era.from),
              borderColor: `${era.tint}80`,
              // si la era queda angosta (p. ej. al filtrar), su nombre se corta en su propio borde
              overflow: "clip",
              // Cada era tiñe toda su franja con su color (más intenso arriba y abajo, algo menos en el eje)
              background: `linear-gradient(180deg, ${era.tint}${i % 2 ? "66" : "59"} 0%, ${era.tint}${i % 2 ? "3d" : "33"} 50%, ${era.tint}${i % 2 ? "59" : "4d"} 100%)`,
            }}
          >
            <button
              onClick={() => scrollToYear(era.from)}
              className="group/era sticky left-0 flex h-[52px] max-w-full items-center gap-2.5 whitespace-nowrap px-4 font-label text-[16px] uppercase text-paper/85 transition-colors hover:text-paper"
            >
              <span className="h-3 w-3 rotate-45 rounded-[3px]" style={{ background: era.tint, boxShadow: `0 0 12px ${era.tint}` }} />
              {era.label}
              <span
                className="rounded-full px-2 py-0.5 text-[14px] normal-case"
                style={{ color: era.tint, background: `${era.tint}22` }}
              >
                {era.from}–{era.to}
              </span>
            </button>
            {/* Nombre de la era en su propia franja al pie: no se cruza con los hitos */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center border-t"
              style={{ height: FOOT_H, borderColor: `${era.tint}55`, background: `${era.tint}26`, clipPath: "inset(0)" }}
            >
              <span
                className="sticky left-0 inline-block whitespace-nowrap px-5 font-display text-[28px] font-bold leading-none"
                style={{ color: era.tint }}
              >
                {era.label}
              </span>
            </div>
          </div>
        ))}

        {/* Eje */}
        <div
          className="absolute h-[4px] -translate-y-1/2 rounded-full"
          style={{
            top: axisY,
            left: 0,
            width: trackW,
            background: axisGradient,
            boxShadow: "0 0 18px 2px rgb(160 175 255 / 0.16)",
          }}
        />
        {ticks.map((y) => {
          const decade = y % 10 === 0;
          return (
            <div key={y} className="absolute" style={{ left: x(y), top: axisY }}>
              <div className={`-translate-x-1/2 rounded-full bg-paper/40 ${decade ? "h-4 w-[2px]" : "h-2 w-px"}`} />
              <span
                className={`absolute -translate-x-1/2 font-label ${
                  decade ? "top-5 text-[16px] text-paper/75" : "top-3.5 text-[12px] text-muted/70"
                }`}
              >
                {y}
              </span>
            </div>
          );
        })}

        {/* Cortes: tramos largos sin hitos, comprimidos */}
        {gaps.map((g) => (
          <div
            key={g.fromYear}
            className="absolute flex flex-col items-center"
            style={{ left: g.x, width: g.w, top: axisY - 12 }}
            title={`${g.fromYear}–${g.toYear}: sin hitos`}
          >
            <div
              className="h-6 w-full"
              style={{
                background: `linear-gradient(var(--color-night), var(--color-night)) center / 100% 8px no-repeat`,
              }}
            >
              <div
                className="mt-[10px] h-[4px] w-full rounded-full"
                style={{
                  background:
                    "repeating-linear-gradient(90deg, rgb(255 255 255 / 0.35) 0 10px, transparent 10px 18px)",
                }}
              />
            </div>
            <span className="mt-1.5 whitespace-nowrap rounded-full bg-night/80 px-2 font-label text-[13px] text-paper/70">
              ≈ {g.years} años
            </span>
          </div>
        ))}

        {/* Hitos */}
        {items.map((item) => {
          const t = tier.get(item.id) ?? 1;
          const color = colorOf.get(item.category)!;
          const cx = x(item.year);
          const cy = axisY - t * tierH;
          const isSelected = item.id === selected?.id;
          const isRelated = related.has(item.id);
          const isMatch = matches.has(item.id);
          const faded = !isMatch || (selected !== null && !isSelected && !isRelated);
          const opacity = faded ? (isMatch ? 0.4 : 0.12) : 1;
          const ring = isSelected
            ? `0 0 0 3.5px ${color}, 0 0 0 10px ${color}44`
            : isRelated
              ? `0 0 0 3px var(--color-night), 0 0 0 6px ${color}`
              : undefined;

          return (
            <div key={item.id} className="transition-opacity duration-300" style={{ opacity }}>
              {/* Tallo hasta el eje */}
              <div
                className="absolute w-[2px] -translate-x-1/2 transition-[top,height,left] duration-500 ease-out"
                style={{
                  left: cx,
                  top: t > 0 ? cy + AV / 2 : axisY,
                  height: Math.abs(t) * tierH - AV / 2,
                  background: `linear-gradient(${t > 0 ? "to bottom" : "to top"}, ${color}cc, ${color}33)`,
                }}
              />
              <div
                className="absolute h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[left] duration-500 ease-out"
                style={{
                  left: cx,
                  top: axisY,
                  background: color,
                  boxShadow: `0 0 0 3px var(--color-night), 0 0 14px 3px ${color}99`,
                }}
              />
              <button
                data-id={item.id}
                onClick={() => onSelect(item.id)}
                title={`${item.year} · ${item.title} — ${item.author}`}
                aria-pressed={isSelected}
                className="animate-rise group absolute z-10 hover:z-20 flex items-center gap-3 rounded-2xl text-left transition-[top,left] duration-500 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-paper/70"
                style={{ left: cx - AV / 2, top: cy - AV / 2 }}
              >
                <span
                  data-avatar
                  className="origin-[30px_50%] transition-transform duration-[420ms] ease-[cubic-bezier(0.34,1.7,0.5,1)] group-hover:-rotate-6 group-hover:scale-[1.18] group-focus-visible:scale-[1.18]"
                >
                  <Avatar item={item} color={color} size={AV} ring={ring} lifted />
                </span>
                {/* Tarjeta teñida con el color de la tradición */}
                <span
                  className="rounded-2xl border px-3.5 py-2 leading-tight shadow-[0_10px_24px_-12px_rgb(0_0_0/0.8)] backdrop-blur-[4px] transition-[background-color,border-color,transform] duration-300 group-hover:-translate-y-0.5"
                  style={{
                    background: isSelected ? `${color}38` : `color-mix(in srgb, ${color} 13%, rgb(15 17 28 / 0.88))`,
                    borderColor: isSelected ? color : `${color}55`,
                  }}
                >
                  <span className="flex items-baseline gap-2">
                    <span className="whitespace-nowrap font-display text-[19px] font-semibold text-paper">
                      {item.short}
                    </span>
                    <span
                      className="rounded-full px-1.5 font-label text-[14px] leading-[1.35]"
                      style={{ color: "var(--color-ink)", background: color }}
                    >
                      {item.year}
                    </span>
                  </span>
                  <span
                    className="mt-0.5 block truncate text-[13px] italic text-paper/70"
                    style={{ maxWidth: TITLE_MAX }}
                  >
                    {item.title}
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
