import { useEffect } from "react";
import { useLocation } from "react-router";
import { Nav } from "@/components/layout/Nav";
import { TransitionPages } from "@/components/layout/TransitionPages";
import { demarrerLenis, arreterLenis } from "@/lib/lenis";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { libelleDe } from "@/lib/parcours";
import { demarrerConsentement } from "@/lib/consentement";
import { BandeauConsentement } from "@/components/legal/BandeauConsentement";
import { titreDePage } from "@/content/site";

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

  /* Le titre de l'onglet suit la page (phase 6). Utile a tout le monde,
     indispensable a un lecteur d'ecran : dans une SPA, le navigateur ne
     recharge rien, et c'est ce titre qui dit « tu as change de page ».
     La page d'accueil (indice 0) garde le titre complet du site. */
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = titreDePage(libelleDe(pathname));
  }, [pathname]);

  /* Consentement aux traceurs : relit le choix enregistre et ne charge
     que ce qui a ete accepte. Ne fait RIEN tant que le registre
     content/traceurs.ts est vide (c'est le cas aujourd'hui). */
  useEffect(() => {
    demarrerConsentement();
  }, []);

  return (
    <div className="bg-ground text-ink min-h-screen">
      {/* Lien d'evitement (RGAA 12.7) : le premier ⇥ de la page le fait
          apparaitre, Entree saute la navigation. Invisible a la souris. */}
      <a
        href="#contenu"
        className="bg-ground text-ink text-small sr-only z-[70] px-4 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Aller au contenu
      </a>
      <Nav />
      {/* tabIndex -1 : cible du lien d'evitement, hors ordre de tabulation. */}
      <main id="contenu" tabIndex={-1}>
        <TransitionPages />
      </main>
      <BandeauConsentement />
    </div>
  );
}
