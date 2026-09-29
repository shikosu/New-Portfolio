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
    // Le test des 3 secondes : qui (le nom), quoi (BUT GEII), ce que je
    // cherche (un stage), dans quel domaine (le semi-conducteur).
    chapo:
      "Étudiant en BUT GEII à l'IUT de Montpellier-Sète. Je cherche un stage, cap sur le semi-conducteur.",
    repere: "Irchi · Montpellier",
    brouillon: true,
  },
  "02": {
    titre: "Du Bac Pro CIEL au BUT GEII",
    texte:
      "Bac Pro CIEL au lycée Champollion de Lattes, puis BUT GEII. Ce qui m'intéresse se passe sous le logiciel : au niveau du transistor et du signal.",
    brouillon: true,
  },
  "03": {
    titre: "Ma cible : la micro-nanoélectronique",
    // 9N = 99,9999999 % : une impurete pour un milliard d'atomes. C'est le
    // minimum du silicium de qualite electronique, et c'est ce qu'affiche
    // le compteur du mecanisme 03 en fin de course.
    texte:
      "Le silicium d'une puce est pur à 99,9999999 % au moins. Je vise une école d'ingénieurs en micro-nanoélectronique, Phelma (Grenoble INP) en priorité, puis l'industrie du semi-conducteur.",
    brouillon: true,
  },
};
