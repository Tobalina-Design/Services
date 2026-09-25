import IdentityMark from "./IdentityMark";
import VerificationCard from "./VerificationCard";

// Un solo viewport. Sin scroll narrativo.
// Jerarquía: identidad (fija) arriba → verificación (interactiva) abajo.
export default function Hero() {
  return (
    <section className="min-h-screen w-full bg-paper flex flex-col items-center justify-center gap-16 px-6 py-16">
      <IdentityMark />
      <VerificationCard />
    </section>
  );
}
