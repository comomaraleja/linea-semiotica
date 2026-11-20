"use client";

import { useEffect, useRef, useState } from "react";
import { categories, eras } from "@/data/timeline";
import Logo from "./Logo";

interface Props {
  open: boolean;
  count: number;
  from: number;
  to: number;
  onClose: () => void;
  onStart: () => void;
}

const NUM: Record<number, string> = { 3: "Tres", 4: "Cuatro", 5: "Cinco", 6: "Seis", 7: "Siete", 8: "Ocho", 9: "Nueve", 10: "Diez" };

/** "¿De qué se trata?": presentación en pasos, centrada sobre el mapa. */
export default function AboutCarousel({ open, count, from, to, onClose, onStart }: Props) {
  const [step, setStep] = useState(0);
  const nextRef = useRef<HTMLButtonElement>(null);

  const slides = [
    {
      key: "hola",
      art: (
        <div className="grid h-28 w-28 place-items-center rounded-[28px] bg-night shadow-[0_18px_40px_-14px_rgb(0_0_0/0.6)]">
          <Logo size={76} className="text-[#f3ead8]" />
        </div>
      ),
      title: "Las ideas que hacen hablar a los juegos",
      body: (
        <p>
          <strong className="font-semibold">Signos en juego</strong> es una línea de tiempo de las teorías que sirven
          para pensar los videojuegos como formas de producir sentido: qué significan sus imágenes y sus reglas, qué
          relatos cuentan, qué discursos ponen a circular y qué lugar le dan a quien juega.
        </p>
      ),
    },
    {
      key: "fichas",
      art: (
        <div className="relative h-28 w-44">
          <span className="absolute left-2 top-3 h-24 w-32 -rotate-6 rounded-xl bg-[#ffc94a] shadow-md" />
          <span className="absolute left-8 top-1 h-24 w-32 rotate-3 rounded-xl bg-[#5ab0ff] shadow-md" />
          <span className="absolute left-14 top-2 grid h-24 w-32 rotate-[-1deg] place-items-center rounded-xl bg-white font-label text-[30px] text-card-ink shadow-lg">
            {count}
          </span>
        </div>
      ),
      title: `${count} hitos, de ${from} a ${to}`,
      body: (
        <p>
          Desde la tradición árabe clásica, Peirce y Saussure hasta los debates actuales sobre retórica procedimental, representación y formas de
          jugar a contrapelo. Cada ficha resume el aporte, sus conceptos clave, <strong className="font-semibold">cómo
          se aplica al diseño y al análisis de videojuegos</strong> y con qué otros hitos dialoga.
        </p>
      ),
    },
    {
      key: "tradiciones",
      art: (
        <div className="flex items-end gap-2.5">
          {categories.map((c, i) => (
            <span
              key={c.id}
              className="block w-7 rounded-full"
              style={{ background: c.color, height: 44 + ((i * 23) % 52), boxShadow: `0 8px 20px -8px ${c.color}` }}
            />
          ))}
        </div>
      ),
      title: `${NUM[categories.length] ?? categories.length} tradiciones, una sola línea`,
      body: (
        <ul className="space-y-2.5">
          {categories.map((c) => (
            <li key={c.id} className="flex gap-3">
              <span
                className="mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full"
                style={{ background: c.color, boxShadow: `0 0 0 3px ${c.color}40` }}
              />
              <span>
                <span className="font-semibold" style={{ color: c.ink }}>
                  {c.label}.
                </span>{" "}
                <span className="text-paper/80">{c.description}</span>
              </span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: "mapa",
      art: (
        <div className="flex h-28 w-48 overflow-hidden rounded-2xl shadow-lg">
          {eras.map((e) => (
            <span key={e.label} className="flex-1" style={{ background: e.tint }} />
          ))}
        </div>
      ),
      title: "Cómo leer el mapa",
      body: (
        <dl className="space-y-3">
          <Legend
            mark={
              <span className="flex gap-0.5">
                {eras.map((e) => (
                  <span key={e.label} className="h-5 w-2 rounded-sm" style={{ background: e.tint }} />
                ))}
              </span>
            }
            term="Colores de fondo"
            text="Las eras: momentos en que ciertas preguntas dominaron el campo."
          />
          <Legend
            mark={
              <span
                className="h-6 w-6 rounded-full bg-card"
                style={{ boxShadow: "0 0 0 2px var(--color-card), 0 0 0 4px #1f62a8" }}
              />
            }
            term="Anillo"
            text="Con una ficha abierta, marca los hitos con los que dialoga."
          />
          <Legend
            mark={<span className="h-5 w-5 rotate-45 rounded-[4px] border-[2.5px] border-[#127a4f] bg-[#3ddc9740]" />}
            term="Rombo"
            text="Un acontecimiento (un juego, un hecho), en lugar de una obra teórica."
          />
          <Legend
            mark={<span className="font-label text-[18px] text-muted">↕</span>}
            term="Arriba o abajo"
            text="Solo para que no se pisen: la altura no significa nada."
          />
        </dl>
      ),
    },
    {
      key: "usar",
      art: <div className="text-[64px] leading-none">🕹️</div>,
      title: "¡A jugar!",
      body: (
        <ul className="space-y-2.5">
          <Tip icon="👆">Tocá un autor para abrir su ficha.</Tip>
          <Tip icon="↔️">Arrastrá, usá la rueda del mouse o las flechas ← → para moverte.</Tip>
          <Tip icon="🎨">Elegí una tradición arriba para ver solo esa línea.</Tip>
          <Tip icon="➕">Con «Agregar» sumás tus propios autores y acontecimientos.</Tip>
        </ul>
      ),
    },
  ];

  const last = step === slides.length - 1;
  const go = (i: number) => setStep(Math.max(0, Math.min(slides.length - 1, i)));

  // Cada vez que se abre, empieza desde el primer paso
  useEffect(() => {
    if (open) {
      setStep(0);
      const t = setTimeout(() => nextRef.current?.focus(), 350);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Teclado: ← → para avanzar, Esc para cerrar
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") (last ? onStart : () => go(step + 1))();
      if (e.key === "ArrowLeft") go(step - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div
      data-open={open}
      aria-hidden={!open}
      inert={!open}
      className="about-overlay fixed inset-0 z-[60] grid place-items-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
        className="about-card paper relative flex max-h-[min(640px,92dvh)] w-full max-w-[560px] flex-col overflow-hidden rounded-[28px]"
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-paper/[0.06] text-paper/70 transition-colors hover:bg-paper/[0.12] hover:text-paper"
        >
          ✕
        </button>

        {/* Carrusel */}
        <div className="min-h-0 flex-1 overflow-hidden">
          <div
            className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
            style={{ transform: `translateX(-${step * 100}%)` }}
          >
            {slides.map((s, i) => (
              <section
                key={s.key}
                aria-hidden={i !== step}
                inert={i !== step}
                className="scroll-x flex h-full w-full shrink-0 flex-col overflow-y-auto px-7 pb-4 pt-9 md:px-10"
              >
                <div className="mb-6 flex h-32 shrink-0 items-center justify-center">{s.art}</div>
                <h2
                  id={i === step ? "about-title" : undefined}
                  className="mb-4 text-center font-display text-[28px] font-bold leading-[1.1] md:text-[32px]"
                >
                  {s.title}
                </h2>
                <div className="text-[16.5px] leading-relaxed text-paper/90">{s.body}</div>
              </section>
            ))}
          </div>
        </div>

        {/* Navegación */}
        <div className="flex shrink-0 items-center gap-3 border-t border-line px-6 py-4">
          <button
            onClick={() => go(step - 1)}
            disabled={step === 0}
            className="whitespace-nowrap rounded-full px-3 py-2 text-[15px] font-medium text-paper/70 md:px-4 transition-colors hover:bg-paper/[0.06] hover:text-paper disabled:pointer-events-none disabled:opacity-0"
          >
            ← Anterior
          </button>

          <div className="mx-auto flex items-center gap-2" role="tablist" aria-label="Pasos">
            {slides.map((s, i) => (
              <button
                key={s.key}
                role="tab"
                aria-selected={i === step}
                aria-label={`Paso ${i + 1}`}
                onClick={() => go(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === step ? "w-7 bg-paper" : "w-2.5 bg-paper/25 hover:bg-paper/50"
                }`}
              />
            ))}
          </div>

          <button
            ref={nextRef}
            onClick={last ? onStart : () => go(step + 1)}
            className={`tag-chip whitespace-nowrap rounded-full px-4 py-2.5 text-[15px] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-card-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-card md:px-5 ${
              last ? "bg-[#ff7a59] text-ink shadow-[0_8px_22px_-8px_#ff7a59]" : "bg-card-ink text-card"
            }`}
          >
            {last ? "Empezar a recorrer →" : "Siguiente →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Legend({ mark, term, text }: { mark: React.ReactNode; term: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <dt className="grid h-6 w-12 shrink-0 place-items-center">{mark}</dt>
      <dd>
        <span className="font-semibold">{term}.</span> <span className="text-paper/80">{text}</span>
      </dd>
    </div>
  );
}

function Tip({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 rounded-2xl bg-paper/[0.05] px-4 py-2.5">
      <span className="text-[20px] leading-none">{icon}</span>
      <span>{children}</span>
    </li>
  );
}
