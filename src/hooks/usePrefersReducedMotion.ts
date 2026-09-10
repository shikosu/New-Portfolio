import { useSyncExternalStore } from "react";

/* ---------------------------------------------------------------------
   Lit le reglage systeme "reduire les animations" (CLAUDE.md §9.1).
   Ce hook conditionne TOUT : en mode reduit, les animations deviennent
   des changements d'etat instantanes et le contenu reste integralement
   accessible.

   useSyncExternalStore plutot que useState + useEffect : le hook rend la
   bonne valeur des le PREMIER rendu (pas de scintillement), et suit les
   changements si l'utilisateur modifie le reglage sans recharger.
   --------------------------------------------------------------------- */

const REQUETE = "(prefers-reduced-motion: reduce)";

function souscrire(auChangement: () => void): () => void {
  const mql = window.matchMedia(REQUETE);
  mql.addEventListener("change", auChangement);
  return () => mql.removeEventListener("change", auChangement);
}

function lire(): boolean {
  return window.matchMedia(REQUETE).matches;
}

// Valeur utilisee si le composant est rendu hors navigateur.
function lireCoteServeur(): boolean {
  return false;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(souscrire, lire, lireCoteServeur);
}
