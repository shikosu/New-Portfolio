import type { Entree, Fiche } from "@/content/types";

/* ---------------------------------------------------------------------
   Les listes d'un bloc : habitudes (04), objectifs (05), axes (06),
   stages (08), competences (09), projets phares (10).

   Rendu STATIQUE, volontairement. La mise en scene propre a chaque liste
   (« chaque habitude s'inscrit a la montee du lingot », « chaque impact
   allume une competence »…) est la dette de la phase 4b : elle s'accroche
   aux timelines existantes de `lib/mecanismes.ts` via `data-entree`, a
   l'etape suivante. Tant qu'elle n'existe pas, le contenu est simplement
   la, lisible — c'est aussi exactement ce que le §9.4 exige sans JS.

   Une vraie liste HTML (<ul>/<li>) : un lecteur d'ecran annonce « liste,
   5 elements », ce qu'une pile de <div> ne dit pas.

   Deux sous-colonnes au-dela de 3 entrees : 5 stages empiles sur une
   colonne depassent la zone haute sur un ecran de 720 px.
   --------------------------------------------------------------------- */

interface ProprietesEntrees {
  readonly repere: string;
  readonly entrees: readonly Entree[];
}

const LIBELLES_FICHE: ReadonlyArray<readonly [keyof Fiche, string]> = [
  ["probleme", "Problème"],
  ["solution", "Solution"],
  ["difficulte", "Difficulté"],
  ["resultat", "Résultat"],
];

export function Entrees({ repere, entrees }: ProprietesEntrees) {
  const colonnes = entrees.length > 3 ? "md:grid-cols-2" : "";

  return (
    <ul className={`grid gap-x-10 gap-y-5 ${colonnes}`}>
      {entrees.map((entree, indice) => (
        // `data-entree` : point d'accroche de la future mise en scene.
        <li key={entree.titre} data-entree={`${repere}-${indice + 1}`}>
          {entree.repere && (
            <p className="text-mono font-mono text-ink-soft uppercase">{entree.repere}</p>
          )}
          <h3 className="text-body font-display mt-1 font-bold">{entree.titre}</h3>
          {entree.detail && (
            <p className="text-small text-ink-soft mt-1 max-w-[60ch]">{entree.detail}</p>
          )}
          {entree.items && entree.items.length > 0 && (
            <ul className="text-mono font-mono mt-2 flex flex-wrap gap-x-3 gap-y-1">
              {entree.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {entree.fiche && (
            <dl className="text-small mt-3 grid max-w-[60ch] grid-cols-[auto_1fr] gap-x-4 gap-y-2">
              {LIBELLES_FICHE.map(([cle, libelle]) => (
                <div key={cle} className="contents">
                  <dt className="text-mono font-mono text-ink pt-0.5 uppercase">{libelle}</dt>
                  <dd className="text-ink-soft">{entree.fiche?.[cle]}</dd>
                </div>
              ))}
            </dl>
          )}
        </li>
      ))}
    </ul>
  );
}
