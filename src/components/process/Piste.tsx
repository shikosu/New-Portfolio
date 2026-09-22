import type { RefObject } from "react";
import { TRAIT } from "@/lib/motion";

/* ---------------------------------------------------------------------
   La piste : LA ligne noire unique du site (CLAUDE.md §1, §10).

   Elle n'est pas dans `assets/process/` avec les 12 figures, et c'est
   volontaire : sa longueur vaut la largeur du convoyeur (ou la hauteur
   de la pile en mobile), qui depend de la taille de la fenetre. Un
   fichier 400 x 400 dessine a la main ne peut pas s'adapter. Le
   `viewBox` et le `d` sont donc poses en pixels par `lib/procede.ts`,
   et remesures a chaque redimensionnement.

   Deux orientations, un seul recit :
   - horizontale : elle vit DANS le convoyeur, donc elle se translate
     avec les panneaux — c'est ce qui fait de sa pointe un front fixe ;
   - verticale : sous 768 px le rail est une pile, la piste se trace de
     haut en bas le long du bord du texte.

   `--color-ink` et non `--color-rule` : la piste porte du sens, c'est la
   regle 2 du §10.
   --------------------------------------------------------------------- */

interface ProprietesPiste {
  readonly refSvg: RefObject<SVGSVGElement | null>;
  readonly refTrace: RefObject<SVGPathElement | null>;
  readonly orientation: "horizontale" | "verticale";
}

export function Piste({ refSvg, refTrace, orientation }: ProprietesPiste) {
  // Les deux pistes sont rendues, et c'est le CSS qui choisit laquelle
  // s'affiche : le seuil reste ainsi au meme endroit que celui du rail.
  const visibilite = orientation === "horizontale" ? "hidden md:block" : "block md:hidden";

  return (
    <svg
      ref={refSvg}
      // `data-piste` : c'est par lui que `pointeDeLaPiste()` retrouve le
      // trace au moment d'une transition de page (phase 5).
      data-piste={orientation}
      aria-hidden="true"
      className={`text-ink pointer-events-none absolute inset-0 h-full w-full ${visibilite}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={TRAIT}
      strokeLinecap="round"
    >
      {/* Le `d` est pose en JavaScript : il depend de la taille reelle. */}
      <path ref={refTrace} />
    </svg>
  );
}
