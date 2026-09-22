import type { Blocs } from "@/content/types";

/* ---------------------------------------------------------------------
   Page 2 — Objectifs & formation (CONTENU.md, blocs 04 a 06).

   ⧖ RESTE A ECRIRE PAR TOI :
   - 04 : 3 a 5 habitudes REELLES, ce que tu fais vraiment chaque semaine.
          « Une habitude fausse se sent a l'entretien. » La liste
          `entrees` reste vide tant que tu ne les as pas donnees.
   - 05 : un 3e objectif principal, ou on assume d'en rester a deux.
   - 06 : garder 3 ou 4 axes parmi les 4 proposes — ceux qui SERVENT le
          profil. Ils viennent tous de projets reels, mais le choix est
          le tien.
   --------------------------------------------------------------------- */

export const BLOCS_OBJECTIFS: Blocs = {
  "04": {
    // L'analogie est exigee noir sur blanc par CONTENU.md : elle est
    // juste, et elle montre que le procede est connu.
    texte:
      "Tirer un cristal trop vite crée des dislocations, et le lingot est perdu. J'avance de la même façon : par petites doses régulières plutôt que par à-coups.",
    entrees: [],
    brouillon: true,
  },
  "05": {
    // Deux objectifs, tous deux donnes dans CONTENU.md. Autant de
    // passages de fil que d'objectifs, pas un de plus.
    entrees: [
      {
        titre: "Comprendre l'architecture d'un processeur",
        detail: "Du jeu d'instructions au chemin de données.",
      },
      {
        titre: "Être réellement à l'aise en analogique",
        detail:
          "Lois des circuits, amplificateurs opérationnels, filtres — éprouvés sur le clone TB-303.",
      },
    ],
    brouillon: true,
  },
  "06": {
    texte:
      "Sans polissage, pas de lithographie : la surface doit être plane pour que la mise au point soit possible. Sans polyvalence, pas d'expérience exploitable.",
    entrees: [
      { titre: "Réseau", detail: "Cisco IOS : VLAN, OSPF, NAT, ACL." },
      {
        titre: "Auto-hébergement",
        detail: "Raspberry Pi 5, Docker, tunnel Cloudflare. Ce site en sort.",
      },
      { titre: "Web", detail: "React et TypeScript. Ce site aussi." },
      {
        titre: "Électronique audio",
        detail: "Synthés et pédales analogiques, simulés sous LTspice.",
      },
    ],
    brouillon: true,
  },
};
