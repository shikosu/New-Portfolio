import type { Etape } from "@/content/etapes";

/* ---------------------------------------------------------------------
   Un panneau du rail = une etape du procede.

   Phase 3 : la mise en page seulement. Le texte redactionnel arrive en
   phase 6 (CONTENU.md). On affiche ici ce qui est deja fige depuis la
   phase 0 : le repere, le nom de l'etape, le sujet traite.

   `tabIndex={0}` : le rail est une region defilable dont le contenu sort
   de l'ecran. Le §9.2 exige que ⇥ l'atteigne et que le rail defile
   jusqu'a lui — sans element focalisable, c'est intestable. C'est aussi
   ce que recommande WCAG 2.1.1 pour une region defilable. Quand les vrais
   liens arriveront en phase 6, on pourra retirer ce tabIndex.
   --------------------------------------------------------------------- */

interface ProprietesPanneau {
  readonly etape: Etape;
}

export function Panneau({ etape }: ProprietesPanneau) {
  const idTitre = `bloc-${etape.repere}-titre`;

  return (
    <article
      tabIndex={0}
      aria-labelledby={idTitre}
      className="flex h-full flex-col justify-center px-6 pt-24 pb-24 md:px-16"
    >
      <p className="text-mono font-mono flex items-center gap-3 uppercase">
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

      <p className="text-body text-ink-soft mt-4 max-w-[65ch]">
        Contenu redige en phase 6 — voir CONTENU.md, bloc {etape.repere}.
      </p>
    </article>
  );
}
