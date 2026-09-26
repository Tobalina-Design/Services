// Contenido del DNI Tobalina.
import { services } from "./services";

export const EMAIL = "tobalina.design@gmail.com";
export const STATEMENT_LINES = ["No hacemos ruido.", "Hacemos identidad."];
export const DOC_NUMBER = "TBLN—ID.01";

export const FRONT_FIELDS = [
  { label: "Nombre / Name", value: "Estudio de diseño e identidad", wide: true },
  { label: "Nacionalidad", value: "Identidad" },
  { label: "Sede / Place", value: "Madrid" },
  { label: "Validez / Expiry", value: "Atemporal" },
];

export const VERTICALS = [
  { key: "corporativo", title: "Identidad corporativa", destination: "Para compañías", items: services.corporativo },
  { key: "eventos", title: "Bodas & eventos", destination: "Alto nivel", items: services.eventos },
] as const;

// Zona de lectura mecánica de DNI (formato TD1: 3 líneas x 30 caracteres).
function mrz(s: string) {
  return (s.toUpperCase().replace(/[^A-Z0-9<]/g, "<") + "<".repeat(30)).slice(0, 30);
}
export const MRZ_LINES = [
  mrz("IDTBLTBLNID01"),
  mrz("NOHACEMOS<RUIDO"),
  mrz("TOBALINA<<HACEMOS<IDENTIDAD"),
];
