// Servicios por vertical — se muestran como sellos de entrada en los visados.
export interface ServiceItem {
  title: string;
  description: string;
}

export const services: Record<"corporativo" | "eventos", ServiceItem[]> = {
  corporativo: [
    {
      title: "Identidad de marca",
      description: "Naming, sistema visual y aplicaciones. Construida para durar, no para una temporada.",
    },
    {
      title: "Presentaciones corporativas",
      description: "Decks de alto impacto para consultoría, inversión y dirección.",
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
      description: "Monograma, paleta y tipografía únicos para cada celebración.",
    },
    {
      title: "Papelería nupcial",
      description: "Invitaciones, minutas y señalética a medida.",
    },
    {
      title: "Dirección de arte del evento",
      description: "Coherencia visual de la invitación al último detalle.",
    },
    {
      title: "Gran formato",
      description: "Cartelería y elementos decorativos a escala para la celebración.",
    },
  ],
};
