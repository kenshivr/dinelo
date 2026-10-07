import { DESCRIPCION, SITIO } from "./sitio";

export type PreguntaFrecuente = { pregunta: string; respuesta: string };

// Redes oficiales de la app: las mismas que muestra la landing.
const REDES_OFICIALES = [
  "https://www.instagram.com/dineloapp/",
  "https://www.tiktok.com/@dinelo979",
  "https://github.com/kenshivr/dinelo",
];

// JSON-LD de la landing (1.2.0): un solo @graph que Google y los asistentes
// de IA leen para saber qué es DiNelo, que es gratis, cómo contactar y qué se
// pregunta. Solo hechos: nada de reseñas, calificaciones ni conteos.
export function datosEstructurados(preguntas: readonly PreguntaFrecuente[]) {
  const organizacion = `${SITIO}/#organizacion`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizacion,
        name: "DiNelo",
        url: `${SITIO}/`,
        logo: `${SITIO}/icon-512.png`,
        sameAs: REDES_OFICIALES,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "dineloapp@gmail.com",
          availableLanguage: "es",
          areaServed: "MX",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITIO}/#sitio`,
        name: "DiNelo",
        url: `${SITIO}/`,
        inLanguage: "es-MX",
        publisher: { "@id": organizacion },
      },
      {
        "@type": "SoftwareApplication",
        name: "DiNelo",
        url: `${SITIO}/`,
        description: DESCRIPCION,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web, Android, iOS (como app web)",
        inLanguage: "es-MX",
        image: `${SITIO}/opengraph-image.jpg`,
        publisher: { "@id": organizacion },
        license: "https://github.com/kenshivr/dinelo/blob/main/LICENSE",
        featureList: [
          "Registrar gastos e ingresos en tres toques, con pesos y centavos",
          "Categorías con emoji y color; medio de pago opcional",
          "Dash con saldo, ingresos contra gastos, por categoría y por día",
          "Apartados: lo que planeas pagar y lo que ya pagaste",
          "Metas de ahorro con aportes",
          "Historial con búsqueda sin acentos y filtros",
          "Tema claro y oscuro; funciona sin conexión",
          "Sin anuncios; borrar la cuenta desde la app",
        ],
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "MXN",
          description: "Gratis, sin planes ni anuncios",
          url: `${SITIO}/registro`,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: preguntas.map((p) => ({
          "@type": "Question",
          name: p.pregunta,
          acceptedAnswer: { "@type": "Answer", text: p.respuesta },
        })),
      },
    ],
  };
}

// Texto del <script type="application/ld+json">: "<" escapado como
// < para que ningún texto pueda cerrar el <script>.
export function jsonLdSeguro(datos: unknown) {
  return JSON.stringify(datos).replace(/</g, "\\u003c");
}
