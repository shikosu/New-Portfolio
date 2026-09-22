import type { Etape } from "@/content/etapes";
import { Figure } from "@/components/process/Figure";
import { HAUTEUR_PISTE } from "@/lib/motion";

/* ---------------------------------------------------------------------
   Un panneau du rail = une etape du procede.

   MISE EN PAGE. Tout le contenu vit dans une zone haute dont le bas
   tombe exactement sur la piste :

       ┌─ panneau (100 % de l'ecran) ─────────────┐
       │                                          │
       │  01  SABLE DE QUARTZ   [moment fort]     │
       │  Qui je suis                             │  <- zone haute,
       │  texte...                                │     hauteur = 68 %
       │                     ┌──────┐             │
       │                     │figure│             │
       │ ────────────────────┴──────┴─────────────│  <- la piste
       │                                          │
       └──────────────────────────────────────────┘

   `justify-end` pousse le contenu vers le BAS de cette zone : la figure
   se retrouve donc posee sur la piste, quelle que soit la longueur du
   texte au-dessus. La hauteur vient de la meme constante que la piste,
   pour qu'on ne puisse pas deplacer l'un sans l'autre.

   `tabIndex={0}` : le rail est une region defilable dont le contenu sort
   de l'ecran. Le §9.2 exige que ⇥ l'atteigne et que le rail defile
   jusqu'a lui. A retirer en phase 6, quand les vrais liens arriveront.
   --------------------------------------------------------------------- */

interface ProprietesPanneau {
  readonly etape: Etape;
}

export function Panneau({ etape }: ProprietesPanneau) {
  const idTitre = `bloc-${etape.repere}-titre`;

  return (
    <article tabIndex={0} aria-labelledby={idTitre} className="relative h-full w-full">
      <div
        className="absolute inset-x-6 top-0 flex flex-col justify-end gap-10 pt-24 md:inset-x-16"
        style={{ height: `${HAUTEUR_PISTE * 100}%` }}
      >
        <div>
          <p className="text-mono font-mono flex flex-wrap items-center gap-3 uppercase">
            <span className="text-ink">{etape.repere}</span>
            <span className="text-ink-soft">{etape.procede}</span>
            {etape.fort && (
              /* Seul usage autorise du jaune : fond de pastille, texte en
                 encre par-dessus (10,25:1). Jamais du texte jaune. §10. */
              <span className="bg-litho text-ink px-2 py-0.5">moment fort</span>
            )}
          </p>

          <h2 id={idTitre} className="text-title font-display mt-4 text-balance">
            {etape.sujet}
          </h2>

          <p className="text-body text-ink-soft mt-4 max-w-[60ch]">
            Contenu redige en phase 6 — voir CONTENU.md, bloc {etape.repere}.
          </p>
        </div>

        {/* La figure, posee sur la piste. `block` + hauteur fixe : son bas
            coincide avec le bas de la zone, donc avec la piste. */}
        <Figure repere={etape.repere} className="block h-36 w-36 md:h-44 md:w-44" />
      </div>
    </article>
  );
}
