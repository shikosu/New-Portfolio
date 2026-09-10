import { useEffect } from "react";
import { Outlet } from "react-router";
import { Nav } from "@/components/layout/Nav";
import { demarrerLenis, arreterLenis } from "@/lib/lenis";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* ---------------------------------------------------------------------
   Coquille persistante : le fond et la navigation survivent aux
   changements de page (CLAUDE.md, phase 5 de la ROADMAP).

   Note : ici on utilise useEffect et non useGSAP, et ce n'est pas une
   entorse au §6.2 — Lenis n'est pas une animation GSAP, c'est un service
   a demarrer une fois. La regle "toujours useGSAP" vise les tweens et les
   ScrollTriggers, qui eux doivent etre revoques au demontage.
   --------------------------------------------------------------------- */

export function Shell() {
  const animationsReduites = usePrefersReducedMotion();

  useEffect(() => {
    // Reglage "reduire les animations" : on laisse le defilement natif du
    // navigateur. Lisser le scroll de quelqu'un qui demande moins de
    // mouvement serait exactement le contraire de ce qu'il demande.
    if (animationsReduites) return;

    demarrerLenis();
    return () => arreterLenis();
  }, [animationsReduites]);

  return (
    <div className="bg-ground text-ink min-h-screen">
      <Nav />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
