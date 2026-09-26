# Tobalina — estudio de diseño e identidad

> No hacemos ruido. Hacemos identidad.

Web de marca personal de Tobalina Studio (Beatriz Tobalina). Next.js 14 / TypeScript / Tailwind / Framer Motion.

## Concepto

La web es un DNI a pantalla completa (`components/id/IdCard.tsx`), sin scroll:

- **Carga** (`Loader.tsx`) — "Verificando identidad" con contador; espera a fuentes y carga, y sale como un telón.
- **Anverso** — TOBALINA como logotipo espaciado y la declaración "No hacemos ruido. Hacemos identidad." como protagonista, con aire entre ambos. Fondo de grano que el cursor silencia a su paso (`Grain.tsx`); sin cursor, el claro de silencio deriva solo.
- **Reverso** — servicios en dos columnas (identidad corporativa / bodas & eventos), contacto y zona de lectura mecánica (3 × 30).
- **Volteo** — tarjeta 3D real de dos caras: se eleva, gira 180° en 1,7 s y se asienta. Las capas de contenido están a distinta profundidad (escala compensada en reposo), así que se desplazan entre sí durante el giro.
- **Tilt** con el cursor en escritorio, con brillo.
- **Modo oscuro / claro** en la cabecera; oscuro por defecto, se recuerda la elección.
- **Móvil**: el documento siempre se compone en horizontal; con el teléfono en vertical aparece girado y hay que girarlo para leer.

Contenido editable en `lib/idcard.ts` y `lib/services.ts`.

## Desarrollo

```bash
npm install
npm run dev
```

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Framer Motion (fundido entre caras)
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
