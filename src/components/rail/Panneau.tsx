import type { CSSProperties } from "react";
import type { Etape } from "@/content/etapes";
import type { Bloc } from "@/content/types";
import { Figure } from "@/components/process/Figure";
import { Entrees } from "@/components/rail/Entrees";
import { Liens } from "@/components/rail/Liens";
import { HAUTEUR_PISTE } from "@/lib/motion";

/* ---------------------------------------------------------------------
   Un panneau du rail = une etape du procede.

   MISE EN PAGE (phase 6). Deux colonnes posees SUR la piste :

       ┌─ panneau (100 % de l'ecran) ──────────────────────────┐
       │                                                       │
       │  01  SABLE DE QUARTZ  [moment fort]   ┌─ entrees ──┐  │
       │  Titre                                │ habitudes, │  │ <- zone haute,
       │  chapo / texte                        │ stages,    │  │    hauteur 68 %
       │  ┌──────┐                             │ liens…     │  │
       │  │figure│                             └────────────┘  │
       │ ─┴──────┴─────────────────────────────────────────────│ <- la piste
       └───────────────────────────────────────────────────────┘

   - Colonne gauche : le texte, puis la figure. La figure RESTE a gauche,
     sous le texte, comme en phase 4 : la revelation se declenche quand
     son bord gauche franchit le milieu de l'ecran, et celle du 1er
     panneau est jouee a l'ouverture parce qu'elle est deja a gauche.
     La deplacer a droite changerait ce calendrier.
   - Sous 1280 px, la colonne gauche passe de 32 a 24 rem : a
     1000 px de large, 5 stages sur une seule sous-colonne debordaient
     de 21 px sous la navigation (mesure au banc, ecran 1000 x 700).
   - Un bloc SANS liste garde une seule colonne, plus large (48 rem) :
     un titre `display` comme « Experiences pro » tient alors sur une
     ligne au lieu de deux.
   - Colonne droite : les listes et les liens, alignees en bas. Elles
     n'existaient pas avant la phase 6 ; la moitie droite du panneau
     etait vide. Les mettre sous le texte aurait fait deborder la zone
     vers le haut sur un ecran de 720 px.
   - `pb-14` sur la colonne droite du DERNIER panneau seulement : la
     fleche « etape suivante » y est posee 1,5 rem au-dessus de la piste.
     Sans ce retrait, la derniere entree tomberait dessus. Ailleurs, ces
     56 px manquaient en hauteur sur un ecran de 640 px.

   SOUS 768 PX, une seule colonne et la zone repasse DANS le flux
   (`relative`) : une liste de stages est plus haute que 68 % d'un
   telephone, et une zone en `absolute` deborderait vers le haut, sur le
   panneau precedent. Ordre de lecture : texte, liste, figure.
   `pl-10` (40 px) et non `px-6` : la piste verticale passe a 24 px du
   bord (MARGE_PISTE). Avec un texte qui commencait aussi a 24 px, la
   ligne rayait la premiere lettre de chaque ligne — invisible tant que
   les blocs etaient vides, flagrant avec une liste de stages.

   `tabIndex={0}` sur l'article : le §9.2 exige que ⇥ atteigne chaque
   panneau pour faire defiler le rail. Un panneau qui contient un vrai
   lien est deja atteint par ce lien ; il perd alors son tabIndex, sinon
   on tabulerait deux fois au meme endroit.
   --------------------------------------------------------------------- */

interface ProprietesPanneau {
  readonly etape: Etape;
  /** Le texte redactionnel du bloc. Absent = bloc encore vide (regle 6). */
  readonly bloc?: Bloc;
}

export function Panneau({ etape, bloc }: ProprietesPanneau) {
  const idTitre = `bloc-${etape.repere}-titre`;
  const entrees = bloc?.entrees ?? [];
  const liens = bloc?.liens ?? [];
  const aDesLiens = liens.length > 0;
  const colonneDroite = entrees.length > 0 || aDesLiens;

  return (
    <article
      // `data-etape` : c'est par lui que `lib/procede.ts` retrouve le
      // mecanisme du bloc et le prefixe des id de sa figure (f01-, f02-…).
      data-etape={etape.repere}
      tabIndex={aDesLiens ? undefined : 0}
      aria-labelledby={idTitre}
      className="relative h-full w-full"
    >
      <div
        className="relative flex min-h-[68svh] flex-col justify-end pr-6 pl-10 pt-24 pb-10 md:absolute md:inset-x-16 md:top-0 md:h-[var(--zone)] md:min-h-0 md:px-0 md:pl-0 md:pb-0"
        // La hauteur vient de la meme constante que la piste : on ne peut
        // pas deplacer l'une sans l'autre.
        style={{ "--zone": `${HAUTEUR_PISTE * 100}%` } as CSSProperties}
      >
        <div
          className={`grid gap-x-10 gap-y-8 xl:gap-x-16 ${
            colonneDroite
              ? "md:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,32rem)_minmax(0,1fr)]"
              : "md:grid-cols-[minmax(0,48rem)]"
          }`}
        >
          {/* `data-insole` : la zone que le bloc 07 revele par clip-path.
              Les autres blocs ne s'en servent pas. */}
          <div data-insole="" className="md:col-start-1 md:row-start-1 md:self-end">
            <p
              data-ligne=""
              className="text-mono font-mono flex flex-wrap items-center gap-3 uppercase"
            >
              <span className="text-ink">{etape.repere}</span>
              <span className="text-ink-soft">{etape.procede}</span>
              {etape.fort && (
                /* Seul usage autorise du jaune : fond de pastille, texte en
                   encre par-dessus (10,25:1). Jamais du texte jaune. §10. */
                <span className="bg-litho text-ink px-2 py-0.5">moment fort</span>
              )}
              {/* Pastille de relecture : n'existe QU'EN DEVELOPPEMENT.
                  Vite remplace `import.meta.env.DEV` par `false` au build,
                  et le bloc entier disparait du code livre. */}
              {import.meta.env.DEV && bloc?.brouillon && (
                <span className="border-ink text-ink border px-2 py-0.5">brouillon</span>
              )}
            </p>

            <h2
              id={idTitre}
              data-titre=""
              className={`font-display mt-4 text-balance ${
                bloc?.titreDisplay ? "text-display" : "text-title"
              }`}
            >
              {bloc?.titre ?? etape.sujet}
            </h2>

            {bloc?.chapo && <p className="text-lead mt-4 max-w-[45ch]">{bloc.chapo}</p>}

            {bloc?.texte && (
              <p data-texte="" className="text-body text-ink-soft mt-4 max-w-[65ch]">
                {bloc.texte}
              </p>
            )}

            {bloc?.repere && (
              <p className="text-mono font-mono text-ink-soft mt-4 uppercase">{bloc.repere}</p>
            )}

            {/* Le compteur du bloc 03 : il monte de 98 % a 9N pendant que
                les impuretes quittent la colonne. C'est un MECANISME decrit
                par CONTENU.md, pas du contenu — et il est en HTML, jamais en
                <text> SVG (§8), pour rester selectionnable et lisible. */}
            {etape.repere === "03" && (
              <p data-compteur="" className="text-mono font-mono text-ink mt-4">
                98 %
              </p>
            )}
          </div>

          {colonneDroite && (
            <div className="md:col-start-2 md:row-span-2 md:row-start-1 md:self-end md:[[data-panneau]:last-child_&]:pb-14">
              {entrees.length > 0 && <Entrees repere={etape.repere} entrees={entrees} />}
              {aDesLiens && <Liens liens={liens} decale={entrees.length > 0} />}
            </div>
          )}

          {/* La figure, posee sur la piste. Sur grand ecran, 2e rangee de
              la colonne gauche : son bas coincide avec celui de la zone,
              donc avec la piste. Elle ne grandit qu'au-dela de 800 px de
              HAUT : sur un portable en 1280 x 720, la zone haute ne fait
              que 490 px, et 32 px de figure en plus poussaient le titre
              du bloc 01 sous la navigation (mesure au banc). Et elle
              RETRECIT sous 720 px de haut (1024 x 640 : le titre du
              bloc 07 passait de 30 px sous la navigation). */}
          <Figure
            repere={etape.repere}
            className="block h-36 w-36 md:col-start-1 md:row-start-2 md:self-end md:[@media(min-height:50rem)]:h-44 md:[@media(min-height:50rem)]:w-44 md:[@media(max-height:44.9rem)]:h-28 md:[@media(max-height:44.9rem)]:w-28"
          />
        </div>
      </div>
    </article>
  );
}
