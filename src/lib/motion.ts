/* ---------------------------------------------------------------------
   Constantes d'animation (CLAUDE.md §7).
   Aucune duree ni easing en dur dans un composant : sinon, le jour ou
   une transition parait trop lente, il faut la chercher dans 40 fichiers.
   --------------------------------------------------------------------- */

export const DUR = {
  micro: 0.2, // survol, focus, changement d'etat
  base: 0.5, // apparition d'un element
  reveal: 0.8, // revelation d'une section
  page: 1.1, // transition entre deux pages — PLAFOND ABSOLU
} as const;

export const EASE = {
  out: "power2.out", // defaut pour tout ce qui apparait
  strong: "expo.out", // moments forts uniquement
  inOut: "power2.inOut", // aller-retour
  none: "none", // OBLIGATOIRE des qu'il y a un scrub
} as const;

export const STAGGER = 0.06;

/* Retard de rattrapage entre la molette et l'animation, en secondes.
   Mesure de phase 1 (`proto/scrub-lab.html`, 2026-09-10) : 0.3 reste colle
   au doigt, 1 commence a flotter, 2 devient elastique.
   60 fps, pire image 17 ms. */
export const SCRUB = 0.3;

/* ---------------------------------------------------------------------
   Geometrie de la piste (phase 4).
   La piste est LA ligne noire unique qui traverse le site (CLAUDE.md §1).
   --------------------------------------------------------------------- */

/** Hauteur de la piste dans le panneau, en fraction de la hauteur d'ecran.
    0,68 : sous le bloc de texte, assez bas pour que les figures posees
    dessus tiennent au-dessus sans toucher le titre. */
export const HAUTEUR_PISTE = 0.68;

/** Longueur de piste deja tracee a l'entree du rail, en largeurs d'ecran.
    0,5 -> au repos, la ligne va du bord gauche au milieu de l'ecran, et la
    pointe derive jusqu'au bord droit pile a la fin du rail. Voir le calcul
    dans `lib/procede.ts`. Mettre 0 pour partir d'une page vierge. */
export const AVANCE_PISTE = 0.5;

/** Marge gauche de la piste verticale (mobile), en pixels. Alignee sur
    le `px-6` des panneaux pour que la ligne suive le bord du texte. */
export const MARGE_PISTE = 24;

/** Epaisseur de trait commune a la piste ET aux 12 figures (CLAUDE.md §8 :
    "la piste est une seule ligne ; deux epaisseurs = deux objets"). */
export const TRAIT = 2.4;
