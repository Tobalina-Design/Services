"use client";

import { useRef, type ReactNode } from "react";
import {
  EMAIL,
  MRZ_LINES,
  OBSERVATIONS,
  PAGE_NUMBER,
  SPREADS,
  STATEMENT,
  VISAS,
  u,
  type PageId,
  type Visa,
} from "@/lib/passport";
import { Fibers, Rosette, Waves } from "./Security";
import { EntryStamp, RoundStamp, Slam } from "./Stamps";

export interface PageProps {
  still?: boolean;
  onJump?: (spread: number) => void;
}

/* ---------- Estructura común de página ---------- */

function PageShell({
  id,
  side,
  children,
  uvText,
  rosette = false,
}: {
  id: PageId;
  side: "left" | "right";
  children: ReactNode;
  uvText?: string;
  rosette?: boolean;
}) {
  const num = PAGE_NUMBER[id];
  return (
    <div className="pg relative h-full w-full overflow-hidden">
      <Waves className="pointer-events-none absolute inset-0 h-full w-full ink2" style={{ opacity: 0.1 }} />
      {rosette && (
        <Rosette
          className="pointer-events-none absolute ink2"
          style={{ width: "90cqh", height: "90cqh", left: "50%", top: "50%", transform: "translate(-50%,-50%)", opacity: 0.09 }}
        />
      )}
      <Fibers seed={num} />
      {uvText && (
        <div className="uv-only pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <p
            className="uv-glow whitespace-nowrap font-display font-light uppercase"
            style={{ fontSize: u(9), transform: "rotate(-24deg)", letterSpacing: "0.08em" }}
          >
            {uvText}
          </p>
        </div>
      )}
      {/* Sombra del lomo */}
      <div
        className="pointer-events-none absolute inset-y-0 w-[14%]"
        style={{
          [side === "left" ? "right" : "left"]: 0,
          background: `linear-gradient(${side === "left" ? "to left" : "to right"}, rgba(0,0,0,0.16), transparent)`,
        }}
      />
      <div
        className="relative flex h-full flex-col"
        style={{
          paddingTop: u(6, 18),
          paddingLeft: side === "left" ? u(7, 20) : u(6, 18),
          paddingRight: side === "right" ? u(7, 20) : u(6, 18),
          paddingBottom: "max(52px, 9cqh)",
        }}
      >
        {children}
      </div>
      <p
        className="absolute font-mono ink2"
        style={{
          bottom: "max(18px, 3.2cqh)",
          [side === "left" ? "left" : "right"]: u(6, 18),
          fontSize: u(1.3, 9),
          letterSpacing: "0.2em",
        }}
      >
        {String(num).padStart(2, "0")}
      </p>
    </div>
  );
}

function PageHeader({ left, right }: { left: string; right: string }) {
  return (
    <div
      className="hair flex items-center justify-between border-b font-body uppercase"
      style={{ fontSize: u(1.25, 8), letterSpacing: "0.22em", paddingBottom: u(1.4, 6) }}
    >
      <span className="ink2">{left}</span>
      <span className="ink2">{right}</span>
    </div>
  );
}

function Field({ label, value, big = false, span = false }: { label: string; value: string; big?: boolean; span?: boolean }) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <p className="ink2 font-body uppercase" style={{ fontSize: u(1.1, 7), letterSpacing: "0.16em" }}>
        {label}
      </p>
      <p
        className={big ? "font-display font-light" : "font-body font-medium uppercase"}
        style={{ fontSize: big ? u(4.2, 18) : u(1.9, 10), lineHeight: 1.15, letterSpacing: big ? "0.02em" : "0.04em" }}
      >
        {value}
      </p>
    </div>
  );
}

/* ---------- Página 1: contraportada interior ---------- */

function InsidePage({ onJump }: PageProps) {
  const index = SPREADS.map((s, i) => ({ label: s.label, page: PAGE_NUMBER[s.pages[0]], i }));
  return (
    <PageShell id="inside" side="left" rosette uvText="Sin ruido">
      <PageHeader left="Pasaporte · Passport" right="Tobalina" />
      <div className="flex flex-1 flex-col justify-center" style={{ gap: u(3, 10) }}>
        <p className="font-display font-light leading-snug" style={{ fontSize: u(3, 14), maxWidth: "32ch" }}>
          Este pasaporte acredita la identidad de Tobalina, estudio de diseño e identidad con sede en Madrid.
        </p>
        <p className="font-body leading-relaxed" style={{ fontSize: u(1.6, 10), maxWidth: "44ch", opacity: 0.75 }}>
          Se ruega a las marcas que lo presenten concederle el tiempo necesario para hacer las cosas bien.
        </p>
        <nav aria-label="Índice del pasaporte" className="hair border-t" style={{ paddingTop: u(1.6, 6) }}>
          <p className="ink2 font-body uppercase" style={{ fontSize: u(1.1, 7), letterSpacing: "0.2em", marginBottom: u(0.8, 3) }}>
            Índice · Contents
          </p>
          {index.map((item) => (
            <button
              key={item.i}
              type="button"
              onClick={() => onJump?.(item.i)}
              className="group hair flex w-full items-baseline justify-between border-b text-left"
              style={{ paddingBlock: u(0.9, 5), fontSize: u(1.7, 11) }}
            >
              <span className="font-body">
                <span className="ink2 font-mono" style={{ marginRight: u(1.5, 8) }}>
                  0{item.i + 1}
                </span>
                <span className="underline-offset-4 group-hover:underline">{item.label}</span>
              </span>
              <span className="ink2 font-mono">p.{String(item.page).padStart(2, "0")}</span>
            </button>
          ))}
        </nav>
      </div>
      <a href={`mailto:${EMAIL}`} className="font-body underline-offset-4 hover:underline" style={{ fontSize: u(1.5, 10) }}>
        {EMAIL}
      </a>
    </PageShell>
  );
}

/* ---------- Página 2: página de datos ---------- */

function DataPage({ still }: PageProps) {
  const ref = useRef<HTMLDivElement>(null);
  function onMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el || still) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--hx", `${(e.clientX - r.left) / r.width}`);
    el.style.setProperty("--hy", `${(e.clientY - r.top) / r.height}`);
  }
  return (
    <PageShell id="data" side="right" uvText="Identidad">
      <div ref={ref} onPointerMove={onMove} className="group/data flex h-full flex-col">
        <PageHeader left="Pasaporte · Passport" right="TBL" />
        <div className="flex flex-1 items-center" style={{ gap: u(3.5, 12), paddingBlock: u(2, 8) }}>
          {/* Foto: monograma, nunca un retrato. Holograma reactivo al cursor. */}
          <div className="flex shrink-0 flex-col" style={{ width: "min(34%, 30cqh)", gap: u(1.2, 5) }}>
            <div className="hair-strong relative aspect-[3/4] w-full overflow-hidden rounded-[2px] border">
              <Rosette className="absolute inset-0 h-full w-full ink2" style={{ opacity: 0.18 }} />
              <span
                className="absolute inset-0 flex items-center justify-center font-display font-light"
                style={{ fontSize: u(15, 60) }}
              >
                T
              </span>
              <div className="hologram pointer-events-none absolute inset-0" />
            </div>
          </div>
          <div className="relative grid min-w-0 flex-1 grid-cols-2" style={{ columnGap: u(2, 8), rowGap: u(1.5, 6) }}>
            <Field label="Tipo / Type" value="P" />
            <Field label="Código / Code" value="TBL" />
            <Field label="Pasaporte nº / Passport no." value="TBLN—ID.01" span />
            <Field label="Apellidos / Surname" value="TOBALINA" big span />
            <Field label="Nombre / Given names" value="Estudio de diseño e identidad" span />
            <Field label="Nacionalidad / Nationality" value="Identidad" />
            <Field label="Sede / Place" value="Madrid" />
            <Field label="Validez / Expiry" value="Atemporal" />
            <Field label="Autoridad / Authority" value="Criterio" />
            {/* Imagen fantasma, como en los pasaportes reales */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-0 font-display font-light"
              style={{ fontSize: u(7, 26), opacity: 0.1 }}
            >
              T
            </span>
          </div>
          {/* Número perforado en el canto */}
          <p
            aria-hidden="true"
            className="font-mono ink2 shrink-0 self-stretch text-center"
            style={{ writingMode: "vertical-rl", fontSize: u(1.3, 8), letterSpacing: "0.5em", opacity: 0.55 }}
          >
            ··TBLN·ID·01··
          </p>
        </div>
        <div className="hair border-t" style={{ paddingTop: u(1.2, 5) }}>
          <p className="ink2 font-body uppercase" style={{ fontSize: u(1.1, 7), letterSpacing: "0.16em" }}>
            Firma del titular / Holder’s signature
          </p>
          <p className="font-display font-light" style={{ fontSize: u(2.6, 13) }}>
            {STATEMENT}
          </p>
        </div>
        <div
          className="mrz"
          style={{ marginTop: u(2, 8), fontSize: "min(2.5cqh, 2.15cqw)", letterSpacing: "0.12em", lineHeight: 1.45 }}
        >
          {MRZ_LINES.map((l) => (
            <p key={l} className="whitespace-nowrap">
              {l}
            </p>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

/* ---------- Visados ---------- */

function VisaIntro({ visa, still, id }: PageProps & { visa: Visa; id: PageId }) {
  return (
    <PageShell id={id} side="left" rosette uvText={visa.category}>
      <PageHeader left="Visado · Visa" right={`Nº ${visa.number}`} />
      <div className="flex flex-1 flex-col justify-center" style={{ gap: u(2.4, 9) }}>
        <p className="ink2 font-body uppercase" style={{ fontSize: u(1.2, 8), letterSpacing: "0.22em" }}>
          Categoría / Category
        </p>
        <h2 className="font-display font-light leading-[0.95]" style={{ fontSize: u(8, 30) }}>
          {visa.category}
        </h2>
        <p className="font-body leading-relaxed" style={{ fontSize: u(1.8, 11), maxWidth: "36ch", opacity: 0.8 }}>
          {visa.intro}
        </p>
        <div className="grid grid-cols-2" style={{ gap: u(1.5, 6), maxWidth: "46ch" }}>
          <Field label="Para / For" value={visa.destination} span />
          <Field label="Validez / Validity" value="Atemporal" />
          <Field label="Entradas / Entries" value="Ilimitadas" />
        </div>
      </div>
      <div className="flex justify-end">
        <Slam rotate={-12} delay={0.35} still={still}>
          <RoundStamp top={visa.stampTop} bottom={visa.stampBottom} center={visa.number} sub="VISADO" size={u(20, 96)} />
        </Slam>
      </div>
    </PageShell>
  );
}

const TILTS = [-2.2, 1.6, 1.2, -1.4];

function VisaStamps({ visa, still, id }: PageProps & { visa: Visa; id: PageId }) {
  return (
    <PageShell id={id} side="right" uvText="Aprobado">
      <PageHeader left="Servicios · Services" right={visa.category} />
      <div className="relative grid flex-1 grid-cols-2 content-center" style={{ gap: u(2.6, 10), paddingBlock: u(2, 8) }}>
        {visa.services.map((s, i) => (
          <Slam key={s.title} rotate={TILTS[i]} delay={0.15 + i * 0.14} still={still} opacity={1}>
            <EntryStamp index={i} title={s.title} description={s.description} />
          </Slam>
        ))}
        <div
          className="pointer-events-none absolute"
          style={{ right: `calc(-1 * ${u(2, 6)})`, top: `calc(-1 * ${u(1, 4)})` }}
        >
          <Slam rotate={16} delay={0.85} still={still} opacity={0.75}>
            <RoundStamp top="100% ÚNICO" bottom="SIN PLANTILLAS" center="✓" size={u(12, 60)} />
          </Slam>
        </div>
      </div>
    </PageShell>
  );
}

/* ---------- Observaciones y contacto ---------- */

function ObsPage() {
  return (
    <PageShell id="obs" side="left" rosette uvText="Confidencial">
      <PageHeader left="Observaciones · Observations" right="Tobalina" />
      <ol className="flex flex-1 flex-col justify-center" style={{ gap: u(3, 10) }}>
        {OBSERVATIONS.map((o, i) => (
          <li key={o} className="hair flex items-baseline border-b" style={{ gap: u(2.5, 10), paddingBottom: u(2, 8) }}>
            <span className="ink2 font-mono" style={{ fontSize: u(1.5, 10) }}>
              0{i + 1}
            </span>
            <span className="font-display font-light leading-snug" style={{ fontSize: u(3.2, 15) }}>
              {o}
            </span>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}

function ContactPage({ still }: PageProps) {
  const subject = encodeURIComponent("Solicitud de visado — Tobalina");
  return (
    <PageShell id="contact" side="right" uvText="Tu turno">
      <PageHeader left="Autoridad expedidora · Issuing authority" right="Madrid" />
      <div className="flex flex-1 flex-col justify-center" style={{ gap: u(2.6, 10) }}>
        <h2 className="font-display font-light leading-[0.95]" style={{ fontSize: u(7.5, 28) }}>
          Solicita tu visado
        </h2>
        <p className="font-body leading-relaxed" style={{ fontSize: u(1.7, 11), maxWidth: "38ch", opacity: 0.8 }}>
          Cuéntanos qué marca o qué celebración necesita identidad propia.
        </p>
        <a
          href={`mailto:${EMAIL}?subject=${subject}`}
          className="email-link font-display font-light self-start"
          style={{ fontSize: u(3.6, 16) }}
        >
          {EMAIL}
        </a>
        <a
          href={`mailto:${EMAIL}?subject=${subject}`}
          className="self-start rounded-full font-body uppercase transition-colors hover:opacity-85"
          style={{
            background: "var(--pg-fg)",
            color: "var(--pg-bg)",
            fontSize: u(1.3, 9),
            letterSpacing: "0.2em",
            padding: `${u(1.3, 8)} ${u(2.6, 14)}`,
          }}
        >
          Escribir →
        </a>
      </div>
      <div className="flex items-end justify-between" style={{ gap: u(2, 8) }}>
        <div className="flex-1">
          <p className="ink2 font-body uppercase" style={{ fontSize: u(1.1, 7), letterSpacing: "0.16em" }}>
            Firma del solicitante / Applicant’s signature
          </p>
          <div className="hair-strong border-b" style={{ height: u(4, 16) }} />
        </div>
        <Slam rotate={-9} delay={0.4} still={still} opacity={0.8}>
          <RoundStamp top="PENDIENTE" bottom="DE TU FIRMA" center="?" size={u(14, 70)} />
        </Slam>
      </div>
    </PageShell>
  );
}

/* ---------- Registro ---------- */

export function renderPage(id: PageId, props: PageProps) {
  switch (id) {
    case "inside":
      return <InsidePage {...props} />;
    case "data":
      return <DataPage {...props} />;
    case "visa-corp-intro":
      return <VisaIntro {...props} id={id} visa={VISAS.corporativo} />;
    case "visa-corp-stamps":
      return <VisaStamps {...props} id={id} visa={VISAS.corporativo} />;
    case "visa-ev-intro":
      return <VisaIntro {...props} id={id} visa={VISAS.eventos} />;
    case "visa-ev-stamps":
      return <VisaStamps {...props} id={id} visa={VISAS.eventos} />;
    case "obs":
      return <ObsPage />;
    case "contact":
      return <ContactPage {...props} />;
  }
}
