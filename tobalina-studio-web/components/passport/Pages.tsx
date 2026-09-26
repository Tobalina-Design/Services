"use client";

import type { ReactNode } from "react";
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
import FitText from "./FitText";
import { Slam, Stamp } from "./Stamps";

export interface PageProps {
  still?: boolean;
  onJump?: (spread: number) => void;
}

/* ---------- Estructura común ---------- */

function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-body font-medium uppercase ${className}`} style={{ fontSize: u(1.1, 8), letterSpacing: "0.2em" }}>
      {children}
    </span>
  );
}

function PageShell({
  id,
  side,
  children,
  uvText,
}: {
  id: PageId;
  side: "left" | "right";
  children: ReactNode;
  uvText: string;
}) {
  const num = PAGE_NUMBER[id];
  const inner = side === "left" ? "paddingRight" : "paddingLeft";
  return (
    <div className="pg relative h-full w-full overflow-hidden">
      {/* Tinta oculta: solo visible con luz UV */}
      <div className="uv-only pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <p className="uv-ink whitespace-nowrap font-display font-bold uppercase" style={{ fontSize: u(16), transform: "rotate(-16deg)" }}>
          {uvText}
        </p>
      </div>
      <div
        className="relative flex h-full flex-col"
        style={{
          padding: `${u(4.5, 14)} ${u(4.5, 14)} max(50px, 8.5cqh)`,
          [inner]: u(5.5, 16),
        }}
      >
        {children}
      </div>
      <div
        className="absolute flex w-full justify-between"
        style={{ bottom: "max(16px, 3cqh)", paddingInline: u(4.5, 14) }}
      >
        {side === "left" ? (
          <>
            <Label>{String(num).padStart(2, "0")}</Label>
            <span />
          </>
        ) : (
          <>
            <span />
            <Label>{String(num).padStart(2, "0")}</Label>
          </>
        )}
      </div>
    </div>
  );
}

function PageHeader({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex items-center justify-between border-b" style={{ borderColor: "var(--pg-fg)", paddingBottom: u(1.2, 6) }}>
      <Label>{left}</Label>
      <Label>{right}</Label>
    </div>
  );
}

function Field({ label, value, big = false, span = false }: { label: string; value: string; big?: boolean; span?: boolean }) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <p className="font-body uppercase" style={{ fontSize: u(1, 7), letterSpacing: "0.18em", opacity: 0.55 }}>
        {label}
      </p>
      <p
        className={`uppercase ${big ? "font-display font-bold" : "font-body font-medium"}`}
        style={{ fontSize: big ? u(4.4, 18) : u(1.8, 10), lineHeight: 1.05 }}
      >
        {value}
      </p>
    </div>
  );
}

/* ---------- 01 · Contraportada interior ---------- */

function InsidePage({ onJump }: PageProps) {
  return (
    <PageShell id="inside" side="left" uvText="Sin ruido">
      <PageHeader left="Pasaporte" right="Tobalina" />
      <div className="flex flex-1 flex-col justify-center">
        <p className="font-display font-bold uppercase" style={{ fontSize: u(5, 19), lineHeight: 0.92 }}>
          Este documento acredita una identidad.
          <br />
          <span style={{ opacity: 0.35 }}>No una tendencia.</span>
        </p>
      </div>
      <nav aria-label="Índice del pasaporte">
        {SPREADS.map((s, i) => (
          <button
            key={s.label}
            type="button"
            onClick={() => onJump?.(i)}
            className="index-row flex w-full items-baseline justify-between border-t text-left uppercase"
            style={{ borderColor: "var(--pg-fg)", paddingBlock: u(0.9, 5) }}
          >
            <span className="font-body font-medium" style={{ fontSize: u(1.5, 10), letterSpacing: "0.06em" }}>
              0{i + 1} — {s.label}
            </span>
            <Label>P.{String(PAGE_NUMBER[s.pages[0]]).padStart(2, "0")}</Label>
          </button>
        ))}
        <a
          href={`mailto:${EMAIL}`}
          className="block border-t border-b uppercase hover:underline"
          style={{ borderColor: "var(--pg-fg)", paddingBlock: u(0.9, 5) }}
        >
          <Label>{EMAIL}</Label>
        </a>
      </nav>
    </PageShell>
  );
}

/* ---------- 02 · Página de datos ---------- */

function DataPage() {
  return (
    <PageShell id="data" side="right" uvText="Identidad">
      <PageHeader left="Pasaporte — Passport" right="TBL" />
      <div className="flex flex-1 items-center" style={{ gap: u(3, 10), paddingBlock: u(2, 8) }}>
        <div
          className="flex shrink-0 items-center justify-center"
          style={{ width: "min(32%, 28cqh)", aspectRatio: "3 / 4", background: "var(--pg-fg)", color: "var(--pg-bg)" }}
        >
          <span className="font-display font-bold" style={{ fontSize: u(14, 56) }}>
            T
          </span>
        </div>
        <div className="relative grid min-w-0 flex-1 grid-cols-2" style={{ columnGap: u(2, 8), rowGap: u(1.4, 6) }}>
          <Field label="Tipo / Type" value="P" />
          <Field label="Código / Code" value="TBL" />
          <Field label="Nº / No." value="TBLN—ID.01" span />
          <Field label="Apellidos / Surname" value="Tobalina" big span />
          <Field label="Nombre / Given names" value="Estudio de diseño e identidad" span />
          <Field label="Nacionalidad" value="Identidad" />
          <Field label="Sede / Place" value="Madrid" />
          <Field label="Validez / Expiry" value="Atemporal" />
          <Field label="Autoridad" value="Criterio" />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 font-display font-bold"
            style={{ fontSize: u(6, 22), opacity: 0.08 }}
          >
            T
          </span>
        </div>
        <p
          aria-hidden="true"
          className="shrink-0 self-stretch text-center font-mono"
          style={{ writingMode: "vertical-rl", fontSize: u(1.2, 8), letterSpacing: "0.5em", opacity: 0.45 }}
        >
          ··TBLN·ID·01··
        </p>
      </div>
      <div className="border-t" style={{ borderColor: "var(--pg-fg)", paddingTop: u(1.1, 5) }}>
        <p className="font-body uppercase" style={{ fontSize: u(1, 7), letterSpacing: "0.18em", opacity: 0.55 }}>
          Firma del titular / Holder’s signature
        </p>
        <p className="font-display font-bold uppercase" style={{ fontSize: u(2.5, 12) }}>
          {STATEMENT}
        </p>
      </div>
      <div className="mrz" style={{ marginTop: u(1.8, 7), fontSize: "min(2.5cqh, 2.15cqw)", letterSpacing: "0.12em", lineHeight: 1.45 }}>
        {MRZ_LINES.map((l) => (
          <p key={l} className="whitespace-nowrap">
            {l}
          </p>
        ))}
      </div>
    </PageShell>
  );
}

/* ---------- Visados ---------- */

function VisaIntro({ visa, still, id }: PageProps & { visa: Visa; id: PageId }) {
  return (
    <PageShell id={id} side="left" uvText={visa.lines[0]}>
      <PageHeader left="Visado — Visa" right={`Nº ${visa.number}`} />
      <div className="flex flex-1 flex-col justify-center" style={{ gap: u(1, 4) }}>
        {visa.lines.map((l) => (
          <FitText key={l} className="font-display font-bold">
            {l}
          </FitText>
        ))}
      </div>
      <div className="flex items-end justify-between" style={{ gap: u(2, 8) }}>
        <div className="grid grid-cols-2 border-t" style={{ borderColor: "var(--pg-fg)", paddingTop: u(1.2, 5), gap: u(1.3, 5), width: "58%" }}>
          <Field label="Para / For" value={visa.destination} span />
          <Field label="Validez" value="Atemporal" />
          <Field label="Entradas" value="Ilimitadas" />
        </div>
        <Slam rotate={-8} delay={0.3} still={still}>
          <Stamp top="Tobalina" main="APROBADO" bottom="Madrid" />
        </Slam>
      </div>
    </PageShell>
  );
}

function VisaStamps({ visa, still, id }: PageProps & { visa: Visa; id: PageId }) {
  return (
    <PageShell id={id} side="right" uvText="Aprobado">
      <PageHeader left="Servicios — Services" right={visa.label} />
      <ol className="flex flex-1 flex-col justify-center">
        {visa.services.map((s, i) => (
          <li
            key={s.title}
            className="grid items-baseline border-t last:border-b"
            style={{ borderColor: "var(--pg-fg)", gridTemplateColumns: `${u(4, 22)} 1fr`, paddingBlock: u(1.6, 7) }}
          >
            <Label>{String(i + 1).padStart(2, "0")}</Label>
            <div>
              <p className="font-display font-bold uppercase" style={{ fontSize: u(3.6, 15), lineHeight: 0.95 }}>
                {s.title}
              </p>
              <p className="font-body uppercase" style={{ fontSize: u(1.2, 8), letterSpacing: "0.14em", marginTop: u(0.6, 3), opacity: 0.6 }}>
                {s.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <div className="flex justify-end">
        <Slam rotate={6} delay={0.5} still={still}>
          <Stamp top="Sin plantillas" main="100% ÚNICO" bottom={`Visado ${visa.number}`} />
        </Slam>
      </div>
    </PageShell>
  );
}

/* ---------- Observaciones y contacto ---------- */

function ObsPage() {
  return (
    <PageShell id="obs" side="left" uvText="Confidencial">
      <PageHeader left="Observaciones" right="Tobalina" />
      <ol className="flex flex-1 flex-col justify-center">
        {OBSERVATIONS.map((o, i) => (
          <li
            key={o}
            className="grid items-baseline border-t last:border-b"
            style={{ borderColor: "var(--pg-fg)", gridTemplateColumns: `${u(4, 22)} 1fr`, paddingBlock: u(2, 8) }}
          >
            <Label>{String(i + 1).padStart(2, "0")}</Label>
            <p className="font-display font-bold uppercase" style={{ fontSize: u(4.2, 17), lineHeight: 0.95 }}>
              {o}
            </p>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}

function ContactPage({ still }: PageProps) {
  const href = `mailto:${EMAIL}?subject=${encodeURIComponent("Solicitud de visado — Tobalina")}`;
  return (
    <PageShell id="contact" side="right" uvText="Tu turno">
      <PageHeader left="Autoridad expedidora" right="Madrid" />
      <div className="flex flex-1 flex-col justify-center" style={{ gap: u(1, 4) }}>
        <FitText className="font-display font-bold">SOLICITA</FitText>
        <FitText className="font-display font-bold">TU VISADO.</FitText>
        <a href={href} className="email-link mt-[2cqh] block">
          <FitText className="font-display font-bold" max={64}>
            {EMAIL.toUpperCase()}
          </FitText>
        </a>
      </div>
      <div className="flex items-end justify-between" style={{ gap: u(3, 10) }}>
        <div className="flex-1">
          <a href={href} className="underline underline-offset-4 hover:no-underline">
            <Label>Escribir →</Label>
          </a>
          <div className="border-b" style={{ borderColor: "var(--pg-fg)", height: u(3.5, 14) }} />
          <p className="font-body uppercase" style={{ fontSize: u(1, 7), letterSpacing: "0.18em", opacity: 0.55, marginTop: u(0.6, 3) }}>
            Firma del solicitante / Applicant’s signature
          </p>
        </div>
        <Slam rotate={-6} delay={0.4} still={still}>
          <Stamp top="Pendiente" main="TU FIRMA" bottom="Tobalina" />
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
      return <DataPage />;
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
