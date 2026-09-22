import type { Blocs } from "@/content/types";

/* ---------------------------------------------------------------------
   Page 3 — Experience (CONTENU.md, blocs 07 et 08).
   Le bloc 09 (competences) vit dans `competences.ts`.

   ⧖ RESTE A FOURNIR PAR TOI :
   - 08 : les DATES de chaque PFMP, et pour chacune ce qui a ete LIVRE
          (« une ligne sur ce qui a ete livre, pas sur ce qui a ete
          observe »). Seule l'entree Adagio en dit assez aujourd'hui.
   - 08 : Fiverr — type de missions, volume, ce que ca t'a appris.
   - 08 : l'ordre chronologique. Seul Adagio est situe (PFMP 5, la
          derniere) ; les trois autres sont dans l'ordre ou tu les as cites.
   --------------------------------------------------------------------- */

export const BLOCS_EXPERIENCE: Blocs = {
  "07": {
    titreDisplay: true,
    texte:
      "Quatre PFMP pendant le Bac Pro CIEL, dans quatre métiers : réseau, cybersécurité, réparation électronique, développement. Le cursus était le masque ; ces expériences sont le motif.",
    repere: "4 PFMP · 1 atelier électronique · 3 réseau et informatique",
    brouillon: true,
  },
  "08": {
    entrees: [
      {
        titre: "Adagio.io — Onfocus SAS",
        repere: "PFMP 5",
        detail: "Intégration SQL, filtrage de bots en Go, présentation du travail en anglais.",
      },
      {
        titre: "L'Atelier du Numérique",
        repere: "PFMP",
        detail: "Réparation électronique et micro-soudure.",
      },
      { titre: "CDC Habitat", repere: "PFMP", detail: "Cybersécurité." },
      { titre: "OVEA", repere: "PFMP", detail: "Télécoms et réseau." },
      { titre: "Freelance", repere: "Fiverr" },
    ],
    brouillon: true,
  },
};
