import type { TimelineItem } from "@/data/timeline";

const enc = encodeURIComponent;

/** Nombre con el que se busca: el autor (sin "(ed.)") o, si es un acontecimiento sin autor, el título. */
const nameOf = (item: TimelineItem) => item.author.replace(/\s*\(eds?\.\)/g, "").trim() || item.title;

/** Búsqueda de la obra en Google Libros, a partir de la referencia (o título + autor). */
export const bookUrl = (item: TimelineItem) =>
  `https://www.google.com/search?tbm=bks&q=${enc(item.reference || `${item.title} ${item.author}`)}`;

interface Props {
  concept: string;
  item: TimelineItem;
  color: string;
  ink: string;
}

/** Etiqueta de concepto: abre Google con el concepto y el nombre del autor o acontecimiento. */
export default function ConceptChip({ concept, item, color, ink }: Props) {
  const query = `${concept} ${nameOf(item)}`;
  return (
    <li>
      <a
        href={`https://www.google.com/search?q=${enc(query)}`}
        target="_blank"
        rel="noopener noreferrer"
        title={`Buscar en Google: ${query}`}
        className="tag-chip flex items-center gap-1.5 rounded-full border px-3 py-1 text-[14px] font-medium"
        style={{ borderColor: `${color}88`, background: `${color}24`, color: ink }}
      >
        {concept}
        <span aria-hidden className="text-[11px] opacity-60">
          ↗
        </span>
      </a>
    </li>
  );
}
