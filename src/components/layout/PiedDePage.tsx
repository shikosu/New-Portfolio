import { Link } from "react-router";
import { COOKIES, EDITEUR, PIED_DE_PAGE, renseigne } from "@/content/legal";
import { CONSENTEMENT_REQUIS, ouvrirPreferences } from "@/lib/consentement";

/* ---------------------------------------------------------------------
   Le pied de page, present sous TOUTES les pages (obligation LCEN :
   mentions legales accessibles depuis chaque page).

   OU IL EST MONTE, et pourquoi c'est important : DANS la scene de
   TransitionPages, juste apres la page. Pas dans la coquille.
   Pendant une transition, la scene passe en `position: fixed`
   (.scene-figee) et glisse hors de l'ecran. Un pied de page laisse
   dans la coquille remonterait alors dans le vide laisse par la page,
   et apparaitrait une fraction de seconde en haut de l'ecran. Dans la
   scene, il part et revient AVEC la page.

   Sur une page a rail, on le trouve apres la fin du defilement
   horizontal : le pin-spacer du rail le repousse sous l'ecran, et le
   defilement vertical reprend une fois le rail termine.

   Contraste : `ink-soft` sur `ground` = 5,21:1 (§10), au-dessus du
   seuil de 4,5. Le filet du haut est en `rule` : decoratif, il ne porte
   aucun sens (§10, regle 2).

   Contact : l'e-mail n'est affiche que s'il est RENSEIGNE. Un mailto
   vers « [A COMPLETER] » serait un lien mort — pire que pas de lien.
   En attendant, GitHub est le moyen de contact visible.
   --------------------------------------------------------------------- */

const LIEN = "underline underline-offset-4 hover:text-ink";

export function PiedDePage() {
  return (
    <footer className="border-rule text-ink-soft text-small border-t px-6 py-8 md:px-16">
      <nav aria-label={PIED_DE_PAGE.libelle}>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <li className="text-ink">{PIED_DE_PAGE.signature}</li>
          {renseigne(EDITEUR.email) ? (
            <li>
              <a href={`mailto:${EDITEUR.email}`} className={LIEN}>
                {EDITEUR.email}
              </a>
            </li>
          ) : (
            <li>
              <a href={PIED_DE_PAGE.github} target="_blank" rel="noopener noreferrer" className={LIEN}>
                GitHub<span className="sr-only"> (nouvel onglet)</span>
              </a>
            </li>
          )}
          <li>
            <Link to={PIED_DE_PAGE.mentions.href} className={LIEN}>
              {PIED_DE_PAGE.mentions.libelle}
            </Link>
          </li>
          <li>
            <Link to={PIED_DE_PAGE.confidentialite.href} className={LIEN}>
              {PIED_DE_PAGE.confidentialite.libelle}
            </Link>
          </li>
          <li>
            {/* Registre vide : un simple lien vers « aucun cookie ».
                Registre rempli : un bouton qui rouvre le bandeau —
                retirer son accord doit etre aussi simple que le donner. */}
            {CONSENTEMENT_REQUIS ? (
              <button type="button" onClick={ouvrirPreferences} className={LIEN}>
                {COOKIES.gerer}
              </button>
            ) : (
              <Link to={PIED_DE_PAGE.cookies.href} className={LIEN}>
                {PIED_DE_PAGE.cookies.libelle}
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </footer>
  );
}
