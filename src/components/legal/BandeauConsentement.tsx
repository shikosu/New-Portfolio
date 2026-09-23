import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router";
import { TEXTES_CONSENTEMENT, COOKIES } from "@/content/legal";
import type { Choix } from "@/lib/consentement";
import {
  CONSENTEMENT_REQUIS,
  categoriesUtilisees,
  choixUniforme,
  enregistrer,
  useConsentement,
} from "@/lib/consentement";

/* ---------------------------------------------------------------------
   Le bandeau de consentement. Aujourd'hui il ne s'affiche JAMAIS : le
   registre content/traceurs.ts est vide (voir l'en-tete de ce fichier).

   REGLE CNIL N°1, traduite en CSS : « Tout refuser » et « Tout accepter »
   partagent la MEME constante de classes. Meme taille, meme bordure,
   meme graisse, cote a cote. Il est impossible d'en mettre un en avant
   sans modifier les deux — c'est voulu. Pas de couleur « positive » sur
   « Accepter » : la palette n'a qu'un accent, et il est reserve au ★.

   Pas d'animation d'entree : le §7 interdit le fondu generique, et un
   bandeau n'est pas une etape du procede. Il est la, c'est tout.

   Ce n'est PAS une fenetre modale : le site reste utilisable sans
   repondre (refuser ne doit rien couter, pas meme de devoir cliquer).
   Le choix « ne pas repondre » vaut refus : rien n'est charge.
   --------------------------------------------------------------------- */

const BOUTON =
  "border-ink text-ink hover:bg-ink hover:text-ground text-small min-h-11 border px-5 py-2 font-bold";

export function BandeauConsentement() {
  const { choix, preferencesOuvertes } = useConsentement();
  if (!CONSENTEMENT_REQUIS || (choix !== null && !preferencesOuvertes)) return null;

  /* La `key` remonte le contenu a chaque ouverture des preferences : ses
     etats (cases, detail deplie) repartent alors du choix ENREGISTRE,
     sans effet qui recopierait des props dans un state. */
  return (
    <ContenuBandeau
      key={preferencesOuvertes ? "preferences" : "premiere-visite"}
      choix={choix}
      preferencesOuvertes={preferencesOuvertes}
    />
  );
}

interface ProprietesContenu {
  readonly choix: Choix | null;
  readonly preferencesOuvertes: boolean;
}

function ContenuBandeau({ choix, preferencesOuvertes }: ProprietesContenu) {
  const categories = categoriesUtilisees();
  // Rouvert depuis le pied de page : detail deplie, cases = choix actuel.
  // Premiere visite : tout decoche (`?? false` plus bas).
  const [detail, setDetail] = useState(preferencesOuvertes);
  const [coches, setCoches] = useState<Record<string, boolean>>({ ...(choix ?? {}) });
  const refTitre = useRef<HTMLHeadingElement>(null);
  const idTitre = useId();

  /* Le focus saute sur le titre quand on arrive depuis « Gerer mes
     cookies », pour qu'un utilisateur au clavier ou au lecteur d'ecran
     sache ou il est arrive (§9.2). Pas a la premiere visite : voler le
     focus a quelqu'un qui n'a rien demande serait desorientant. */
  useEffect(() => {
    if (preferencesOuvertes) refTitre.current?.focus();
  }, [preferencesOuvertes]);

  return (
    <section
      aria-labelledby={idTitre}
      className="bg-ground border-ink fixed inset-x-0 bottom-0 z-[60] border-t px-6 py-5 md:px-16"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4">
        <h2 id={idTitre} ref={refTitre} tabIndex={-1} className="text-body font-bold">
          {TEXTES_CONSENTEMENT.titre}
        </h2>
        <p className="text-small max-w-[65ch]">
          {TEXTES_CONSENTEMENT.texte}{" "}
          <Link to={`/confidentialite#${COOKIES.id}`} className="underline underline-offset-4">
            {TEXTES_CONSENTEMENT.lienPolitique}
          </Link>
        </p>

        {detail && (
          <fieldset className="flex flex-col gap-3">
            <legend className="sr-only">{TEXTES_CONSENTEMENT.personnaliser}</legend>
            {categories.map((categorie) => (
              <label key={categorie.id} className="text-small flex items-start gap-3">
                {/* Jamais pre-cochee : `?? false`. */}
                <input
                  type="checkbox"
                  className="accent-ink mt-1 size-4"
                  checked={coches[categorie.id] ?? false}
                  onChange={(e) =>
                    setCoches((avant) => ({ ...avant, [categorie.id]: e.target.checked }))
                  }
                />
                <span>
                  <span className="font-bold">{categorie.libelle}</span>
                  <span className="text-ink-soft block">{categorie.description}</span>
                </span>
              </label>
            ))}
          </fieldset>
        )}

        <div className="flex flex-wrap gap-3">
          <button type="button" className={BOUTON} onClick={() => enregistrer(choixUniforme(false))}>
            {TEXTES_CONSENTEMENT.refuser}
          </button>
          <button type="button" className={BOUTON} onClick={() => enregistrer(choixUniforme(true))}>
            {TEXTES_CONSENTEMENT.accepter}
          </button>
          {detail ? (
            <button
              type="button"
              className={BOUTON}
              onClick={() => enregistrer({ ...choixUniforme(false), ...coches })}
            >
              {TEXTES_CONSENTEMENT.enregistrer}
            </button>
          ) : (
            <button
              type="button"
              className="text-small text-ink min-h-11 px-2 underline underline-offset-4"
              aria-expanded={false}
              onClick={() => setDetail(true)}
            >
              {TEXTES_CONSENTEMENT.personnaliser}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
