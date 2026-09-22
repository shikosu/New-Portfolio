import { useEffect } from "react";
import { Nav } from "@/components/layout/Nav";
import { TransitionPages } from "@/components/layout/TransitionPages";
import { demarrerLenis, arreterLenis } from "@/lib/lenis";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* ---------------------------------------------------------------------
   Coquille persistante : le fond, la navigation et le defilement lisse
   survivent aux changements de page (ROADMAP phase 5).

   C'est ce qui repond a deux criteres de sortie d'un coup :
   - aucun clignotement blanc, puisque `bg-ground` n'est jamais demonte ;
   - pas de fuite memoire, puisque l'instance Lenis n'est creee qu'une
     fois pour toute la visite au lieu d'une par page.

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
        <TransitionPages />
      </main>
    </div>
  );
}
