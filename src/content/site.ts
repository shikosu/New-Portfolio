/* ---------------------------------------------------------------------
   L'identite du site : ce que l'onglet, les moteurs de recherche et les
   apercus de lien affichent.

   ⚠️ Les memes valeurs sont recopiees dans `index.html` (<title>,
   description, Open Graph) : ce fichier-la est lu AVANT que le moindre
   JavaScript tourne — c'est ce que voient Google, LinkedIn et Discord.
   Changer l'un sans l'autre = deux identites.
   --------------------------------------------------------------------- */

export const SITE = {
  nom: "Téo Vidal",
  marque: "Irchi",
  /** Titre de l'onglet sur la page d'accueil. */
  titre: "Téo Vidal · Irchi",
} as const;

/** « Objectifs · Téo Vidal » ; la page d'accueil garde le titre complet. */
export function titreDePage(libelle: string | null): string {
  return libelle ? `${libelle} · ${SITE.nom}` : SITE.titre;
}

/* ---------------------------------------------------------------------
   La description de chaque page (balise <meta name="description">).
   Celle de l'accueil est recopiee dans `index.html` : c'est la seule que
   lisent les apercus de lien, qui n'executent pas le JavaScript. Les
   autres servent aux moteurs qui, eux, l'executent (Google).
   Cle absente = description de l'accueil.
   --------------------------------------------------------------------- */
const DESCRIPTIONS: Readonly<Record<string, string>> = {
  "/": "Téo Vidal, étudiant en BUT GEII à l'IUT de Montpellier-Sète, cherche un stage. Cap sur le semi-conducteur. Le portfolio suit une ligne de fabrication, du sable à la puce.",
  "/objectifs":
    "Ce que Téo Vidal veut maîtriser en BUT GEII : l'architecture d'un processeur et l'électronique analogique. À côté : réseau, auto-hébergement, web.",
  "/experience":
    "Les PFMP de Téo Vidal en Bac Pro CIEL (réseau, cybersécurité, réparation électronique, développement) et ses outils : C/C++, ESP32, Verilog, KiCad, LTspice.",
  "/projets":
    "De l'Arduino à l'ASIC : un circuit numérique conçu en Verilog avec des outils libres. Les autres projets de Téo Vidal, et comment le contacter pour un stage.",
  "/mentions-legales":
    "Mentions légales du site de Téo Vidal : éditeur, hébergement, propriété intellectuelle.",
  "/confidentialite":
    "Politique de confidentialité du site de Téo Vidal : aucun cookie, aucun formulaire, et les seules données qui circulent pendant la visite.",
};

export function descriptionDePage(chemin: string): string {
  return DESCRIPTIONS[chemin] ?? DESCRIPTIONS["/"];
}
