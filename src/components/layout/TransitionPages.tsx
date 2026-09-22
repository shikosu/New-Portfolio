import { startTransition, Suspense, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router";
import type { Location } from "react-router";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { SEUIL_RAIL } from "@/hooks/useHorizontalRail";
import { PAGES, PARCOURS, precharger, sensEntre } from "@/lib/parcours";
import { pointeDeLaPiste } from "@/lib/procede";
import { remettreEnHaut } from "@/lib/lenis";
import { Liaison } from "@/components/layout/Liaison";
import {
  afficherLiaison,
  effacerLiaison,
  figerScene,
  jouerEntree,
  jouerSortie,
  mesurerLiaison,
} from "@/lib/transition";

/* =====================================================================
   L'orchestrateur des transitions de page (ROADMAP phase 5).

   L'IDEE CENTRALE, et elle tient en un mot : la LOCATION DIFFEREE.

   React Router change d'adresse instantanement. Si on le laissait faire,
   la page A disparaitrait avant d'avoir eu le temps de sortir. On garde
   donc DEUX adresses :

       location  ..... celle du navigateur, elle change au clic
       affichee  ..... celle qu'on rend vraiment, elle change en retard

   `<Routes location={affichee}>` : on dit explicitement a React Router
   quelle adresse rendre, au lieu de le laisser lire la sienne.

   MACHINE A ETATS. Le hook se relance a chaque changement de l'une ou
   l'autre, et trois cas seulement peuvent se presenter :

       location change            affichee change
            │                          │
            ▼                          ▼
       (C) SORTIE ──── on remplace ──► (A) ENTREE ──► repos
            │                                          ▲
            └──── (B) rien a faire ────────────────────┘

   Le passage de (C) a (A) se fait par un drapeau en `ref` et non par un
   state : un state de plus, c'est un rendu de plus, donc un risque de
   rejouer une animation deja jouee.

   LE CLIGNOTEMENT BLANC (critere de sortie). Il a trois causes possibles,
   et les trois sont traitees ici :
     1. la page suivante n'est pas encore telechargee -> on ATTEND la
        promesse de `precharger` avant de remplacer quoi que ce soit ;
     2. le fond disparait entre les deux pages -> le fond `bg-ground`
        est porte par la coquille, qui n'est jamais demontee ;
     3. Suspense affiche son `fallback` -> il ne peut plus se declencher,
        puisqu'on ne remplace la page qu'une fois le morceau arrive.
   ===================================================================== */

/* ⚠ LECON DE LA PHASE 5, mesuree au banc, a ne pas re-apprendre.

   `setAffichee(location)` tout court ne marche PAS ici. Les pages sont
   chargees a la demande : au premier rendu de la nouvelle, React.lazy
   suspend le temps d'un micro-tour, Suspense affiche son `fallback`, et
   React applique alors son garde-fou anti-clignotement — il refuse de
   remplacer un fallback avant ~300 ms, meme si le contenu est deja pret.
   Mesure au banc : la page entrante apparaissait 336 ms en retard, donc
   d'un coup, a 83 % d'opacite, au lieu de se reveler depuis 0.

   `startTransition` marque la mise a jour comme non urgente : React garde
   l'ancien arbre a l'ecran pendant qu'il prepare le nouveau, n'affiche
   jamais le fallback, et n'a donc aucun garde-fou a appliquer. Le rendu
   tombe sur le meme tour que le debut de l'animation d'entree.

   Consequence a retenir : le composant qui declenche une transition
   visuelle ne peut pas etre rendu par un chemin qui suspend sans
   `startTransition`, sinon l'animation et le DOM se desynchronisent. */

/** Ce qu'il reste a faire une fois la page remplacee. */
interface Suite {
  readonly sens: 1 | -1;
  /** false = bascule instantanee (mode reduit, ou sous 768 px). */
  readonly anime: boolean;
}

export function TransitionPages() {
  const location = useLocation();
  const animationsReduites = usePrefersReducedMotion();
  const [affichee, setAffichee] = useState<Location>(location);

  const refScene = useRef<HTMLDivElement>(null);
  const refSvg = useRef<SVGSVGElement>(null);
  const refTrace = useRef<SVGPathElement>(null);
  const refSuite = useRef<Suite | null>(null);

  useGSAP(
    () => {
      const scene = refScene.current;
      const svg = refSvg.current;
      const trace = refTrace.current;
      if (!scene || !svg || !trace) return;

      let annule = false;

      /* =============================================================
         (A) La page vient d'etre remplacee : on joue l'entree.
         ============================================================= */
      const suite = refSuite.current;
      if (suite) {
        refSuite.current = null;

        /* Le rail de la nouvelle page s'est monte juste avant ce bloc
           (les effets des enfants passent avant ceux du parent), a un
           moment ou la hauteur du document bougeait encore. On remesure
           tout avant de bouger un pixel — c'est le §6.3. */
        ScrollTrigger.refresh();

        // Le focus repart en tete de la nouvelle page : sans ca, un
        // utilisateur au clavier resterait accroche a un element qui
        // n'existe plus et repartirait du haut du navigateur (§9.2).
        scene.focus({ preventScroll: true });

        if (!suite.anime) return;

        const geometrie = mesurerLiaison(svg, trace);
        const tl = jouerEntree({
          scene,
          trace,
          geometrie,
          sens: suite.sens,
          auTermine: () => {
            if (annule) return;
            /* La liaison s'arrete exactement sur la position de repos de
               la piste de la page : les deux traits se superposent au
               pixel pres, donc masquer l'un ne se voit pas. */
            effacerLiaison(svg);
            gsap.set(scene, { clearProps: "opacity" });
            ScrollTrigger.refresh();
          },
        });

        return () => {
          annule = true;
          tl.kill();
        };
      }

      /* =============================================================
         (B) Rien a faire : premier rendu, ou adresse inchangee.
         ============================================================= */
      if (location.key === affichee.key) return;

      const sens = sensEntre(affichee.pathname, location.pathname);
      const chargement = precharger(location.pathname);

      /* =============================================================
         (C bis) Bascule instantanee.

         Deux situations, un seul chemin de code — c'est exactement le
         raisonnement du §2 pour le rail : "une seule mecanique a
         deboguer au lieu de deux".
           - "reduire les animations" : le §9.1 l'exige.
           - sous 768 px : le rail y est une pile verticale et la piste
             se trace de haut en bas. Une liaison horizontale n'aurait
             aucun sens, et un balayage vertical serait une DEUXIEME
             mecanique a regler et a tester.
         ============================================================= */
      if (animationsReduites || window.innerWidth < SEUIL_RAIL) {
        void chargement.then(() => {
          if (annule) return;
          remettreEnHaut();
          refSuite.current = { sens, anime: false };
          startTransition(() => setAffichee(location));
        });
        return () => {
          annule = true;
        };
      }

      /* =============================================================
         (C) La sortie.
         ============================================================= */
      const geometrie = mesurerLiaison(svg, trace);
      // La liaison reprend le trait exactement ou la piste l'a laisse.
      const pointe = pointeDeLaPiste(scene) ?? geometrie.largeur;
      afficherLiaison(svg);

      // La scene sort du flux : c'est ce qui permet de la translater
      // sans decaler le rail epingle (lecon en tete de lib/transition.ts).
      const degeler = figerScene(scene);

      const tl = jouerSortie({
        scene,
        trace,
        geometrie,
        sens,
        pointe,
        auTermine: () => {
          void chargement.then(
            () => {
              if (annule) return;
              // Dans cet ordre : la page sortante est encore montee mais
              // hors ecran, donc son rail peut rebobiner sans qu'on le voie.
              remettreEnHaut();
              degeler();
              refSuite.current = { sens, anime: true };
              startTransition(() => setAffichee(location));
            },
            () => {
              /* Le morceau de code n'arrive pas : reseau coupe, ou
                 deploiement passe entre-temps et l'ancien fichier n'existe
                 plus. Plutot que de laisser un ecran vide, on fait une
                 vraie navigation : le navigateur ira chercher la page
                 complete, et au pire affichera SON message d'erreur. */
              window.location.assign(location.pathname);
            },
          );
        },
      });

      return () => {
        annule = true;
        tl.kill();
      };
    },
    { dependencies: [location, affichee, animationsReduites] },
  );

  return (
    <>
      {/* tabIndex -1 : cible de focus apres un changement de page, sans
          entrer dans l'ordre de tabulation. Pas de `outline: none` ici :
          le focus programme ne declenche pas `:focus-visible`, donc la
          regle du §9.2 est respectee sans rien desactiver. */}
      <div ref={refScene} tabIndex={-1}>
        <Suspense fallback={null}>
          <Routes location={affichee}>
            {PARCOURS.map(({ chemin }) => {
              const Page = PAGES[chemin];
              return <Route key={chemin} path={chemin} element={<Page />} />;
            })}
          </Routes>
        </Suspense>
      </div>

      <Liaison refSvg={refSvg} refTrace={refTrace} />
    </>
  );
}
