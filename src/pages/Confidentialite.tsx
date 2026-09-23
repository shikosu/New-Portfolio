import { PageLegale } from "@/components/legal/PageLegale";
import { BlocLegal } from "@/components/legal/BlocLegal";
import { CONFIDENTIALITE, COOKIES } from "@/content/legal";
import { TRACEURS } from "@/content/traceurs";
import { CONSENTEMENT_REQUIS, ouvrirPreferences } from "@/lib/consentement";

/* ---------------------------------------------------------------------
   Politique de confidentialite ET politique de cookies, sur une page.
   Deux pages pour un site qui ne depose aucun cookie, ce serait une page
   vide de plus a maintenir.

   La section « Cookies » n'est PAS un texte fige : elle est calculee a
   partir du registre content/traceurs.ts.
     - registre vide  -> « aucun cookie », et pas de bouton ;
     - registre rempli -> le tableau des traceurs (outil, emetteur,
       finalite, duree) et le bouton « Gerer mes cookies ».
   Impossible, donc, que la politique annonce « aucun cookie » le jour ou
   un outil de mesure est branche.
   --------------------------------------------------------------------- */

export function Confidentialite() {
  const cookies = {
    id: COOKIES.id,
    titre: COOKIES.titre,
    paragraphes: [...(CONSENTEMENT_REQUIS ? COOKIES.avec : COOKIES.aucun), ...COOKIES.necessaires],
    ...(CONSENTEMENT_REQUIS && {
      tableau: {
        legende: COOKIES.legendeTableau,
        entetes: COOKIES.entetes,
        lignes: TRACEURS.map((t) => [t.nom, t.emetteur, t.finalite, t.duree]),
      },
    }),
  };

  return (
    <PageLegale
      page={CONFIDENTIALITE}
      complement={
        <BlocLegal
          section={cookies}
          enfants={
            CONSENTEMENT_REQUIS && (
              <button
                type="button"
                onClick={ouvrirPreferences}
                className="border-ink text-ink hover:bg-ink hover:text-ground text-small mt-6 min-h-11 border px-5 py-2 font-bold"
              >
                {COOKIES.gerer}
              </button>
            )
          }
        />
      }
    />
  );
}
