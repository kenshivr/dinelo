import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { datosEstructurados, jsonLdSeguro } from "@/lib/datos-estructurados";
import { DESCRIPCION } from "@/lib/sitio";
import {
  BENEFICIOS,
  BTN,
  CAPTURAS,
  ENLACES_APP,
  FAQ,
  INSTALAR,
  PASOS,
  REDES,
  type Captura,
  type Red,
} from "@/components/landing/contenido";
import {
  IconoChevron,
  IconoCorreo,
  IconoGitHub,
  IconoInstagram,
  IconoTikTok,
} from "@/components/landing/iconos";
import { LandingCabecera } from "@/components/landing/landing-cabecera";
import { LandingDemo } from "@/components/landing/landing-demo";
import { Revelar } from "@/components/landing/revelar";
import "@/components/landing/landing.css";

// La landing es la portada canónica: "/" la sirve sin sesión (proxy). El
// título es absoluto para no heredar el del layout. openGraph y twitter van
// completos, imagen incluida: un openGraph propio REEMPLAZA el del layout.
const TITULO_PAGINA = "DiNelo — gastos e ingresos, claros en un solo lugar";
const ALT_IMAGEN = "DiNelo: la placa amarilla de la app de gastos e ingresos";

export const metadata: Metadata = {
  title: { absolute: TITULO_PAGINA },
  description: DESCRIPCION,
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    type: "website",
    locale: "es_MX",
    siteName: "DiNelo",
    title: TITULO_PAGINA,
    description: DESCRIPCION,
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: ALT_IMAGEN,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO_PAGINA,
    description: DESCRIPCION,
    images: [{ url: "/opengraph-image.jpg", alt: ALT_IMAGEN }],
  },
};

// JSON-LD para Google y asistentes de IA, con las mismas preguntas de la página.
const jsonLd = jsonLdSeguro(datosEstructurados(FAQ));

const CONTENEDOR = "mx-auto w-full max-w-6xl px-[18px]";
const SECCION = "scroll-mt-24 py-14 md:py-20";
const TITULO =
  "text-[clamp(1.9rem,4.5vw,2.9rem)] leading-[1.08] font-black tracking-tight text-balance";
const TEXTO = "max-w-[60ch] text-[16px] leading-relaxed text-muted-foreground";
const ETIQUETA =
  "inline-block w-fit rounded-full border-2 bg-foreground px-3 py-1 text-[13px] font-black text-background";

const ICONOS_RED = {
  instagram: IconoInstagram,
  tiktok: IconoTikTok,
  correo: IconoCorreo,
  github: IconoGitHub,
} as const;

function EnlaceRed({ r, className }: { r: Red; className?: string }) {
  const Icono = ICONOS_RED[r.id];
  const externo = r.href.startsWith("https://");
  return (
    <a
      href={r.href}
      {...(externo && { target: "_blank", rel: "noopener noreferrer" })}
      className={cn("flex items-center gap-2.5", className)}
    >
      <Icono />
      <span className="flex min-w-0 flex-col leading-tight">
        <b className="text-[14px] font-black">{r.nombre}</b>
        <span className="truncate text-[13.5px] text-muted-foreground">
          {r.texto}
        </span>
      </span>
    </a>
  );
}

// Captura real dentro de un marco de teléfono, con width/height para no
// mover el layout mientras carga.
function Telefono({
  c,
  eager = false,
  className,
}: {
  c: Captura;
  eager?: boolean;
  className?: string;
}) {
  return (
    <figure className={cn("marco-tel", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- webp ya optimizado en public/landing; sin pasar por el optimizador */}
      <img
        src={c.src}
        alt={c.alt}
        width={c.ancho}
        height={c.alto}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        decoding="async"
      />
    </figure>
  );
}

function Numero({ n, fill }: { n: number; fill: string }) {
  return (
    <span
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-xl border-2 text-[22px] font-black shadow-[3px_3px_0_var(--sh)]",
        fill,
      )}
    >
      {n}
    </span>
  );
}

function Pasos({
  titulo,
  pasos,
  fill,
}: {
  titulo: string;
  pasos: readonly string[];
  fill: string;
}) {
  return (
    <div className="nbs flex flex-col gap-4 p-5">
      <b className="text-[18px] font-black">{titulo}</b>
      <ol className="flex flex-col gap-3">
        {pasos.map((p, i) => (
          <li
            key={p}
            className="flex items-center gap-3 text-[15px] font-semibold"
          >
            <span className={cn("tag size-7 text-[13px]", fill)}>{i + 1}</span>
            {p}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function LandingPage() {
  const [dash, gastos, control, oscuro] = CAPTURAS;
  return (
    <main className="landing-raiz flex w-full flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <LandingCabecera />

      {/* Hero: titular con marcador, dos CTA y el Dash con chips flotando */}
      <section
        data-testid="hero"
        className={cn(
          CONTENEDOR,
          "grid items-center gap-10 pt-10 pb-14 lg:grid-cols-[55fr_45fr] lg:gap-12 lg:pt-16 lg:pb-20",
        )}
      >
        <div className="flex flex-col gap-5">
          <span className={ETIQUETA}>Gratis · sin tienda · sin anuncios</span>
          <h1 className="text-[clamp(2.4rem,6.5vw,4.4rem)] leading-[1.04] font-black tracking-tight text-balance">
            Tus gastos e ingresos, <em>claros</em> en un solo lugar.
          </h1>
          <p className="max-w-[46ch] text-[18px] leading-snug text-muted-foreground">
            Registra en segundos, mira a dónde se va tu dinero y cuánto te queda
            de verdad. Se instala desde el navegador.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/registro" className={cn(BTN, "f-gg w-full sm:w-auto")}>
              Crear cuenta gratis
            </Link>
            <Link href="/login" className={cn(BTN, "w-full sm:w-auto")}>
              Ya tengo cuenta
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[340px] pt-6 pb-10 sm:max-w-[360px]">
          <Telefono c={dash} eager className="-rotate-2" />
          <span className="chip f-y flota -top-1 -left-4 rotate-[-6deg] text-[15px] sm:-left-10">
            🍔 Comida · 57%
          </span>
          <span className="chip f-p flota top-[38%] -right-5 rotate-[5deg] text-[15px] sm:-right-12">
            🎉 Diversión · 30%
          </span>
          <div className="stat f-gg flota -bottom-2 -left-3 rotate-[-4deg] sm:-left-12">
            <span className="text-[13px] font-black tracking-[0.1em] uppercase">
              Saldo
            </span>
            <div className="text-[26px] leading-none font-black tabular-nums">
              $8,490.00
            </div>
          </div>
        </div>
      </section>

      {/* Qué es: tres bloques de color */}
      <section id="que-es" className={SECCION}>
        <Revelar className={cn(CONTENEDOR, "flex flex-col gap-8")}>
          <div className="flex flex-col gap-3">
            <h2 className={TITULO}>
              Una app de gastos para <em>personas</em>, no para contadores.
            </h2>
            <p className={TEXTO}>
              Sin presupuestos complicados ni reportes de veinte páginas. Tiene
              lo que usas todos los días y nada más.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {BENEFICIOS.map((b) => (
              <div
                key={b.titulo}
                className={cn(
                  "flex flex-col gap-2 rounded-2xl border-2 p-5 shadow-[5px_5px_0_var(--sh)]",
                  b.fill,
                )}
              >
                <h3 className="text-[19px] leading-tight font-black">
                  {b.titulo}
                </h3>
                <p className="text-[14.5px] leading-relaxed font-semibold">
                  {b.texto}
                </p>
              </div>
            ))}
          </div>
        </Revelar>
      </section>

      {/* Cómo funciona: tres pasos y la demo */}
      <section id="como-funciona" className={SECCION}>
        <Revelar className={cn(CONTENEDOR, "flex flex-col gap-10")}>
          <div className="flex flex-col gap-3">
            <h2 className={TITULO}>
              Registra un gasto en lo que dura <em>el semáforo</em>.
            </h2>
            <p className={TEXTO}>
              Tres pasos para empezar. Y abajo, la captura tal como se siente en
              la app: elige un concepto, confirma el monto y registra.
            </p>
          </div>
          <ol className="grid gap-4 md:grid-cols-3">
            {PASOS.map((p, i) => (
              <li key={p.titulo} className="nbs flex items-start gap-4 p-5">
                <Numero n={i + 1} fill={["f-y", "f-p", "f-gg"][i]} />
                <div className="flex flex-col gap-1">
                  <b className="text-[17px] leading-tight font-black">
                    {p.titulo}
                  </b>
                  <span className="text-[14.5px] leading-snug text-muted-foreground">
                    {p.texto}
                  </span>
                </div>
              </li>
            ))}
          </ol>
          <LandingDemo />
        </Revelar>
      </section>

      {/* Funciones: composiciones distintas, como en las piezas de redes */}
      <section id="funciones" className={SECCION}>
        <div className={cn(CONTENEDOR, "flex flex-col gap-14 md:gap-20")}>
          <Revelar className="flex flex-col gap-3">
            <h2 className={TITULO}>Lo demás que hace por ti.</h2>
          </Revelar>

          {/* Apartados: la tarjeta reconstruida con «Ya lo pagué» + la captura */}
          <Revelar className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="flex flex-col gap-4">
              <span className={ETIQUETA}>Control</span>
              <h3 className="text-[26px] leading-tight font-black">
                Apartados
              </h3>
              <p className={TEXTO}>
                Lo que planeas pagar y lo que ya pagaste, en la misma pantalla.
                Anota la renta, la luz o la tarjeta antes de pagarlas; el día
                que lo hagas, un toque y se vuelve gasto real.
              </p>
              <div className="nbs flex flex-col gap-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[17px] font-black">
                    <span className="tag f-p" aria-hidden /> Renta
                  </span>
                  <b className="text-[20px] font-black tabular-nums">
                    $3,000.00
                  </b>
                </div>
                <span className="btn f-gg text-[15px]">✓ Ya lo pagué</span>
              </div>
            </div>
            <Telefono
              c={control}
              className="mx-auto w-full max-w-[300px] rotate-2"
            />
          </Revelar>

          {/* Metas: barra de progreso en bloque */}
          <Revelar className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="order-2 flex flex-col gap-4 lg:order-1">
              <div className="stat f-b flex flex-col gap-3 py-4">
                <div className="flex items-center justify-between">
                  <b className="text-[18px] font-black">
                    ✈️ Viaje de diciembre
                  </b>
                  <span className="chip f-y text-[13px]">65%</span>
                </div>
                <div className="text-[28px] font-black tabular-nums">
                  $9,750.00{" "}
                  <span className="text-[15px] font-extrabold">
                    de $15,000.00
                  </span>
                </div>
                <div className="bfill overflow-hidden bg-background">
                  <div className="f-gg h-full w-[65%]" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "+$3,000 · 15 jul",
                    "+$3,000 · 30 jul",
                    "+$3,750 · 15 ago",
                  ].map((a) => (
                    <span key={a} className="chip f-g text-[13px]">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 flex flex-col gap-4 lg:order-2">
              <span className={ETIQUETA}>Control</span>
              <h3 className="text-[26px] leading-tight font-black">Metas</h3>
              <p className={TEXTO}>
                Ahorrar con fecha se siente distinto. Cada meta tiene nombre,
                monto y aportes; cada aporte mueve la barra y te dice cuánto
                falta.
              </p>
            </div>
          </Revelar>

          {/* Historial: buscador reconstruido */}
          <Revelar className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="flex flex-col gap-4">
              <span className={ETIQUETA}>Cuenta</span>
              <h3 className="text-[26px] leading-tight font-black">
                Historial
              </h3>
              <p className={TEXTO}>
                Busca sin acentos, filtra sin esfuerzo. «cafe» encuentra «Café»;
                filtra por tipo, categoría, medio y mes, y edita o borra
                cualquier registro.
              </p>
            </div>
            <div className="nbs flex flex-col gap-3 p-4">
              <div className="nbs flex items-center gap-2 px-3 py-2.5 text-[15px] font-black">
                <span aria-hidden>🔍</span> cafe
                <span className="ml-auto text-[13px] font-extrabold text-muted-foreground">
                  sin acentos
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="chip f-y text-[13px]">Gastos</span>
                <span className="chip text-[13px]">☕ Café</span>
                <span className="chip text-[13px]">💵 Efectivo</span>
                <span className="chip text-[13px]">Agosto</span>
              </div>
              {[
                ["Café con leche", "Café", "$45.00"],
                ["Café de olla", "Café", "$30.00"],
                ["Cafetería del trabajo", "Comida", "$120.00"],
              ].map(([c, cat, m]) => (
                <div
                  key={c}
                  className="flex items-center justify-between border-t-2 pt-3 text-[14.5px] font-extrabold"
                >
                  <span>
                    {c}{" "}
                    <span className="text-[13px] font-semibold text-muted-foreground">
                      · {cat}
                    </span>
                  </span>
                  <span className="tabular-nums">{m}</span>
                </div>
              ))}
            </div>
          </Revelar>

          {/* Tema: dos teléfonos */}
          <Revelar className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="order-2 flex justify-center gap-4 lg:order-1">
              <Telefono
                c={CAPTURAS[3]}
                className="w-[42%] max-w-[220px] -rotate-2"
              />
              <Telefono
                c={{
                  ...oscuro,
                  id: "login-claro",
                  src: "/landing/login-claro.webp",
                  alt: "Pantalla de entrada de DiNelo en tema claro",
                  alto: 1434,
                }}
                className="w-[42%] max-w-[220px] rotate-2"
              />
            </div>
            <div className="order-1 flex flex-col gap-4 lg:order-2">
              <span className={ETIQUETA}>Cuenta</span>
              <h3 className="text-[26px] leading-tight font-black">
                Claro u oscuro
              </h3>
              <p className={TEXTO}>
                Tú eliges. Los bloques de color no cambian entre temas: es la
                identidad de la app. Lo demás, sí.
              </p>
            </div>
          </Revelar>
        </div>
      </section>

      {/* Capturas reales */}
      <section id="capturas" className={SECCION}>
        <Revelar className={cn(CONTENEDOR, "flex flex-col gap-8")}>
          <h2 className={TITULO}>Así se ve.</h2>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-7">
            {[dash, gastos, control, oscuro].map((c, i) => (
              <div key={c.id} className="flex flex-col items-center gap-7">
                <Telefono c={c} className={i % 2 ? "rotate-1" : "-rotate-1"} />
                <span className="chip text-[13px]">{c.etiqueta}</span>
              </div>
            ))}
          </div>
        </Revelar>
      </section>

      {/* Instalar */}
      <section id="instalar" className={SECCION}>
        <Revelar className={cn(CONTENEDOR, "flex flex-col gap-8")}>
          <div className="flex flex-col gap-3">
            <h2 className={TITULO}>
              Tres pasos. <em className="verde">Cero tienda.</em>
            </h2>
            <p className={TEXTO}>
              Es una app web instalable: queda con su ícono, abre a pantalla
              completa y funciona sin conexión. Instálala desde Chrome en
              Android; Firefox le pone su propia insignia al ícono.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Pasos
              titulo="iPhone · Safari"
              pasos={INSTALAR.iphone}
              fill="f-y"
            />
            <Pasos
              titulo="Android · Chrome"
              pasos={INSTALAR.android}
              fill="f-gg"
            />
          </div>
          <Link href="/registro" className={cn(BTN, "f-y w-full sm:w-fit")}>
            Abrir dinelo.vercel.app →
          </Link>
        </Revelar>
      </section>

      {/* Preguntas frecuentes */}
      <section id="preguntas" className={SECCION}>
        <Revelar className={cn(CONTENEDOR, "flex flex-col gap-8")}>
          <h2 className={TITULO}>Preguntas frecuentes.</h2>
          <div className="landing-faq grid gap-4 md:grid-cols-2">
            {FAQ.map((f) => (
              <details key={f.pregunta} className="nbs p-4">
                <summary className="flex items-center justify-between gap-3 text-[16px] font-black">
                  {f.pregunta}
                  <IconoChevron className="shrink-0" />
                </summary>
                <p className="pt-3 text-[14.5px] leading-relaxed text-muted-foreground">
                  {f.respuesta}
                </p>
              </details>
            ))}
          </div>
        </Revelar>
      </section>

      {/* Pie */}
      <footer role="contentinfo" className="border-t-2 bg-card">
        <div
          className={cn(
            CONTENEDOR,
            "grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]",
          )}
        >
          <div className="flex flex-col items-start gap-4">
            <Link
              href="/landing"
              className="f-y -rotate-2 rounded-xl border-2 px-4 py-1.5 text-[24px] font-black tracking-tighter shadow-[4px_4px_0_var(--sh)]"
            >
              DiNelo
            </Link>
            <p className="max-w-[40ch] text-[14.5px] leading-relaxed text-muted-foreground">
              Gastos e ingresos, claros en un solo lugar. Gratis, sin tienda,
              sin anuncios.
            </p>
          </div>
          <nav aria-label="Páginas" className="flex flex-col gap-2">
            <b className="text-[13px] font-black tracking-[0.1em] uppercase text-muted-foreground">
              La app
            </b>
            {ENLACES_APP.map((e) => (
              <Link
                key={e.href}
                href={e.href}
                className="text-[14.5px] font-extrabold"
              >
                {e.texto}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3">
            <b className="text-[13px] font-black tracking-[0.1em] uppercase text-muted-foreground">
              Síguenos
            </b>
            {REDES.map((r) => (
              <EnlaceRed key={r.id} r={r} />
            ))}
          </div>
        </div>
        <div
          className={cn(
            CONTENEDOR,
            "pb-8 text-[13.5px] font-semibold text-muted-foreground",
          )}
        >
          © 2026 DiNelo · Hecha en México · Código abierto (MIT)
        </div>
      </footer>
    </main>
  );
}
