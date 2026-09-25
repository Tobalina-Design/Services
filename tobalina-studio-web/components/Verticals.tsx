// Bifurcación: dos documentos distintos, no dos secciones de una misma página.
// Mismo ADN tipográfico, atmósfera propia por vertical.
const verticals = [
  {
    key: "corporativo",
    label: "identidad corporativa",
    desc: "Estructura, precisión y consultoría de marca para compañías.",
    tone: "bg-ink text-paper",
  },
  {
    key: "eventos",
    label: "bodas y eventos de alto nivel",
    desc: "El mismo rigor, con una atmósfera más cálida e íntima.",
    tone: "bg-sand text-ink",
  },
];

export default function Verticals() {
  return (
    <section className="min-h-screen w-full grid md:grid-cols-2">
      {verticals.map((v) => (
        <a
          key={v.key}
          href={`#${v.key}`}
          className={`${v.tone} flex flex-col items-center justify-center gap-4 px-10 py-20 group transition-colors`}
        >
          <p className="font-body text-xs uppercase tracking-[0.2em] opacity-50">
            documento
          </p>
          <h2 className="font-display font-light text-4xl md:text-5xl text-center">
            {v.label}
          </h2>
          <p className="font-body text-sm opacity-70 text-center max-w-xs">
            {v.desc}
          </p>
        </a>
      ))}
    </section>
  );
}
