// Servicios por vertical, para la "vuelta" del documento.
export interface ServiceItem {
  title: string;
  description: string;
}

export const services: Record<"corporativo" | "eventos", ServiceItem[]> = {
  corporativo: [
    {
      title: "Identidad de marca",
      description:
        "Naming, sistema visual y aplicaciones. Construida para durar, no para una temporada.",
    },
    {
      title: "Presentaciones corporativas",
      description:
        "Decks de alto impacto para consultoría, inversión y dirección.",
    },
    {
      title: "Diseño editorial",
      description: "Informes, dossieres y publicaciones de marca.",
    },
    {
      title: "Dirección de arte",
      description: "Supervisión creativa de campañas y activos de marca.",
    },
  ],
  eventos: [
    {
      title: "Identidad de boda",
      description:
        "Monograma, paleta y tipografía únicos para cada celebración.",
    },
    {
      title: "Papelería nupcial",
      description: "Invitaciones, minutas y señalética a medida.",
    },
    {
      title: "Dirección de arte del evento",
      description:
        "Coherencia visual de principio a fin, de la invitación al último detalle.",
    },
    {
      title: "Gran formato",
      description:
        "Cartelería y elementos decorativos a escala para la celebración.",
    },
  ],
};

// Líneas decorativas tipo zona de lectura mecánica (MRZ) de pasaporte.
// Puramente estético — refuerza la textura de "documento oficial".
export const mrz: Record<"corporativo" | "eventos", string[]> = {
  corporativo: [
    "IDENTIDAD<<TOBALINA<<<<<<<<<<<<<<<<<<<<<<<<",
    "CORP<<BRANDING<<PRESENTACIONES<<EDITORIAL<<",
  ],
  eventos: [
    "IDENTIDAD<<TOBALINA<<<<<<<<<<<<<<<<<<<<<<<<",
    "EVENT<<BODAS<<CELEBRACIONES<<PAPELERIA<<<<<",
  ],
};
