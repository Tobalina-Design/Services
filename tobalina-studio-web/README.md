# Tobalina — estudio de diseño e identidad

> No hacemos ruido. Hacemos identidad.

Web de marca personal de Tobalina Studio (Beatriz Tobalina). Next.js 14 / TypeScript / Tailwind / Framer Motion.

## Concepto

La web es un pasaporte a pantalla completa (`components/passport/`):

- **Portada** — lo primero que se ve: TOBALINA + "No hacemos ruido. Hacemos identidad.", emblema y título con foil que sigue al cursor, email visible.
- **Doble página** con paso de hoja 3D real sobre el lomo (anverso y reverso). Navegación: flechas del teclado, esquinas de página, barra inferior, índice clicable, swipe en móvil.
  1. Contraportada interior + página de datos (campos de pasaporte, holograma reactivo, número perforado, zona MRZ).
  2. Visado · Identidad corporativa — servicios como sellos de entrada.
  3. Visado · Bodas & eventos — ídem.
  4. Observaciones + Autoridad expedidora (contacto: tobalina.design@gmail.com).
- **Modo UV** (botón UV o tecla U): revela tintas ocultas y fibras fluorescentes, como un pasaporte real bajo luz ultravioleta.
- **Móvil**: girar el teléfono ES abrir el pasaporte. Vertical = portada cerrada; horizontal = pasaporte abierto (detectado por `pointer: coarse` + orientación).
- Tipografía y espaciado escalan con cada página mediante container query units (`u()` en `lib/passport.ts`).

Contenido editable en `lib/passport.ts` y `lib/services.ts`.

## Desarrollo

```bash
npm install
npm run dev
```

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Framer Motion (tilt, spring, transiciones)
- GSAP + Lenis (instalados, pendientes de scroll/timeline en próximas secciones)
- Fuentes autohospedadas: Red Rose (display) + Inter (body) vía `@fontsource`

## Paleta

- `ink` `#232E2C` — portada y texto
- `paper` `#F4EFE6` — fondo base
- `sand` `#E4DBC8` — vertical bodas/eventos
- `foil` `#C9C2B4` — foil y holograma
- `umber` `#7A6A52` — tinta de sellos y etiquetas

## Pendiente

- Copy completo de los dos "documentos" (corporativo / bodas)
- Contenido de la sección de cierre/contacto (sin logos de cliente, confidencialidad)
- Versión en inglés
