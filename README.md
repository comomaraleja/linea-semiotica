# Signos en juego

Prototipo de línea de tiempo interactiva de semiótica, estudios del discurso, narratología y game studies aplicados al desarrollo de videojuegos.

La revisión general del contenido está pendiente, asi como la relacion entre las lineas de estudios del lenguaje con la linea videojuegos.

Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS 4.

## Correr

```bash
npm install
npm run dev      # http://localhost:3000
```

## Estructura

```
data/timeline.ts         ← todo el contenido: categorías, eras e hitos
components/Timeline.tsx  ← estado: selección, filtros, búsqueda, teclado, #hash
components/Overview.tsx  ← el mapa: carriles a pantalla completa (una fila por categoría)
components/DetailPanel.tsx ← ficha del hito, que se abre como diálogo flotante sobre el mapa
app/                     ← layout, página y estilos globales
```

## Agregar un hito

Sumá un objeto a `timeline` en `data/timeline.ts`:

```ts
{
  id: "mi-hito",            // único; también sirve como enlace: /#mi-hito
  year: 2020,
  title: "Título de la obra",
  author: "Autora",
  short: "Autora",          // etiqueta corta para la vista completa
  category: "semiotica",    // semiotica | discurso | narratologia | juego
  summary: "…",
  concepts: ["…"],
  gameDesign: "…",          // la aplicación al diseño de videojuegos
  prompt: "…",              // opcional: pregunta para el propio proyecto
  related: ["bogost"],      // ids con los que dialoga (se resaltan con anillo)
  reference: "…",
}
```

Los carriles reacomodan las etiquetas solos para que no se pisen. Si agregás una categoría nueva, sumala a `categories` con su color.

## Interacción

- Clic en un punto: abre la ficha como diálogo dentro del mapa, del lado opuesto al punto para no taparlo.
- Clic en una zona vacía del mapa, ✕ o Esc: cierra la ficha.
- ← →: recorre los hitos en orden cronológico (respeta filtros y búsqueda).
- Chips de categoría: muestran u ocultan carriles.
- Búsqueda: filtra por autor, título, concepto o texto (ignora tildes).
- La URL guarda el hito abierto (`/#genette`), así podés compartir un enlace directo.

## Exportar como sitio estático

Agregá `output: "export"` en `next.config.ts` y corré `npm run build`: el sitio queda en `out/`.

## Agregar desde la interfaz

El botón **+ Agregar** abre un formulario para sumar un autor/obra o un acontecimiento. Cada aporte se guarda como un **archivo `.mdx` en `content/aportes/`** de tu copia del proyecto (las fotos, en `content/aportes/fotos/`). Así no se pierden aunque borres los datos del navegador, y si usás git quedan versionados.

- Al abrir la app se leen **todos** los `.mdx` de esa carpeta, también los que copies de otra persona o escribas a mano. Al volver a la pestaña se releen.
- Editar o eliminar desde la ficha ("Tu aporte") reescribe o borra el archivo.
- **Exportar / Importar** (en el formulario) sirven para pasarle tus aportes a otra persona como `.json`.
- Solo se escribe cuando la app corre en tu computadora (`localhost`, con `npm run dev` o `npm start`). Si la publicás en un servidor o como sitio estático, los `.mdx` del proyecto se muestran pero lo nuevo se guarda en el navegador. Para permitir escritura en otro host: `APORTES_ESCRITURA=abierta`.

### Formato de un aporte

```mdx
---
id: mi-lanzamiento-de-pong      # opcional: si falta, sale del nombre del archivo
tipo: acontecimiento            # autor | acontecimiento
año: 1972
título: Lanzamiento de Pong
autor: Atari                    # opcional en acontecimientos
etiqueta: Pong                  # nombre corto en la línea (opcional)
línea: juego                    # semiotica | discurso | feminismo | arabe | latam | narratologia | juego
conceptos: [Arcade, Reglas simples]
dialoga_con: [huizinga, caillois]   # ids de otros hitos
referencia: Atari (1972). Pong.
---

## Resumen

Qué plantea y por qué importa.

## En el diseño de videojuegos

Cómo sirve para diseñar o analizar un juego.
```

Solo `año` y `título` son obligatorios; un archivo mal formado se ignora sin romper la línea. Para que un aporte pase a ser parte fija de la línea base, copialo a `timeline` en `data/timeline.ts`.
