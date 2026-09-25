# Tobalina — estudio de diseño e identidad

> No hacemos ruido. Hacemos identidad.

Web de marca personal de Tobalina Studio (Beatriz Tobalina). Next.js 14 / TypeScript / Tailwind / Framer Motion.

## Concepto

La web ENTERA es el carnet de identidad — no una página que contiene una tarjeta. Un único componente, `components/IdentityExperience.tsx`, monta la experiencia completa a pantalla completa:

- Nombre + statement ("No hacemos ruido. Hacemos identidad.") ocupan el centro del viewport, siempre visibles, sin condición de interacción — es lo primero e innegociable que se ve al abrir la web.
- El tilt 3D (cursor / giroscopio) se aplica a la pantalla entera, no a un elemento aislado.
- El foil holográfico y el microtexto secundario (`lib/documents.ts` → `microtext`) son la capa de verificación: solo se revelan al inclinar por encima de un umbral (`REVEAL_THRESHOLD`). Refuerzan el mensaje, nunca lo portan.
- Las dos verticales (identidad corporativa / bodas y eventos de alto nivel) son documentos completos distintos, definidos en `lib/documents.ts`, que se intercambian por clic en el selector inferior — nunca por scroll.

Cero scroll: un único viewport que cambia de documento, no una página que se recorre.

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
