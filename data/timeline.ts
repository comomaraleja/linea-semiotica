export type CategoryId = "semiotica" | "discurso" | "feminismo" | "arabe" | "latam" | "narratologia" | "juego";

export interface Category {
  id: CategoryId;
  label: string;
  /** Nombre corto para los tags de la barra */
  short: string;
  description: string;
  color: string; // valor CSS, usado en marcadores y etiquetas sobre fondo oscuro
  /** Versión oscura del color, para texto sobre el papel de las fichas */
  ink: string;
}

export interface TimelineItem {
  id: string;
  year: number;
  title: string;
  author: string;
  /** Etiqueta breve para la vista completa */
  short: string;
  category: CategoryId;
  summary: string;
  concepts: string[];
  /** Qué te sirve esto cuando diseñás o analizás un videojuego */
  gameDesign: string;
  /** Pregunta para llevar al propio proyecto */
  prompt?: string;
  related: string[];
  reference: string;
  /** "autor" (por defecto) u "acontecimiento" (un hecho, sin autor) */
  kind?: "autor" | "acontecimiento";
  /** Cargado desde la interfaz (se guarda en el navegador) */
  custom?: boolean;
  /** Foto propia: URL o data URL */
  photo?: string;
}

export interface Era {
  label: string;
  from: number;
  to: number;
  /** Tinte de la franja de la era en el mapa */
  tint: string;
}

export const categories: Category[] = [
  {
    id: "semiotica",
    label: "Semiótica",
    short: "Semiótica",
    description: "Cómo algo llega a significar algo para alguien.",
    color: "#ff7a59",
    ink: "#b8432a",
  },
  {
    id: "discurso",
    label: "Estudios del discurso",
    short: "Discurso",
    description: "El lenguaje como acción social, poder y contexto.",
    color: "#5ab0ff",
    ink: "#1f62a8",
  },
  {
    id: "feminismo",
    label: "Estudios feministas del discurso",
    short: "Feminismos",
    description: "Género, poder y lenguaje: quién habla, quién mira y quién es representada.",
    color: "#ffc94a",
    ink: "#8f6400",
  },
  {
    id: "arabe",
    label: "Estudios árabes e islámicos",
    short: "Árabe-islámicos",
    description: "El signo, la retórica y el relato en la tradición árabe-islámica: de la clásica a la crítica moderna.",
    color: "#ff6fb5",
    ink: "#b0246c",
  },
  {
    id: "latam",
    label: "Estudios latinoamericanos del discurso",
    short: "Latinoamericanos",
    description: "El discurso, los medios y la cultura pensados desde América Latina: poder, mediaciones y descolonización.",
    color: "#b4e35a",
    ink: "#4a7410",
  },
  {
    id: "narratologia",
    label: "Narratología",
    short: "Narratología",
    description: "Estructuras del relato: quién cuenta, qué y cómo.",
    color: "#b392ff",
    ink: "#6a43c4",
  },
  {
    id: "juego",
    label: "Teoría del juego y game studies",
    short: "Game studies",
    description: "El juego como forma cultural y el videojuego como medio.",
    color: "#3ddc97",
    ink: "#127a4f",
  },
];

export const eras: Era[] = [
  { label: "Tradición clásica árabe-islámica", from: 800, to: 1400, tint: "#e3b97a" }, // arena
  { label: "Fundaciones", from: 1900, to: 1955, tint: "#c99a6b" }, // sepia
  { label: "Estructuralismo y giro pragmático", from: 1955, to: 1980, tint: "#4fb5b0" }, // petróleo
  { label: "Discurso, poder y multimodalidad", from: 1980, to: 1996, tint: "#7d86ff" }, // índigo
  { label: "Ludología vs. narratología", from: 1996, to: 2005, tint: "#d77ac9" }, // ciruela
  { label: "Retórica procedimental y madurez", from: 2005, to: 2020, tint: "#8fd16a" }, // verde
];

export const timeline: TimelineItem[] = [
  {
    id: "peirce",
    short: "Peirce",
    year: 1903,
    title: "Clasificación de los signos",
    author: "Charles S. Peirce",
    category: "semiotica",
    summary:
      "Peirce piensa el signo como una relación de tres términos: el representamen (lo que está en lugar de algo), el objeto y el interpretante (el efecto de sentido que produce). De ahí sale su tricotomía más usada: ícono (significa por semejanza), índice (por conexión física o causal) y símbolo (por convención).",
    concepts: ["Semiosis", "Ícono / índice / símbolo", "Interpretante", "Semiosis ilimitada"],
    gameDesign:
      "Sirve para auditar el feedback de un juego. Una barra de vida es mayormente simbólica, la sangre en pantalla es indicial, el sprite del personaje es icónico. Los índices (huellas, humo, sonido que viene de una dirección) son los que mejor enseñan sin texto, porque el jugador infiere la causa.",
    prompt: "¿Qué información crítica de tu juego depende solo de símbolos que hay que aprender?",
    related: ["saussure", "eco-tratado", "gee"],
    reference: "Peirce, C. S. (1931–1958). Collected Papers. Harvard University Press (escritos de c. 1867–1910).",
  },
  {
    id: "saussure",
    short: "Saussure",
    year: 1916,
    title: "Curso de lingüística general",
    author: "Ferdinand de Saussure",
    category: "semiotica",
    summary:
      "Publicado póstumamente a partir de apuntes de sus alumnos. Define el signo lingüístico como la unión de un significante (imagen acústica) y un significado (concepto), unidos de forma arbitraria. El valor de un signo no está en sí mismo sino en su diferencia con los demás signos del sistema.",
    concepts: ["Significante / significado", "Arbitrariedad", "Lengua / habla", "Sintagma / paradigma", "Valor"],
    gameDesign:
      "Pensar el juego como sistema de diferencias: una espada vale lo que vale por contraste con las demás armas, no por sí misma. El eje paradigmático es el inventario de opciones intercambiables (qué arma elijo); el sintagmático, la secuencia en que las combino (cómo encadeno acciones).",
    prompt: "Si sacás un elemento de tu sistema, ¿cambia el valor de los que quedan?",
    related: ["peirce", "barthes", "greimas"],
    reference: "Saussure, F. de (1916). Cours de linguistique générale. Payot.",
  },
  {
    id: "propp",
    short: "Propp",
    year: 1928,
    title: "Morfología del cuento",
    author: "Vladimir Propp",
    category: "narratologia",
    summary:
      "Al analizar cien cuentos maravillosos rusos, Propp encuentra que comparten 31 funciones (acciones definidas por su papel en la trama) que aparecen siempre en el mismo orden, y siete esferas de acción (héroe, villano, donante, ayudante, etc.).",
    concepts: ["Funciones narrativas", "Esferas de acción", "Gramática del relato"],
    gameDesign:
      "Es la base implícita de muchos sistemas de misiones y de generación procedural de historias: si el relato es una gramática de funciones, se puede recombinar. Útil para diseñar quests modulares, aunque también muestra el riesgo de que todo se vuelva fórmula.",
    related: ["greimas", "genette", "jenkins"],
    reference: "Propp, V. (1928). Morfología del cuento. (Trad. esp. Fundamentos, 1971).",
  },
  {
    id: "huizinga",
    short: "Huizinga",
    year: 1938,
    title: "Homo Ludens",
    author: "Johan Huizinga",
    category: "juego",
    summary:
      "Sostiene que el juego es anterior a la cultura y que muchas instituciones (derecho, guerra, poesía, filosofía) tienen un origen lúdico. Lo define como una actividad libre, separada de la vida corriente, con reglas propias, que se desarrolla en un tiempo y espacio delimitados.",
    concepts: ["Juego como fundamento cultural", "Espacio delimitado", "Reglas propias", "Círculo mágico (idea retomada luego)"],
    gameDesign:
      "La noción de un espacio separado donde rigen otras reglas es el antecedente del 'círculo mágico' que Salen y Zimmerman popularizan. Ayuda a pensar umbrales: menús, tutoriales y pantallas de carga como rituales de entrada y salida.",
    related: ["caillois", "salen-zimmerman"],
    reference: "Huizinga, J. (1938). Homo Ludens. (Trad. esp. Alianza).",
  },
  {
    id: "barthes",
    short: "Barthes",
    year: 1957,
    title: "Mitologías",
    author: "Roland Barthes",
    category: "semiotica",
    summary:
      "Barthes lee la cultura de masas francesa (lucha libre, publicidad, juguetes) como sistemas de signos. El mito es un sistema semiótico de segundo orden: un signo completo pasa a ser significante de un nuevo significado, que se presenta como natural cuando en realidad es ideológico.",
    concepts: ["Denotación / connotación", "Mito", "Naturalización", "Semiología de la cultura"],
    gameDesign:
      "Herramienta para preguntarse qué connota la estética de un juego más allá de lo que muestra. Una ciudad 'peligrosa', un enemigo 'salvaje', una economía donde todo se compra: el juego puede naturalizar valores sin enunciarlos.",
    prompt: "¿Qué da por obvio tu juego que podría no serlo?",
    related: ["saussure", "bogost", "kress-van-leeuwen"],
    reference: "Barthes, R. (1957). Mythologies. Seuil. (Trad. esp. Siglo XXI).",
  },
  {
    id: "caillois",
    short: "Caillois",
    year: 1958,
    title: "Los juegos y los hombres",
    author: "Roger Caillois",
    category: "juego",
    summary:
      "Discute y amplía a Huizinga con una tipología: agon (competencia), alea (azar), mimicry (simulacro, representación) e ilinx (vértigo). Además propone un eje entre paidia (juego libre, improvisado) y ludus (juego reglado, con dificultad deliberada).",
    concepts: ["Agon / alea / mimicry / ilinx", "Paidia / ludus"],
    gameDesign:
      "Una de las taxonomías más usadas para describir la experiencia que busca un juego. El eje paidia-ludus es directamente aplicable: un sandbox tira hacia paidia, un juego de puzzles hacia ludus. Frasca lo retoma para distinguir juego libre y juego con objetivo.",
    related: ["huizinga", "frasca-1999"],
    reference: "Caillois, R. (1958). Les jeux et les hommes. Gallimard. (Trad. esp. FCE).",
  },
  {
    id: "jakobson",
    short: "Jakobson",
    year: 1960,
    title: "Lingüística y poética",
    author: "Roman Jakobson",
    category: "discurso",
    summary:
      "Modelo de la comunicación con seis factores (emisor, receptor, mensaje, código, canal, contexto) y una función del lenguaje asociada a cada uno: emotiva, conativa, poética, metalingüística, fática y referencial. Un mismo mensaje puede combinar varias, pero una suele dominar.",
    concepts: ["Seis funciones del lenguaje", "Función poética", "Función fática", "Función metalingüística"],
    gameDesign:
      "Útil para clasificar mensajes de interfaz: un tutorial es metalingüístico (habla del código del juego), una orden del NPC es conativa, un 'conectando…' es fático. La función poética aparece cuando el juego llama la atención sobre su propia forma.",
    related: ["austin", "saussure"],
    reference: "Jakobson, R. (1960). 'Closing statement: Linguistics and poetics'. En T. Sebeok (ed.), Style in Language. MIT Press.",
  },
  {
    id: "austin",
    short: "Austin",
    year: 1962,
    title: "Cómo hacer cosas con palabras",
    author: "J. L. Austin",
    category: "discurso",
    summary:
      "Conferencias de 1955 publicadas en 1962. Algunos enunciados no describen el mundo sino que hacen algo ('prometo', 'los declaro marido y mujer'). Austin distingue el acto locutivo (decir), ilocutivo (lo que se hace al decir) y perlocutivo (el efecto que se produce).",
    concepts: ["Actos de habla", "Performativos", "Ilocución / perlocución", "Condiciones de felicidad"],
    gameDesign:
      "En un juego, presionar un botón es casi siempre un performativo: elegir una opción de diálogo no describe, hace (acusa, perdona, traiciona). Ayuda a diseñar sistemas de diálogo donde las opciones se entiendan como actos con consecuencias y no solo como frases.",
    prompt: "¿Tus opciones de diálogo se leen como frases o como acciones?",
    related: ["jakobson", "foucault", "butler", "bogost"],
    reference: "Austin, J. L. (1962). How to Do Things with Words. Oxford University Press.",
  },
  {
    id: "greimas",
    short: "Greimas",
    year: 1966,
    title: "Semántica estructural",
    author: "Algirdas J. Greimas",
    category: "narratologia",
    summary:
      "Abstrae a Propp en el modelo actancial: seis actantes en tres ejes (sujeto/objeto, destinador/destinatario, ayudante/oponente). Más tarde formaliza el cuadrado semiótico, que organiza las relaciones de contrariedad y contradicción entre términos.",
    concepts: ["Modelo actancial", "Actante vs. actor", "Cuadrado semiótico", "Programa narrativo"],
    gameDesign:
      "El modelo actancial distingue roles de personajes: un mismo personaje puede ser ayudante y luego oponente. Muy útil para mapear facciones, compañeros y traiciones. Pérez Latorre lo adapta al análisis del videojuego, con el jugador ocupando el lugar del sujeto.",
    related: ["propp", "perez-latorre", "saussure"],
    reference: "Greimas, A. J. (1966). Sémantique structurale. Larousse. (Trad. esp. Gredos).",
  },
  {
    id: "foucault",
    short: "Foucault",
    year: 1969,
    title: "La arqueología del saber",
    author: "Michel Foucault",
    category: "discurso",
    summary:
      "El discurso no es un reflejo de la realidad sino una práctica que forma los objetos de los que habla. Foucault estudia las reglas que determinan qué puede decirse, quién puede decirlo y desde qué lugar en una época dada.",
    concepts: ["Formación discursiva", "Enunciado", "Archivo", "Saber / poder"],
    gameDesign:
      "Lleva la pregunta a nivel de la industria: qué tipo de juegos son 'pensables' en un momento, qué géneros fijan qué es un juego, quién está autorizado a hacerlos. También sirve para leer cómo los juegos de estrategia o gestión construyen 'población', 'territorio' o 'recursos' como objetos administrables.",
    related: ["austin", "laclau-mouffe", "fairclough", "galloway"],
    reference: "Foucault, M. (1969). L'archéologie du savoir. Gallimard. (Trad. esp. Siglo XXI).",
  },
  {
    id: "genette",
    short: "Genette",
    year: 1972,
    title: "Figuras III (Discurso del relato)",
    author: "Gérard Genette",
    category: "narratologia",
    summary:
      "Sistematiza la narratología separando historia (lo que pasa), relato (el texto) y narración (el acto de contar). Analiza el orden (analepsis, prolepsis), la duración, la frecuencia, la focalización (desde dónde se percibe) y la voz (quién narra).",
    concepts: ["Historia / relato / narración", "Focalización", "Diégesis", "Analepsis / prolepsis", "Paratexto (1987)"],
    gameDesign:
      "La distinción diegético / no diegético es central en UI: una interfaz diegética existe dentro del mundo (el traje de Dead Space), una no diegética flota sobre él. La focalización ayuda a decidir qué sabe el jugador frente a lo que sabe el personaje.",
    prompt: "¿Tu cámara y tu HUD cuentan desde el mismo lugar que tu historia?",
    related: ["propp", "murray", "jenkins"],
    reference: "Genette, G. (1972). Figures III. Seuil. (Trad. esp. Lumen).",
  },
  {
    id: "eco-tratado",
    short: "Eco",
    year: 1975,
    title: "Tratado de semiótica general",
    author: "Umberto Eco",
    category: "semiotica",
    summary:
      "Integra las tradiciones de Saussure y Peirce en una teoría de los códigos y de la producción de signos. La semiótica estudia todo lo que puede usarse para mentir: si algo no puede usarse para engañar, tampoco puede usarse para significar.",
    concepts: ["Teoría de los códigos", "Función semiótica", "Enciclopedia", "Hipercodificación"],
    gameDesign:
      "La idea de enciclopedia (el saber cultural que el lector trae) explica por qué ciertas convenciones funcionan sin enseñarse: barriles rojos que explotan, cajas que se rompen. Los géneros funcionan como códigos compartidos que el diseño puede respetar o subvertir.",
    related: ["peirce", "eco-lector", "gee"],
    reference: "Eco, U. (1975). Trattato di semiotica generale. Bompiani. (Trad. esp. Lumen).",
  },
  {
    id: "bajtin",
    short: "Bajtín",
    year: 1975,
    title: "Teoría y estética de la novela",
    author: "Mijaíl Bajtín",
    category: "discurso",
    summary:
      "Reúne ensayos escritos décadas antes. Todo enunciado responde a otros y anticipa respuestas: el lenguaje es dialógico. La novela orquesta muchas voces sociales (heteroglosia, plurilingüismo) y el cronotopo nombra la unidad de tiempo y espacio que organiza un género.",
    concepts: ["Dialogismo", "Heteroglosia", "Polifonía", "Cronotopo"],
    gameDesign:
      "El cronotopo es una herramienta muy concreta para el diseño de niveles: el 'camino', el 'umbral', la 'ciudad provinciana' son configuraciones espacio-temporales con sentido propio. La polifonía sirve para pensar juegos con múltiples voces que no se resuelven en una sola verdad.",
    related: ["jenkins", "eco-lector", "fairclough"],
    reference: "Bajtín, M. (1975). Voprosy literatury i estetiki. (Trad. esp. Taurus, 1989).",
  },
  {
    id: "eco-lector",
    short: "Eco",
    year: 1979,
    title: "Lector in fabula",
    author: "Umberto Eco",
    category: "semiotica",
    summary:
      "Un texto es un mecanismo perezoso que necesita que el lector complete lo no dicho. El autor construye un lector modelo, la estrategia de lectura que el texto prevé. Distingue textos cerrados (que buscan una lectura) y abiertos (que admiten varias).",
    concepts: ["Lector modelo", "Cooperación textual", "Obra abierta", "Inferencia"],
    gameDesign:
      "Reemplazá 'lector' por 'jugador modelo': todo juego presupone a alguien que sabe ciertas cosas y hará ciertas inferencias. Diseñar el onboarding es diseñar ese jugador modelo. Los juegos de historia ambiental dependen de esta cooperación.",
    prompt: "Describí a tu jugador modelo en tres líneas. ¿El tutorial lo produce o lo supone?",
    related: ["eco-tratado", "jenkins", "aarseth"],
    reference: "Eco, U. (1979). Lector in fabula. Bompiani. (Trad. esp. Lumen).",
  },
  {
    id: "lakoff-johnson",
    short: "Lakoff y Johnson",
    year: 1980,
    title: "Metáforas de la vida cotidiana",
    author: "George Lakoff y Mark Johnson",
    category: "discurso",
    summary:
      "La metáfora no es un adorno sino una forma de pensar: entendemos un dominio a través de otro ('una discusión es una guerra', 'más es arriba'). Muchas de estas metáforas se basan en la experiencia corporal.",
    concepts: ["Metáfora conceptual", "Esquemas de imagen", "Cognición corporizada"],
    gameDesign:
      "Los controles y la UI viven de metáforas corporales: arriba es más, lo pesado es lento, avanzar es ir a la derecha. Diseñar en contra de estas metáforas produce fricción; usarlas bien hace que las mecánicas se sientan 'naturales'.",
    related: ["gee", "bogost"],
    reference: "Lakoff, G. y Johnson, M. (1980). Metaphors We Live By. University of Chicago Press. (Trad. esp. Cátedra).",
  },
  {
    id: "laclau-mouffe",
    short: "Laclau y Mouffe",
    year: 1985,
    title: "Hegemonía y estrategia socialista",
    author: "Ernesto Laclau y Chantal Mouffe",
    category: "discurso",
    summary:
      "Desde una teoría del discurso posestructuralista, sostienen que las identidades sociales nunca están cerradas: se fijan parcialmente mediante articulaciones alrededor de puntos nodales. La hegemonía es la capacidad de fijar esos sentidos.",
    concepts: ["Articulación", "Punto nodal", "Significante vacío", "Antagonismo"],
    gameDesign:
      "Útil para analizar cómo un juego construye un 'nosotros' y un 'ellos' (facciones, enemigos) y qué significante organiza esa frontera ('libertad', 'orden'). También para estudiar discursos de comunidades de jugadores.",
    related: ["foucault", "fairclough"],
    reference: "Laclau, E. y Mouffe, C. (1985). Hegemony and Socialist Strategy. Verso. (Trad. esp. FCE).",
  },
  {
    id: "veron",
    short: "Verón",
    year: 1987,
    title: "La semiosis social",
    author: "Eliseo Verón",
    category: "latam",
    summary:
      "Desde Argentina, Verón propone una teoría de los discursos sociales: el sentido solo se analiza en sus huellas materiales, en relación con sus condiciones de producción y de reconocimiento. Entre ambas hay siempre un desfase: lo que se produce no determina cómo se lee.",
    concepts: ["Condiciones de producción / reconocimiento", "Gramáticas", "Contrato de lectura", "Desfase"],
    gameDesign:
      "El contrato de lectura (cómo un medio construye la relación con su público) se aplica a la relación que un juego propone con quien juega: cómplice, pedagógica, desafiante. El desfase producción-reconocimiento explica por qué los jugadores usan los sistemas de maneras no previstas.",
    prompt: "¿Qué contrato le propone tu juego a quien juega en el primer minuto?",
    related: ["eco-lector", "fairclough", "scolari", "veron-mediatizacion"],
    reference: "Verón, E. (1987). La semiosis social. Gedisa.",
  },
  {
    id: "fairclough",
    short: "Fairclough",
    year: 1989,
    title: "Lenguaje y poder",
    author: "Norman Fairclough",
    category: "discurso",
    summary:
      "Funda el análisis crítico del discurso (ACD) con un modelo de tres dimensiones: el texto, la práctica discursiva (producción y consumo) y la práctica social. Busca mostrar cómo el lenguaje reproduce o cuestiona relaciones de poder.",
    concepts: ["Análisis crítico del discurso", "Modelo tridimensional", "Interdiscursividad", "Naturalización"],
    gameDesign:
      "Un método para analizar juegos completos: el texto (reglas, diálogos, imágenes), la práctica (cómo se produce, comercializa y juega) y lo social (qué ideologías refuerza). También se usa para estudiar el marketing y los discursos de la industria.",
    related: ["foucault", "van-dijk", "veron", "laclau-mouffe"],
    reference: "Fairclough, N. (1989). Language and Power. Longman.",
  },
  {
    id: "van-dijk",
    short: "van Dijk",
    year: 1993,
    title: "Principios del análisis crítico del discurso",
    author: "Teun A. van Dijk",
    category: "discurso",
    summary:
      "Programa del ACD centrado en el abuso de poder y la reproducción de la desigualdad a través del discurso. Van Dijk agrega una dimensión sociocognitiva: entre discurso y sociedad median modelos mentales y representaciones compartidas.",
    concepts: ["Enfoque sociocognitivo", "Modelos de contexto", "Polarización nosotros/ellos", "Acceso al discurso"],
    gameDesign:
      "La estructura de polarización (lo bueno nuestro, lo malo de ellos) es casi una plantilla del diseño de enemigos. Analizar cómo se representan grupos sociales en los personajes es una aplicación directa.",
    related: ["fairclough", "laclau-mouffe"],
    reference: "van Dijk, T. A. (1993). 'Principles of critical discourse analysis'. Discourse & Society, 4(2).",
  },
  {
    id: "kress-van-leeuwen",
    short: "Kress y van Leeuwen",
    year: 1996,
    title: "Reading Images",
    author: "Gunther Kress y Theo van Leeuwen",
    category: "semiotica",
    summary:
      "Una 'gramática del diseño visual' desde la semiótica social: las imágenes, como el lenguaje, tienen recursos sistemáticos para representar, interpelar y componer. Base de los estudios de multimodalidad.",
    concepts: ["Semiótica social", "Multimodalidad", "Dado / nuevo", "Saliencia", "Modalidad visual"],
    gameDesign:
      "Aplicación directa al diseño de interfaces y composición de pantalla: qué es más saliente, qué va a la izquierda (dado) y a la derecha (nuevo), cuándo la mirada de un personaje interpela al jugador. El videojuego es multimodal por definición: imagen, sonido, texto y háptica.",
    related: ["barthes", "peirce", "perez-latorre"],
    reference: "Kress, G. y van Leeuwen, T. (1996). Reading Images: The Grammar of Visual Design. Routledge.",
  },
  {
    id: "aarseth",
    short: "Aarseth",
    year: 1997,
    title: "Cybertext",
    author: "Espen Aarseth",
    category: "juego",
    summary:
      "Propone la literatura ergódica: textos en los que el lector debe hacer un esfuerzo no trivial para recorrerlos (elegir, explorar, configurar). Analiza aventuras de texto, MUDs e hipertextos como máquinas para producir signos, no solo como relatos.",
    concepts: ["Literatura ergódica", "Cibertexto", "Textón / escriptón", "Función del usuario"],
    gameDesign:
      "Desplaza la pregunta de 'qué cuenta el juego' a 'qué trabajo le pide al jugador para producir el texto'. La distinción entre textones (el material almacenado) y escriptones (lo que efectivamente aparece al jugar) es útil para el diseño procedural.",
    related: ["murray", "frasca-1999", "eco-lector"],
    reference: "Aarseth, E. (1997). Cybertext: Perspectives on Ergodic Literature. Johns Hopkins University Press.",
  },
  {
    id: "murray",
    short: "Murray",
    year: 1997,
    title: "Hamlet en la holocubierta",
    author: "Janet H. Murray",
    category: "narratologia",
    summary:
      "Piensa el futuro del relato en medios digitales. Describe sus propiedades (procedural, participativo, espacial, enciclopédico) y tres placeres estéticos: inmersión, agencia y transformación.",
    concepts: ["Agencia", "Inmersión", "Transformación", "Autoría procedural"],
    gameDesign:
      "El concepto de agencia (la satisfacción de ver los resultados significativos de nuestras decisiones) se volvió vocabulario básico del diseño narrativo. La 'autoría procedural' plantea escribir reglas que generan historias en lugar de escribir historias.",
    prompt: "¿Dónde siente agencia el jugador y dónde solo elige entre opciones equivalentes?",
    related: ["aarseth", "genette", "frasca-1999", "jenkins"],
    reference: "Murray, J. H. (1997). Hamlet on the Holodeck. Free Press. (Trad. esp. Paidós).",
  },
  {
    id: "frasca-1999",
    short: "Frasca",
    year: 1999,
    title: "Ludología y narratología",
    author: "Gonzalo Frasca",
    category: "juego",
    summary:
      "El investigador uruguayo propone 'ludología' para nombrar el estudio del juego en sí, sin reducirlo a narrativa. Junto con Aarseth y Juul abre el debate ludología vs. narratología de los primeros años 2000. En 2003 desarrolla la idea de simulación como forma de representación alternativa al relato.",
    concepts: ["Ludología", "Simulación vs. narración", "Paidia / ludus (revisado)", "Reglas de manipulación y de meta"],
    gameDesign:
      "La simulación modela comportamientos: no dice que la ciudad colapsa, construye un sistema que puede colapsar. Esto cambia la pregunta de diseño de '¿qué pasa?' a '¿qué podría pasar y bajo qué reglas?'.",
    related: ["caillois", "aarseth", "juul", "bogost"],
    reference: "Frasca, G. (1999). 'Ludology meets narratology'. Parnasso, 3. / (2003) 'Simulation versus narrative'. En The Video Game Theory Reader.",
  },
  {
    id: "game-studies",
    short: "Game Studies",
    year: 2001,
    title: "Game Studies, año uno",
    author: "Espen Aarseth (ed.)",
    category: "juego",
    summary:
      "Aparece la revista Game Studies y su editorial declara 2001 como el año uno de los estudios de videojuegos como campo académico propio. Ese mismo año Manovich publica El lenguaje de los nuevos medios.",
    concepts: ["Institucionalización del campo", "Base de datos vs. narrativa (Manovich)"],
    gameDesign:
      "Más un hito institucional que una teoría. Marca el momento en que aparece un lugar estable para discutir el videojuego con categorías propias, y de ahí sale gran parte de la bibliografía posterior.",
    related: ["aarseth", "frasca-1999", "juul"],
    reference: "Aarseth, E. (2001). 'Computer Game Studies, Year One'. Game Studies, 1(1).",
  },
  {
    id: "salen-zimmerman",
    short: "Salen y Zimmerman",
    year: 2003,
    title: "Rules of Play",
    author: "Katie Salen y Eric Zimmerman",
    category: "juego",
    summary:
      "Manual de diseño que organiza el campo en tres esquemas: reglas, juego (experiencia) y cultura. Define el juego significativo como la relación entre las acciones del jugador y los resultados del sistema, que debe ser discernible e integrada.",
    concepts: ["Círculo mágico", "Juego significativo", "Esquemas: reglas / juego / cultura", "Semiótica del juego"],
    gameDesign:
      "Dedica capítulos explícitos a la semiótica (Peirce, Saussure) aplicada a diseño. El criterio de 'discernible' (el jugador percibe el resultado) e 'integrado' (el resultado importa después) es un test práctico para cualquier mecánica.",
    prompt: "Elegí una mecánica: ¿su resultado es discernible? ¿Importa más tarde?",
    related: ["huizinga", "peirce", "juul"],
    reference: "Salen, K. y Zimmerman, E. (2003). Rules of Play: Game Design Fundamentals. MIT Press.",
  },
  {
    id: "gee",
    short: "Gee",
    year: 2003,
    title: "Lo que nos enseñan los videojuegos sobre el aprendizaje",
    author: "James Paul Gee",
    category: "discurso",
    summary:
      "Gee, desde el análisis del discurso y la alfabetización, sostiene que aprender es ingresar a 'dominios semióticos': conjuntos de prácticas que usan modalidades específicas para comunicar significados. Los buenos videojuegos implementan muchos principios de aprendizaje.",
    concepts: ["Dominios semióticos", "Discursos (con D mayúscula)", "Principios de aprendizaje", "Identidad proyectiva"],
    gameDesign:
      "Muy útil para diseño educativo: un juego enseña su propio dominio semiótico y para eso tiene que dosificar, permitir errores baratos y ofrecer información justo cuando se necesita. La identidad proyectiva describe la relación jugador-personaje-proyecto.",
    related: ["peirce", "eco-tratado", "lakoff-johnson"],
    reference: "Gee, J. P. (2003). What Video Games Have to Teach Us About Learning and Literacy. Palgrave Macmillan.",
  },
  {
    id: "jenkins",
    short: "Jenkins",
    year: 2004,
    title: "El diseño de juegos como arquitectura narrativa",
    author: "Henry Jenkins",
    category: "narratologia",
    summary:
      "Propone salir del debate ludología/narratología pensando el diseñador como arquitecto narrativo. El relato en los juegos puede ser evocado (remite a historias conocidas), representado (escenas), incrustado (pistas en el entorno) o emergente (surge del sistema).",
    concepts: ["Narrativa ambiental", "Historias evocadas / incrustadas / emergentes", "Espacios narrativos"],
    gameDesign:
      "Es la referencia de la 'environmental storytelling': contar mediante la disposición del espacio y los objetos. Conecta directamente con el cronotopo de Bajtín y la cooperación del lector modelo de Eco.",
    prompt: "¿Qué historia se podría reconstruir en un cuarto de tu juego sin ningún texto?",
    related: ["bajtin", "eco-lector", "murray", "genette"],
    reference: "Jenkins, H. (2004). 'Game Design as Narrative Architecture'. En Wardrip-Fruin y Harrigan (eds.), First Person. MIT Press.",
  },
  {
    id: "juul",
    short: "Juul",
    year: 2005,
    title: "Half-Real",
    author: "Jesper Juul",
    category: "juego",
    summary:
      "El videojuego es medio real: reglas reales con consecuencias reales, y un mundo ficticio. Ambas dimensiones se cruzan: la ficción ayuda a entender las reglas, y las reglas pueden contradecir la ficción. Propone también una definición clásica de juego en seis rasgos.",
    concepts: ["Reglas reales / ficción", "Juegos de emergencia vs. de progresión", "Mundos incoherentes"],
    gameDesign:
      "La distinción entre juegos de emergencia (reglas simples, mucha variación) y de progresión (secuencia diseñada) es una decisión de diseño temprana. Los 'mundos incoherentes' nombran lo que pasa cuando ficción y reglas no coinciden (vidas extra, reapariciones).",
    related: ["frasca-1999", "salen-zimmerman", "hocking"],
    reference: "Juul, J. (2005). Half-Real: Video Games between Real Rules and Fictional Worlds. MIT Press.",
  },
  {
    id: "galloway",
    short: "Galloway",
    year: 2006,
    title: "Gaming: Essays on Algorithmic Culture",
    author: "Alexander R. Galloway",
    category: "juego",
    summary:
      "El videojuego es una forma cultural basada en la acción: no se mira, se ejecuta. Galloway clasifica los actos en un cuadrante (diegético/no diegético, operador/máquina) y lee la ideología del juego en el propio algoritmo.",
    concepts: ["Acción como medio", "Actos del operador y de la máquina", "Alegoría del control"],
    gameDesign:
      "Útil para pensar todo lo que pasa en un juego que no es narración: pausas, menús, actos de la máquina (el clima, los enemigos). Su lectura del algoritmo como alegoría conecta con Foucault y con Bogost.",
    related: ["foucault", "genette", "bogost"],
    reference: "Galloway, A. R. (2006). Gaming: Essays on Algorithmic Culture. University of Minnesota Press.",
  },
  {
    id: "bogost",
    short: "Bogost",
    year: 2007,
    title: "Persuasive Games",
    author: "Ian Bogost",
    category: "juego",
    summary:
      "Introduce la retórica procedimental: el arte de persuadir mediante procesos, reglas y modelos computacionales, y no solo con palabras o imágenes. Un juego argumenta a través de lo que permite y lo que impide hacer.",
    concepts: ["Retórica procedimental", "Juegos persuasivos", "Entimema procedimental"],
    gameDesign:
      "Probablemente el concepto más directo entre discurso y diseño: las reglas son argumentos. Si en tu juego la única forma de progresar es acumular, el juego afirma algo sobre la acumulación, lo diga o no. El jugador completa el argumento al jugar (entimema).",
    prompt: "Si tus reglas fueran un ensayo, ¿cuál sería su tesis?",
    related: ["frasca-1999", "barthes", "austin", "hocking", "sicart"],
    reference: "Bogost, I. (2007). Persuasive Games: The Expressive Power of Videogames. MIT Press.",
  },
  {
    id: "hocking",
    short: "Hocking",
    year: 2007,
    title: "Disonancia ludonarrativa",
    author: "Clint Hocking",
    category: "narratologia",
    summary:
      "En un post sobre BioShock, el diseñador Clint Hocking acuña el término: hay disonancia cuando lo que el juego dice en su historia contradice lo que las mecánicas hacen hacer al jugador.",
    concepts: ["Disonancia ludonarrativa", "Contrato lúdico y narrativo"],
    gameDesign:
      "Un término de diseño más que académico, hoy de uso cotidiano. Funciona como herramienta de revisión: comparar el tema declarado del juego con la tesis de sus reglas (Bogost). A veces la disonancia se usa intencionalmente como recurso crítico.",
    related: ["bogost", "juul", "genette"],
    reference: "Hocking, C. (2007). 'Ludonarrative Dissonance in Bioshock'. Click Nothing (blog).",
  },
  {
    id: "sicart",
    short: "Sicart",
    year: 2009,
    title: "The Ethics of Computer Games",
    author: "Miguel Sicart",
    category: "juego",
    summary:
      "Los juegos son objetos morales y los jugadores son agentes éticos que reflexionan, no solo receptores de contenido. Analiza cómo el diseño puede abrir o cerrar espacios para la reflexión ética. En 2014 publica Play Matters.",
    concepts: ["Jugador como agente ético", "Diseño ético", "Juego como forma de estar en el mundo"],
    gameDesign:
      "Distingue entre sistemas morales cerrados (barras de karma que reducen la ética a contabilidad) y diseños que obligan a pensar. Útil para quien diseña decisiones difíciles sin una respuesta 'correcta' puntuada.",
    related: ["bogost", "laclau-mouffe"],
    reference: "Sicart, M. (2009). The Ethics of Computer Games. MIT Press.",
  },
  {
    id: "perez-latorre",
    short: "Pérez Latorre",
    year: 2012,
    title: "El lenguaje videolúdico",
    author: "Óliver Pérez Latorre",
    category: "semiotica",
    summary:
      "Propone una semiótica específica del videojuego, articulando el análisis del diseño de juego (sujeto jugador, entorno, reglas) con el de la narrativa. Adapta herramientas de Greimas y de la semiótica estructural al estudio de la significación lúdica.",
    concepts: ["Significación lúdica", "Sujeto / entorno / reglas", "Gramática del diseño"],
    gameDesign:
      "Uno de los textos en español más completos para analizar videojuegos semióticamente. Ofrece un modelo ordenado que se puede usar como plantilla de análisis de cualquier juego.",
    related: ["greimas", "kress-van-leeuwen", "navarro-remesal"],
    reference: "Pérez Latorre, Ó. (2012). El lenguaje videolúdico. Laertes.",
  },
  {
    id: "scolari",
    short: "Scolari",
    year: 2013,
    title: "Homo Videoludens 2.0",
    author: "Carlos A. Scolari (ed.)",
    category: "discurso",
    summary:
      "Compilación coordinada por el investigador argentino Scolari sobre videojuegos, aprendizaje y cultura digital, desde la perspectiva de la ecología de los medios y las hipermediaciones (concepto que él desarrolla en 2008).",
    concepts: ["Hipermediaciones", "Ecología de medios", "Narrativas transmedia"],
    gameDesign:
      "Conecta el videojuego con el ecosistema de medios: el juego como parte de un universo transmedia y como espacio de aprendizaje informal. Bibliografía en español accesible.",
    related: ["veron", "gee", "perez-latorre"],
    reference: "Scolari, C. A. (ed.) (2013). Homo Videoludens 2.0. Col·lecció Transmedia XXI, Universitat de Barcelona.",
  },
  {
    id: "fernandez-vara",
    short: "Fernández-Vara",
    year: 2014,
    title: "Introduction to Game Analysis",
    author: "Clara Fernández-Vara",
    category: "juego",
    summary:
      "Manual práctico para escribir análisis de videojuegos como textos. Propone examinar contexto, información general y elementos formales, combinando herramientas de los estudios literarios y culturales con las del diseño.",
    concepts: ["Análisis textual de juegos", "Contexto / forma", "Close playing"],
    gameDesign:
      "Útil si querés escribir sobre juegos o documentar decisiones de diseño. Tiene un método explícito y ejemplos, ideal para trabajos de investigación o para enseñar análisis.",
    related: ["perez-latorre", "salen-zimmerman"],
    reference: "Fernández-Vara, C. (2014). Introduction to Game Analysis. Routledge.",
  },
  {
    id: "navarro-remesal",
    short: "Navarro-Remesal",
    year: 2016,
    title: "Libertad dirigida",
    author: "Víctor Navarro-Remesal",
    category: "juego",
    summary:
      "Una gramática del análisis y diseño de videojuegos centrada en la libertad del jugador: el juego otorga una libertad que siempre está dirigida por el diseño. Analiza cómo se construye esa libertad en distintos niveles.",
    concepts: ["Libertad dirigida", "Agencia", "Gramática del diseño"],
    gameDesign:
      "Retoma el problema de la agencia de Murray desde el análisis: no se trata de cuánta libertad hay, sino de cómo se la dirige. Muy útil para revisar el diseño de mundos abiertos y de decisiones.",
    related: ["murray", "perez-latorre"],
    reference: "Navarro-Remesal, V. (2016). Libertad dirigida: una gramática del análisis y diseño de videojuegos. Shangrila.",
  },
  // ── Eliseo Verón y Arturo Roig ────────────────────────────────────────────
  {
    id: "veron-mediatizacion",
    short: "Verón",
    year: 2013,
    title: "La semiosis social 2: ideas, momentos, interpretantes",
    author: "Eliseo Verón",
    category: "latam",
    summary:
      "En su último libro, Verón piensa la mediatización como un proceso de larga duración: cada vez que un fenómeno mental se exterioriza en un soporte material (de la piedra tallada a la red), cambian las escalas, los tiempos y las formas en que circula el sentido. La circulación —el desfase entre producción y reconocimiento— pasa a ser el centro del análisis.",
    concepts: ["Mediatización", "Circulación", "Fenómeno mediático", "Cambio de escala"],
    gameDesign:
      "Un juego hoy no termina en la pantalla: se completa en streams, clips, wikis, memes y mods. La mediatización permite estudiar esa circulación como parte del sentido del juego, y no como un agregado externo. Sirve para analizar cómo una comunidad resignifica mecánicas que el diseño no previó.",
    prompt: "¿Qué momento de tu juego está pensado para ser compartido fuera del juego?",
    related: ["veron", "scolari", "jenkins"],
    reference: "Verón, E. (2013). La semiosis social 2: ideas, momentos, interpretantes. Paidós.",
  },
  {
    id: "roig",
    short: "Roig",
    year: 1981,
    title: "Teoría y crítica del pensamiento latinoamericano",
    author: "Arturo Andrés Roig",
    category: "latam",
    summary:
      "Desde Mendoza y el exilio, Roig lee la historia de las ideas latinoamericanas como historia de discursos situados. Propone el 'a priori antropológico' (un sujeto que se afirma a sí mismo como valioso al tomar la palabra) y analiza el 'universo discursivo' de una época como un campo de tensión entre discurso opresor y discurso liberador, donde todo discurso supone un contradiscurso.",
    concepts: ["A priori antropológico", "Universo discursivo", "Discurso opresor / liberador", "Función utópica", "Historización / deshistorización"],
    gameDesign:
      "Útil para leer quién tiene la palabra en un juego y desde dónde: qué sujeto se afirma como valioso, qué voces quedan como fondo o como enemigo. La función utópica sirve para pensar mundos que proponen otro orden posible, y la deshistorización para detectar ficciones que presentan como 'natural' una conquista o una colonización.",
    prompt: "¿Desde qué lugar de enunciación habla tu juego, y qué contradiscurso deja afuera?",
    related: ["foucault", "laclau-mouffe", "veron", "segato"],
    reference: "Roig, A. A. (1981). Teoría y crítica del pensamiento latinoamericano. Fondo de Cultura Económica.",
  },

  // ── Estudios feministas del discurso ──────────────────────────────────────
  {
    id: "kristeva",
    short: "Kristeva",
    year: 1974,
    title: "La revolución del lenguaje poético",
    author: "Julia Kristeva",
    category: "feminismo",
    summary:
      "Kristeva distingue dos dimensiones de la significación: lo simbólico (el orden de la gramática, la ley y la referencia) y lo semiótico (ritmos, pulsiones y entonaciones previas al sentido, ligadas a la 'chora'). El sujeto no está fijo: es un 'sujeto en proceso' atravesado por esa tensión. Antes había acuñado la noción de intertextualidad.",
    concepts: ["Lo semiótico / lo simbólico", "Chora", "Sujeto en proceso", "Intertextualidad"],
    gameDesign:
      "Da vocabulario para lo que el juego significa sin decirlo: ritmo, música, sensación háptica, repetición. Muchos juegos transmiten afecto en esa capa 'semiótica' antes que en el texto. La intertextualidad, a su vez, explica cómo un juego se arma citando géneros y otros juegos.",
    related: ["barthes", "bajtin", "butler"],
    reference: "Kristeva, J. (1974). La révolution du langage poétique. Seuil.",
  },
  {
    id: "mulvey",
    short: "Mulvey",
    year: 1975,
    title: "Placer visual y cine narrativo",
    author: "Laura Mulvey",
    category: "feminismo",
    summary:
      "Ensayo fundacional de la teoría fílmica feminista. Mulvey sostiene que el cine clásico organiza la mirada desde una posición masculina: la mujer aparece como imagen para ser mirada ('to-be-looked-at-ness') y el hombre como portador de la mirada y motor de la acción.",
    concepts: ["Mirada masculina (male gaze)", "Escopofilia", "Mujer como espectáculo", "Identificación"],
    gameDesign:
      "La cámara de un juego también es una mirada: qué encuadra, en qué se detiene, a quién controla quien juega. Sirve para analizar diseños de personaje, cámaras en tercera persona, cinemáticas y el reparto entre quien actúa y quien es mirada.",
    prompt: "¿Desde qué mirada está compuesta la cámara de tu juego?",
    related: ["de-lauretis", "sarkeesian", "genette"],
    reference: "Mulvey, L. (1975). 'Visual Pleasure and Narrative Cinema'. Screen, 16(3), 6-18.",
  },
  {
    id: "lakoff-r",
    short: "R. Lakoff",
    year: 1975,
    title: "El lenguaje y el lugar de la mujer",
    author: "Robin Lakoff",
    category: "feminismo",
    summary:
      "Uno de los trabajos que inauguran la lingüística del género. Lakoff describe rasgos de un 'lenguaje de mujeres' (atenuadores, preguntas de confirmación, cortesía extrema) y argumenta que reflejan y reproducen una posición social subordinada. Muy discutido después, abrió el campo.",
    concepts: ["Lenguaje y género", "Atenuación", "Cortesía", "Enfoque del déficit"],
    gameDesign:
      "Invita a revisar la escritura de diálogos: qué personajes hablan con autoridad, cuáles piden permiso, cuáles se disculpan. Sirve para detectar estereotipos en el guion y en la caracterización por el habla.",
    related: ["lakoff-johnson", "austin", "mills"],
    reference: "Lakoff, R. (1975). Language and Woman's Place. Harper & Row.",
  },
  {
    id: "haraway",
    short: "Haraway",
    year: 1985,
    title: "Manifiesto cyborg",
    author: "Donna Haraway",
    category: "feminismo",
    summary:
      "Haraway propone el cyborg —híbrido de organismo y máquina— como figura política para un feminismo que desarma los binarismos naturaleza/cultura, humano/máquina y varón/mujer. Más tarde formula la idea de 'conocimientos situados': no hay mirada desde ningún lugar.",
    concepts: ["Cyborg", "Ruptura de binarismos", "Conocimientos situados", "Tecnociencia"],
    gameDesign:
      "El avatar es una forma de cyborg: un cuerpo hecho de jugador, código e interfaz. Sirve para pensar la relación cuerpo-máquina, los editores de personaje y la ciencia ficción de los juegos más allá de los binarismos.",
    related: ["butler", "de-lauretis", "galloway"],
    reference: "Haraway, D. (1985). 'A Manifesto for Cyborgs'. Socialist Review, 80, 65-108.",
  },
  {
    id: "de-lauretis",
    short: "de Lauretis",
    year: 1987,
    title: "Tecnologías del género",
    author: "Teresa de Lauretis",
    category: "feminismo",
    summary:
      "Retomando a Foucault, de Lauretis plantea que el género no es una propiedad de los cuerpos sino el producto de tecnologías sociales: el cine, los discursos institucionales, la teoría misma. Desde la semiótica y la narratología, también analiza cómo el relato asigna el lugar del héroe y el del obstáculo.",
    concepts: ["Tecnologías del género", "Representación", "Narrativa y deseo", "Sujeto del feminismo"],
    gameDesign:
      "Los videojuegos son tecnologías del género: producen modelos de cuerpo, deseo y conducta a través de reglas, recompensas y personajes. Permite analizar cómo un sistema de juego distribuye la acción y la pasividad.",
    related: ["foucault", "mulvey", "greimas"],
    reference: "de Lauretis, T. (1987). Technologies of Gender. Indiana University Press.",
  },
  {
    id: "crenshaw",
    short: "Crenshaw",
    year: 1989,
    title: "Desmarginalizar la intersección de raza y sexo",
    author: "Kimberlé Crenshaw",
    category: "feminismo",
    summary:
      "Crenshaw acuña la noción de interseccionalidad: las opresiones de género, raza y clase no se suman, se cruzan, y producen experiencias que no se ven si se analiza cada eje por separado.",
    concepts: ["Interseccionalidad", "Ejes de opresión", "Invisibilización"],
    gameDesign:
      "Una herramienta para analizar la representación en juegos sin reducirla a contar personajes: importa qué cruces de identidad aparecen, cuáles nunca, y qué roles ocupan en la estructura del relato y de las mecánicas.",
    related: ["shaw", "lazar"],
    reference: "Crenshaw, K. (1989). 'Demarginalizing the Intersection of Race and Sex'. University of Chicago Legal Forum, 1989(1).",
  },
  {
    id: "butler",
    short: "Butler",
    year: 1990,
    title: "El género en disputa",
    author: "Judith Butler",
    category: "feminismo",
    summary:
      "Butler sostiene que el género es performativo: no expresa una esencia previa, sino que se produce por la repetición de actos, gestos y discursos regulados. Retoma la teoría de los actos de habla de Austin y la vuelve una teoría del sujeto.",
    concepts: ["Performatividad", "Repetición", "Matriz heterosexual", "Subversión"],
    gameDesign:
      "Jugar es repetir actos dentro de reglas, por eso la performatividad se aplica directamente: el juego hace que quien juega encarne gestos una y otra vez. También ilumina los editores de personaje y los sistemas que fijan o abren las identidades posibles.",
    prompt: "¿Qué gestos repite quien juega tu juego cien veces, y qué identidad producen?",
    related: ["austin", "kristeva", "ruberg"],
    reference: "Butler, J. (1990). Gender Trouble: Feminism and the Subversion of Identity. Routledge.",
  },
  {
    id: "mills",
    short: "Mills",
    year: 1995,
    title: "Estilística feminista",
    author: "Sara Mills",
    category: "feminismo",
    summary:
      "Mills propone un método para analizar textos desde el género en tres niveles: la palabra (sexismo léxico), la frase (quién es agente y quién paciente) y el discurso (personajes, focalización, guiones narrativos estereotipados).",
    concepts: ["Estilística feminista", "Agencia gramatical", "Focalización", "Guiones narrativos"],
    gameDesign:
      "Un método aplicable a textos de juego: descripciones de objetos, diálogos, tutoriales. Analizar quién es sujeto de los verbos en la narración y en las misiones muestra cómo se reparte la agencia.",
    related: ["lakoff-r", "genette", "lazar"],
    reference: "Mills, S. (1995). Feminist Stylistics. Routledge.",
  },
  {
    id: "cassell-jenkins",
    short: "Cassell y Jenkins",
    year: 1998,
    title: "From Barbie to Mortal Kombat",
    author: "Justine Cassell y Henry Jenkins (eds.)",
    category: "feminismo",
    summary:
      "Primera gran compilación sobre género y videojuegos. Reúne a investigadoras, diseñadoras y empresarias del movimiento de 'juegos para chicas' de los noventa y discute si hacía falta diseñar juegos específicos o transformar la cultura del juego en su conjunto.",
    concepts: ["Juegos para chicas", "Género y tecnología", "Cultura gamer", "Diseño inclusivo"],
    gameDesign:
      "Plantea un debate que sigue vigente: ¿diseñar 'para' un público definido por el género refuerza estereotipos o abre espacios? Útil para pensar público, marketing y supuestos de diseño.",
    related: ["jenkins", "shaw", "sarkeesian"],
    reference: "Cassell, J. y Jenkins, H. (eds.) (1998). From Barbie to Mortal Kombat: Gender and Computer Games. MIT Press.",
  },
  {
    id: "segato",
    short: "Segato",
    year: 2003,
    title: "Las estructuras elementales de la violencia",
    author: "Rita Segato",
    category: "feminismo",
    summary:
      "Desde la antropología, Segato lee la violencia de género como un acto comunicativo: la violencia es expresiva, es un enunciado dirigido a otros hombres y a la sociedad, dentro de lo que llama el 'mandato de masculinidad'.",
    concepts: ["Violencia expresiva", "Mandato de masculinidad", "Violencia como enunciado", "Pedagogía de la crueldad"],
    gameDesign:
      "Permite leer la violencia en los juegos como discurso, no solo como mecánica: a quién se dirige, qué enseña, qué masculinidad recompensa. Muy útil para diseñar con conciencia el lugar de la violencia en el sistema de juego.",
    prompt: "En tu juego, ¿a quién le habla la violencia y qué le enseña?",
    related: ["roig", "foucault", "lazar"],
    reference: "Segato, R. (2003). Las estructuras elementales de la violencia. Universidad Nacional de Quilmes.",
  },
  {
    id: "lazar",
    short: "Lazar",
    year: 2005,
    title: "Análisis crítico feminista del discurso",
    author: "Michelle M. Lazar (ed.)",
    category: "feminismo",
    summary:
      "Lazar articula el análisis crítico del discurso con la teoría feminista: estudia cómo el discurso sostiene y naturaliza un orden de género, muchas veces de forma sutil y en apariencia 'moderna' o igualitaria.",
    concepts: ["ACD feminista", "Orden de género", "Sexismo sutil", "Praxis crítica"],
    gameDesign:
      "Combina el método de Fairclough con el género: sirve para analizar el discurso de un juego, de su marketing y de su comunidad, y detectar sexismos que no son explícitos sino estructurales.",
    related: ["fairclough", "van-dijk", "mills", "crenshaw"],
    reference: "Lazar, M. M. (ed.) (2005). Feminist Critical Discourse Analysis: Gender, Power and Ideology in Discourse. Palgrave Macmillan.",
  },
  {
    id: "sarkeesian",
    short: "Sarkeesian",
    year: 2013,
    title: "Tropes vs. Women in Video Games",
    author: "Anita Sarkeesian",
    category: "feminismo",
    summary:
      "Serie de video ensayos de Feminist Frequency (2013-2017) que analiza tropos recurrentes en los videojuegos: la damisela en apuros, la 'versión femenina' de un personaje masculino, las mujeres como decorado. Su difusión masiva y el acoso que recibió la volvieron un caso central del debate sobre género y cultura gamer.",
    concepts: ["Tropos narrativos", "Damisela en apuros", "Mujeres como decorado", "Crítica cultural"],
    gameDesign:
      "Un catálogo práctico de tropos para revisar en el propio diseño: motivaciones de personajes, recompensas, entornos y personajes no jugables. Conecta la crítica feminista con la narratología del juego.",
    related: ["mulvey", "propp", "cassell-jenkins"],
    reference: "Sarkeesian, A. (2013-2017). Tropes vs. Women in Video Games [serie web]. Feminist Frequency.",
  },
  {
    id: "shaw",
    short: "Shaw",
    year: 2014,
    title: "Gaming at the Edge",
    author: "Adrienne Shaw",
    category: "feminismo",
    summary:
      "A partir de entrevistas con jugadores de identidades marginalizadas, Shaw muestra que la identificación con personajes es más compleja de lo que se supone: la representación importa no porque todos necesiten 'verse', sino por lo que se vuelve imaginable como posible.",
    concepts: ["Representación", "Identificación", "Identidad gamer", "Márgenes"],
    gameDesign:
      "Desarma el argumento 'el público solo quiere jugar con quien se le parece'. Útil para pensar la diversidad del elenco más allá de la cuota, y la identidad 'gamer' como construcción discursiva.",
    related: ["crenshaw", "cassell-jenkins", "ruberg"],
    reference: "Shaw, A. (2014). Gaming at the Edge: Sexuality and Gender at the Margins of Gamer Culture. University of Minnesota Press.",
  },
  {
    id: "ruberg",
    short: "Ruberg",
    year: 2019,
    title: "Video Games Have Always Been Queer",
    author: "Bonnie Ruberg",
    category: "feminismo",
    summary:
      "Ruberg sostiene que lo queer en los videojuegos no depende solo de personajes o temas explícitos: también está en las mecánicas, en el fracaso, en jugar 'mal' o a contrapelo del diseño, y en los deseos que los sistemas habilitan.",
    concepts: ["Lecturas queer", "Fracaso", "Jugar a contrapelo", "Deseo y mecánica"],
    gameDesign:
      "Invita a buscar sentido en lo que el diseño no prevé: rutas no óptimas, fallar a propósito, demorarse. Abre posibilidades de diseño que no centran la eficiencia ni la victoria.",
    related: ["butler", "shaw", "sicart"],
    reference: "Ruberg, B. (2019). Video Games Have Always Been Queer. NYU Press.",
  },

  // ── Estudios árabes e islámicos: tradición clásica ────────────────────────
  {
    id: "shafii",
    short: "al-Shāfiʿī",
    year: 820,
    title: "al-Risāla (fundamentos del derecho)",
    author: "Muḥammad ibn Idrīs al-Shāfiʿī",
    category: "arabe",
    summary:
      "Con al-Risāla nace la tradición de uṣūl al-fiqh, los fundamentos del derecho: una hermenéutica muy sofisticada para leer textos normativos. A lo largo de los siglos distinguirá el sentido literal del figurado (ḥaqīqa / majāz), lo que el texto dice expresamente (manṭūq) y lo que implica sin decirlo (mafhūm), algo cercano a las implicaturas de Grice.",
    concepts: ["Uṣūl al-fiqh", "Ḥaqīqa / majāz", "Manṭūq / mafhūm", "Hermenéutica"],
    gameDesign:
      "Las reglas de un juego también se interpretan: lo que dicen y lo que implican. Muchas comunidades juegan en el mafhūm, en lo que el sistema permite sin nombrarlo (atajos, exploits, speedruns). Sirve para pensar qué lecturas de tus reglas habilitás sin querer.",
    related: ["ibn-sina", "eco-lector", "austin"],
    reference: "al-Shāfiʿī (c. 820). al-Risāla. (Trad. ingl.: The Epistle on Legal Theory, NYU Press, 2013).",
  },
  {
    id: "jahiz",
    short: "al-Jāḥiẓ",
    year: 860,
    title: "Kitāb al-bayān wa-l-tabyīn",
    author: "al-Jāḥiẓ",
    category: "arabe",
    summary:
      "Al-Jāḥiẓ clasifica los modos de significar en cinco: la palabra (lafẓ), el gesto (ishāra), el cálculo con los dedos (ʿaqd), la escritura (khaṭṭ) y la 'elocuencia' de las cosas mismas por su estado (niṣba / ḥāl). Es una semiótica general avant la lettre: no todo lo que significa es lenguaje verbal.",
    concepts: ["Bayān", "Cinco sistemas de signos", "Niṣba / ḥāl", "Semiótica general"],
    gameDesign:
      "Un videojuego significa con los cinco a la vez: texto, gestos de los personajes, números en la interfaz, escritura en el mundo y la 'elocuencia' de los espacios y objetos. Sirve como checklist: ¿qué estás comunicando con cada sistema y cuál dejás mudo?",
    prompt: "¿Qué cuenta tu escenario sin una sola palabra?",
    related: ["peirce", "kress-van-leeuwen", "ibn-sina"],
    reference: "al-Jāḥiẓ (s. IX). Kitāb al-bayān wa-l-tabyīn. Ed. ʿA. M. Hārūn, El Cairo, 1948.",
  },
  {
    id: "ibn-sina",
    short: "Ibn Sīnā",
    year: 1030,
    title: "La teoría de la dalāla (al-Ishārāt wa-l-tanbīhāt)",
    author: "Ibn Sīnā (Avicena)",
    category: "arabe",
    summary:
      "Avicena distingue tres modos de significación (dalāla) de una palabra: por correspondencia total con su sentido (muṭābaqa), por inclusión de una parte (taḍammun) y por implicación de algo que la acompaña (iltizām). La distinción se parece bastante a la que la semiótica moderna hará entre denotación y connotación.",
    concepts: ["Dalāla", "Muṭābaqa / taḍammun / iltizām", "Denotación y connotación"],
    gameDesign:
      "Un objeto de juego puede significar lo que es (una llave abre una puerta), una parte de algo mayor (la llave es parte de un sistema de progreso) o lo que implica (alguien la escondió: hay una historia). Útil para diseñar objetos con capas de sentido.",
    related: ["jahiz", "barthes", "hazim"],
    reference: "Ibn Sīnā (c. 1030). al-Ishārāt wa-l-tanbīhāt. (Trad. ingl.: Remarks and Admonitions. Part One: Logic, 1984).",
  },
  {
    id: "jurjani",
    short: "al-Jurjānī",
    year: 1070,
    title: "Dalāʾil al-iʿjāz y Asrār al-balāgha",
    author: "ʿAbd al-Qāhir al-Jurjānī",
    category: "arabe",
    summary:
      "Su teoría del naẓm (composición) sostiene que el sentido no está en las palabras aisladas sino en las relaciones sintácticas entre ellas: una misma palabra cambia de valor según cómo se ordena con las demás. Por eso se lo compara con frecuencia con Saussure y el estructuralismo.",
    concepts: ["Naẓm", "Relaciones sintácticas", "Imagen poética", "Sentido relacional"],
    gameDesign:
      "En el diseño de sistemas pasa lo mismo: una mecánica no significa sola, sino por cómo se combina con las otras. Un salto no es igual en un plataformero que en un juego de terror. El naẓm invita a diseñar combinaciones, no piezas sueltas.",
    prompt: "¿Qué mecánica tuya cambia de sentido según con cuál se combina?",
    related: ["saussure", "abu-deeb", "jakobson"],
    reference: "al-Jurjānī, ʿA. (s. XI). Dalāʾil al-iʿjāz; Asrār al-balāgha. Ed. H. Ritter, Estambul, 1954.",
  },
  {
    id: "ibn-rushd",
    short: "Ibn Rushd",
    year: 1175,
    title: "Comentario medio a la Poética de Aristóteles",
    author: "Ibn Rushd (Averroes)",
    category: "arabe",
    summary:
      "Al-Fārābī, Ibn Sīnā e Ibn Rushd comentaron la Poética y la Retórica de Aristóteles y desarrollaron el concepto de takhyīl: el asentimiento imaginativo que produce la poesía. A diferencia de la demostración, que busca la verdad, el discurso poético mueve a quien lo recibe a través de la imaginación.",
    concepts: ["Takhyīl", "Asentimiento imaginativo", "Poética filosófica", "Mímesis"],
    gameDesign:
      "Takhyīl describe bien lo que hace la ficción interactiva: no convence con argumentos, mueve con imágenes y situaciones. Sirve para pensar la diferencia entre explicarle algo al jugador y hacérselo sentir.",
    related: ["hazim", "ibn-sina", "murray"],
    reference: "Ibn Rushd (c. 1175). Talkhīṣ kitāb al-shiʿr. (Trad. ingl.: Averroes' Middle Commentary on Aristotle's Poetics, Butterworth, 1986).",
  },
  {
    id: "sakkaki",
    short: "al-Sakkākī",
    year: 1220,
    title: "Miftāḥ al-ʿulūm (la balāgha sistematizada)",
    author: "al-Sakkākī",
    category: "arabe",
    summary:
      "La retórica árabe (balāgha) distingue entre khabar, el enunciado que puede ser verdadero o falso, e inshāʾ, el que realiza una acción: ordenar, preguntar, desear, prohibir. Al-Sakkākī sistematiza esta ciencia, que suele compararse con la teoría de los actos de habla de Austin (Pierre Larcher la estudió en detalle).",
    concepts: ["Balāgha", "Khabar / inshāʾ", "Actos de habla", "ʿIlm al-maʿānī"],
    gameDesign:
      "La distinción khabar / inshāʾ ordena la escritura de un juego: hay líneas que informan (lore, descripciones) y líneas que hacen (órdenes, preguntas, promesas que abren misiones). Conviene saber cuál es cuál cuando diseñás diálogos.",
    related: ["austin", "taha", "jurjani"],
    reference: "al-Sakkākī (s. XIII). Miftāḥ al-ʿulūm. Sobre khabar / inshāʾ y actos de habla: los trabajos de Pierre Larcher.",
  },
  {
    id: "ibn-salah",
    short: "Ibn al-Ṣalāḥ",
    year: 1235,
    title: "Muqaddima (la ciencia del ḥadīth)",
    author: "Ibn al-Ṣalāḥ al-Shahrazūrī",
    category: "arabe",
    summary:
      "La ciencia del ḥadīth evalúa cada relato por su isnād, la cadena de quienes lo transmitieron: quién lo contó, a quién, si se conocieron, qué tan fiables eran. Es una teoría de la transmisión y de la confiabilidad del narrador, muy útil para pensar la enunciación.",
    concepts: ["Isnād", "Matn", "Fiabilidad del narrador", "Cadena de transmisión"],
    gameDesign:
      "Muchos juegos cuentan a través de documentos, rumores y testimonios de fiabilidad variable. El isnād es un modelo para diseñar narradores poco confiables y cadenas de transmisión que el jugador pueda reconstruir.",
    prompt: "¿Quién le contó a quién la historia que encuentra tu jugador?",
    related: ["genette", "ibn-khaldun", "kilito"],
    reference: "Ibn al-Ṣalāḥ (s. XIII). Muqaddima fī ʿulūm al-ḥadīth. (Trad. ingl.: An Introduction to the Science of the Ḥadīth, Garnet, 2006).",
  },
  {
    id: "hazim",
    short: "Ḥāzim",
    year: 1280,
    title: "Minhāj al-bulaghāʾ wa-sirāj al-udabāʾ",
    author: "Ḥāzim al-Qarṭājannī",
    category: "arabe",
    summary:
      "Nacido en Cartagena (al-Ándalus) y exiliado en Túnez, Ḥāzim sistematiza la poética filosófica: articula el takhyīl (lo imaginativo) con la retórica árabe y propone una teoría completa de cómo la poesía produce efectos en quien la recibe.",
    concepts: ["Takhyīl", "Poética", "Efecto en el receptor", "al-Ándalus"],
    gameDesign:
      "Una poética centrada en el efecto: qué produce cada recurso en quien recibe la obra. Es la pregunta de fondo del diseño de experiencias: no qué contiene el juego, sino qué le hace sentir a quien juega.",
    related: ["ibn-rushd", "ibn-sina"],
    reference: "Ḥāzim al-Qarṭājannī (s. XIII). Minhāj al-bulaghāʾ wa-sirāj al-udabāʾ. Ed. M. al-Ḥabīb ibn al-Khūja, Túnez, 1966.",
  },
  {
    id: "ibn-khaldun",
    short: "Ibn Khaldūn",
    year: 1377,
    title: "al-Muqaddima",
    author: "Ibn Khaldūn",
    category: "arabe",
    summary:
      "En la introducción a su historia universal, Ibn Khaldūn critica los relatos históricos (akhbār) y explica por qué los narradores distorsionan: partidismo, exceso de confianza en las fuentes, ignorancia de las condiciones sociales, deseo de agradar a los poderosos. Propone juzgar un relato por su verosimilitud dentro de la vida social.",
    concepts: ["Crítica de los akhbār", "ʿUmrān (vida social)", "Verosimilitud", "Sesgo del narrador"],
    gameDesign:
      "Un marco para diseñar mundos con historias en disputa: crónicas oficiales, versiones interesadas, mitos fundacionales. También sirve para revisar qué versión de la historia asume tu propio juego.",
    related: ["ibn-salah", "foucault", "roig"],
    reference: "Ibn Khaldūn (1377). al-Muqaddima. (Trad. esp.: Introducción a la historia universal, FCE, 1977).",
  },

  // ── Estudios árabes e islámicos: crítica y teoría moderna ─────────────────
  {
    id: "khatibi",
    short: "Khatibi",
    year: 1974,
    title: "La blessure du nom propre",
    author: "Abdelkebir Khatibi",
    category: "arabe",
    summary:
      "Desde Marruecos, Khatibi hace una semiótica de la cultura popular: la caligrafía, el tatuaje, los proverbios, el cuerpo. Lee esos sistemas de signos contra la idea de que la cultura 'legítima' es solo la escrita y oficial.",
    concepts: ["Semiótica de la cultura popular", "Caligrafía", "Tatuaje", "Doble crítica"],
    gameDesign:
      "Invita a mirar los signos 'menores' de un mundo de juego: marcas en el cuerpo de los personajes, grafitis, inscripciones, ornamentos. También es un llamado a representar culturas sin reducirlas a decorado exótico.",
    related: ["barthes", "kress-van-leeuwen", "jahiz"],
    reference: "Khatibi, A. (1974). La blessure du nom propre. Denoël.",
  },
  {
    id: "abu-deeb",
    short: "Abu Deeb",
    year: 1979,
    title: "Al-Jurjānī's Theory of Poetic Imagery",
    author: "Kamal Abu Deeb",
    category: "arabe",
    summary:
      "Abu Deeb hace un análisis estructural de la poesía árabe, incluida la preislámica, y relee a al-Jurjānī con las herramientas del estructuralismo, mostrando cuánto anticipó la teoría del sentido relacional.",
    concepts: ["Estructuralismo", "Imagen poética", "Poesía preislámica", "Naẓm"],
    gameDesign:
      "Un ejemplo de cómo una teoría 'antigua' se vuelve herramienta nueva al releerla. Lo mismo vale para el diseño: muchos recursos de los juegos actuales ya estaban en formas narrativas y poéticas muy anteriores.",
    related: ["jurjani", "jakobson", "greimas"],
    reference: "Abu Deeb, K. (1979). Al-Jurjānī's Theory of Poetic Imagery. Aris & Phillips.",
  },
  {
    id: "arkoun",
    short: "Arkoun",
    year: 1982,
    title: "Lectures du Coran",
    author: "Mohammed Arkoun",
    category: "arabe",
    summary:
      "Arkoun aplica la lingüística, la semiótica y el análisis del discurso al Corán y a su tradición de lectura. Distingue el texto de las capas de interpretación que lo fueron fijando y propone una 'razón islámica' crítica de sí misma.",
    concepts: ["Análisis del discurso", "Lo pensable / lo impensado", "Crítica de la razón islámica"],
    gameDesign:
      "La distinción entre lo pensable y lo impensado en una cultura se aplica a los géneros de juego: qué experiencias se vuelven 'imposibles de diseñar' porque nadie las imagina. Útil para salir de las convenciones.",
    related: ["foucault", "abu-zayd", "jabiri"],
    reference: "Arkoun, M. (1982). Lectures du Coran. Maisonneuve & Larose.",
  },
  {
    id: "siza-qasim",
    short: "Sīzā Qāsim",
    year: 1984,
    title: "Bināʾ al-riwāya",
    author: "Sīzā Qāsim",
    category: "arabe",
    summary:
      "Un análisis narratológico de la trilogía de El Cairo de Naguib Mahfuz: tiempo, espacio y perspectiva en la novela. Es uno de los trabajos que introducen la narratología estructural en la crítica árabe.",
    concepts: ["Tiempo narrativo", "Espacio", "Perspectiva", "Novela árabe"],
    gameDesign:
      "El cuidado del tiempo y del espacio narrativo de una novela-río se traslada a los juegos de mundo extenso: cómo se organiza el paso del tiempo, cómo un barrio cuenta una historia a lo largo de generaciones.",
    related: ["genette", "kilito", "yaqtin"],
    reference: "Qāsim, S. (1984). Bināʾ al-riwāya: dirāsa muqārana fī thulāthiyyat Najīb Maḥfūẓ. El Cairo.",
  },
  {
    id: "kilito",
    short: "Kilito",
    year: 1985,
    title: "L'auteur et ses doubles",
    author: "Abdelfattah Kilito",
    category: "arabe",
    summary:
      "Kilito estudia el relato árabe clásico (las maqāmas, Las mil y una noches) y la figura del autor: atribuciones falsas, narradores interpuestos, textos que circulan sin dueño. Escribe en francés y en árabe; también son clave Les Séances (1983) y L'œil et l'aiguille (1992).",
    concepts: ["Autoría", "Maqāma", "Las mil y una noches", "Relato enmarcado"],
    gameDesign:
      "Las mil y una noches son un modelo de relato enmarcado: historias dentro de historias, contadas para sobrevivir. Muy útil para diseñar estructuras narrativas anidadas y narradores que se pasan la palabra.",
    prompt: "¿Quién cuenta la historia de tu juego, y por qué la cuenta?",
    related: ["genette", "ibn-salah", "siza-qasim"],
    reference: "Kilito, A. (1985). L'auteur et ses doubles: essai sur la culture arabe classique. Seuil.",
  },
  {
    id: "miftah",
    short: "Miftāḥ",
    year: 1985,
    title: "Taḥlīl al-khiṭāb al-shiʿrī",
    author: "Muḥammad Miftāḥ",
    category: "arabe",
    summary:
      "Un análisis del discurso poético que articula semiótica, pragmática y la noción de tanāṣṣ (intertextualidad) para leer la poesía árabe, clásica y moderna.",
    concepts: ["Discurso poético", "Tanāṣṣ (intertextualidad)", "Pragmática"],
    gameDesign:
      "La intertextualidad es central en los juegos: citan géneros, homenajean a otros juegos, reciclan mecánicas. Sirve para diseñar referencias que suman sentido en lugar de ser solo guiños.",
    related: ["kristeva", "bajtin", "jurjani"],
    reference: "Miftāḥ, M. (1985). Taḥlīl al-khiṭāb al-shiʿrī: istrātījiyyat al-tanāṣṣ. Casablanca.",
  },
  {
    id: "anzimat",
    short: "Qāsim y Abū Zayd",
    year: 1986,
    title: "Anẓimat al-ʿalāmāt (Sistemas de signos)",
    author: "Sīzā Qāsim y Naṣr Ḥāmid Abū Zayd (eds.)",
    category: "arabe",
    summary:
      "Una introducción colectiva a la semiótica en árabe, que reúne traducciones y estudios sobre los sistemas de signos en la lengua, la literatura y la cultura. Fue clave para instalar la semiótica (sīmiyāʾiyyāt) en la universidad árabe.",
    concepts: ["Sīmiyāʾiyyāt", "Sistemas de signos", "Cultura", "Traducción teórica"],
    gameDesign:
      "Recordatorio de que las teorías viajan y se traducen: también las del diseño. Sirve para pensar cómo adaptar marcos de análisis a juegos hechos desde otras culturas y lenguas.",
    related: ["eco-tratado", "siza-qasim", "abu-zayd"],
    reference: "Qāsim, S. y Abū Zayd, N. Ḥ. (eds.) (1986). Anẓimat al-ʿalāmāt fī al-lugha wa-l-adab wa-l-thaqāfa: madkhal ilā al-sīmūṭīqā. El Cairo.",
  },
  {
    id: "jabiri",
    short: "al-Jābirī",
    year: 1986,
    title: "Bunyat al-ʿaql al-ʿarabī (Crítica de la razón árabe, II)",
    author: "Mohammed ʿĀbid al-Jābirī",
    category: "arabe",
    summary:
      "En su Crítica de la razón árabe, al-Jābirī distingue tres sistemas epistémicos del pensamiento árabe: bayān (el saber que se apoya en el texto y su interpretación), ʿirfān (la gnosis, el saber por iluminación) y burhān (la demostración racional).",
    concepts: ["Bayān", "ʿIrfān", "Burhān", "Sistemas epistémicos"],
    gameDesign:
      "Los tres modos de saber describen tres maneras en que un juego puede hacer que el jugador comprenda: leyendo (textos, pistas), intuyendo (atmósfera, revelación) o deduciendo (puzles, sistemas). Útil para variar cómo se descubre la información.",
    related: ["arkoun", "foucault", "roig"],
    reference: "al-Jābirī, M. ʿA. (1984–1986). Naqd al-ʿaql al-ʿarabī: Takwīn al-ʿaql al-ʿarabī; Bunyat al-ʿaql al-ʿarabī. Beirut.",
  },
  {
    id: "taha",
    short: "Ṭāhā ʿAbd al-Raḥmān",
    year: 1987,
    title: "Fī uṣūl al-ḥiwār wa-tajdīd ʿilm al-kalām",
    author: "Ṭāhā ʿAbd al-Raḥmān",
    category: "arabe",
    summary:
      "Desde Marruecos, Ṭāhā ʿAbd al-Raḥmān trabaja la lógica, la pragmática y la teoría de la argumentación y del diálogo (ḥiwār), en diálogo con la tradición del kalām y con la filosofía del lenguaje contemporánea.",
    concepts: ["Ḥiwār (diálogo)", "Argumentación", "Pragmática", "Kalām"],
    gameDesign:
      "Una teoría del diálogo como intercambio argumentativo, no como menú de frases. Útil para diseñar sistemas de conversación donde convencer, objetar o ceder tenga reglas y consecuencias.",
    related: ["sakkaki", "austin", "bogost"],
    reference: "ʿAbd al-Raḥmān, Ṭ. (1987). Fī uṣūl al-ḥiwār wa-tajdīd ʿilm al-kalām. Casablanca.",
  },
  {
    id: "yaqtin",
    short: "Yaqṭīn",
    year: 1989,
    title: "Taḥlīl al-khiṭāb al-riwāʾī",
    author: "Saʿīd Yaqṭīn",
    category: "arabe",
    summary:
      "Uno de los principales narratólogos árabes: adapta la narratología (Genette, Todorov) al análisis del discurso novelístico árabe, distinguiendo tiempo, modo y voz del relato.",
    concepts: ["Sardiyyāt (narratología)", "Discurso narrativo", "Tiempo, modo y voz"],
    gameDesign:
      "Muestra que las categorías de Genette se pueden adaptar a otras tradiciones; lo mismo hace el análisis de juegos al adaptar la narratología a la interactividad.",
    related: ["genette", "siza-qasim", "ibrahim"],
    reference: "Yaqṭīn, S. (1989). Taḥlīl al-khiṭāb al-riwāʾī. al-Markaz al-thaqāfī al-ʿarabī.",
  },
  {
    id: "abu-zayd",
    short: "Abū Zayd",
    year: 1990,
    title: "Mafhūm al-naṣṣ",
    author: "Naṣr Ḥāmid Abū Zayd",
    category: "arabe",
    summary:
      "Abū Zayd analiza el Corán como texto, con herramientas lingüísticas y semióticas: un mensaje que se produce y se comprende dentro de una cultura y un código. Su enfoque le costó un juicio por apostasía en 1995 y el exilio.",
    concepts: ["Concepto de texto", "Hermenéutica", "Texto y cultura", "Código"],
    gameDesign:
      "Leer un texto en su contexto de producción y recepción es también leer un juego: qué entendía su público, qué códigos compartía. Sirve para analizar juegos de otras épocas y culturas sin anacronismos.",
    related: ["arkoun", "anzimat", "veron"],
    reference: "Abū Zayd, N. Ḥ. (1990). Mafhūm al-naṣṣ: dirāsa fī ʿulūm al-Qurʾān. El Cairo.",
  },
  {
    id: "ibrahim",
    short: "ʿA. Ibrāhīm",
    year: 1992,
    title: "al-Sardiyya al-ʿarabiyya",
    author: "ʿAbdallāh Ibrāhīm",
    category: "arabe",
    summary:
      "Desde Irak, ʿAbdallāh Ibrāhīm estudia la narratividad árabe (sardiyya) desde sus formas clásicas, y más tarde coordina una enciclopedia del relato árabe.",
    concepts: ["Sardiyya", "Formas narrativas clásicas", "Historia del relato"],
    gameDesign:
      "Un repertorio de formas narrativas no occidentales (relatos enmarcados, maqāmas, crónicas) que pueden inspirar estructuras de juego distintas al viaje del héroe.",
    related: ["kilito", "yaqtin", "propp"],
    reference: "Ibrāhīm, ʿA. (1992). al-Sardiyya al-ʿarabiyya. Beirut.",
  },
  {
    id: "bengrad",
    short: "Bengrad",
    year: 2003,
    title: "al-Sīmiyāʾiyyāt: mafāhīmuhā wa-taṭbīqātuhā",
    author: "Saʿīd Bengrad",
    category: "arabe",
    summary:
      "Bengrad tradujo al árabe a Eco y a Peirce, fundó y dirige la revista ʿAlāmāt ('Signos') y escribió una introducción a los conceptos y aplicaciones de la semiótica, de la publicidad a la imagen.",
    concepts: ["Sīmiyāʾiyyāt", "Traducción de Eco y Peirce", "Semiótica de la imagen"],
    gameDesign:
      "Un puente entre la semiótica de Peirce y Eco y su uso en análisis de imagen y publicidad en árabe: muy útil para leer el marketing y la imagen de los juegos.",
    related: ["peirce", "eco-tratado", "anzimat"],
    reference: "Bengrad, S. (2003). al-Sīmiyāʾiyyāt: mafāhīmuhā wa-taṭbīqātuhā. Casablanca.",
  },
  {
    id: "alif",
    short: "Alif",
    year: 1981,
    kind: "acontecimiento",
    title: "Nace Alif: Journal of Comparative Poetics",
    author: "",
    category: "arabe",
    summary:
      "La Universidad Americana de El Cairo funda Alif, revista bilingüe (árabe e inglés) de poética comparada. Junto con Fuṣūl (El Cairo), es una de las vías principales para encontrar bibliografía académica árabe sobre teoría literaria, semiótica y narratología.",
    concepts: ["Poética comparada", "Revista académica", "Bilingüismo"],
    gameDesign:
      "Un punto de partida para buscar bibliografía: varios números tratan narración, imagen y cultura popular, útiles para pensar juegos desde otras tradiciones.",
    related: ["kilito", "siza-qasim"],
    reference: "Alif: Journal of Comparative Poetics. Universidad Americana de El Cairo, 1981–.",
  },

  // ── Estudios latinoamericanos del discurso ────────────────────────────────
  {
    id: "rama",
    short: "Rama",
    year: 1984,
    title: "La ciudad letrada",
    author: "Ángel Rama",
    category: "latam",
    summary:
      "El uruguayo Ángel Rama muestra cómo, desde la colonia, una élite de letrados concentró el poder de la escritura en las ciudades americanas: la letra ordenaba, legislaba y excluía a quienes vivían en la oralidad. La cultura escrita es, en América Latina, una tecnología de poder.",
    concepts: ["Ciudad letrada", "Escritura y poder", "Letrados", "Oralidad"],
    gameDesign:
      "En un juego, quién tiene acceso a los textos (documentos, códices, carteles) define quién sabe y quién manda. Útil para diseñar mundos donde leer es un privilegio, y para revisar qué saberes orales o no escritos quedan fuera del sistema.",
    related: ["foucault", "roig", "quijano"],
    reference: "Rama, Á. (1984). La ciudad letrada. Ediciones del Norte.",
  },
  {
    id: "martin-barbero",
    short: "Martín-Barbero",
    year: 1987,
    title: "De los medios a las mediaciones",
    author: "Jesús Martín-Barbero",
    category: "latam",
    summary:
      "Desde Colombia, Martín-Barbero desplaza la pregunta de los medios a las mediaciones: el sentido no se juega en el mensaje sino en cómo lo apropian los públicos desde su vida cotidiana, sus memorias y sus culturas populares, como pasa con el melodrama y la telenovela.",
    concepts: ["Mediaciones", "Culturas populares", "Recepción", "Melodrama"],
    gameDesign:
      "Los jugadores no reciben un juego: se lo apropian desde sus contextos (cibercafés, consolas compartidas, comunidades). Sirve para estudiar cómo se juega en América Latina y para diseñar pensando en esas mediaciones.",
    related: ["veron", "garcia-canclini", "jenkins"],
    reference: "Martín-Barbero, J. (1987). De los medios a las mediaciones: comunicación, cultura y hegemonía. Gustavo Gili.",
  },
  {
    id: "garcia-canclini",
    short: "García Canclini",
    year: 1990,
    title: "Culturas híbridas",
    author: "Néstor García Canclini",
    category: "latam",
    summary:
      "García Canclini propone pensar la modernidad latinoamericana como hibridación: lo culto, lo popular y lo masivo, lo tradicional y lo moderno se mezclan y se reconvierten. Las identidades no son puras sino cruces en movimiento.",
    concepts: ["Hibridación", "Culto / popular / masivo", "Reconversión cultural", "Desterritorialización"],
    gameDesign:
      "Muchos juegos latinoamericanos mezclan mitología local, cultura pop y géneros globales. La hibridación da un marco para diseñar y analizar esas mezclas sin caer en el folclore de postal.",
    prompt: "¿Qué mezcla cultural propia podría sostener la estética de tu juego?",
    related: ["martin-barbero", "bajtin", "rivera-cusicanqui"],
    reference: "García Canclini, N. (1990). Culturas híbridas: estrategias para entrar y salir de la modernidad. Grijalbo.",
  },
  {
    id: "steimberg",
    short: "Steimberg",
    year: 1993,
    title: "Semiótica de los medios masivos",
    author: "Oscar Steimberg",
    category: "latam",
    summary:
      "Steimberg estudia los géneros y los estilos en los medios: el género como un conjunto de rasgos retóricos, temáticos y enunciativos que generan expectativas, y el estilo como una manera de hacer que atraviesa géneros y época.",
    concepts: ["Géneros", "Estilo", "Rasgos retóricos, temáticos y enunciativos", "Transposición"],
    gameDesign:
      "Los géneros de videojuegos (plataformas, roguelike, survival horror) funcionan igual: prometen reglas, temas y un modo de dirigirse al jugador. Sirve para decidir qué convenciones respetar y cuáles romper.",
    related: ["veron", "bajtin", "juul"],
    reference: "Steimberg, O. (1993). Semiótica de los medios masivos: el pasaje a los medios de los géneros populares. Atuel.",
  },
  {
    id: "bolivar",
    short: "Bolívar",
    year: 1994,
    title: "Discurso e interacción en el texto escrito",
    author: "Adriana Bolívar",
    category: "latam",
    summary:
      "Desde Venezuela, Bolívar analiza el texto escrito como interacción: incluso sin interlocutor presente, quien escribe negocia con quien lee, evalúa y toma posición. Es una de las impulsoras del análisis del discurso en la región.",
    concepts: ["Interacción escrita", "Evaluación", "Diálogo en el texto"],
    gameDesign:
      "Los textos de un juego (tutoriales, cartas, registros) también interactúan con quien juega: lo interpelan, lo evalúan, le dan confianza. Útil para escribir textos que dialoguen.",
    related: ["aled", "van-dijk", "fairclough"],
    reference: "Bolívar, A. (1994). Discurso e interacción en el texto escrito. Universidad Central de Venezuela.",
  },
  {
    id: "aled",
    short: "ALED",
    year: 1995,
    kind: "acontecimiento",
    title: "Nace la Asociación Latinoamericana de Estudios del Discurso",
    author: "",
    category: "latam",
    summary:
      "Se funda ALED, que reúne a investigadoras e investigadores del discurso de toda la región y organiza congresos periódicos y la Revista ALED. Consolida el campo como una tradición latinoamericana propia, en diálogo con el ACD europeo.",
    concepts: ["Comunidad académica", "Revista ALED", "Análisis del discurso"],
    gameDesign:
      "Un punto de entrada para encontrar análisis del discurso hechos desde y sobre América Latina, incluidos medios, política y cultura popular.",
    related: ["bolivar", "pardo-abril", "arnoux"],
    reference: "Asociación Latinoamericana de Estudios del Discurso (ALED), fundada en 1995.",
  },
  {
    id: "filinich",
    short: "Filinich",
    year: 1998,
    title: "Enunciación",
    author: "María Isabel Filinich",
    category: "latam",
    summary:
      "Filinich sistematiza la teoría de la enunciación para el análisis de textos: cómo el discurso construye una figura de quien enuncia y otra de quien recibe, y cómo se marcan en el texto la distancia, la perspectiva y la voz.",
    concepts: ["Enunciación", "Enunciador / enunciatario", "Perspectiva", "Voz"],
    gameDesign:
      "En un juego hay muchas instancias que 'hablan' (narrador, interfaz, personajes, el sistema mismo). Útil para que cada una tenga una voz coherente y para decidir desde dónde le habla el juego a quien juega.",
    related: ["genette", "veron", "bajtin"],
    reference: "Filinich, M. I. (1998). Enunciación. Eudeba.",
  },
  {
    id: "orlandi",
    short: "Orlandi",
    year: 1999,
    title: "Análise de discurso: princípios e procedimentos",
    author: "Eni Orlandi",
    category: "latam",
    summary:
      "Orlandi consolida en Brasil la escuela de análisis del discurso de línea francesa (Pêcheux): el sentido depende de las condiciones de producción y de la memoria discursiva, de lo ya dicho que habla en cada enunciado, y también de los silencios.",
    concepts: ["Memoria discursiva", "Formación discursiva", "Silencio", "Interdiscurso"],
    gameDesign:
      "Un juego se juega con memoria: cada mecánica y cada tropo evocan lo ya jugado. Y también significa por lo que calla. Útil para revisar qué silencios tiene tu mundo.",
    related: ["foucault", "veron", "pardo-abril"],
    reference: "Orlandi, E. P. (1999). Análise de discurso: princípios e procedimentos. Pontes.",
  },
  {
    id: "quijano",
    short: "Quijano",
    year: 2000,
    title: "Colonialidad del poder, eurocentrismo y América Latina",
    author: "Aníbal Quijano",
    category: "latam",
    summary:
      "El peruano Aníbal Quijano propone la noción de colonialidad del poder: la clasificación racial de la población y el eurocentrismo como forma de conocimiento sobrevivieron al fin del colonialismo y siguen organizando el trabajo, la autoridad y el saber.",
    concepts: ["Colonialidad del poder", "Eurocentrismo", "Raza como clasificación", "Giro decolonial"],
    gameDesign:
      "Muchos juegos repiten la lógica colonial: explorar, expandir, explotar, exterminar (4X), o pueblos 'primitivos' como fondo. Un marco para detectarla y para diseñar desde otras perspectivas.",
    prompt: "¿Qué lugar tienen en tu mundo los pueblos que no son los protagonistas?",
    related: ["rama", "rivera-cusicanqui", "roig"],
    reference: "Quijano, A. (2000). 'Colonialidad del poder, eurocentrismo y América Latina'. En E. Lander (comp.), La colonialidad del saber. CLACSO.",
  },
  {
    id: "laclau-populismo",
    short: "Laclau",
    year: 2005,
    title: "La razón populista",
    author: "Ernesto Laclau",
    category: "latam",
    summary:
      "Laclau analiza el populismo como una lógica discursiva: demandas diversas se articulan en una cadena de equivalencias alrededor de un significante vacío (un nombre, un líder, una palabra) y construyen un 'pueblo' frente a un antagonista.",
    concepts: ["Significante vacío", "Cadena de equivalencias", "Antagonismo", "Construcción del pueblo"],
    gameDesign:
      "Útil para diseñar facciones y movimientos políticos creíbles: cómo se unen demandas distintas, qué símbolo las agrupa y contra quién se definen. También para leer la retórica de comunidades y fandoms.",
    related: ["laclau-mouffe", "van-dijk", "arnoux"],
    reference: "Laclau, E. (2005). La razón populista. Fondo de Cultura Económica.",
  },
  {
    id: "arnoux",
    short: "Arnoux",
    year: 2006,
    title: "Análisis del discurso: modos de abordar materiales de archivo",
    author: "Elvira Narvaja de Arnoux",
    category: "latam",
    summary:
      "Arnoux propone el análisis del discurso como práctica interpretativa que se apoya en la lingüística para leer materiales de archivo, y desarrolla la glotopolítica: cómo los Estados y las instituciones intervienen sobre las lenguas y sus usos.",
    concepts: ["Análisis del discurso", "Archivo", "Glotopolítica", "Práctica interpretativa"],
    gameDesign:
      "La glotopolítica abre preguntas concretas para un juego: en qué lenguas y variedades está, cómo habla cada personaje y qué jerarquías construye eso. Útil para la localización y el doblaje.",
    related: ["roig", "veron", "laclau-populismo"],
    reference: "Arnoux, E. N. de (2006). Análisis del discurso: modos de abordar materiales de archivo. Santiago Arcos.",
  },
  {
    id: "pardo-abril",
    short: "Pardo Abril",
    year: 2007,
    title: "Cómo hacer análisis crítico del discurso: una perspectiva latinoamericana",
    author: "Neyla Graciela Pardo Abril",
    category: "latam",
    summary:
      "Desde Colombia, Pardo Abril propone un método de análisis crítico del discurso pensado desde y para América Latina, atento a la violencia, la pobreza y la representación mediática de los conflictos.",
    concepts: ["ACD latinoamericano", "Representación mediática", "Método", "Violencia y discurso"],
    gameDesign:
      "Un método aplicable a juegos que representan conflictos, pobreza o violencia en la región: qué actores aparecen, cómo se los nombra, a quién se le da agencia.",
    related: ["fairclough", "van-dijk", "aled"],
    reference: "Pardo Abril, N. G. (2007). Cómo hacer análisis crítico del discurso: una perspectiva latinoamericana. Frasis.",
  },
  {
    id: "rivera-cusicanqui",
    short: "Rivera Cusicanqui",
    year: 2010,
    title: "Ch'ixinakax utxiwa",
    author: "Silvia Rivera Cusicanqui",
    category: "latam",
    summary:
      "La socióloga aymara-boliviana critica los discursos del multiculturalismo oficial y propone lo ch'ixi: lo que es dos cosas a la vez sin fundirse, como un color hecho de puntos que no se mezclan. Una alternativa a la idea de hibridación armónica.",
    concepts: ["Ch'ixi", "Descolonización", "Multiculturalismo crítico", "Prácticas y discursos"],
    gameDesign:
      "Lo ch'ixi sirve para diseñar identidades y mundos donde las tradiciones conviven en tensión sin resolverse en una síntesis cómoda. También para cuestionar la representación 'decorativa' de pueblos originarios.",
    related: ["garcia-canclini", "quijano", "segato"],
    reference: "Rivera Cusicanqui, S. (2010). Ch'ixinakax utxiwa: una reflexión sobre prácticas y discursos descolonizadores. Tinta Limón.",
  },
];
