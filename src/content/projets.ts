import type { Blocs } from "@/content/types";

/* ---------------------------------------------------------------------
   Page 4 — Projets & contact (CONTENU.md, blocs 10 a 12).

   10 : UN SEUL projet phare, choisi le 2026-09-22. C'est la consigne de
        la ROADMAP poussee au bout : « un projet explique en profondeur
        vaut mieux que six projets listes ». La fiche est honnete sur
        l'etat d'avancement — phases 1 et 2 closes, synthese a venir.
   11 : le lien pointe vers GitHub tant que la page /projets n'existe
        pas (decision du 2026-09-22 : pas de lien mort).
   12 : e-mail donne le 2026-09-29 (adresse universitaire).
        ⧖ RESTE A FOURNIR PAR TOI : l'URL LinkedIn, le CV en PDF (a
        deposer dans `public/`, puis `CV` = "/cv-teo-vidal.pdf"), et les
        deux lignes sur le travail en equipe. Une broche dont l'URL est
        vide est RETIREE de la liste avant rendu : aucun lien mort.
   --------------------------------------------------------------------- */

export const GITHUB = "https://github.com/shikosu";
export const EMAIL = "teo.vidal@etu.umontpellier.fr";
/** ⧖ A remplir : l'URL complete du profil (https://www.linkedin.com/in/…). */
const LINKEDIN = "";
/** ⧖ A remplir : le chemin du PDF une fois depose dans public/. */
const CV = "";

/** Les broches du boitier (bloc 12). L'ordre est celui de CONTENU.md. */
const BROCHES = [
  { libelle: EMAIL, href: `mailto:${EMAIL}` },
  { libelle: "GitHub", href: GITHUB, externe: true },
  { libelle: "LinkedIn", href: LINKEDIN, externe: true },
  { libelle: "CV (PDF)", href: CV },
].filter((broche) => broche.href !== "");

export const BLOCS_PROJETS: Blocs = {
  "10": {
    titre: "Le projet que je détaille",
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
    titre: "Les autres projets",
    texte: "Mes autres projets sont sur GitHub, avec leur code.",
    liens: [{ libelle: "Tous les projets sur GitHub", href: GITHUB, externe: true }],
    brouillon: true,
  },
  "12": {
    titre: "Me contacter pour un stage",
    liens: BROCHES,
    brouillon: true,
  },
};
