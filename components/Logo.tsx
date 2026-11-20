/**
 * Logo animado a partir del ícono carbon:network-4 (IBM Carbon, Apache 2.0, vía Iconify).
 * El trazado original queda intacto; encima se animan señales que viajan por las
 * conexiones y nodos que se encienden con los colores de las tradiciones.
 */

const CORAL = "#ff7a59";
const SKY = "#5ab0ff";
const SAFFRON = "#ffc94a";
const LAVENDER = "#b392ff";
const MINT = "#3ddc97";

const DUR = "3.2s";

/** Relleno del hueco de un nodo que se enciende cuando llega la señal. */
function Hub({ cx, cy, color, at }: { cx: number; cy: number; color: string; at: number }) {
  // `at`: momento (0–1 del ciclo) en que se enciende
  const a = Math.max(0, at - 0.02);
  const b = Math.min(0.999, at + 0.16);
  return (
    <circle cx={cx} cy={cy} r={2.1} fill={color} opacity={0}>
      <animate
        attributeName="opacity"
        dur={DUR}
        repeatCount="indefinite"
        keyTimes={`0;${a};${at};${b};1`}
        values="0;0;1;0;0"
      />
    </circle>
  );
}

/** Chispa que recorre una conexión. */
function Spark({ path, color, begin }: { path: string; color: string; begin: string }) {
  return (
    <circle r={1.3} fill={color}>
      <animateMotion dur={DUR} begin={begin} repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;0.45;1" calcMode="linear" path={path} />
      <animate
        attributeName="opacity"
        dur={DUR}
        begin={begin}
        repeatCount="indefinite"
        keyTimes="0;0.05;0.42;0.47;1"
        values="0;1;1;0;0"
      />
    </circle>
  );
}

/** Punto suelto que titila. */
function Twinkle({ cx, cy, color, begin }: { cx: number; cy: number; color: string; begin: string }) {
  return (
    <circle cx={cx} cy={cy} r={2} fill={color}>
      <animate attributeName="opacity" dur={DUR} begin={begin} repeatCount="indefinite" values="0.35;1;0.35" />
      <animate attributeName="r" dur={DUR} begin={begin} repeatCount="indefinite" values="2;2.5;2" />
    </circle>
  );
}

export default function Logo({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label="Signos en juego"
      className={`shrink-0 overflow-visible ${className}`}
    >
      {/* Ícono original */}
      <path
        fill="currentColor"
        d="M28 12a3.996 3.996 0 0 0-3.858 3h-4.284a3.966 3.966 0 0 0-5.491-2.643l-3.177-3.97A3.96 3.96 0 0 0 12 6a4 4 0 1 0-4 4a4 4 0 0 0 1.634-.357l3.176 3.97a3.924 3.924 0 0 0 0 4.774l-3.176 3.97A4 4 0 0 0 8 22a4 4 0 1 0 4 4a3.96 3.96 0 0 0-.81-2.387l3.176-3.97A3.966 3.966 0 0 0 19.858 17h4.284A3.993 3.993 0 1 0 28 12M6 6a2 2 0 1 1 2 2a2 2 0 0 1-2-2m2 22a2 2 0 1 1 2-2a2 2 0 0 1-2 2m8-10a2 2 0 1 1 2-2a2 2 0 0 1-2 2m12 0a2 2 0 1 1 2-2a2 2 0 0 1-2 2"
      />

      {/* Puntos sueltos en color: versión quieta, solo con «reducir movimiento» */}
      <g className="logo-still">
        <circle cx={21} cy={6} r={2} fill={SAFFRON} />
        <circle cx={4} cy={16} r={2} fill={CORAL} />
        <circle cx={21} cy={26} r={2} fill={MINT} />
      </g>

      {/* Todo lo animado vive acá: con «reducir movimiento» se oculta */}
      <g className="logo-motion">
        <Twinkle cx={21} cy={6} color={SAFFRON} begin="0s" />
        <Twinkle cx={4} cy={16} color={CORAL} begin="-1.07s" />
        <Twinkle cx={21} cy={26} color={MINT} begin="-2.13s" />

        {/* Señales: de los nodos de la izquierda al centro, y del centro a la derecha */}
        <Spark path="M8 6 L16 16" color={CORAL} begin="0s" />
        <Spark path="M8 26 L16 16" color={SKY} begin="-0.4s" />
        <Spark path="M16 16 L28 16" color={LAVENDER} begin="-1.6s" />

        {/* Nodos que se encienden al recibir la señal */}
        <Hub cx={8} cy={6} color={CORAL} at={0.03} />
        <Hub cx={8} cy={26} color={SKY} at={0.8} />
        <Hub cx={16} cy={16} color={LAVENDER} at={0.46} />
        <Hub cx={28} cy={16} color={MINT} at={0.93} />
      </g>
    </svg>
  );
}
