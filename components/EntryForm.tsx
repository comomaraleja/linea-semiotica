"use client";

import { useMemo, useRef, useState } from "react";
import { categories, type CategoryId, type TimelineItem } from "@/data/timeline";
import { resizeImage } from "@/lib/custom";
import Avatar from "./Avatar";

const catById = new Map(categories.map((c) => [c.id, c]));

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/** Etiqueta corta sugerida: apellido(s) del autor o el comienzo del título. */
function suggestShort(kind: "autor" | "acontecimiento", author: string, title: string) {
  if (kind === "autor" && author.trim()) {
    return author
      .replace(/\(eds?\.\)/g, "")
      .split(/\s+y\s+/)
      .map((n) => n.trim().split(/\s+/).pop())
      .filter(Boolean)
      .join(" y ");
  }
  const t = title.trim();
  return t.length > 24 ? `${t.slice(0, 22).trim()}…` : t;
}

interface Props {
  /** Si viene, se edita ese aporte */
  initial?: TimelineItem;
  /** Todos los hitos, para elegir con cuáles dialoga */
  all: TimelineItem[];
  defaultCategory?: CategoryId;
  customCount: number;
  /** Dónde se guardan: archivos .mdx del proyecto o el navegador */
  store: "archivos" | "navegador";
  onSave: (item: Omit<TimelineItem, "id"> & { id?: string }) => void;
  onCancel: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

export default function EntryForm({
  initial,
  all,
  defaultCategory,
  customCount,
  store,
  onSave,
  onCancel,
  onExport,
  onImport,
}: Props) {
  const [kind, setKind] = useState<"autor" | "acontecimiento">(initial?.kind ?? "autor");
  const [year, setYear] = useState(initial ? String(initial.year) : "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [author, setAuthor] = useState(initial?.author ?? "");
  const [short, setShort] = useState(initial?.short ?? "");
  const [shortTouched, setShortTouched] = useState(!!initial);
  const [category, setCategory] = useState<CategoryId>(initial?.category ?? defaultCategory ?? "semiotica");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [concepts, setConcepts] = useState(initial?.concepts.join(", ") ?? "");
  const [gameDesign, setGameDesign] = useState(initial?.gameDesign ?? "");
  const [related, setRelated] = useState<string[]>(initial?.related ?? []);
  const [reference, setReference] = useState(initial?.reference ?? "");
  const [photo, setPhoto] = useState(initial?.photo ?? "");
  const [relQuery, setRelQuery] = useState("");
  const [error, setError] = useState("");
  const [tried, setTried] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const shortValue = shortTouched ? short : suggestShort(kind, author, title);
  const yearNum = Number(year);
  const yearOk = year.trim() !== "" && Number.isInteger(yearNum) && yearNum >= 1500 && yearNum <= 2100;
  const titleOk = title.trim() !== "";
  const authorOk = kind === "acontecimiento" || author.trim() !== "";
  const cat = catById.get(category)!;

  const byId = useMemo(() => new Map(all.map((i) => [i.id, i])), [all]);
  const suggestions = useMemo(() => {
    const q = normalize(relQuery.trim());
    if (!q) return [];
    return all
      .filter((i) => i.id !== initial?.id && !related.includes(i.id))
      .filter((i) => normalize(`${i.short} ${i.author} ${i.title} ${i.year}`).includes(q))
      .slice(0, 6);
  }, [relQuery, all, related, initial?.id]);

  // Vista previa del avatar con los datos actuales
  const preview: TimelineItem = {
    id: initial?.id ?? "preview",
    year: yearNum || 0,
    title,
    author,
    short: shortValue,
    category,
    summary,
    concepts: [],
    gameDesign,
    related: [],
    reference,
    kind,
    custom: true,
    photo: photo || undefined,
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (!yearOk || !titleOk || !authorOk) {
      setError("Completá los campos marcados.");
      return;
    }
    onSave({
      id: initial?.id,
      kind,
      year: yearNum,
      title: title.trim(),
      author: author.trim(),
      short: shortValue.trim() || title.trim(),
      category,
      summary: summary.trim(),
      concepts: concepts
        .split(/[,;\n]/)
        .map((c) => c.trim())
        .filter(Boolean),
      gameDesign: gameDesign.trim(),
      prompt: initial?.prompt, // se conserva si venía de antes
      related,
      reference: reference.trim(),
      photo: photo || undefined,
      custom: true,
    });
  };

  const pickPhoto = async (file?: File) => {
    if (!file) return;
    try {
      setPhoto(await resizeImage(file));
      setError("");
    } catch {
      setError("No se pudo leer esa imagen. Probá con un JPG o PNG.");
    }
  };

  return (
    <form onSubmit={submit} className="flex h-full flex-col" noValidate>
      <div className="flex shrink-0 items-center gap-3 border-b border-line px-5 py-3">
        <h2 id="detail-title" className="font-display text-lg font-semibold leading-none">
          {initial ? "Editar aporte" : "Agregar a la línea"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cerrar"
          className="ml-auto grid h-7 w-7 place-items-center rounded-md border border-line text-paper/80 transition-colors hover:bg-paper/[0.07]"
        >
          ✕
        </button>
      </div>

      <div className="animate-rise scroll-x min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 md:px-6">
        {/* Tipo */}
        <div className="grid grid-cols-2 gap-1 rounded-lg border border-line p-1" role="radiogroup" aria-label="Tipo">
          {(
            [
              ["autor", "Autor / obra"],
              ["acontecimiento", "Acontecimiento"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={kind === k}
              onClick={() => setKind(k)}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors duration-200 ${
                kind === k ? "bg-paper/10 text-paper" : "text-muted hover:text-paper"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Foto + año + título */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              title="Elegir imagen"
              className="rounded-full transition-transform hover:scale-105"
            >
              <Avatar item={preview} color={cat.ink} size={60} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => pickPhoto(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => (photo ? setPhoto("") : fileRef.current?.click())}
              className="text-[11px] text-muted hover:text-paper"
            >
              {photo ? "Quitar foto" : "Subir foto"}
            </button>
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <Field label="Año" invalid={tried && !yearOk} hint={tried && !yearOk ? "Entre 1500 y 2100" : undefined}>
              <input
                inputMode="numeric"
                value={year}
                onChange={(e) => setYear(e.target.value.replace(/[^\d-]/g, ""))}
                placeholder="1984"
                className="input w-28 tabular-nums"
              />
            </Field>
            <Field label={kind === "autor" ? "Título de la obra" : "Acontecimiento"} invalid={tried && !titleOk}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={kind === "autor" ? "Ej.: Mitologías" : "Ej.: Lanzamiento de Pong"}
                className="input"
              />
            </Field>
          </div>
        </div>

        <Field
          label={kind === "autor" ? "Autor/a" : "Protagonistas (opcional)"}
          invalid={tried && !authorOk}
          hint={kind === "autor" ? "Para dos autores: «Nombre Apellido y Nombre Apellido»" : undefined}
        >
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder={kind === "autor" ? "Ej.: Roland Barthes" : "Ej.: Atari"}
            className="input"
          />
        </Field>

        <Field label="Etiqueta en la línea" hint="Se completa sola; podés cambiarla">
          <input
            value={shortValue}
            onChange={(e) => {
              setShort(e.target.value);
              setShortTouched(true);
            }}
            maxLength={28}
            className="input"
          />
        </Field>

        <Field label="Línea" group>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => {
              const on = c.id === category;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  aria-pressed={on}
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                    on ? "text-paper" : "border-line text-muted hover:text-paper"
                  }`}
                  style={on ? { borderColor: c.color, background: `${c.color}26` } : undefined}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                  {c.label}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Resumen">
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={4}
            placeholder="¿Qué plantea? ¿Por qué importa?"
            className="input resize-y"
          />
        </Field>

        <Field label="Conceptos clave" hint="Separados por comas">
          <input
            value={concepts}
            onChange={(e) => setConcepts(e.target.value)}
            placeholder="Mito, connotación, naturalización"
            className="input"
          />
        </Field>

        <Field label="En el diseño de videojuegos">
          <textarea
            value={gameDesign}
            onChange={(e) => setGameDesign(e.target.value)}
            rows={3}
            placeholder="¿Cómo sirve para diseñar o analizar un juego?"
            className="input resize-y"
          />
        </Field>


        <Field label="Dialoga con" group>
          {related.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {related.map((id) => {
                const r = byId.get(id);
                if (!r) return null;
                return (
                  <span
                    key={id}
                    className="flex items-center gap-1.5 rounded-full border border-line py-0.5 pl-2 pr-1 text-xs"
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: catById.get(r.category)?.color }} />
                    <span className="font-label text-[13px] text-muted">{r.year}</span> {r.short}
                    <button
                      type="button"
                      onClick={() => setRelated(related.filter((x) => x !== id))}
                      aria-label={`Quitar ${r.short}`}
                      className="grid h-4 w-4 place-items-center rounded-full text-muted hover:bg-paper/10 hover:text-paper"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}
          <div className="relative">
            <input
              value={relQuery}
              onChange={(e) => setRelQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (suggestions[0]) {
                    setRelated([...related, suggestions[0].id]);
                    setRelQuery("");
                  }
                }
              }}
              placeholder="Buscar autor u obra…"
              className="input"
            />
            {suggestions.length > 0 && (
              <ul className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-lg border border-line bg-white shadow-xl">
                {suggestions.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setRelated([...related, s.id]);
                        setRelQuery("");
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-paper/[0.06]"
                    >
                      <span className="h-2 w-2 rounded-full" style={{ background: catById.get(s.category)?.color }} />
                      <span className="font-label text-[13px] text-muted">{s.year}</span>
                      <span>{s.short}</span>
                      <span className="truncate text-muted">· {s.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Field>

        <Field label="Referencia">
          <input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Apellido, N. (año). Título. Editorial."
            className="input"
          />
        </Field>

        {/* Respaldo de aportes */}
        <div className="rounded-lg border border-dashed border-line p-3 text-xs leading-relaxed text-muted">
          {store === "archivos" ? (
            <>
              Tus aportes ({customCount}) se guardan como archivos <code className="font-label">.mdx</code> en{" "}
              <code className="font-label">content/aportes/</code> de este proyecto. Para pasárselos a otra persona:{" "}
            </>
          ) : (
            <>
              Tus aportes ({customCount}) se guardan en este navegador. Para no perderlos o pasarlos a otra
              computadora:{" "}
            </>
          )}
          <button type="button" onClick={onExport} className="text-paper underline-offset-2 hover:underline">
            Exportar
          </button>{" "}
          ·{" "}
          <button
            type="button"
            onClick={() => importRef.current?.click()}
            className="text-paper underline-offset-2 hover:underline"
          >
            Importar
          </button>
          <input
            ref={importRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImport(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 border-t border-line px-5 py-3">
        {error && <p className="mr-auto text-xs text-[#c2413b]">{error}</p>}
        <button
          type="button"
          onClick={onCancel}
          className="ml-auto rounded-md px-3 py-1.5 text-sm text-muted hover:text-paper"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-md px-4 py-1.5 text-sm font-medium text-ink transition-opacity hover:opacity-90"
          style={{ background: cat.color }}
        >
          {initial ? "Guardar cambios" : "Agregar a la línea"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  invalid,
  group,
  children,
}: {
  label: string;
  hint?: string;
  invalid?: boolean;
  /** Contiene varios controles: se usa un contenedor en vez de <label> */
  group?: boolean;
  children: React.ReactNode;
}) {
  const Tag = group ? "div" : "label";
  return (
    <Tag className="block" data-invalid={invalid || undefined} {...(group ? { role: "group", "aria-label": label } : {})}>
      <span className={`mb-1.5 block font-label text-[13px] uppercase ${invalid ? "text-[#c2413b]" : "text-paper/80"}`}>
        {label}
      </span>
      {children}
      {hint && <span className={`mt-1 block text-[11px] ${invalid ? "text-[#c2413b]" : "text-muted"}`}>{hint}</span>}
    </Tag>
  );
}
