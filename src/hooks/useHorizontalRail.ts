import { useRef } from "react";
import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { EASE, SCRUB } from "@/lib/motion";
import { defilerVers } from "@/lib/lenis";
import { brancherFigures, brancherPiste, brancherPisteVerticale } from "@/lib/procede";

/* =====================================================================
   useHorizontalRail — le squelette de navigation du site (ROADMAP P3).

   Principe, en une phrase : on epingle (`pin`) une section a l'ecran,
   et pendant que la molette continue de tourner, on translate un convoyeur
   plus large que l'ecran vers la gauche.

   Chronogramme (comme en TP d'electronique numerique) :

     position de la molette   0 ────────────────────────────► course
                              │                              │
     etat de la section       │◄──── epinglee (pin) ────────►│
                              │                              │
     translation du convoyeur   0% ──────────────────────► -(N-1) x largeur

   La molette n'est PAS un declencheur ici, c'est l'AXE DES TEMPS de
   l'animation. D'ou `ease: "none"` obligatoire (CLAUDE.md §7) : un ease
   deformerait ce que l'utilisateur tient dans la main.

   Trois regimes, et un seul chemin de code par regime :
     - ecran >= 768 px et animations normales .... rail horizontal
     - ecran <  768 px ........................... pile verticale (natif)
     - "reduire les animations" .................. pile verticale (natif)
   Les deux derniers ne font RIEN ici : c'est la mise en page qui change
   (voir Rail.tsx). Aucun ScrollTrigger n'est cree, donc rien a nettoyer,
   rien a desynchroniser.
   ===================================================================== */

/** Largeur en dessous de laquelle le rail devient une pile verticale. */
export const SEUIL_RAIL = 768;

interface OptionsRail {
  /** Nombre de panneaux dans le rail. En dessous de 2, il n'y a rien a faire defiler. */
  readonly nombreDePanneaux: number;
  /** Reglage systeme "reduire les animations" (CLAUDE.md §9.1). */
  readonly animationsReduites: boolean;
  /** Le trait de l'indicateur : on pilote son `scaleX` de 0 a 1. */
  readonly refFilet: RefObject<HTMLElement | null>;
  /** Le compteur "01" de l'indicateur : on reecrit son texte. */
  readonly refCompteur: RefObject<HTMLElement | null>;
  /** Le <svg> de la piste (phase 4) : son viewBox est pose en pixels. */
  readonly refPisteSvg: RefObject<SVGSVGElement | null>;
  /** Le <path> de la piste : son `d` est pose en pixels, et c'est lui
      qu'on trace au scrub. */
  readonly refPisteTrace: RefObject<SVGPathElement | null>;
  /** Idem pour la piste verticale du mobile (sous 768 px). */
  readonly refPisteSvgV: RefObject<SVGSVGElement | null>;
  readonly refPisteTraceV: RefObject<SVGPathElement | null>;
}

interface RetourRail {
  /** A poser sur la section epinglee. */
  readonly refConteneur: RefObject<HTMLDivElement | null>;
  /** A poser sur le convoyeur : la rangee de panneaux, large de N ecrans. */
  readonly refConvoyeur: RefObject<HTMLDivElement | null>;
  /**
   * Le tween du rail. En phase 4, c'est LUI qu'on passera en
   * `containerAnimation` aux ScrollTriggers des figures de procede :
   * sans lui, elles surveilleraient une position verticale qui ne bouge
   * jamais pendant le defilement horizontal (CLAUDE.md §6.4).
   * `null` tant que le rail n'est pas actif.
   */
  readonly refAnimationConteneur: RefObject<gsap.core.Tween | null>;
}

export function useHorizontalRail({
  nombreDePanneaux,
  animationsReduites,
  refFilet,
  refCompteur,
  refPisteSvg,
  refPisteTrace,
  refPisteSvgV,
  refPisteTraceV,
}: OptionsRail): RetourRail {
  const refConteneur = useRef<HTMLDivElement>(null);
  const refConvoyeur = useRef<HTMLDivElement>(null);
  const refAnimationConteneur = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const conteneur = refConteneur.current;
      const convoyeur = refConvoyeur.current;

      // Garde-fou : pas de convoyeur, ou un seul panneau -> rien a faire defiler.
      if (!conteneur || !convoyeur || nombreDePanneaux < 2) return;
      if (animationsReduites) return;

      /* -----------------------------------------------------------------
         BLOC 1 — gsap.matchMedia()
         Le rail n'existe qu'au-dessus de 768 px. matchMedia cree le
         ScrollTrigger en entrant dans la requete et le REVOQUE en sortant.
         C'est ce qui fait qu'un redimensionnement de 1200 px a 600 px ne
         laisse pas un pin fantome derriere lui.
         ----------------------------------------------------------------- */
      const mm = gsap.matchMedia();

      mm.add(`(min-width: ${SEUIL_RAIL}px)`, () => {
        /* ---------------------------------------------------------------
           BLOC 2 — la course de defilement
           Elle doit valoir exactement la distance que le convoyeur parcourt,
           sinon le dernier panneau n'arrive jamais au bord (course trop
           courte) ou reste colle avant la fin (course trop longue).

             convoyeur  = N x largeur du conteneur
             course = convoyeur - 1 x largeur du conteneur = (N-1) x largeur

           On mesure `conteneur.clientWidth` et non `window.innerWidth` :
           innerWidth INCLUT la barre de defilement verticale. Sur un PC
           avec barres classiques (~15 px), les deux different, et le convoyeur
           finirait decalee de 15 px a 100 %. clientWidth est la largeur
           reellement visible. C'est une fonction, pas une valeur figee :
           `invalidateOnRefresh` la rappellera a chaque redimensionnement.
           --------------------------------------------------------------- */
        const course = () => convoyeur.offsetWidth - conteneur.clientWidth;

        /* ---------------------------------------------------------------
           BLOC 3 — l'indicateur de progression
           Ecrit DIRECTEMENT dans le DOM, sans passer par un state React :
           `onUpdate` tire a 60 images par seconde, et 60 rendus React par
           seconde suffisent a faire tomber le site sous la barre des
           60 fps. quickSetter est la version "pre-compilee" de gsap.set.
           --------------------------------------------------------------- */
        const filet = refFilet.current;
        const poserEchelle = filet ? gsap.quickSetter(filet, "scaleX") : null;

        /* La piste est pilotee par la progression du rail (voir la lecon
           en tete de `lib/procede.ts`). On declare la fonction ici, vide,
           et on la remplit juste apres la creation du tween : `onUpdate`
           ne tire de toute facon qu'a partir du premier defilement. */
        let majPiste: ((progression: number) => void) | null = null;

        const majIndicateur = (progression: number) => {
          majPiste?.(progression);

          // scaleX : une transformation. Pas `width`, interdit par le §7 —
          // animer width force le navigateur a refaire toute la mise en page
          // a chaque image, scaleX se traite sur le compositeur.
          poserEchelle?.(progression);

          const compteur = refCompteur.current;
          if (!compteur) return;
          // 3 panneaux : progression 0 -> 01, 0,5 -> 02, 1 -> 03.
          const index = Math.round(progression * (nombreDePanneaux - 1)) + 1;
          const texte = String(index).padStart(2, "0");
          // On n'ecrit que si la valeur change : eviter 60 ecritures DOM
          // par seconde pour afficher trois fois le meme "02".
          if (compteur.textContent !== texte) compteur.textContent = texte;
        };

        /* ---------------------------------------------------------------
           BLOC 4 — le rail lui-meme
           xPercent est un pourcentage de la largeur de L'ELEMENT ANIME
           (le convoyeur), pas du conteneur. Pour N panneaux dans un convoyeur de
           N x 100 % :  -100 x (N-1) / N.
           Verification pour N = 3 : -100 x 2/3 = -66,7 % de 300 % = -200 %
           de la largeur du conteneur, soit deux panneaux. Correct.
           --------------------------------------------------------------- */
        const animation = gsap.to(convoyeur, {
          xPercent: (-100 * (nombreDePanneaux - 1)) / nombreDePanneaux,
          ease: EASE.none, // OBLIGATOIRE sur un scrub (§7)
          scrollTrigger: {
            trigger: conteneur,
            start: "top top",
            end: () => `+=${course()}`,
            pin: true,
            anticipatePin: 1, // evite le sursaut au moment ou le pin s'active
            scrub: SCRUB, // 0,3 s — mesure en phase 1
            invalidateOnRefresh: true, // recalcule `end` et les valeurs au refresh
            onUpdate: (self) => majIndicateur(self.progress),
            onRefresh: (self) => majIndicateur(self.progress),
          },
        });

        refAnimationConteneur.current = animation;
        const declencheur = animation.scrollTrigger;

        /* ---------------------------------------------------------------
           BLOC 4 bis — le procede (phase 4)
           La piste et les figures dependent de la geometrie qu'on vient
           d'etablir, et doivent mourir avec elle. D'ou l'appel ici, dans
           le meme bloc matchMedia, et non dans un hook separe qui se
           reveillerait a contretemps apres un redimensionnement.
           --------------------------------------------------------------- */
        const nettoyages: Array<() => void> = [];

        const svgPiste = refPisteSvg.current;
        const tracePiste = refPisteTrace.current;
        if (svgPiste && tracePiste) {
          const piste = brancherPiste({
            conteneur,
            convoyeur,
            svg: svgPiste,
            trace: tracePiste,
            nombreDePanneaux,
          });
          majPiste = piste.mettreAJour;
          majPiste(declencheur?.progress ?? 0); // etat au chargement
          nettoyages.push(piste.nettoyer);
        }

        nettoyages.push(brancherFigures({ conteneur, animation }));

        /* ---------------------------------------------------------------
           BLOC 5 — le clavier (critere de sortie de la phase 3)
           Probleme : quand ⇥ amene le focus sur un element du panneau 3,
           celui-ci est hors ecran, translate par une transformation CSS.
           Le navigateur ne sait pas "defiler vers la droite" ici — il
           essaie, en poussant le scrollLeft du conteneur, ce qui decale
           tout sans rien reparer.

           Solution : on intercepte le focus, on identifie le panneau, on
           convertit son indice en position VERTICALE de molette (c'est
           elle qui pilote le rail), et on remet scrollLeft a zero pour
           annuler la tentative du navigateur.

             indice 0 -> debut du pin      (declencheur.start)
             indice N-1 -> fin du pin      (declencheur.end)
           --------------------------------------------------------------- */
        const surFocus = (evenement: FocusEvent) => {
          if (!declencheur) return;
          const cible = evenement.target;
          if (!(cible instanceof HTMLElement)) return;

          const panneau = cible.closest<HTMLElement>("[data-panneau]");
          if (!panneau) return;

          const indice = Number(panneau.dataset.panneau);
          if (!Number.isFinite(indice)) return;

          conteneur.scrollLeft = 0;
          const fraction = indice / (nombreDePanneaux - 1);
          defilerVers(declencheur.start + fraction * (declencheur.end - declencheur.start));
        };

        // Filet de securite : si le navigateur pousse quand meme le
        // conteneur (certaines versions de Safari le font au clic), on le
        // ramene a zero. Sans ca, le convoyeur se retrouve decale en double.
        const surDerive = () => {
          if (conteneur.scrollLeft !== 0) conteneur.scrollLeft = 0;
        };

        conteneur.addEventListener("focusin", surFocus);
        conteneur.addEventListener("scroll", surDerive);

        /* ---------------------------------------------------------------
           BLOC 6 — les polices
           Chakra Petch et IBM Plex Mono sont auto-hebergees : au premier
           rendu, le texte est mesure avec la police de secours. Quand la
           vraie police arrive, les hauteurs changent -> les positions
           calculees par ScrollTrigger sont fausses. D'ou le refresh
           (CLAUDE.md §6.3). `annule` evite de rafraichir un contexte
           deja revoque si l'utilisateur change de page entre-temps.
           --------------------------------------------------------------- */
        let annule = false;
        void document.fonts.ready.then(() => {
          if (!annule) ScrollTrigger.refresh();
        });

        return () => {
          annule = true;
          conteneur.removeEventListener("focusin", surFocus);
          conteneur.removeEventListener("scroll", surDerive);
          for (const nettoyer of nettoyages) nettoyer();
          refAnimationConteneur.current = null;
          // Le tween et son ScrollTrigger sont revoques par matchMedia.
        };
      });

      /* -----------------------------------------------------------------
         BLOC 7 — le mobile
         Sous 768 px il n'y a pas de rail : les panneaux sont empiles et
         le defilement est natif. La piste s'y trace de haut en bas.
         Le conteneur n'etant pas epingle, cette piste-la peut avoir son
         propre ScrollTrigger (le piege n°1 du §6.4 ne s'applique qu'a un
         element epingle).
         ----------------------------------------------------------------- */
      mm.add(`(max-width: ${SEUIL_RAIL - 1}px)`, () => {
        const svg = refPisteSvgV.current;
        const trace = refPisteTraceV.current;
        if (!svg || !trace) return;
        return brancherPisteVerticale({ conteneur, svg, trace });
      });

      return () => mm.revert();
    },
    { scope: refConteneur, dependencies: [nombreDePanneaux, animationsReduites] },
  );

  return { refConteneur, refConvoyeur, refAnimationConteneur };
}
