import type { Blocs } from "@/content/types";

/* ---------------------------------------------------------------------
   Page 1 — Presentation (CONTENU.md, blocs 01 a 03).

   ⧖ RESTE A ECRIRE PAR TOI — ces trois phrases ne peuvent venir que de
   toi, et aucune n'a ete inventee pour boucher le trou :
   - 01 : la phrase d'accroche. « Quelque chose qu'un autre etudiant GEII
          ne pourrait pas ecrire a ta place. » Elle ira dans `chapo`, et
          la ligne actuelle descendra dans `repere`.
   - 02 : l'anecdote du declic (un montage, un cours, une panne reparee).
   - 03 : ta facon de travailler, en une phrase, sans adjectif
          auto-decerne.
   --------------------------------------------------------------------- */

export const BLOCS_PRESENTATION: Blocs = {
  "01": {
    // Le NOM est ce qui se compose par sedimentation (mecanisme 01).
    titre: "Téo Vidal",
    titreDisplay: true,
    chapo:
      "Étudiant en BUT GEII à Montpellier. Cap : le semi-conducteur, de la conception au circuit intégré.",
    repere: "Irchi · IUT de Montpellier-Sète",
    brouillon: true,
  },
  "02": {
    texte:
      "Bac Pro CIEL au lycée Champollion de Lattes, puis BUT GEII. Je ne me suis pas arrêté au logiciel : ce qui m'intéresse est en dessous — le transistor, le signal, la datasheet.",
    brouillon: true,
  },
  "03": {
    texte:
      "Une impureté sur un milliard d'atomes suffit à changer le comportement d'une puce. Cap visé : une école d'ingénieurs en micro-nanoélectronique — Grenoble INP–Phelma en cible — puis l'industrie du semi-conducteur.",
    brouillon: true,
  },
};
