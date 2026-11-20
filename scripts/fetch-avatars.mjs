// Descarga retratos de autores desde Wikipedia/Wikimedia Commons a public/avatars/
// y escribe data/avatars.json (persona -> archivo + crédito).
// Uso: node scripts/fetch-avatars.mjs
import { mkdir, readFile, writeFile } from "node:fs/promises";

// slug de persona -> títulos candidatos en Wikipedia (se prueba en orden)
const people = {
  peirce: ["en:Charles Sanders Peirce"],
  saussure: ["en:Ferdinand de Saussure"],
  propp: ["en:Vladimir Propp"],
  huizinga: ["en:Johan Huizinga"],
  barthes: ["en:Roland Barthes"],
  caillois: ["en:Roger Caillois", "fr:Roger Caillois"],
  jakobson: ["en:Roman Jakobson"],
  austin: ["en:J. L. Austin"],
  greimas: ["en:Algirdas Julien Greimas", "lt:Algirdas Julius Greimas"],
  foucault: ["en:Michel Foucault"],
  genette: ["en:Gérard Genette", "fr:Gérard Genette"],
  eco: ["en:Umberto Eco"],
  bajtin: ["en:Mikhail Bakhtin"],
  lakoff: ["en:George Lakoff"],
  johnson: ["en:Mark Johnson (philosopher)"],
  laclau: ["en:Ernesto Laclau", "es:Ernesto Laclau"],
  mouffe: ["en:Chantal Mouffe"],
  veron: ["es:Eliseo Verón", "en:Eliseo Verón"],
  fairclough: ["en:Norman Fairclough"],
  "van-dijk": ["en:Teun A. van Dijk", "nl:Teun van Dijk"],
  kress: ["en:Gunther Kress"],
  "van-leeuwen": ["en:Theo van Leeuwen"],
  aarseth: ["en:Espen Aarseth", "no:Espen Aarseth"],
  murray: ["en:Janet H. Murray"],
  frasca: ["en:Gonzalo Frasca", "es:Gonzalo Frasca"],
  salen: ["en:Katie Salen"],
  zimmerman: ["en:Eric Zimmerman"],
  gee: ["en:James Paul Gee"],
  jenkins: ["en:Henry Jenkins"],
  juul: ["en:Jesper Juul"],
  galloway: ["en:Alexander R. Galloway"],
  bogost: ["en:Ian Bogost"],
  hocking: ["en:Clint Hocking"],
  sicart: ["en:Miguel Sicart"],
  "perez-latorre": ["es:Óliver Pérez Latorre"],
  scolari: ["es:Carlos Scolari", "en:Carlos A. Scolari"],
  "fernandez-vara": ["en:Clara Fernández-Vara"],
  "navarro-remesal": ["es:Víctor Navarro Remesal"],
  roig: ["es:Arturo Andrés Roig", "en:Arturo Andrés Roig"],
  kristeva: ["en:Julia Kristeva"],
  mulvey: ["en:Laura Mulvey"],
  "lakoff-r": ["en:Robin Lakoff"],
  haraway: ["en:Donna Haraway"],
  "de-lauretis": ["en:Teresa de Lauretis"],
  crenshaw: ["en:Kimberlé Crenshaw"],
  butler: ["en:Judith Butler"],
  mills: ["en:Sara Mills"],
  cassell: ["en:Justine Cassell"],
  segato: ["es:Rita Segato", "en:Rita Segato"],
  lazar: ["en:Michelle M. Lazar"],
  sarkeesian: ["en:Anita Sarkeesian"],
  shaw: ["en:Adrienne Shaw"],
  ruberg: ["en:Bonnie Ruberg"],
};

const UA = { "User-Agent": "linea-semiotica-avatars/1.0 (educational timeline)" };
await mkdir("public/avatars", { recursive: true });
// Conserva lo ya descargado: solo busca a quien falte
const out = JSON.parse(await readFile("data/avatars.json", "utf8").catch(() => "{}"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** fetch con reintentos ante 429 (límite de pedidos de Wikimedia) */
async function get(url) {
  for (let wait = 20000; ; wait *= 2) {
    const res = await fetch(url, { headers: UA });
    if (res.status !== 429 || wait > 160000) return res;
    console.log(`  (límite de pedidos, espero ${wait / 1000}s)`);
    await sleep(wait);
  }
}

for (const [slug, titles] of Object.entries(people)) {
  if (out[slug]) continue;
  let done = false;
  for (const t of titles) {
    const [lang, title] = t.split(/:(.*)/s);
    const res = await get(
      `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`,
    );
    if (!res.ok) continue;
    const j = await res.json();
    const src = j.thumbnail?.source;
    if (!src) continue;
    const ext = src.match(/\.(jpe?g|png|webp)/i)?.[1]?.toLowerCase().replace("jpeg", "jpg") ?? "jpg";
    const img = await get(src);
    if (!img.ok) continue;
    const file = `${slug}.${ext}`;
    await writeFile(`public/avatars/${file}`, Buffer.from(await img.arrayBuffer()));
    out[slug] = { src: `/avatars/${file}`, credit: j.content_urls?.desktop?.page ?? "" };
    console.log("✓", slug, "←", t);
    done = true;
    break;
  }
  if (!done) console.log("·", slug, "(sin foto, se usan iniciales)");
  await sleep(3000);
}

await writeFile("data/avatars.json", JSON.stringify(out, null, 2) + "\n");
