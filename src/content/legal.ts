import type { PageLegale } from "@/content/types";
import { GITHUB } from "@/content/projets";

/* =====================================================================
   Les textes legaux (chantier de conformite, 2026-09-23).

   Ils decrivent CE QUE LE CODE FAIT REELLEMENT, pas un modele generique.
   Inventaire qui les fonde :
   - aucun formulaire, aucun compte, aucune vente ;
   - aucun cookie ni stockage navigateur depose par le site ;
   - aucun script, police ou media charge depuis un autre domaine
     (polices @fontsource auto-hebergees, GSAP et Lenis via npm) ;
   - hebergement : Raspberry Pi personnel, en France, derriere un tunnel
     Cloudflare (Cloudflare, Inc., Etats-Unis) ;
   - Nginx ne voit que l'adresse du tunnel, pas celle du visiteur
     (aucune directive `real_ip` dans deploy/nginx.conf) ;
   - contact : liens directs (e-mail, GitHub, LinkedIn), pas de formulaire.

   Si l'un de ces faits change (formulaire, outil de mesure, nouvel
   hebergeur…), CE FICHIER DOIT CHANGER AVEC. Une politique qui decrit un
   autre site que le tien ne te protege de rien.

   ⚠️ Tout ce qui commence par « [ » est a remplir par toi.
   ===================================================================== */

/** Vrai si la valeur a ete renseignee (ne commence pas par « [ »). */
export function renseigne(valeur: string): boolean {
  return !valeur.startsWith("[");
}

/* ---------------------------------------------------------------------
   Identite. Site non professionnel, edite ET heberge par toi (choix du
   2026-09-23 : garder le Raspberry Pi). Consequence legale : l'option
   d'anonymat de la LCEN ne joue pas — elle suppose un hebergeur TIERS
   qui detient ton identite. Etant ton propre hebergeur, tu publies tes
   coordonnees. Le telephone doit fonctionner, pas forcement etre ton
   portable principal.
   --------------------------------------------------------------------- */
export const EDITEUR = {
  nom: "Téo Vidal",
  adresse: "50 Rue Des Sauges 34070 Montpellier",
  telephone: "+33 6 77 87 68 52",
  email: "teovidal.hrl@gmail.com",
} as const;

/** L'adresse du site. ⚠️ A passer sur https://teovidal.eu le jour de la bascule. */
export const DOMAINE = "https://teovidal.eu";

/** Le prestataire technique qui transporte le trafic (tunnel, cache). */
export const CLOUDFLARE = {
  nom: "Cloudflare, Inc.",
  adresse: "101 Townsend St., San Francisco, CA 94107, États-Unis",
  telephone: "+1 650 319 8930",
  confidentialite: "https://www.cloudflare.com/privacypolicy/",
} as const;

const MISE_A_JOUR = "2026-09-23";

/* ===================================================================== */
export const MENTIONS_LEGALES: PageLegale = {
  titre: "Mentions légales",
  chapo:
    "Ce site est le portfolio personnel de Téo Vidal. Il est non commercial : rien n'y est vendu, aucune publicité n'y est affichée.",
  miseAJour: MISE_A_JOUR,
  brouillon: true,
  sections: [
    {
      id: "editeur",
      titre: "Éditeur du site",
      paragraphes: ["Le site est édité par une personne physique, à titre non professionnel :"],
      liste: [
        `Nom : ${EDITEUR.nom}`,
        `Adresse : ${EDITEUR.adresse}`,
        `Téléphone : ${EDITEUR.telephone}`,
        `E-mail : ${EDITEUR.email}`,
      ],
    },
    {
      id: "publication",
      titre: "Directeur de la publication",
      paragraphes: [EDITEUR.nom],
    },
    {
      id: "hebergement",
      titre: "Hébergement",
      paragraphes: [
        "Le site est hébergé par son éditeur, sur un serveur personnel situé en France :",
      ],
      liste: [
        `Nom : ${EDITEUR.nom}`,
        `Adresse : ${EDITEUR.adresse}`,
        `Téléphone : ${EDITEUR.telephone}`,
      ],
    },
    {
      id: "acheminement",
      titre: "Acheminement du trafic",
      paragraphes: [
        "Les connexions au site transitent par le réseau d'un prestataire technique, qui assure la liaison sécurisée avec le serveur et la protection contre les attaques :",
      ],
      liste: [
        CLOUDFLARE.nom,
        CLOUDFLARE.adresse,
        `Téléphone : ${CLOUDFLARE.telephone}`,
      ],
    },
    {
      id: "propriete",
      titre: "Propriété intellectuelle",
      paragraphes: [
        "Les textes, les figures de procédé et la mise en page de ce site sont l'œuvre de Téo Vidal. Leur reproduction, totale ou partielle, sans autorisation écrite est interdite.",
        "Les polices Chakra Petch et IBM Plex Mono sont distribuées sous licence SIL Open Font License 1.1. Les bibliothèques logicielles utilisées le sont sous leurs licences respectives.",
        "Les noms d'entreprises, de produits et de technologies cités (par exemple Cisco, Raspberry Pi, Cloudflare) appartiennent à leurs propriétaires. Ils sont mentionnés à titre descriptif, sans lien d'affiliation.",
      ],
    },
    {
      id: "liens",
      titre: "Liens externes",
      paragraphes: [
        "Ce site contient des liens vers d'autres sites (GitHub notamment). L'éditeur n'a aucun contrôle sur leur contenu et décline toute responsabilité à leur égard.",
      ],
    },
    {
      id: "donnees",
      titre: "Données personnelles et cookies",
      paragraphes: [
        "Ce que le site fait de vos données, et vos droits, sont détaillés dans la politique de confidentialité.",
      ],
      liens: [{ libelle: "Politique de confidentialité et cookies", href: "/confidentialite" }],
    },
    {
      id: "droit",
      titre: "Droit applicable",
      paragraphes: ["Le présent site et ces mentions sont soumis au droit français."],
    },
  ],
};

/* ===================================================================== */
export const CONFIDENTIALITE: PageLegale = {
  titre: "Confidentialité et cookies",
  chapo:
    "Ce site ne vous demande rien : pas de formulaire, pas de compte, pas de cookie publicitaire. Voici, sans rien omettre, les seules données qui circulent quand vous le visitez.",
  miseAJour: MISE_A_JOUR,
  brouillon: true,
  sections: [
    {
      id: "responsable",
      titre: "Responsable du traitement",
      paragraphes: [
        `${EDITEUR.nom}, éditeur du site. Contact pour toute question sur vos données : ${EDITEUR.email}.`,
      ],
    },
    {
      id: "traitements",
      titre: "Les données traitées",
      paragraphes: [
        "Trois traitements seulement existent. Aucune donnée n'est vendue, louée ou utilisée à des fins publicitaires, et aucune décision automatisée n'est prise à votre sujet.",
      ],
      tableau: {
        legende: "Traitements de données personnelles réalisés par le site",
        entetes: ["Traitement", "Données", "Finalité", "Base légale", "Conservation"],
        lignes: [
          [
            "Acheminement par Cloudflare",
            "Adresse IP, date et heure, page demandée, navigateur, pays déduit de l'IP",
            "Transporter les pages jusqu'à vous et protéger le site contre les attaques",
            "Intérêt légitime (sécurité et fonctionnement du site)",
            "[À VÉRIFIER : durée des journaux dans le compte Cloudflare]",
          ],
          [
            "Journaux du serveur",
            "Date et heure, page demandée, navigateur, code de réponse. Votre adresse IP n'y figure pas : le serveur ne voit que celle du tunnel Cloudflare.",
            "Diagnostiquer les pannes",
            "Intérêt légitime (bon fonctionnement du site)",
            "Rotation automatique : au-delà de 30 Mo, les plus anciennes lignes sont effacées",
          ],
          [
            "Échanges par e-mail",
            "Votre adresse e-mail, votre nom s'il apparaît, le contenu de votre message",
            "Vous répondre",
            "Intérêt légitime (répondre à une prise de contact)",
            "Le temps de l'échange, puis 3 ans au plus après le dernier message",
          ],
        ],
      },
    },
    {
      id: "destinataires",
      titre: "Qui y a accès",
      paragraphes: [
        `Téo Vidal, seul. Deux prestataires techniques traitent certaines données pour son compte : ${CLOUDFLARE.nom} (acheminement du trafic) et le fournisseur de la messagerie qui reçoit vos e-mails, [À COMPLÉTER : nom du fournisseur de messagerie].`,
      ],
    },
    {
      id: "transferts",
      titre: "Transferts hors de l'Union européenne",
      paragraphes: [
        "Cloudflare est une société américaine : les données d'acheminement peuvent être traitées aux États-Unis. Ce transfert est encadré par la décision d'adéquation de la Commission européenne du 10 juillet 2023 (EU-U.S. Data Privacy Framework), à laquelle Cloudflare a adhéré.",
        "[À COMPLÉTER : si votre fournisseur de messagerie est hors de l'Union européenne, indiquer ici le pays et la garantie applicable.]",
      ],
      liens: [
        {
          libelle: "Politique de confidentialité de Cloudflare",
          href: CLOUDFLARE.confidentialite,
          externe: true,
        },
      ],
    },
    {
      id: "droits",
      titre: "Vos droits",
      paragraphes: [
        "Vous pouvez à tout moment demander l'accès à vos données, leur rectification ou leur effacement, vous opposer à leur traitement ou en demander la limitation. Le droit à la portabilité ne s'applique pas ici : il ne concerne que les traitements fondés sur le consentement ou sur un contrat, et aucun des traitements ci-dessus ne l'est. Vous pouvez aussi définir des directives sur le sort de vos données après votre décès.",
        `Pour exercer ces droits, écrivez à ${EDITEUR.email}. Une réponse vous sera apportée dans un délai d'un mois.`,
        "Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL (Commission nationale de l'informatique et des libertés), 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07.",
      ],
      liens: [
        {
          libelle: "Adresser une plainte à la CNIL",
          href: "https://www.cnil.fr/fr/plaintes",
          externe: true,
        },
      ],
    },
  ],
};

/* ---------------------------------------------------------------------
   La section « Cookies » de la page de confidentialite. Elle a deux
   versions, et c'est le registre `content/traceurs.ts` qui choisit :
   liste vide -> AUCUN, liste remplie -> le tableau des traceurs.
   --------------------------------------------------------------------- */
export const COOKIES = {
  id: "cookies",
  titre: "Cookies et traceurs",
  aucun: [
    "Ce site ne dépose aucun cookie de mesure d'audience, de publicité ou de réseau social, et n'écrit rien dans le stockage de votre navigateur. C'est pour cela qu'aucun bandeau ne vous est présenté : il n'y a rien à accepter ni à refuser.",
  ],
  avec: [
    "Les traceurs ci-dessous ne sont déposés qu'avec votre accord, donné dans le bandeau. Votre choix est conservé six mois dans votre navigateur, puis la question vous est reposée. Vous pouvez le modifier à tout moment, aussi simplement que vous l'avez donné.",
  ],
  necessaires: [
    "Cloudflare peut déposer un cookie de sécurité (__cf_bm, durée 30 minutes) pour distinguer les visiteurs humains des robots malveillants. Strictement nécessaire à la protection du site, il est dispensé de consentement.",
  ],
  legendeTableau: "Traceurs soumis à votre consentement",
  entetes: ["Outil", "Émetteur", "Finalité", "Durée"],
  gerer: "Gérer mes cookies",
} as const;

/* ---------------------------------------------------------------------
   Le bandeau de consentement. N'apparait QUE si content/traceurs.ts
   contient au moins un traceur.
   --------------------------------------------------------------------- */
export const TEXTES_CONSENTEMENT = {
  titre: "Mesure d'audience",
  texte:
    "Avec votre accord, ce site mesure sa fréquentation. Vous pouvez tout refuser : le site fonctionne exactement de la même façon.",
  lienPolitique: "En savoir plus",
  refuser: "Tout refuser",
  accepter: "Tout accepter",
  personnaliser: "Personnaliser",
  enregistrer: "Enregistrer mes choix",
} as const;

/* ---------------------------------------------------------------------
   Le pied de page, present sous TOUTES les pages.
   --------------------------------------------------------------------- */
export const PIED_DE_PAGE = {
  libelle: "Informations légales",
  mentions: { libelle: "Mentions légales", href: "/mentions-legales" },
  confidentialite: { libelle: "Confidentialité", href: "/confidentialite" },
  cookies: { libelle: "Cookies", href: "/confidentialite#cookies" },
  github: GITHUB,
  signature: `© ${new Date().getFullYear()} ${EDITEUR.nom} — Irchi`,
} as const;
