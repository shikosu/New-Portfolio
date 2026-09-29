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
    titre: "Au quotidien",
    // L'analogie est exigee noir sur blanc par CONTENU.md : elle est
    // juste, et elle montre que le procede est connu.
    texte:
      "Un cristal tiré trop vite se remplit de dislocations, et le lingot est perdu. J'avance de la même façon, par petites doses régulières.",
    entrees: [],
    brouillon: true,
  },
  "05": {
    titre: "Ce que je veux maîtriser en GEII",
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
          "Lois des circuits, amplificateurs opérationnels et filtres, mis à l'épreuve sur un clone de TB-303.",
      },
    ],
    brouillon: true,
  },
  "06": {
    titre: "À côté de l'électronique",
    texte:
      "Le polissage CMP rend le wafer plan, pour que la lithographie puisse faire sa mise au point. En dehors de l'électronique, je pratique aussi :",
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
