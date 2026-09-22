import type { RefObject } from "react";
import { TRAIT } from "@/lib/motion";

/* ---------------------------------------------------------------------
   La piste : LA ligne noire unique du site (CLAUDE.md §1, §10).

   Elle n'est pas dans `assets/process/` avec les 12 figures, et c'est
   volontaire : sa longueur vaut la largeur du convoyeur, qui depend de
   la taille de la fenetre. Un fichier 400 x 400 dessine a la main ne
   peut pas s'adapter. Le `viewBox` et le `d` sont donc poses en pixels
   par `brancherPiste`, et remesures a chaque redimensionnement.

   Elle vit DANS le convoyeur : elle se translate donc avec les panneaux,
   ce qui est exactement ce qu'il faut pour que sa pointe reste un front
   fixe a l'ecran (le calcul est dans `lib/procede.ts`).

   `--color-ink` et non `--color-rule` : la piste porte du sens, c'est la
   regle 2 du §10.
   --------------------------------------------------------------------- */

interface ProprietesPiste {
  readonly refSvg: RefObject<SVGSVGElement | null>;
  readonly refTrace: RefObject<SVGPathElement | null>;
}

export function Piste({ refSvg, refTrace }: ProprietesPiste) {
  return (
    <svg
      ref={refSvg}
      aria-hidden="true"
      /* `hidden md:block` : sous 768 px le rail est une pile verticale,
         une piste horizontale n'y a aucun sens. Le trace vertical du
         mobile reste a faire (voir ROADMAP phase 4). */
      className="text-ink pointer-events-none absolute inset-0 hidden h-full w-full md:block"
      fill="none"
      stroke="currentColor"
      strokeWidth={TRAIT}
      strokeLinecap="round"
    >
      {/* Le `d` est pose en JavaScript : il depend de la largeur reelle. */}
      <path ref={refTrace} />
    </svg>
  );
}
