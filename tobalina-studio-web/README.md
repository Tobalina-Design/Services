# Tobalina — estudio de diseño e identidad

> No hacemos ruido. Hacemos identidad.

Web de marca personal de Tobalina Studio (Beatriz Tobalina). Next.js 14 / TypeScript / Tailwind / Framer Motion.

## Concepto

Toda la página evoca un DNI/pasaporte real, no solo la tarjeta: fondo con textura de seguridad (guilloché) deliberadamente más oscuro que las dos caras de la tarjeta, y un documento centrado con la proporción real de una tarjeta de identidad (ISO/IEC 7810 ID-1) en escritorio. `components/IdentityExperience.tsx` monta la experiencia completa:

- **Pestañas de vertical** — "identidad corporativa" / "bodas & eventos" siempre visibles encima del documento, nunca giran, nunca ambiguas. Cambiar de vertical vuelve siempre al frente.
- **Frente** — campos tipo carnet real (marca, declaración, ref.) + caja de monograma (nunca un retrato real). El tilt 3D (cursor) se aplica solo en escritorio; el foil holográfico y el microtexto secundario (`lib/documents.ts` → `microtext`) son la capa de verificación, revelados solo tras un umbral (`REVEAL_THRESHOLD`).
- **Reverso** — servicios de la vertical activa (`lib/services.ts`) en lista, más una franja decorativa tipo zona de lectura mecánica de pasaporte (`mrz`).
- **Escritorio**: botón "ver servicios →" fuera de la tarjeta (nunca se solapa con su contenido) gira el documento en 3D.
- **Móvil**: el giro es FÍSICO, no animado — la cara visible la decide la orientación real del teléfono (retrato = frente, horizontal = reverso), detectada por `pointer: coarse` en `globals.css` (no por ancho de viewport, que cambia al rotar). Un aviso "gira tu móvil" aparece en retrato.
- La proporción estricta de tarjeta ID-1 solo se aplica a partir de 768px; en móvil el alto es el que pida el contenido, para evitar solapes.

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
