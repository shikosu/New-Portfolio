import { useSyncExternalStore } from "react";
import { CATEGORIES, TRACEURS } from "@/content/traceurs";
import type { Categorie } from "@/content/traceurs";

/* =====================================================================
   Le consentement aux traceurs (CNIL, article 82 de la loi
   Informatique et Libertes). Chantier de conformite, 2026-09-23.

   ANALOGIE ELECTRONIQUE : c'est un interrupteur commande, pas un fusible.
   Par defaut le circuit est OUVERT — aucun script de mesure n'est dans la
   page. Seul un « Accepter » ferme le contact, et un « Refuser » ou un
   retrait le rouvre.

       registre (content/traceurs.ts)
            │
            ▼
       ┌───────────┐  choix == null   ┌─────────┐
       │  demarrer │ ───────────────► │ bandeau │──► enregistrer(choix)
       └───────────┘                  └─────────┘          │
            │ choix connu                                   │
            ▼                                               ▼
       appliquer(choix) ◄───────────────────────────────────┘
            │
            └─► injecte <script> UNIQUEMENT pour les categories acceptees

   LES QUATRE REGLES CNIL, et ou elles vivent :
   1. « Tout refuser » aussi visible que « Tout accepter » ... Bandeau.tsx
      (meme composant de bouton, meme taille, cote a cote).
   2. Rien avant le consentement ............................ appliquer()
      (le seul endroit du site qui cree un <script> de traceur).
   3. Retrait aussi simple que l'accord ..... ouvrirPreferences(), appele
      par le bouton « Gerer mes cookies » du pied de page.
   4. Choix conserve six mois au plus ................ DUREE_CHOIX_JOURS.

   Le choix lui-meme est range dans le localStorage. Ce stockage-la est
   exempte de consentement : il sert uniquement a se souvenir de la
   reponse du visiteur, sans quoi il faudrait la redemander a chaque page.
   ===================================================================== */

/** 6 mois (recommandation CNIL). Au-dela, on redemande. */
export const DUREE_CHOIX_JOURS = 182;

const CLE = "irchi.consentement";
const MS_PAR_JOUR = 24 * 60 * 60 * 1000;

/** Categorie -> accepte (true) ou refuse (false). */
export type Choix = Readonly<Record<string, boolean>>;

interface Enregistrement {
  /**
   * La liste des traceurs au moment du choix. Si le registre change
   * (outil ajoute ou remplace), l'empreinte ne correspond plus et on
   * redemande : on ne peut pas avoir consenti a un outil inconnu.
   */
  readonly empreinte: string;
  readonly date: number;
  readonly choix: Choix;
}

interface Etat {
  /** null = le visiteur n'a pas encore repondu (ou son choix a expire). */
  readonly choix: Choix | null;
  /** Vrai quand le visiteur a rouvert ses preferences. */
  readonly preferencesOuvertes: boolean;
}

/* ---------------------------------------------------------------------
   Ce que le registre contient.
   --------------------------------------------------------------------- */

/** Les categories qui ont AU MOINS un traceur. Les autres sont masquees. */
export function categoriesUtilisees(): readonly Categorie[] {
  return CATEGORIES.filter((c) => TRACEURS.some((t) => t.categorie === c.id));
}

/** Faut-il un bandeau ? Non tant que le registre est vide. */
export const CONSENTEMENT_REQUIS = TRACEURS.length > 0;

const EMPREINTE = TRACEURS.map((t) => `${t.id}:${t.categorie}`)
  .sort()
  .join("|");

/* ---------------------------------------------------------------------
   Lecture et ecriture du choix.

   Tout acces au localStorage est dans un try/catch : navigation privee,
   stockage bloque ou plein -> il leve une exception. Dans ce cas on se
   comporte comme si le visiteur n'avait pas encore repondu, ce qui est
   le cas SUR (rien n'est charge).
   --------------------------------------------------------------------- */

function lireStockage(): Choix | null {
  try {
    const brut = window.localStorage.getItem(CLE);
    if (!brut) return null;
    const lu = JSON.parse(brut) as Partial<Enregistrement>;
    if (lu.empreinte !== EMPREINTE) return null;
    if (typeof lu.date !== "number") return null;
    if (Date.now() - lu.date > DUREE_CHOIX_JOURS * MS_PAR_JOUR) return null;
    if (!lu.choix || typeof lu.choix !== "object") return null;
    return lu.choix;
  } catch {
    return null;
  }
}

function ecrireStockage(choix: Choix): void {
  const enregistrement: Enregistrement = { empreinte: EMPREINTE, date: Date.now(), choix };
  try {
    window.localStorage.setItem(CLE, JSON.stringify(enregistrement));
  } catch {
    // Stockage indisponible : le choix vaut pour cette visite seulement.
  }
}

/* ---------------------------------------------------------------------
   Le magasin, lu par React via useSyncExternalStore (meme technique que
   usePrefersReducedMotion). L'objet `etat` est REMPLACE a chaque
   changement, jamais modifie : c'est ce qui permet a React de voir que
   quelque chose a change.
   --------------------------------------------------------------------- */

let etat: Etat = { choix: null, preferencesOuvertes: false };
const abonnes = new Set<() => void>();

function changer(suivant: Etat): void {
  etat = suivant;
  abonnes.forEach((prevenir) => prevenir());
}

function souscrire(prevenir: () => void): () => void {
  abonnes.add(prevenir);
  return () => abonnes.delete(prevenir);
}

export function useConsentement(): Etat {
  return useSyncExternalStore(
    souscrire,
    () => etat,
    () => etat,
  );
}

/* ---------------------------------------------------------------------
   L'interrupteur : injecte les scripts des categories acceptees.
   `charges` evite d'injecter deux fois le meme script.
   --------------------------------------------------------------------- */

const charges = new Set<string>();

function appliquer(choix: Choix): void {
  for (const traceur of TRACEURS) {
    if (!choix[traceur.categorie] || !traceur.script || charges.has(traceur.id)) continue;
    const balise = document.createElement("script");
    balise.src = traceur.script.src;
    balise.defer = true;
    for (const [nom, valeur] of Object.entries(traceur.script.attributs ?? {})) {
      balise.setAttribute(nom, valeur);
    }
    document.head.append(balise);
    charges.add(traceur.id);
  }
}

/** A appeler une fois, au demarrage de l'application. */
export function demarrerConsentement(): void {
  if (!CONSENTEMENT_REQUIS) return;
  const choix = lireStockage();
  changer({ choix, preferencesOuvertes: false });
  if (choix) appliquer(choix);
}

export function enregistrer(choix: Choix): void {
  ecrireStockage(choix);

  /* Un script deja charge ne se « decharge » pas : il a pu poser ses
     propres ecouteurs et cookies. Si le visiteur retire un accord donne
     plus tot dans la visite, la seule facon honnete d'appliquer le retrait
     est de recharger la page, qui repart alors SANS ce script. */
  const retrait = TRACEURS.some((t) => charges.has(t.id) && !choix[t.categorie]);
  if (retrait) {
    window.location.reload();
    return;
  }

  changer({ choix, preferencesOuvertes: false });
  appliquer(choix);
}

/** Construit un choix ou toutes les categories valent `valeur`. */
export function choixUniforme(valeur: boolean): Choix {
  return Object.fromEntries(categoriesUtilisees().map((c) => [c.id, valeur]));
}

/** Le lien « Gerer mes cookies » du pied de page. */
export function ouvrirPreferences(): void {
  changer({ ...etat, preferencesOuvertes: true });
}
