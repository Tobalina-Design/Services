// Contenido de cada "documento" (vertical de negocio).
// Cada uno es el carnet de identidad completo, no una sección dentro de una página.
export type DocumentKey = "corporativo" | "eventos";

export interface IdentityDocument {
  key: DocumentKey;
  tabLabel: string;
  type: string;
  name: string;
  statement: string;
  subline: string;
  issuedBy: string;
  refCode: string;
  microtext: string;
  tone: "dark" | "light";
}

export const documents: Record<DocumentKey, IdentityDocument> = {
  corporativo: {
    key: "corporativo",
    tabLabel: "identidad corporativa",
    type: "identidad corporativa",
    name: "TOBALINA",
    statement: "No hacemos ruido. Hacemos identidad.",
    subline: "Diseñamos para perdurar, no solo para llamar la atención.",
    issuedBy: "emitido por criterio, no por consenso",
    refCode: "TBLN—ID.01",
    microtext: "no hacemos ruido. hacemos identidad.",
    tone: "dark",
  },
  eventos: {
    key: "eventos",
    tabLabel: "bodas & eventos",
    type: "bodas y eventos de alto nivel",
    name: "TOBALINA",
    statement: "No hacemos ruido. Hacemos identidad.",
    subline: "El mismo rigor, con una atmósfera más cálida e íntima.",
    issuedBy: "cada historia, un documento único",
    refCode: "TBLN—ID.02",
    microtext: "no hacemos ruido. hacemos identidad.",
    tone: "light",
  },
};

export const documentOrder: DocumentKey[] = ["corporativo", "eventos"];
