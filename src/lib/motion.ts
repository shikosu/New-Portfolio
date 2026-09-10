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
