// Servicios por vertical. Una línea por servicio: qué es y qué consigue.
export interface ServiceItem {
  title: string;
  description: string;
}

export const services: Record<"corporativo" | "eventos", ServiceItem[]> = {
  corporativo: [
    { title: "Identidad de marca", description: "Nombre, símbolo y sistema. Una marca que se reconoce sin explicarse." },
    { title: "Presentaciones", description: "Para decidir: inversión, consejo, cliente. Cada diapositiva, un argumento." },
    { title: "Editorial", description: "Informes y dossieres con la autoridad de un libro." },
    { title: "Dirección de arte", description: "Un mismo criterio en cada campaña y en cada pieza." },
  ],
  eventos: [
    { title: "Identidad del evento", description: "Monograma, paleta y tipografía propios. Nunca una plantilla." },
    { title: "Papelería", description: "Invitación, minuta, seating y señalética, impresos con oficio." },
    { title: "Dirección de arte", description: "Una sola mirada, del save the date al último detalle." },
    { title: "Gran formato", description: "Lonas, cartelería y escenografía gráfica a la escala del espacio." },
  ],
};
