/* ---------------------------------------------------------------------
   Le contrat du contenu (phase 6).

   Un bloc de contenu = ce qu'une etape du procede fait apparaitre.
   La STRUCTURE (repere, etape, sujet, ★) reste dans `etapes.ts`, figee
   en phase 0. Ici, uniquement le texte redactionnel, par bloc.

   Tous les champs sont optionnels : la regle 6 du CONTENU.md dit qu'un
   bloc sans contenu reel RESTE VIDE — il n'affiche alors que son sujet.
   Un champ absent n'est pas un oubli, c'est un « ⧖ a fournir ».

   `brouillon: true` : texte redige par Claude a partir de faits que tu
   as donnes, en attente de ta relecture. En `npm run dev` une pastille
   « brouillon » s'affiche sur le bloc ; en production elle n'existe pas
   (voir Panneau.tsx). A passer a `false` bloc par bloc, apres relecture.
   --------------------------------------------------------------------- */

/** Une entree de liste : une habitude, une carte d'objectif, un stage… */
export interface Entree {
  /** L'intitule, en `lead` ou en gras selon le bloc. */
  readonly titre: string;
  /** Une ou deux lignes de `body`. */
  readonly detail?: string;
  /** Repere court en `mono` : dates, structure, niveau. */
  readonly repere?: string;
  /** Items en `mono` (outils d'un groupe de competences). */
  readonly items?: readonly string[];
  /**
   * La fiche d'un projet phare (bloc 10). La ROADMAP impose ces quatre
   * questions, dans cet ordre, pour chaque projet : c'est ce qui repond a
   * « qu'est-ce que ca prouve sur mes competences ? ».
   */
  readonly fiche?: Fiche;
}

export interface Fiche {
  readonly probleme: string;
  readonly solution: string;
  readonly difficulte: string;
  readonly resultat: string;
}

/** Un lien sortant : une broche du boitier, le GitHub du bloc 11… */
export interface Lien {
  readonly libelle: string;
  readonly href: string;
  /** Lien vers un autre site : ouvert dans un nouvel onglet, annonce. */
  readonly externe?: boolean;
}

export interface Bloc {
  /**
   * Remplace le sujet de l'etape dans le <h2>. Sert au bloc 01, ou c'est
   * le NOM qui se compose par sedimentation (CONTENU.md).
   */
  readonly titre?: string;
  /** Titre en taille `display` (titres de page : 01 et 07). */
  readonly titreDisplay?: boolean;
  /** Le chapo, en `lead`. */
  readonly chapo?: string;
  /** Le paragraphe, en `body`. Porte `data-texte` (mecanisme 02). */
  readonly texte?: string;
  /** Une ligne de repere en `mono`. */
  readonly repere?: string;
  /** Les listes : habitudes, objectifs, stages, competences, projets. */
  readonly entrees?: readonly Entree[];
  /** Les liens : contact (12), tous les projets (11). */
  readonly liens?: readonly Lien[];
  /** Texte redige par Claude, a relire. Voir en tete de fichier. */
  readonly brouillon?: boolean;
}

/** Les blocs d'une page, indexes par repere ("01".."12"). */
export type Blocs = Readonly<Record<string, Bloc>>;

/* ---------------------------------------------------------------------
   Les pages annexes (chantier de conformite legale, 2026-09-23).

   Elles ne font PAS partie du recit du procede : pas de rail, pas de
   piste, pas de transition animee. Ce sont des pages de texte, rendues
   par un composant unique (`components/legal/PageLegale.tsx`).

   Convention des champs a remplir : toute valeur qui commence par « [ »
   (ex. « [A COMPLETER : adresse postale] ») est un TROU que seul toi
   peux combler. `renseigne()` (content/legal.ts) sait les reconnaitre,
   ce qui permet par exemple de ne pas afficher un lien mailto vers une
   adresse qui n'existe pas encore.
   --------------------------------------------------------------------- */

/** Un tableau simple : une ligne d'en-tete, des lignes de cellules. */
export interface Tableau {
  /** Legende lue par les lecteurs d'ecran (<caption>). */
  readonly legende: string;
  readonly entetes: readonly string[];
  readonly lignes: readonly (readonly string[])[];
}

export interface SectionLegale {
  /** Ancre de la section : /confidentialite#cookies. */
  readonly id: string;
  readonly titre: string;
  readonly paragraphes?: readonly string[];
  readonly liste?: readonly string[];
  readonly tableau?: Tableau;
  readonly liens?: readonly Lien[];
}

export interface PageLegale {
  readonly titre: string;
  readonly chapo?: string;
  /** Date de derniere mise a jour, au format AAAA-MM-JJ. */
  readonly miseAJour: string;
  readonly sections: readonly SectionLegale[];
  /** Meme regle que les blocs : redige par Claude, a relire par toi. */
  readonly brouillon?: boolean;
}
