# Tobalina — estudio de diseño e identidad

> No hacemos ruido. Hacemos identidad.

Web de marca personal de Tobalina Studio (Beatriz Tobalina). Next.js 14 / TypeScript / Tailwind / Framer Motion.

## Concepto

La web ENTERA es el carnet de identidad — no una página que contiene una tarjeta. Un único componente, `components/IdentityExperience.tsx`, monta la experiencia completa a pantalla completa, con dos caras como un DNI/pasaporte real:

- **Frente** — nombre + statement ("No hacemos ruido. Hacemos identidad.") ocupan el centro del viewport, siempre visibles, sin condición de interacción. El tilt 3D (cursor / giroscopio) se aplica solo aquí; el foil holográfico y el microtexto secundario (`lib/documents.ts` → `microtext`) son la capa de verificación, revelados solo tras un umbral (`REVEAL_THRESHOLD`).
- **Reverso** — servicios de la vertical activa (`lib/services.ts`), en grid, más una franja decorativa tipo zona de lectura mecánica de pasaporte (`mrz`). Se accede con el botón "servicios →" — giro explícito, nunca automático.
- Las dos verticales (identidad corporativa / bodas y eventos de alto nivel) son documentos completos distintos que se intercambian por clic en el selector inferior — nunca por scroll. Cambiar de documento vuelve siempre al frente.

Cero scroll: un único viewport que cambia de cara y de documento, no una página que se recorre.

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
