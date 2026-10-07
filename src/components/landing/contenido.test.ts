import { describe, expect, test } from "vitest";
import {
  BENEFICIOS,
  CAPTURAS,
  ENLACES_APP,
  FAQ,
  INSTALAR,
  NAV,
  PASOS,
  REDES,
} from "./contenido";

// Datos de la landing (odd/tasks/landing.md): un solo módulo con las redes
// oficiales, las anclas y los textos. Cambiar un handle = una línea.

const RUTAS_APP = [
  "/registro",
  "/login",
  "/recuperar",
  "/privacidad",
  "/terminos",
];

function todosLosHref(): string[] {
  return [
    ...NAV.map((n) => n.href),
    ...REDES.map((r) => r.href),
    ...ENLACES_APP.map((e) => e.href),
  ];
}

describe("contenido — redes oficiales", () => {
  test("Instagram, TikTok, correo y GitHub con sus enlaces exactos", () => {
    const porId = Object.fromEntries(REDES.map((r) => [r.id, r]));
    expect(porId.instagram.href).toBe("https://www.instagram.com/dineloapp/");
    expect(porId.instagram.texto).toBe("@dineloapp");
    expect(porId.tiktok.href).toBe("https://www.tiktok.com/@dinelo979");
    expect(porId.tiktok.texto).toBe("@dinelo979");
    expect(porId.correo.href).toBe("mailto:dineloapp@gmail.com");
    expect(porId.correo.texto).toBe("dineloapp@gmail.com");
    expect(porId.github.href).toBe("https://github.com/kenshivr/dinelo");
    expect(REDES).toHaveLength(4);
  });

  test("ningún texto trae referencias viejas", () => {
    const todo = JSON.stringify({
      NAV,
      REDES,
      ENLACES_APP,
      BENEFICIOS,
      PASOS,
      INSTALAR,
      CAPTURAS,
      FAQ,
    });
    expect(todo).not.toMatch(/vidal\.fullstack|kenshi\.vr|\+DiNelo|\bNelo\b/);
  });
});

describe("contenido — enlaces", () => {
  test("cada href es ancla, ruta interna conocida, https o mailto", () => {
    for (const href of todosLosHref()) {
      expect(href).not.toBe("");
      const valido =
        href.startsWith("#") ||
        RUTAS_APP.includes(href) ||
        href.startsWith("https://") ||
        href.startsWith("mailto:");
      expect(valido, href).toBe(true);
    }
  });

  test("las páginas de la app accesibles desde la landing son cinco", () => {
    expect(ENLACES_APP.map((e) => e.href)).toEqual(RUTAS_APP);
  });

  test("el menú ancla a Qué es, Cómo funciona, Instalar y Preguntas", () => {
    expect(NAV.map((n) => n.href)).toEqual([
      "#que-es",
      "#como-funciona",
      "#instalar",
      "#preguntas",
    ]);
  });
});

describe("contenido — capturas y textos", () => {
  test("las capturas viven en /landing y nunca es la de Cuenta", () => {
    expect(CAPTURAS.length).toBeGreaterThanOrEqual(4);
    for (const c of CAPTURAS) {
      expect(c.src).toMatch(/^\/landing\/[a-z-]+\.webp$/);
      expect(c.src).not.toMatch(/cuenta/);
      expect(c.alt.length).toBeGreaterThan(10);
      expect(c.ancho).toBe(738);
      expect(c.alto).toBeGreaterThan(1400);
    }
  });

  test("tres beneficios, tres pasos y pasos de instalación para iPhone y Android", () => {
    expect(BENEFICIOS).toHaveLength(3);
    expect(PASOS).toHaveLength(3);
    expect(INSTALAR.iphone.length).toBeGreaterThanOrEqual(3);
    expect(INSTALAR.android.length).toBeGreaterThanOrEqual(3);
    expect(INSTALAR.iphone.join(" ")).toMatch(
      /Agregar a (pantalla de )?inicio/,
    );
  });

  test("las preguntas cubren gratis, tienda, anuncios, sin conexión, datos y código abierto", () => {
    const texto = FAQ.map((f) => `${f.pregunta} ${f.respuesta}`).join(" ");
    expect(FAQ.length).toBeGreaterThanOrEqual(6);
    for (const tema of [
      /gratis/i,
      /tienda/i,
      /anuncios/i,
      /sin (conexión|internet)/i,
      /borra/i,
      /código abierto|MIT/i,
    ]) {
      expect(texto).toMatch(tema);
    }
  });
});
