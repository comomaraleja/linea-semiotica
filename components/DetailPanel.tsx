"use client";

import { useState } from "react";
import { categories, type TimelineItem } from "@/data/timeline";
import Avatar from "./Avatar";
import ConceptChip, { bookUrl } from "./ConceptChip";

const catById = new Map(categories.map((c) => [c.id, c]));

interface Props {
  item: TimelineItem;
  /** Hitos que dialogan con este (en ambos sentidos), en orden cronológico */
  related: TimelineItem[];
  onSelect: (id: string) => void;
  /** Solo para aportes propios */
  onEdit?: () => void;
  onDelete?: () => void;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export default function DetailPanel({ item, related, onSelect, onEdit, onDelete, onClose, onPrev, onNext }: Props) {
  const cat = catById.get(item.category) ?? categories[0];
  const [confirming, setConfirming] = useState(false);
  const isEvent = item.kind === "acontecimiento";

  return (
    <article className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-3 border-b border-line px-5 py-3 text-xs">
          <span
            className="min-w-0 truncate whitespace-nowrap rounded-full px-2.5 py-1 font-medium"
            style={{ background: `${cat.color}33`, color: cat.ink }}
            title={cat.label}
          >
            {cat.label}
          </span>
          <span className="shrink-0 font-label text-[16px] text-muted">{item.year}</span>
          {item.custom && (
            <span className="shrink-0 whitespace-nowrap rounded-full border border-dashed border-paper/25 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
              Tu aporte
            </span>
          )}
          <div className="ml-auto flex shrink-0 gap-1">
            <NavButton label="Anterior" onClick={onPrev}>
              ←
            </NavButton>
            <NavButton label="Siguiente" onClick={onNext}>
              →
            </NavButton>
            <NavButton label="Cerrar" hint="Esc" onClick={onClose}>
              ✕
            </NavButton>
          </div>
      </div>

      {/* key: cada hito entra con un fundido suave */}
      <div key={item.id} className="animate-rise scroll-x min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-6">
      <header className="mb-5">
        <h2 id="detail-title" className="font-display text-[30px] font-semibold leading-[1.1] md:text-[36px]">
          {item.title}
        </h2>
        <div className="mt-3 flex items-center gap-3">
          <Avatar item={item} color={cat.ink} size={56} />
          <p className="text-[17px] font-semibold text-paper/80">{item.author || (isEvent ? "Acontecimiento" : "")}</p>
        </div>
      </header>

      {item.summary && <p className="whitespace-pre-line text-[17px] leading-relaxed text-paper/90">{item.summary}</p>}

      <ul className="mt-5 flex flex-wrap gap-2 empty:hidden">
        {item.concepts.map((c) => (
          <ConceptChip key={c} concept={c} item={item} color={cat.color} ink={cat.ink} />
        ))}
      </ul>

      {item.gameDesign && (
      <section
        className="mt-6 rounded-lg border-l-[3px] p-5"
        style={{ borderColor: cat.color, background: `${cat.color}1f` }}
      >
        <h3 className="mb-2 font-label text-[15px] uppercase" style={{ color: cat.ink }}>
          🎮 En el diseño de videojuegos
        </h3>
        <p className="whitespace-pre-line text-[16.5px] leading-relaxed">{item.gameDesign}</p>
      </section>
      )}

      {related.length > 0 && (
        <section className="mt-7">
          <h3 className="mb-3 font-label text-[15px] uppercase text-muted">💬 Dialoga con</h3>
          <div className="flex flex-wrap gap-2">
            {related.map((r) => {
              const rc = catById.get(r.category) ?? cat;
              return (
                <button
                  key={r.id}
                  onClick={() => onSelect(r.id)}
                  className="flex items-center gap-2 rounded-lg border border-line bg-white/50 px-3 py-2 text-left text-sm transition-colors hover:border-paper/40 hover:bg-white"
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: rc.color }} />
                  <span className="font-label text-[13px] text-muted">{r.year}</span>
                  <span>{r.short}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {item.reference && (
        <footer className="mt-7 border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
          <a
            href={bookUrl(item)}
            target="_blank"
            rel="noopener noreferrer"
            title="Buscar la obra en Google Libros"
            className="underline decoration-paper/20 underline-offset-[3px] transition-colors hover:text-paper hover:decoration-paper/60"
          >
            {item.reference} <span aria-hidden>↗</span>
          </a>
        </footer>
      )}

      {item.custom && onEdit && onDelete && (
        <div className="mt-6 flex items-center gap-2 border-t border-line pt-4">
          {confirming ? (
            <>
              <span className="mr-auto text-sm text-paper/80">¿Eliminar este aporte?</span>
              <button
                onClick={() => setConfirming(false)}
                className="rounded-md border border-line px-3 py-1.5 text-sm text-paper/80 hover:bg-paper/[0.06]"
              >
                Cancelar
              </button>
              <button
                onClick={onDelete}
                className="rounded-md bg-[#c2413b] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#a83530]"
              >
                Eliminar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="rounded-md border border-line px-3 py-1.5 text-sm text-paper hover:border-paper/40 hover:bg-paper/[0.06]"
              >
                Editar
              </button>
              <button
                onClick={() => setConfirming(true)}
                className="rounded-md px-3 py-1.5 text-sm text-muted hover:text-[#c2413b]"
              >
                Eliminar
              </button>
            </>
          )}
        </div>
      )}
      </div>
    </article>
  );
}

function NavButton({
  label,
  hint = "flechas del teclado",
  onClick,
  children,
}: {
  label: string;
  hint?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      aria-label={label}
      title={`${label} (${hint})`}
      className="grid h-7 w-7 place-items-center rounded-md border border-line text-paper/80 transition-colors hover:bg-paper/[0.07] disabled:opacity-30"
    >
      {children}
    </button>
  );
}
