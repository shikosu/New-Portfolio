/* ---------------------------------------------------------------------
   Le registre des traceurs (cookies, stockage local, pixels…) soumis a
   consentement. C'est la SOURCE UNIQUE : le bandeau, le blocage des
   scripts et le tableau de la politique de cookies lisent tous cette
   liste. Trois endroits, une seule verite.

   ⚠️ AUJOURD'HUI LA LISTE EST VIDE, ET C'EST VOULU.
   Inventaire du 2026-09-23 : le site ne depose aucun cookie, n'ecrit
   rien dans le stockage du navigateur et ne charge aucun script tiers.
   Liste vide = pas de bandeau. Un bandeau qui ne bloque rien serait une
   gene pour le visiteur ET une information fausse (recommandation CNIL).

   LE JOUR OU TU BRANCHES UN OUTIL DE MESURE, tu ajoutes UNE entree ici :

     {
       id: "umami",
       nom: "Umami",
       emetteur: "Teo Vidal (instance auto-hebergee sur le Raspberry Pi)",
       finalite: "Compter les visites et leur pays d'origine.",
       duree: "13 mois maximum",
       categorie: "mesure",
       script: {
         src: "https://stats.teovidal.eu/script.js",
         attributs: { "data-website-id": "…" },
       },
     }

   …et tout suit : le bandeau apparait, le script n'est injecte qu'apres
   « Accepter », le tableau de la politique de cookies se remplit, le
   lien « Gerer mes cookies » apparait dans le pied de page. Changer la
   liste redemande le consentement a tout le monde (empreinte, voir
   lib/consentement.ts) : on ne peut pas avoir accepte un outil qu'on ne
   connaissait pas.

   Ce qui n'a RIEN a faire ici : les cookies strictement necessaires
   (securite Cloudflare, par exemple). Ils sont exemptes de consentement
   et sont decrits en texte dans content/legal.ts.
   --------------------------------------------------------------------- */

/** Une famille de finalites que le visiteur accepte ou refuse en bloc. */
export interface Categorie {
  readonly id: string;
  readonly libelle: string;
  readonly description: string;
}

export interface Traceur {
  readonly id: string;
  /** Le nom de l'outil, tel qu'il sera affiche. */
  readonly nom: string;
  /** Qui depose le traceur et recoit les donnees. */
  readonly emetteur: string;
  readonly finalite: string;
  /** Duree de vie du traceur, en clair (« 13 mois maximum »). */
  readonly duree: string;
  /** L'id d'une entree de CATEGORIES. */
  readonly categorie: string;
  /** Le script a injecter APRES consentement. Jamais avant. */
  readonly script?: {
    readonly src: string;
    readonly attributs?: Readonly<Record<string, string>>;
  };
}

export const CATEGORIES: readonly Categorie[] = [
  {
    id: "mesure",
    libelle: "Mesure d'audience",
    description:
      "Compter les visites, les pages consultées et le pays d'origine, pour savoir si ce portfolio est lu.",
  },
];

export const TRACEURS: readonly Traceur[] = [];
