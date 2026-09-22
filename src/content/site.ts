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
  titre: "Téo Vidal — Irchi",
} as const;

/** « Objectifs — Téo Vidal » ; la page d'accueil garde le titre complet. */
export function titreDePage(libelle: string | null): string {
  return libelle ? `${libelle} — ${SITE.nom}` : SITE.titre;
}
