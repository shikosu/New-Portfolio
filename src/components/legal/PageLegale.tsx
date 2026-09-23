import { useEffect } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router";
import type { PageLegale as DonneesPage } from "@/content/types";
import { BlocLegal } from "@/components/legal/BlocLegal";
import { defilerVers } from "@/lib/lenis";

/* ---------------------------------------------------------------------
   Gabarit des pages annexes : mentions legales, confidentialite.

   Volontairement HORS du concept : pas de rail, pas de piste, pas de
   figure. Le §7 dit « un seul moment spectaculaire par page » ; ici il
   n'y en a aucun, et c'est la bonne dose pour un texte qu'on vient lire
   vite. Meme palette, meme echelle typographique, meme mesure (65 car.).

   Hierarchie de titres : UN h1 (le titre de la page), des h2 par
   section. Aucun saut de niveau (RGAA 9.1).

   ANCRES. /confidentialite#cookies doit arriver sur la section cookies.
   Le navigateur ne le fait pas tout seul ici : la page est rendue APRES
   le changement d'adresse (SPA), et c'est Lenis qui detient la position
   de defilement. On attend donc le montage, on mesure, et on passe par
   `defilerVers` — jamais window.scrollTo dans le dos de Lenis (§6.5).
   La cle `location.key` relance l'effet meme si on clique deux fois le
   meme lien. 96 px de marge : la hauteur de la navigation fixe, plus
   une respiration.
   --------------------------------------------------------------------- */

const MARGE_NAV = 96;

interface ProprietesPageLegale {
  readonly page: DonneesPage;
  /** Une section calculee (la section cookies), inseree en fin de page. */
  readonly complement?: ReactNode;
}

export function PageLegale({ page, complement }: ProprietesPageLegale) {
  const { hash, key } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const cible = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!cible) return;
    defilerVers(cible.getBoundingClientRect().top + window.scrollY - MARGE_NAV);
    // Le focus suit, sans provoquer un second defilement.
    cible.focus({ preventScroll: true });
  }, [hash, key]);

  return (
    <article className="mx-auto max-w-[65ch] px-6 pt-32 pb-24 md:px-0">
      <h1 className="text-display font-display text-balance">{page.titre}</h1>

      <p className="text-mono font-mono text-ink-soft mt-4 flex flex-wrap gap-3 uppercase">
        <span>
          Mise à jour : <time dateTime={page.miseAJour}>{formaterDate(page.miseAJour)}</time>
        </span>
        {import.meta.env.DEV && page.brouillon && (
          <span className="border-ink text-ink border px-2">brouillon</span>
        )}
      </p>

      {page.chapo && <p className="text-lead mt-8">{page.chapo}</p>}

      {page.sections.map((section) => (
        <BlocLegal key={section.id} section={section} />
      ))}

      {complement}
    </article>
  );
}

/** "2026-09-23" -> "23 septembre 2026". Sans dependance : Intl suffit. */
function formaterDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}
