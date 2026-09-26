// Servicios por vertical. Descripciones mínimas, sin adjetivos.
export interface ServiceItem {
  title: string;
  description: string;
}

export const services: Record<"corporativo" | "eventos", ServiceItem[]> = {
  corporativo: [
    { title: "Identidad de marca", description: "Naming. Sistema visual. Aplicaciones." },
    { title: "Presentaciones", description: "Consultoría. Inversión. Dirección." },
    { title: "Editorial", description: "Informes. Dossieres. Publicaciones." },
    { title: "Dirección de arte", description: "Campañas. Activos de marca." },
  ],
  eventos: [
    { title: "Identidad de boda", description: "Monograma. Paleta. Tipografía." },
    { title: "Papelería", description: "Invitaciones. Minutas. Señalética." },
    { title: "Dirección de arte", description: "De la invitación al último detalle." },
    { title: "Gran formato", description: "Cartelería. Escenografía gráfica." },
  ],
};
