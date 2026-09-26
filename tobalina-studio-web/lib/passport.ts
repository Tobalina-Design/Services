// Contenido del pasaporte Tobalina. Tono: seco, declarativo, en mayúsculas.
import { services } from "./services";

export const EMAIL = "tobalina.design@gmail.com";
export const STATEMENT = "No hacemos ruido. Hacemos identidad.";

export type PageId =
  | "inside"
  | "data"
  | "visa-corp-intro"
  | "visa-corp-stamps"
  | "visa-ev-intro"
  | "visa-ev-stamps"
  | "obs"
  | "contact";

export const SPREADS: { pages: [PageId, PageId]; label: string }[] = [
  { pages: ["inside", "data"], label: "Identidad" },
  { pages: ["visa-corp-intro", "visa-corp-stamps"], label: "Corporativo" },
  { pages: ["visa-ev-intro", "visa-ev-stamps"], label: "Bodas & eventos" },
  { pages: ["obs", "contact"], label: "Contacto" },
];

export const PAGE_NUMBER: Record<PageId, number> = SPREADS.flatMap((s) => s.pages).reduce(
  (acc, id, i) => ({ ...acc, [id]: i + 1 }),
  {} as Record<PageId, number>
);

export interface Visa {
  key: "corporativo" | "eventos";
  number: string;
  lines: string[];
  label: string;
  destination: string;
  services: { title: string; description: string }[];
}

export const VISAS: Record<"corporativo" | "eventos", Visa> = {
  corporativo: {
    key: "corporativo",
    number: "01",
    lines: ["IDENTIDAD", "CORPORATIVA"],
    label: "Identidad corporativa",
    destination: "Para compañías.",
    services: services.corporativo,
  },
  eventos: {
    key: "eventos",
    number: "02",
    lines: ["BODAS &", "EVENTOS"],
    label: "Bodas & eventos",
    destination: "Para bodas y eventos de alto nivel.",
    services: services.eventos,
  },
};

export const OBSERVATIONS = [
  "Piezas únicas. Sin plantillas.",
  "El trabajo no se enseña. Se entrega.",
  "Diseñado para perdurar.",
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

// Unidad fluida relativa a cada página (container query units), con suelo en px.
export function u(n: number, floorPx = 0) {
  const fluid = `min(${n}cqh, ${(n * 1.45).toFixed(2)}cqw)`;
  return floorPx ? `max(${floorPx}px, ${fluid})` : fluid;
}
