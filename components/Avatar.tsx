import avatars from "@/data/avatars.json";
import type { TimelineItem } from "@/data/timeline";

const photos = avatars as Record<string, { src: string; credit: string }>;

/** Personas detrás de cada hito (por defecto, el id del hito). */
const peopleByItem: Record<string, string[]> = {
  "eco-tratado": ["eco"],
  "eco-lector": ["eco"],
  "frasca-1999": ["frasca"],
  "game-studies": ["aarseth"],
  "lakoff-johnson": ["lakoff", "johnson"],
  "laclau-mouffe": ["laclau", "mouffe"],
  "kress-van-leeuwen": ["kress", "van-leeuwen"],
  "salen-zimmerman": ["salen", "zimmerman"],
  "veron-mediatizacion": ["veron"],
  "cassell-jenkins": ["cassell", "jenkins"],
};

export const peopleOf = (item: TimelineItem) => peopleByItem[item.id] ?? [item.id];

/** "Gunther Kress y Theo van Leeuwen" -> ["GK", "TL"] */
function initialsOf(item: TimelineItem) {
  return item.author
    .replace(/\(ed\.\)/g, "")
    .split(/\s+y\s+/)
    .map((name) => {
      // Se descuentan artículos árabes ("al-Jāḥiẓ" -> "J") y signos iniciales como ʿ
      const words = name
        .trim()
        .split(/\s+/)
        .map((w) => w.replace(/^(al|el|ad|an|ar|as|ash|at|az)-/i, "").replace(/^[^\p{L}ʿʾ]*[ʿʾ]?/u, ""))
        .filter((w) => /^\p{Lu}/u.test(w) && !/^(Ibn|Bin|Abū|Abu)$/.test(w));
      const first = words[0]?.[0] ?? name.trim()[0] ?? "?";
      const last = words.length > 1 ? words[words.length - 1][0] : "";
      return (first + last).toUpperCase();
    });
}

interface Props {
  item: TimelineItem;
  color: string;
  size?: number;
  /** Anillo exterior: grosor y color (permite marcar selección / relación) */
  ring?: string;
  /** Sombra y halo de color: da volumen sobre el mapa oscuro */
  lifted?: boolean;
}

/** Retrato circular (o dos superpuestos si el hito es de dos autores). */
export default function Avatar({ item, color, size = 40, ring, lifted = false }: Props) {
  const shadow = [
    ring ?? `0 0 0 ${size >= 50 ? 3 : 2}px ${color}`,
    lifted ? `0 10px 18px -6px rgb(0 0 0 / 0.7), 0 0 22px -2px ${color}55` : "0 4px 10px -4px rgb(0 0 0 / 0.25)",
  ].join(", ");
  // Acontecimiento: marcador en rombo (o su imagen, si tiene)
  if (item.kind === "acontecimiento") {
    return (
      <span className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
        <span
          className="absolute overflow-hidden rounded-[22%] bg-panel transition-shadow duration-300"
          style={{
            width: size * 0.78,
            height: size * 0.78,
            transform: "rotate(45deg)",
            boxShadow: shadow,
          }}
        >
          {item.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.photo}
              alt=""
              draggable={false}
              className="h-full w-full scale-[1.42] -rotate-45 object-cover"
            />
          ) : (
            <span className="block h-full w-full" style={{ background: `${color}2e` }} />
          )}
        </span>
        {!item.photo && (
          <span className="relative font-semibold" style={{ color, fontSize: size * 0.34 }}>
            ✦
          </span>
        )}
      </span>
    );
  }

  const people = item.photo ? [item.id] : peopleOf(item);
  const initials = initialsOf(item);
  const overlap = Math.round(size * 0.6);

  return (
    <span className="relative flex shrink-0" style={{ height: size, width: size + (people.length - 1) * overlap }}>
      {people.map((slug, i) => {
        const photo = item.photo ? { src: item.photo } : photos[slug];
        return (
          <span
            key={slug + i}
            className="absolute top-0 grid place-items-center overflow-hidden rounded-full bg-panel transition-shadow duration-300"
            style={{
              left: i * overlap,
              width: size,
              height: size,
              zIndex: people.length - i,
              boxShadow: shadow,
            }}
          >
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo.src}
                alt=""
                loading="lazy"
                draggable={false}
                className="h-full w-full object-cover object-top grayscale-[35%]"
              />
            ) : (
              <span
                className="grid h-full w-full place-items-center font-semibold tracking-tight"
                style={{ background: `${color}2e`, color, fontSize: size * 0.34 }}
              >
                {initials[i] ?? initials[0]}
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
