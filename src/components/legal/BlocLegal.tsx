import type { ReactNode } from "react";
import type { SectionLegale } from "@/content/types";
import { Liens } from "@/components/rail/Liens";

/* ---------------------------------------------------------------------
   Une section de page legale : h2, paragraphes, liste, tableau, liens.
   Separee de PageLegale (un composant par fichier, §11) parce que la
   page de confidentialite en fabrique une a la main : la section cookies,
   dont le contenu depend du registre des traceurs.
   --------------------------------------------------------------------- */

interface ProprietesBlocLegal {
  readonly section: SectionLegale;
  /** Contenu calcule insere avant les liens (le tableau des traceurs). */
  readonly enfants?: ReactNode;
}

export function BlocLegal({ section, enfants }: ProprietesBlocLegal) {
  return (
    // tabIndex -1 : cible de focus quand on arrive par une ancre.
    <section id={section.id} tabIndex={-1} aria-labelledby={`${section.id}-titre`} className="mt-12">
      <h2 id={`${section.id}-titre`} className="text-lead font-display font-bold">
        {section.titre}
      </h2>

      {section.paragraphes?.map((texte) => (
        <p key={texte} className="text-body mt-4">
          {texte}
        </p>
      ))}

      {section.liste && (
        <ul className="text-body mt-4 flex flex-col gap-1">
          {section.liste.map((ligne) => (
            <li key={ligne}>{ligne}</li>
          ))}
        </ul>
      )}

      {section.tableau && (
        /* Sur telephone, un tableau de 5 colonnes ne tient pas : on le
           laisse defiler DANS son cadre (et le cadre est focalisable pour
           qu'on puisse le faire defiler au clavier) plutot que de faire
           deborder toute la page. */
        <div
          className="mt-6 overflow-x-auto"
          tabIndex={0}
          role="region"
          aria-label={section.tableau.legende}
        >
          <table className="text-small w-full min-w-[40rem] border-collapse text-left">
            <caption className="sr-only">{section.tableau.legende}</caption>
            <thead>
              <tr>
                {section.tableau.entetes.map((entete) => (
                  <th key={entete} scope="col" className="border-ink border-b py-2 pr-4 align-bottom font-bold">
                    {entete}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.tableau.lignes.map((ligne) => (
                <tr key={ligne[0]} className="border-rule border-b">
                  {ligne.map((cellule, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="py-3 pr-4 align-top font-bold">
                        {cellule}
                      </th>
                    ) : (
                      <td key={i} className="py-3 pr-4 align-top">
                        {cellule}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {enfants}

      {section.liens && (
        <div className="mt-6">
          <Liens liens={section.liens} />
        </div>
      )}
    </section>
  );
}

