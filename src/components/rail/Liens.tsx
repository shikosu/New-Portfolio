import type { Lien } from "@/content/types";

/* ---------------------------------------------------------------------
   Les liens d'un bloc : les broches du boitier (12), la puce qui glisse
   hors du wafer vers « tous les projets » (11).

   Un <a> natif et rien d'autre : il repond a Entree au clavier exactement
   comme au clic (§9.2), sans une ligne de JavaScript. Un <div onClick>
   aurait demande de reimplementer tout ca — et on l'aurait oublie.

   Lien externe : nouvel onglet ANNONCE au lecteur d'ecran (texte masque
   visuellement), et `rel="noopener noreferrer"` pour que la page ouverte
   ne puisse pas piloter celle-ci via `window.opener`.

   Pas de fleche `→` collee au libelle (§10) : le soulignement suffit a
   dire « lien », et il epaissit au survol plutot que de changer de
   couleur — la palette n'a pas de deuxieme couleur a y consacrer.
   Changement INSTANTANE, sans `transition` : l'epaisseur d'un
   soulignement n'est ni `transform` ni `opacity` (§7).
   --------------------------------------------------------------------- */

interface ProprietesLiens {
  readonly liens: readonly Lien[];
  /** Espace au-dessus quand une liste precede les liens. */
  readonly decale?: boolean;
}

export function Liens({ liens, decale = false }: ProprietesLiens) {
  return (
    <ul className={`flex flex-col gap-3 ${decale ? "mt-8" : ""}`}>
      {liens.map((lien) => (
        <li key={lien.href}>
          <a
            href={lien.href}
            {...(lien.externe ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="text-lead text-ink underline decoration-1 underline-offset-4 hover:decoration-2"
          >
            {lien.libelle}
            {lien.externe && <span className="sr-only"> (nouvel onglet)</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
