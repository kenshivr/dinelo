# ADR 0001 — PWA en vez de app nativa

- **Fecha**: 2026-08-09
- **Estado**: Aceptada

## Contexto

DiNelo nació para dos usuarios concretos: un iPhone y un Android. La app se usa parado
en una tienda, con una mano — tiene que abrir desde la pantalla de inicio, sentirse
nativa y funcionar con mala señal.

Publicar en iOS sin App Store cuesta 99 USD/año (cuenta de desarrollador) o re-firmar
el binario cada 7 días con una cuenta gratuita. Para una app personal de presupuesto
cero, ninguna de las dos es razonable.

## Decisión

PWA instalable: manifest + service worker con Serwist sobre Next.js. Safari
("Agregar a pantalla de inicio") y Chrome ("Instalar app") la montan como ícono
de pantalla completa.

## Consecuencias

- ✅ Cero costo de distribución y sin revisión de tiendas: `git push` a `main` actualiza
  la app en todos los teléfonos.
- ✅ Un solo código para las dos plataformas.
- ✅ Offline y shortcuts de pantalla de inicio cubiertos por el service worker.
- ⚠️ Sin notificaciones push confiables en iOS (existen desde 16.4 pero son frágiles);
  quedaron fuera de v1.
- ⚠️ La instalación depende del navegador correcto (en Android tiene que ser Chrome;
  Firefox marca el ícono con su insignia) — se resolvió con un tutorial de instalación
  con capturas.
- ⚠️ El service worker cachea agresivo: tras un deploy, una PWA abierta puede mostrar
  la versión anterior hasta reabrirse (mordió en producción — ver el fix del avatar
  del header).
