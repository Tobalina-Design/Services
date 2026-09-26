// Contenido del pasaporte Tobalina. Todo el copy vive aquí.
import { services } from "./services";

export const EMAIL = "tobalina.design@gmail.com";
export const STATEMENT = "No hacemos ruido. Hacemos identidad.";
export const SUBLINE = "Diseñamos para perdurar, no solo para llamar la atención.";

export type PageId =
  | "inside"
  | "data"
  | "visa-corp-intro"
  | "visa-corp-stamps"
  | "visa-ev-intro"
  | "visa-ev-stamps"
  | "obs"
  | "contact";

// Cada doble página: [izquierda, derecha]
export const SPREADS: { pages: [PageId, PageId]; label: string }[] = [
  { pages: ["inside", "data"], label: "Identidad" },
  { pages: ["visa-corp-intro", "visa-corp-stamps"], label: "Visado · Identidad corporativa" },
  { pages: ["visa-ev-intro", "visa-ev-stamps"], label: "Visado · Bodas & eventos" },
  { pages: ["obs", "contact"], label: "Contacto" },
];

export const PAGE_NUMBER: Record<PageId, number> = SPREADS.flatMap((s) => s.pages).reduce(
  (acc, id, i) => ({ ...acc, [id]: i + 1 }),
  {} as Record<PageId, number>
);

export interface Visa {
  key: "corporativo" | "eventos";
  number: string;
  category: string;
  destination: string;
  intro: string;
  stampTop: string;
  stampBottom: string;
  services: { title: string; description: string }[];
}

export const VISAS: Record<"corporativo" | "eventos", Visa> = {
  corporativo: {
    key: "corporativo",
    number: "01",
    category: "Identidad corporativa",
    destination: "Compañías · B2B",
    intro: "Estructura, precisión y consultoría de marca para compañías.",
    stampTop: "TOBALINA · MADRID",
    stampBottom: "IDENTIDAD CORPORATIVA",
    services: services.corporativo,
  },
  eventos: {
    key: "eventos",
    number: "02",
    category: "Bodas & eventos",
    destination: "Bodas y eventos de alto nivel",
    intro: "El mismo rigor, con una atmósfera más cálida e íntima.",
    stampTop: "TOBALINA · MADRID",
    stampBottom: "BODAS & EVENTOS",
    services: services.eventos,
  },
};

export const OBSERVATIONS = [
  "Piezas 100% únicas. Sin plantillas.",
  "Confidencialidad: el trabajo entregado no se publica.",
  SUBLINE,
];

// Zona de lectura mecánica (MRZ): 2 líneas x 44 caracteres, como un pasaporte TD3.
function mrz(s: string) {
  const clean = s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9<]/g, "<");
  return (clean + "<".repeat(44)).slice(0, 44);
}

export const MRZ_LINES = [
  mrz("P<TBLTOBALINA<<ESTUDIO<DE<DISENO<E<IDENTIDAD"),
  mrz("NOHACEMOS<RUIDO<<HACEMOS<IDENTIDAD<<TBLNID01"),
];

// Unidad fluida relativa al tamaño de cada página (container query units),
// con suelo en px para legibilidad en móvil apaisado.
export function u(n: number, floorPx = 0) {
  const fluid = `min(${n}cqh, ${(n * 1.45).toFixed(2)}cqw)`;
  return floorPx ? `max(${floorPx}px, ${fluid})` : fluid;
}
