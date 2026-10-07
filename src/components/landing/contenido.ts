// Datos de la landing pública (1.2.0, odd/tasks/landing.md). Todo lo que se
// puede querer cambiar sin tocar el diseño vive aquí: redes oficiales,
// anclas, textos, capturas y preguntas. Cambiar un handle = una línea.

export const NAV = [
  { texto: "Qué es", href: "#que-es" },
  { texto: "Cómo funciona", href: "#como-funciona" },
  { texto: "Instalar", href: "#instalar" },
  { texto: "Preguntas", href: "#preguntas" },
] as const;

// Botón de bloque con el padding lateral que .btn no trae
export const BTN = "btn inline-flex items-center justify-center gap-2 px-6";

export type Red = {
  id: "instagram" | "tiktok" | "correo" | "github";
  nombre: string;
  texto: string;
  href: string;
};

// Redes oficiales de la app (Brayan, 2026-10-07).
export const REDES: readonly Red[] = [
  {
    id: "instagram",
    nombre: "Instagram",
    texto: "@dineloapp",
    href: "https://www.instagram.com/dineloapp/",
  },
  {
    id: "tiktok",
    nombre: "TikTok",
    texto: "@dinelo979",
    href: "https://www.tiktok.com/@dinelo979",
  },
  {
    id: "correo",
    nombre: "Correo",
    texto: "dineloapp@gmail.com",
    href: "mailto:dineloapp@gmail.com",
  },
  {
    id: "github",
    nombre: "GitHub",
    texto: "kenshivr/dinelo",
    href: "https://github.com/kenshivr/dinelo",
  },
];

// Páginas de la app accesibles sin sesión, en el orden del pie.
export const ENLACES_APP = [
  { texto: "Crear cuenta", href: "/registro" },
  { texto: "Entrar", href: "/login" },
  { texto: "Recuperar contraseña", href: "/recuperar" },
  { texto: "Privacidad", href: "/privacidad" },
  { texto: "Términos", href: "/terminos" },
] as const;

// Qué es: tres bloques de color (fills f-* de la app).
export const BENEFICIOS = [
  {
    titulo: "Para registrar sin fricción",
    texto:
      "Concepto, monto y listo. Categoría y medio de pago son opcionales: lo que importa es anotarlo en el momento, con una mano.",
    fill: "f-y",
  },
  {
    titulo: "Para saber cuánto te queda",
    texto:
      "El Dash muestra tu saldo real, ingresos contra gastos del mes y a dónde se fue el dinero, por categoría y por día.",
    fill: "f-b",
  },
  {
    titulo: "Gratis y sin anuncios",
    texto:
      "No hay plan premium escondido ni venta de datos. Tu cuenta se borra cuando tú digas, desde la app.",
    fill: "f-g",
  },
] as const;

// Cómo funciona: tres pasos.
export const PASOS = [
  {
    titulo: "Crea tu cuenta",
    texto:
      "Correo y contraseña. Sin tarjeta, sin tienda, sin esperar aprobación.",
  },
  {
    titulo: "Registra tu primer gasto",
    texto:
      "Escribe el concepto, teclea el monto y toca Registrar. Tres toques.",
  },
  {
    titulo: "Mira el Dash",
    texto:
      "Saldo, ingresos contra gastos y el reparto por categoría, al instante.",
  },
] as const;

// Instalar como app, sin tienda.
export const INSTALAR = {
  iphone: [
    "Abre dinelo.vercel.app en Safari.",
    "Toca Compartir (el cuadrito con la flecha).",
    "Elige «Agregar a pantalla de inicio» y confirma.",
  ],
  android: [
    "Abre dinelo.vercel.app en Chrome.",
    "Toca el menú ⋮ o el aviso «Instalar app».",
    "Elige «Agregar a pantalla de inicio» y confirma.",
  ],
} as const;

export type Captura = {
  id: string;
  src: string;
  alt: string;
  etiqueta: string;
  ancho: number;
  alto: number;
};

// Capturas reales de la app (public/landing, webp a 738 px de ancho).
// Nunca la de Cuenta: muestra datos personales.
export const CAPTURAS: readonly Captura[] = [
  {
    id: "dash",
    src: "/landing/dash.webp",
    alt: "Dash de DiNelo con ingresos, gastos, saldo y el reparto por categoría del mes",
    etiqueta: "Dash",
    ancho: 738,
    alto: 1434,
  },
  {
    id: "gastos",
    src: "/landing/gastos.webp",
    alt: "Pantalla Registrar gasto de DiNelo: concepto, monto grande, categorías y medio",
    etiqueta: "Registrar gasto",
    ancho: 738,
    alto: 1431,
  },
  {
    id: "control",
    src: "/landing/control.webp",
    alt: "Control de DiNelo con apartados pendientes y el botón Ya lo pagué",
    etiqueta: "Control › Apartados",
    ancho: 738,
    alto: 1431,
  },
  {
    id: "login-oscuro",
    src: "/landing/login-oscuro.webp",
    alt: "Pantalla de entrada de DiNelo en tema oscuro",
    etiqueta: "Tema oscuro",
    ancho: 738,
    alto: 1454,
  },
];

export const FAQ = [
  {
    pregunta: "¿De verdad es gratis?",
    respuesta:
      "Sí. DiNelo nació como una herramienta personal y hoy está abierta a cualquiera. No hay plan premium, ni prueba que vence, ni anuncios.",
  },
  {
    pregunta: "¿Por qué no está en la tienda?",
    respuesta:
      "Porque no hace falta. Es una app web instalable (PWA): se agrega a tu pantalla de inicio desde Safari o Chrome, queda con su ícono y se actualiza sola.",
  },
  {
    pregunta: "¿Funciona sin conexión?",
    respuesta:
      "Sí. Una vez instalada abre aunque no haya señal; lo que ya cargaste sigue ahí y la captura se sincroniza cuando vuelve la red.",
  },
  {
    pregunta: "¿Se conecta a mi banco?",
    respuesta:
      "No. Tú registras tus gastos e ingresos, en pesos y con centavos. Nadie más tiene tus claves ni tus movimientos reales.",
  },
  {
    pregunta: "¿Qué pasa con mis datos?",
    respuesta:
      "Son tuyos. Cada cuenta ve solo lo suyo, no se venden ni se usan para anuncios, y desde Cuenta puedes borrar tu cuenta completa cuando quieras.",
  },
  {
    pregunta: "¿Puedo ver cómo está hecha?",
    respuesta:
      "Sí. El código es abierto con licencia MIT en GitHub: Next.js, Supabase y Vercel. Puedes leerlo, proponer cambios o correrla tú mismo.",
  },
  {
    pregunta: "¿Para quién es?",
    respuesta:
      "Para personas, no para contadores. Si quieres saber en qué se fue la quincena sin abrir una hoja de cálculo, es para ti.",
  },
] as const;
