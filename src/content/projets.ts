import type { Blocs } from "@/content/types";

/* ---------------------------------------------------------------------
   Page 4 — Projets & contact (CONTENU.md, blocs 10 a 12).

   10 : UN SEUL projet phare, choisi le 2026-09-22. C'est la consigne de
        la ROADMAP poussee au bout : « un projet explique en profondeur
        vaut mieux que six projets listes ». La fiche est honnete sur
        l'etat d'avancement — phases 1 et 2 closes, synthese a venir.
   11 : le lien pointe vers GitHub tant que la page /projets n'existe
        pas (decision du 2026-09-22 : pas de lien mort).
   12 : ⧖ RESTE A FOURNIR PAR TOI — l'adresse e-mail publique (perso ou
        une adresse @teovidal.eu ?), l'URL LinkedIn, le CV en PDF (a
        deposer dans `public/`), et les deux lignes sur le travail en
        equipe. Une broche sans URL n'est pas affichee.
   --------------------------------------------------------------------- */

export const GITHUB = "https://github.com/shikosu";

export const BLOCS_PROJETS: Blocs = {
  "10": {
    entrees: [
      {
        titre: "De l'Arduino à l'ASIC",
        repere: "Verilog vers GDSII · en cours",
        fiche: {
          probleme:
            "Concevoir un circuit numérique jusqu'au dessin des masques, avec des outils libres uniquement.",
          solution:
            "Verilog, simulation sous Icarus Verilog, chronogrammes sous GTKWave. Ensuite : synthèse avec Yosys, placement-routage avec OpenLane.",
          difficulte:
            "Changer de modèle mental : décrire des connexions permanentes, pas une suite d'instructions. Latches inférés, affectations bloquantes ou non, reset mal initialisé.",
          resultat:
            "Logique combinatoire et séquentielle validées au chronogramme : multiplexeurs, compteurs, compteur BCD, machine à états d'un feu tricolore.",
        },
      },
    ],
    brouillon: true,
  },
  "11": {
    texte: "Tout le reste est là.",
    liens: [{ libelle: "Tous les projets sur GitHub", href: GITHUB, externe: true }],
    brouillon: true,
  },
  "12": {
    liens: [{ libelle: "GitHub", href: GITHUB, externe: true }],
    brouillon: true,
  },
};
