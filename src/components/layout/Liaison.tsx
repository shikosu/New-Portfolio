import type { RefObject } from "react";
import { TRAIT } from "@/lib/motion";

/* ---------------------------------------------------------------------
   La liaison : le morceau de piste qui relie deux pages (phase 5).

   Pendant une transition, la piste de la page sortante s'en va avec elle
   et celle de la page entrante n'est pas encore a l'ecran. Entre les
   deux, c'est CE trait-la qui porte la continuite : il sort par le bord
   droit de la page A, puis entre par le bord gauche de la page B.

   Trois choix, et leurs raisons :

   - `fixed` : il est cale sur la FENETRE, pas sur le document. Les pages
     glissent dessous, lui ne bouge pas. C'est ce qui fait qu'on lit une
     seule ligne continue et non deux traits qui se croisent.

   - hors du conteneur anime : s'il vivait dans la page sortante, il
     partirait avec elle. Il est donc pose a cote, dans la coquille
     persistante.

   - meme hauteur et meme epaisseur que la piste du rail
     (HAUTEUR_PISTE, TRAIT) : le §8 est formel, "la piste est UNE SEULE
     ligne ; deux epaisseurs = deux objets". Le raccord doit etre
     invisible.

   `visibility: hidden` au repos plutot que `display: none` : un element
   en `display:none` n'a pas de geometrie, donc `lib/transition.ts` ne
   pourrait pas le mesurer avant de l'afficher.
   --------------------------------------------------------------------- */

interface ProprietesLiaison {
  readonly refSvg: RefObject<SVGSVGElement | null>;
  readonly refTrace: RefObject<SVGPathElement | null>;
}

export function Liaison({ refSvg, refTrace }: ProprietesLiaison) {
  return (
    <svg
      ref={refSvg}
      data-liaison=""
      aria-hidden="true"
      className="text-ink pointer-events-none fixed inset-0 z-[45] h-full w-full"
      style={{ visibility: "hidden" }}
      fill="none"
      stroke="currentColor"
      strokeWidth={TRAIT}
      strokeLinecap="round"
    >
      {/* Le `d` est pose en pixels par `lib/transition.ts` : il depend de
          la taille reelle de la fenetre, comme celui de la piste. */}
      <path ref={refTrace} />
    </svg>
  );
}
