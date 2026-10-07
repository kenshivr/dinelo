import { describe, expect, test } from "vitest";
import { datosEstructurados, jsonLdSeguro } from "./datos-estructurados";

// JSON-LD de la landing (odd/tasks/landing.md): solo hechos. DiNelo es
// gratuita, en español de México, con sus redes oficiales como sameAs.

const preguntas = [
  { pregunta: "¿Es gratis?", respuesta: "Sí." },
  { pregunta: "¿Hay tienda?", respuesta: "No: se instala desde el navegador." },
];

// el grafo es un literal tipado; aquí se lee como datos sueltos
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function grafo(): any[] {
  return datosEstructurados(preguntas)["@graph"];
}

describe("datosEstructurados", () => {
  test("lleva Organization, WebSite, SoftwareApplication y FAQPage", () => {
    expect(grafo().map((n) => n["@type"])).toEqual([
      "Organization",
      "WebSite",
      "SoftwareApplication",
      "FAQPage",
    ]);
  });

  test("la organización apunta a las redes oficiales y al correo nuevo", () => {
    const org = grafo()[0] as {
      sameAs: string[];
      contactPoint: { email: string };
    };
    expect(org.sameAs).toEqual([
      "https://www.instagram.com/dineloapp/",
      "https://www.tiktok.com/@dinelo979",
      "https://github.com/kenshivr/dinelo",
    ]);
    expect(org.contactPoint.email).toBe("dineloapp@gmail.com");
    expect(JSON.stringify(grafo())).not.toMatch(/vidal\.fullstack|telephone/);
  });

  test("la app es gratis, en es-MX y con la FAQ completa", () => {
    const app = grafo()[2] as {
      offers: { price: string; priceCurrency: string };
      inLanguage: string;
      applicationCategory: string;
    };
    expect(app.offers.price).toBe("0");
    expect(app.offers.priceCurrency).toBe("MXN");
    expect(app.inLanguage).toBe("es-MX");
    expect(app.applicationCategory).toBe("FinanceApplication");
    const faq = grafo()[3] as { mainEntity: unknown[] };
    expect(faq.mainEntity).toHaveLength(preguntas.length);
  });
});

test("jsonLdSeguro escapa '<' para no cerrar el <script>", () => {
  expect(jsonLdSeguro({ a: "</script><b>" })).not.toContain("<");
  expect(jsonLdSeguro({ a: "</script>" })).toContain("\\u003c/script>");
});
