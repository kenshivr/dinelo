import { describe, expect, test } from "vitest";
import { destinoSinSesion, esEntrada, esPublica } from "./rutas";

// Puerta del proxy (landing 1.2.0, odd/tasks/landing.md): sin sesión la raíz
// SIRVE la landing sin redirigir (el 307 costaba LCP), /landing es pública y
// las rutas profundas siguen yendo a /login.

describe("rutas — qué es público", () => {
  test("las pantallas de entrada son públicas y de entrada", () => {
    for (const ruta of ["/login", "/registro", "/recuperar"]) {
      expect(esEntrada(ruta)).toBe(true);
      expect(esPublica(ruta)).toBe(true);
    }
  });

  test("la landing, los enlaces de correo, el SW, offline y las legales son públicas", () => {
    for (const ruta of [
      "/landing",
      "/auth/confirm",
      "/serwist/sw.js",
      "/~offline",
      "/privacidad",
      "/terminos",
    ]) {
      expect(esPublica(ruta)).toBe(true);
      expect(esEntrada(ruta)).toBe(false);
    }
  });

  test("la raíz y las tabs no son públicas", () => {
    for (const ruta of ["/", "/gastos", "/dash", "/cuenta/historial"]) {
      expect(esPublica(ruta)).toBe(false);
    }
  });
});

describe("rutas — destino sin sesión", () => {
  test('"/" se reescribe a /landing', () => {
    expect(destinoSinSesion("/")).toEqual({
      pathname: "/landing",
      modo: "rewrite",
    });
  });

  test("una ruta profunda redirige a /login", () => {
    expect(destinoSinSesion("/gastos")).toEqual({
      pathname: "/login",
      modo: "redirect",
    });
  });
});
