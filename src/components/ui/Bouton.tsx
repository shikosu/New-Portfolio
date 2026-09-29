import type { ButtonHTMLAttributes } from "react";

/* ---------------------------------------------------------------------
   Le bouton du site : UN composant, DEUX variantes (DESIGN.md §4).

     principal   fond encre, texte quartz   -> l'action attendue
     secondaire  bordure encre, s'inverse   -> toutes les autres
                 au survol

   Angles vifs (le theme efface les rayons), hauteur minimale 44 px
   (`min-h-11`, cible tactile), et un changement de couleur au survol
   dont la duree vient du theme (--default-transition-duration).

   Pas de variante « danger », « lien », « icone » : le site n'en a pas
   besoin. Une troisieme variante s'ajoute d'abord dans DESIGN.md.
   --------------------------------------------------------------------- */

const COMMUN = "text-small min-h-11 border border-ink px-5 py-2 font-bold transition-colors";

const VARIANTES = {
  principal: "bg-ink text-ground hover:bg-ground hover:text-ink",
  secondaire: "text-ink hover:bg-ink hover:text-ground",
} as const;

interface ProprietesBouton extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variante?: keyof typeof VARIANTES;
}

export function Bouton({ variante = "secondaire", className = "", ...reste }: ProprietesBouton) {
  return (
    <button
      type="button"
      {...reste}
      className={`${COMMUN} ${VARIANTES[variante]} ${className}`.trim()}
    />
  );
}
