import type { RefObject } from "react";

/* ---------------------------------------------------------------------
   Indicateur de progression du rail (ROADMAP P3).

   Forme retenue : un compteur en IBM Plex Mono ("01 / 03") et un filet
   court dont la portion encree avance avec le scrub.

   Deux points d'accessibilite :

   1. `aria-hidden` — le compteur est une commodite VISUELLE. Un lecteur
      d'ecran parcourt les panneaux dans l'ordre du DOM, il n'a pas besoin
      qu'on lui annonce "02 / 03" a chaque image. L'information n'est pas
      perdue, elle est portee par la structure.
   2. Le filet gris (`--color-rule`, 1,32:1) est ici LEGITIME : il est
      purement decoratif, c'est la gorge vide. L'information, elle, est
      portee par le compteur et par la portion encree, tous deux en
      `--color-ink` (18,08:1). Voir CLAUDE.md §10, consequence 2.

   Aucune valeur n'est calculee ici : c'est useHorizontalRail qui ecrit
   dans ces deux refs, 60 fois par seconde, sans repasser par React.
   --------------------------------------------------------------------- */

interface ProprietesIndicateur {
  readonly refFilet: RefObject<HTMLSpanElement | null>;
  readonly refCompteur: RefObject<HTMLSpanElement | null>;
  readonly total: number;
}

export function IndicateurRail({ refFilet, refCompteur, total }: ProprietesIndicateur) {
  return (
    <div
      data-indicateur=""
      aria-hidden="true"
      className="pointer-events-none absolute bottom-6 left-6 z-40 hidden items-center gap-4 md:flex"
    >
      <p className="text-mono font-mono">
        <span ref={refCompteur} className="text-ink">
          01
        </span>
        <span className="text-ink-soft"> / {String(total).padStart(2, "0")}</span>
      </p>

      {/* La gorge : largeur fixe, 1 px de haut, overflow cache pour que
          le trait encre ne deborde jamais meme si scaleX depasse 1. */}
      <span className="bg-rule relative block h-px w-28 overflow-hidden">
        {/* Le trait encre. origin-left + scale-x-0 : il part de zero et
            grandit vers la droite. Une transformation, jamais `width`. */}
        <span ref={refFilet} className="bg-ink absolute inset-0 block origin-left scale-x-0" />
      </span>
    </div>
  );
}
