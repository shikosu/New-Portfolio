import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

/* =====================================================================
   Le parcours : l'ordre des 4 pages, et le code de chacune.

   Deux choses vivent ici et nulle part ailleurs :

   1. L'ORDRE. Il sert a deduire le SENS d'une navigation. Aller de
      /objectifs vers /experience, c'est avancer dans le procede (sens +1) ;
      revenir en arriere, c'est le remonter (sens -1). La transition de
      phase 5 joue dans un sens ou dans l'autre selon ce signe, y compris
      quand c'est le bouton "precedent" du navigateur qui declenche le
      changement : on ne regarde pas COMMENT on a navigue, on regarde OU
      on etait et OU on va.

   2. LE CHARGEUR de chaque page. Les 4 pages sont chargees a la demande
      (`import()` dynamique), donc Vite en fait 4 morceaux separes. C'est
      ce qui rend le prechargement possible : au survol de la fleche, on
      declenche le telechargement du morceau suivant AVANT le clic.

   Schema du parcours :

       01/03        04/06        07/09        10/12
       /  ────────► /objectifs ► /experience ► /projets
       indice 0        1              2            3
              ◄──────── sens -1 (on remonte) ────────

   Note sur les exports nommes : le §11 impose `export function Page()`,
   alors que React.lazy attend un module avec un export `default`. D'ou
   le `.then(m => ({ default: m.Page }))` : on adapte ici, une fois, au
   lieu de tordre la convention du projet.
   ===================================================================== */

export interface EtapeParcours {
  /** Le chemin de la route, tel qu'il apparait dans l'URL. */
  readonly chemin: string;
  /** Le libelle affiche (navigation, fleche de fin de rail). */
  readonly libelle: string;
  /** Le repere de procede qui ouvre la page (01, 04, 07, 10). */
  readonly repere: string;
}

export const PARCOURS: readonly EtapeParcours[] = [
  { chemin: "/", libelle: "Présentation", repere: "01" },
  { chemin: "/objectifs", libelle: "Objectifs", repere: "04" },
  { chemin: "/experience", libelle: "Expérience", repere: "07" },
  { chemin: "/projets", libelle: "Projets", repere: "10" },
] as const;

type Chargeur = () => Promise<{ default: ComponentType }>;

const CHARGEURS: Readonly<Record<string, Chargeur>> = {
  "/": () => import("@/pages/Presentation").then((m) => ({ default: m.Presentation })),
  "/objectifs": () => import("@/pages/Objectifs").then((m) => ({ default: m.Objectifs })),
  "/experience": () => import("@/pages/Experience").then((m) => ({ default: m.Experience })),
  "/projets": () => import("@/pages/Projets").then((m) => ({ default: m.Projets })),
};

/* ---------------------------------------------------------------------
   Le cache de prechargement.

   `import()` est deja dedoublonne par le navigateur : demander deux fois
   le meme module ne telecharge qu'une fois. On garde quand meme la
   promesse, parce que l'orchestrateur de transition a besoin de
   l'ATTENDRE : il ne remplace la page qu'une fois le morceau arrive,
   sinon Suspense afficherait un ecran vide le temps du telechargement —
   exactement le clignotement que le critere de sortie interdit.
   --------------------------------------------------------------------- */
const enCours = new Map<string, Promise<unknown>>();

export function precharger(chemin: string): Promise<unknown> {
  const chargeur = CHARGEURS[normaliser(chemin)];
  if (!chargeur) return Promise.resolve();

  const cle = normaliser(chemin);
  let promesse = enCours.get(cle);
  if (!promesse) {
    // Un echec reseau ne doit pas rester en cache : sinon la page ne se
    // chargerait plus jamais. On retire l'entree et on laisse remonter.
    promesse = chargeur().catch((erreur: unknown) => {
      enCours.delete(cle);
      throw erreur;
    });
    enCours.set(cle, promesse);
  }
  return promesse;
}

/** Les composants de page, charges a la demande. */
export const PAGES: Readonly<Record<string, LazyExoticComponent<ComponentType>>> = {
  "/": lazy(CHARGEURS["/"]),
  "/objectifs": lazy(CHARGEURS["/objectifs"]),
  "/experience": lazy(CHARGEURS["/experience"]),
  "/projets": lazy(CHARGEURS["/projets"]),
};

/* ---------------------------------------------------------------------
   Utilitaires d'ordre.
   --------------------------------------------------------------------- */

/** "/objectifs/" et "/objectifs" sont la meme page ; "" est la racine. */
function normaliser(chemin: string): string {
  if (chemin.length > 1 && chemin.endsWith("/")) return chemin.slice(0, -1);
  return chemin === "" ? "/" : chemin;
}

/** Position dans le parcours, ou -1 si le chemin n'en fait pas partie. */
export function indiceDe(chemin: string): number {
  const cible = normaliser(chemin);
  return PARCOURS.findIndex((etape) => etape.chemin === cible);
}

/**
 * Le sens de la navigation : +1 on avance dans le procede, -1 on le
 * remonte. Si l'un des deux chemins est inconnu (404 a venir), on
 * considere qu'on avance — c'est le cas par defaut, pas une erreur.
 */
export function sensEntre(depuis: string, vers: string): 1 | -1 {
  const a = indiceDe(depuis);
  const b = indiceDe(vers);
  if (a < 0 || b < 0) return 1;
  return b < a ? -1 : 1;
}

/** L'etape qui suit celle-ci dans le procede, ou null en fin de parcours. */
export function etapeSuivante(chemin: string): EtapeParcours | null {
  const indice = indiceDe(chemin);
  if (indice < 0) return null;
  return PARCOURS[indice + 1] ?? null;
}
