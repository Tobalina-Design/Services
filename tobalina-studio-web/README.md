# Tobalina — estudio de diseño e identidad

> No hacemos ruido. Hacemos identidad.

Web de marca personal de Tobalina Studio (Beatriz Tobalina). Next.js 14 / TypeScript / Tailwind / Framer Motion.

## Concepto

Metáfora del carnet de identidad. La jerarquía es intencional y no debe invertirse:

- `components/IdentityMark.tsx` — identidad de marca (nombre + statement). Fija, sin condición de interacción. Es lo primero e innegociable que se ve al abrir la web.
- `components/VerificationCard.tsx` — capa de verificación. Tarjeta con tilt 3D por cursor; el foil holográfico y el microtexto secundario solo se revelan al inclinar por encima de un umbral (`REVEAL_THRESHOLD`). Refuerza el mensaje, nunca lo porta.
- `components/Verticals.tsx` — bifurcación en dos documentos: identidad corporativa (B2B) y bodas/eventos de alto nivel. Secciones separadas, mismo ADN tipográfico, atmósfera propia.

Apenas scroll: hero en un solo viewport, sin scroll narrativo largo.

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

- `ink` `#232E2C` — texto y fondo oscuro
- `paper` `#F4EFE6` — fondo base
- `sand` `#E4DBC8` — vertical bodas/eventos
- `foil` `#C9C2B4` — capa holográfica de verificación

## Pendiente

- Copy completo de los dos "documentos" (corporativo / bodas)
- Contenido de la sección de cierre/contacto (sin logos de cliente, confidencialidad)
- Versión en inglés
