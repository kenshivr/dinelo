# Landing pública de DiNelo + redes oficiales (1.2.0)

Locator: `odd/tasks/landing.md` · Engram mirror: dinelo `odd/landing/tasks`
Fecha: 2026-10-07 · TDD: ON (Strict TDD Mode del entorno; runner `pnpm test` = vitest run; patrón de masdinelo: cada componente con su .test.tsx) · Checks: `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm build`

## Objetivo
Landing pública de DiNelo (gratis) inspirada en la de masdinelo (`/landing` + proxy que reescribe "/" sin sesión), SIN personaje ni pulpo:
qué es, para qué, demo de funcionalidad con componentes sueltos estilo Bloque (como las piezas de redes), capturas reales, enlaces a las
páginas accesibles (registro, login, recuperar, privacidad, términos, GitHub) y a las redes oficiales. Además, corregir referencias viejas.

## Redes oficiales (fuente de verdad)
- Instagram https://www.instagram.com/dineloapp/ · TikTok https://www.tiktok.com/@dinelo979 · correo dineloapp@gmail.com · web https://dinelo.vercel.app · GitHub https://github.com/kenshivr/dinelo

## Decisiones
- Ruta `/landing`; proxy: sin sesión "/" se REESCRIBE a /landing (antes al login); con sesión "/" → /gastos. /landing pública. La puerta
  (`esEntrada`, `esPublica`, `destinoSinSesion`) vive en `src/lib/rutas.ts` como funciones puras con pruebas.
- Un solo módulo `src/components/landing/contenido.ts` con REDES/ENLACES_APP/NAV/BENEFICIOS/PASOS/INSTALAR/CAPTURAS/FAQ (cambiar un handle = una línea).
- Capturas: docs/capturas (dash, gastos, control, login-claro, login-oscuro) → webp q80 en public/landing/ (15–33 KB); NUNCA cuenta.jpeg (datos reales).
  `<img>` plano con width/height, lazy salvo el hero (eager + fetchPriority high): sin pasar por el optimizador y sin salto de layout.
- PageSpeed: sin JS extra salvo la demo y la cabecera (client), CSS propio `landing.css` (marcador amarillo del titular, marco de teléfono,
  revelado, FAQ, menú móvil), fuentes del sistema, `Revelar` visible por defecto (sin CLS).
- Versión 1.2.0 (minor: feature), CHANGELOG, release notes en Downloads\nelo\dinelo\release-1.2.0.md, README (redes + landing).
- Claude NO commitea: mensaje en .git/mensaje-commit.txt; Brayan corre git add/commit, tag y gh release.
- Puerto 3004 en `dev`/`start` (cambio local de Brayan ya en el árbol; va en el mismo commit).

## Tareas
- [x] T1 Referencias viejas: privacidad y términos → mailto dineloapp@gmail.com; README/README.en con redes y landing; llms.txt
- [x] T2 contenido.ts + tests (datos, enlaces válidos, sin referencias viejas)
- [x] T3 Proxy: "/" sin sesión → /landing (ruta pública) + lib/rutas.ts con test
- [x] T4 Componentes Bloque (landing-cabecera, landing-demo, revelar, iconos, landing.css) con tests RED→GREEN
- [x] T5 page.tsx /landing con metadata absoluta + openGraph/twitter + JSON-LD (lib/datos-estructurados.ts); sitemap incluye / y /landing
- [x] T6 Capturas webp en public/landing
- [x] T7 Versión 1.2.0: package.json, CHANGELOG, release-1.2.0.md, README
- [x] T8 Checks: test, lint, typecheck, build; revisión visual (dev server + captura móvil 390 y escritorio 1366)
- [x] T9 Mensaje de commit en .git/mensaje-commit.txt

## Evidencia (7-oct-2026)
- RED observado: 7 archivos de prueba fallaron por módulos inexistentes antes de implementar; GREEN: `pnpm test` → 16 archivos, 111 pruebas OK
  (46 nuevas: rutas 5, datos-estructurados 4, contenido 7, cabecera 3, demo 8, revelar 3, page 14).
- `pnpm lint` sin avisos · `pnpm typecheck` OK · `pnpm build` OK (`/landing` estático ○; proxy ƒ; Serwist genera sw.js).
- Revisión visual con el dev server de Brayan en :3004 (el mío falló por EADDRINUSE; el suyo recargó los cambios): `/` sin sesión responde
  200 con el título de la landing; escritorio 1366 y móvil 390 (emulado por DevTools: `scrollWidth` = 390, cero elementos desbordados).
  Capturas en el scratchpad de la sesión (landing-escritorio*.png, landing-movil-*.png). Tema oscuro (el del sistema en esta PC); el claro
  no se capturó: los componentes usan los tokens de la app y los fills Bloque son constantes en ambos temas.
- Edge headless en Windows no baja de ~468 px de ancho con --window-size; para móvil real hay que emular por CDP (Emulation.setDeviceMetricsOverride).
- Un iframe local no sirve para capturar la app: `X-Frame-Options: DENY` (next.config).

## Comandos para Brayan (en orden)
```
git add .; git commit -F .git/mensaje-commit.txt
git push
git tag -a v1.2.0 -m "DiNelo 1.2.0"; git push --tags
gh release create v1.2.0 --title "DiNelo 1.2.0" --notes-file "C:\Users\Admon\Downloads\nelo\dinelo\release-1.2.0.md"
```
(en 1.1.1 el `chore(release)` fue un commit aparte con CHANGELOG + package.json; esta vez el bump va dentro del feat por la regla de un commit por día; el tag y el release se hacen igual.)

## Siguiente paso
Brayan revisa la landing en localhost:3004 (claro y oscuro) y en el teléfono; commit, push, tag y release; luego PageSpeed de `/` para confirmar 100.
- 7-oct (ajustes de Brayan): badge 65% de Metas en amarillo (se perdia en oscuro), gap-7 entre telefonos y etiquetas en "Asi se ve", boton de tema claro/oscuro en la cabecera (TemaBoton, next-themes + useHidratado, test RED→GREEN). 112 tests, lint y tsc OK; verificado con captura del dev server.
- 7-oct (cierre): logo → /landing en toda la app: `src/components/logo.tsx` (grande/chico) + logo.test.tsx (RED→GREEN), usado en login, registro, recuperar, restablecer, privacidad, términos, ~offline y page-header. /landing es pública también con sesión (no rebota). 114 tests, lint, tsc OK. Documentado en CHANGELOG, release-1.2.0.md y DINELO.md.
