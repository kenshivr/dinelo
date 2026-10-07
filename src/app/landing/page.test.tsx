import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import {
  CAPTURAS,
  ENLACES_APP,
  FAQ,
  NAV,
  REDES,
} from "@/components/landing/contenido";
import LandingPage, { metadata } from "./page";

// Landing pública /landing (odd/tasks/landing.md): el proxy la sirve en "/"
// sin sesión. Sin personaje ni pulpo: bloques, capturas reales y una demo.

describe("LandingPage — metadatos", () => {
  test("título absoluto, descripción propia y canónica /", () => {
    expect(metadata.title).toMatchObject({
      absolute: expect.stringMatching(/^DiNelo — /),
    });
    expect(String(metadata.description)).toMatch(/gratis|gratuita/i);
    expect(metadata.alternates?.canonical).toBe("/");
  });

  test("openGraph y twitter completos con la imagen existente", () => {
    expect(metadata.openGraph).toMatchObject({
      url: "/",
      type: "website",
      locale: "es_MX",
      siteName: "DiNelo",
    });
    expect(JSON.stringify(metadata.openGraph)).toMatch(/opengraph-image\.jpg/);
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
  });

  test("lleva el JSON-LD con la app gratis y cada pregunta frecuente", () => {
    const { container } = render(<LandingPage />);
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    )!;
    expect(script).not.toBeNull();
    expect(script.innerHTML).not.toContain("<");
    const datos = JSON.parse(script.textContent!);
    const faq = datos["@graph"].find(
      (n: { "@type": string }) => n["@type"] === "FAQPage",
    );
    expect(faq.mainEntity).toHaveLength(FAQ.length);
    expect(JSON.stringify(datos)).toMatch(/"price":"0"/);
  });
});

describe("LandingPage — estructura", () => {
  test("cada sección del menú existe con su id y hay capturas e instalación", () => {
    const { container } = render(<LandingPage />);
    for (const n of NAV) {
      expect(container.querySelector(`section${n.href}`)).not.toBeNull();
    }
    expect(container.querySelector("section#funciones")).not.toBeNull();
    expect(container.querySelector("section#capturas")).not.toBeNull();
  });

  test("el encabezado enlaza las anclas y las pantallas públicas", () => {
    render(<LandingPage />);
    const header = screen.getByRole("banner");
    const nav = within(header).getAllByRole("navigation", {
      name: "Secciones",
    })[0];
    expect(
      within(nav)
        .getAllByRole("link")
        .map((a) => a.getAttribute("href")),
    ).toEqual(NAV.map((n) => n.href));
    expect(
      within(header).getByRole("link", { name: "Entrar" }),
    ).toHaveAttribute("href", "/login");
  });

  test("sin personaje, sin pulpo y sin la captura de Cuenta", () => {
    const { container } = render(<LandingPage />);
    const srcs = [...container.querySelectorAll("img")].map(
      (i) => i.getAttribute("src") ?? "",
    );
    expect(srcs.length).toBeGreaterThan(0);
    for (const src of srcs) {
      expect(src).not.toMatch(/personaje|pulpo|nelo\/|cuenta/i);
      expect(src).toMatch(/\/landing\//);
    }
  });
});

describe("LandingPage — hero y qué es", () => {
  test("el H1 lleva el marcador y los dos CTA van a registro y login", () => {
    render(<LandingPage />);
    const hero = screen.getByTestId("hero");
    const h1 = within(hero).getByRole("heading", { level: 1 });
    expect(h1.querySelector("em")).not.toBeNull();
    expect(
      within(hero).getByRole("link", { name: /Crear cuenta gratis/ }),
    ).toHaveAttribute("href", "/registro");
    expect(
      within(hero).getByRole("link", { name: /Ya tengo cuenta/ }),
    ).toHaveAttribute("href", "/login");
    expect(hero.querySelector('img[src="/landing/dash.webp"]')).not.toBeNull();
  });

  test("Qué es: tres bloques y la promesa de gratis sin anuncios", () => {
    render(<LandingPage />);
    const queEs = document.getElementById("que-es")!;
    expect(within(queEs).getAllByRole("heading", { level: 3 })).toHaveLength(3);
    expect(queEs.textContent).toMatch(/gratis/i);
    expect(queEs.textContent).toMatch(/sin anuncios/i);
  });
});

describe("LandingPage — funciones y demo", () => {
  test("Cómo funciona: tres pasos numerados y la demo con su mini Dash", () => {
    render(<LandingPage />);
    const como = document.getElementById("como-funciona")!;
    expect(within(como).getAllByText(/^[123]$/)).toHaveLength(3);
    expect(within(como).getByTestId("mini-dash")).toBeInTheDocument();
    expect(
      within(como).getByRole("button", { name: /Registrar gasto/ }),
    ).toBeInTheDocument();
  });

  test("Funciones: Apartados con «Ya lo pagué», Metas, Historial y tema", () => {
    render(<LandingPage />);
    const funciones = document.getElementById("funciones")!;
    for (const nombre of [
      "Apartados",
      "Metas",
      "Historial",
      "Claro u oscuro",
    ]) {
      expect(
        within(funciones).getByRole("heading", { name: nombre }),
      ).toBeInTheDocument();
    }
    expect(within(funciones).getByText(/Ya lo pagué/)).toBeInTheDocument();
  });

  test("las capturas reales se pintan con su alt y tamaño", () => {
    const { container } = render(<LandingPage />);
    const galeria = container.querySelector("#capturas")!;
    for (const c of CAPTURAS) {
      const img = galeria.querySelector(`img[src="${c.src}"]`);
      expect(img).not.toBeNull();
      expect(img).toHaveAttribute("alt", c.alt);
      expect(img).toHaveAttribute("width");
      expect(img).toHaveAttribute("height");
    }
  });
});

describe("LandingPage — instalar, preguntas y pie", () => {
  test("Instalar explica iPhone y Android sin insignias de tiendas", () => {
    render(<LandingPage />);
    const instalar = document.getElementById("instalar")!;
    expect(within(instalar).getAllByText(/iPhone/).length).toBeGreaterThan(0);
    expect(within(instalar).getAllByText(/Android/).length).toBeGreaterThan(0);
    expect(
      screen.queryByText(/Google Play|App Store/i),
    ).not.toBeInTheDocument();
  });

  test("cada pregunta es un <details> con su <summary>", () => {
    const { container } = render(<LandingPage />);
    const items = container.querySelectorAll("#preguntas details");
    expect(items.length).toBe(FAQ.length);
    for (const { pregunta } of FAQ) {
      expect(screen.getByText(pregunta).tagName).toBe("SUMMARY");
    }
  });

  test("el pie enlaza las páginas de la app, las redes y el correo", () => {
    render(<LandingPage />);
    const pie = screen.getByRole("contentinfo");
    for (const e of ENLACES_APP) {
      expect(within(pie).getByRole("link", { name: e.texto })).toHaveAttribute(
        "href",
        e.href,
      );
    }
    for (const r of REDES) {
      const enlace = within(pie).getByRole("link", {
        name: new RegExp(r.texto),
      });
      expect(enlace).toHaveAttribute("href", r.href);
      if (r.href.startsWith("https://")) {
        expect(enlace).toHaveAttribute("target", "_blank");
        expect(enlace).toHaveAttribute("rel", "noopener noreferrer");
      }
    }
    expect(pie).toHaveTextContent(/© 2026 DiNelo/);
    expect(pie).toHaveTextContent(/Hecha en México/);
    expect(pie).toHaveTextContent(/MIT/);
    expect(within(pie).getByText("DiNelo").closest("a")).toHaveAttribute(
      "href",
      "/landing",
    );
  });

  test("ningún texto de la landing baja de 13px ni nombra a nadie", () => {
    const { container } = render(<LandingPage />);
    expect(
      container.querySelectorAll(
        '[class*="text-[9"], [class*="text-[10"], [class*="text-[11"], [class*="text-[12"]',
      ),
    ).toHaveLength(0);
    const visible = container.cloneNode(true) as HTMLElement;
    visible.querySelectorAll("script").forEach((x) => x.remove());
    expect(visible.textContent).not.toMatch(/\bNelo\b|\+DiNelo|vidal/);
  });
});
