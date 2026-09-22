/* ---------------------------------------------------------------------
   Les 12 etapes du procede (CLAUDE.md §2, CONTENU.md).

   Regle du §5 : aucun texte en dur dans un composant. Ce fichier ne
   contient QUE la structure figee en phase 0 — le repere, le nom de
   l'etape, le sujet traite. Le texte redactionnel viendra en phase 6
   dans presentation.ts / objectifs.ts / experience.ts / projets.ts.

   `fort: true` = le ★ de la page. UN SEUL par page, jamais deux (§7).
   --------------------------------------------------------------------- */

export interface Etape {
  /** Numero de l'etape dans le procede, sur deux chiffres : "01" .. "12". */
  readonly repere: string;
  /** L'etape reelle du procede de fabrication. */
  readonly procede: string;
  /** Ce que ce bloc raconte du parcours. */
  readonly sujet: string;
  /** Le moment fort de la page (★). Un seul par page. */
  readonly fort: boolean;
}

export const ETAPES_PRESENTATION: readonly Etape[] = [
  { repere: "01", procede: "Sable de quartz", sujet: "Qui je suis", fort: true },
  { repere: "02", procede: "Four à arc électrique", sujet: "Pourquoi le bas niveau", fort: false },
  { repere: "03", procede: "Purification (Siemens)", sujet: "Mon exigence, ma cible", fort: false },
] as const;

export const ETAPES_OBJECTIFS: readonly Etape[] = [
  { repere: "04", procede: "Tirage Czochralski", sujet: "Objectifs au quotidien", fort: true },
  { repere: "05", procede: "Sciage du lingot", sujet: "Objectifs principaux", fort: false },
  { repere: "06", procede: "Polissage CMP", sujet: "Objectifs secondaires", fort: false },
] as const;

export const ETAPES_EXPERIENCE: readonly Etape[] = [
  { repere: "07", procede: "Photolithographie", sujet: "Expériences pro", fort: true },
  { repere: "08", procede: "Gravure", sujet: "Stages et emplois", fort: false },
  { repere: "09", procede: "Dopage", sujet: "Compétences et outils", fort: false },
] as const;

export const ETAPES_PROJETS: readonly Etape[] = [
  { repere: "10", procede: "Test sous pointes (EWS)", sujet: "Projets phares", fort: true },
  { repere: "11", procede: "Découpe (dicing)", sujet: "Tous les projets", fort: false },
  { repere: "12", procede: "Packaging", sujet: "Contact, posture pro", fort: false },
] as const;
