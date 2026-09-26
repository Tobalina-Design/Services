# Tobalina — estudio de diseño e identidad

> No hacemos ruido. Hacemos identidad.

Web de marca personal de Tobalina Studio (Beatriz Tobalina). Next.js 14 / TypeScript / Tailwind / Framer Motion.

## Concepto

La web es un DNI a pantalla completa (`components/id/IdCard.tsx`), sin scroll y sin paso de hoja:

- **Anverso** — solo lo esencial: chip, la declaración "No hacemos ruido. Hacemos identidad." y TOBALINA a todo el ancho.
- **Reverso** — servicios en dos columnas (identidad corporativa / bodas & eventos), contacto (tobalina.design@gmail.com) y zona de lectura mecánica en formato DNI (3 × 30).
- **Tilt**: en escritorio la tarjeta se inclina siguiendo el cursor, con un brillo que acompaña.
- **Giro**: al pasar a servicios la tarjeta gira sobre su eje hasta ponerse de canto y vuelve desde el otro lado con la otra cara; igual al volver al anverso.
- **Modo claro / oscuro**: selector en la cabecera; se recuerda en el navegador y, por defecto, sigue al sistema.
- Se cambia de cara (botón "Servicios →" / "← Anverso"; en escritorio también ← → o R).
- **Móvil**: el documento siempre se compone en horizontal. Con el teléfono en vertical aparece girado 90° y hay que girar el móvil para leerlo (aviso breve al cargar).

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
