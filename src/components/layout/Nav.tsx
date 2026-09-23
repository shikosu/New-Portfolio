import { NavLink, useLocation } from "react-router";
import { PARCOURS, estAnnexe, precharger } from "@/lib/parcours";

/* Navigation persistante : cette barre n'est PAS remontee entre deux
   pages, seul le contenu l'est (ROADMAP phase 5).

   Les 4 etapes viennent de `lib/parcours.ts` et non d'une liste locale :
   c'est la meme source qui donne l'ordre du procede, donc le SENS d'une
   transition. Deux listes, et le jour ou l'ordre change, la fleche et la
   barre ne diraient plus la meme chose.

   Survol et focus declenchent le prechargement du morceau de code de la
   page visee, comme la fleche de fin de rail. */

export function Nav() {
  /* Sur une page annexe (legale), le texte defile SOUS la barre fixe :
     sans fond, les deux se superposaient et devenaient illisibles. Sur
     les pages du rail, on garde la barre transparente — rien n'y passe
     dessous, et la page qui sort pendant une transition doit rester
     visible jusqu'en haut de l'ecran. */
  const { pathname } = useLocation();
  const fond = estAnnexe(pathname) ? "bg-ground" : "";

  return (
    <nav aria-label="Parcours" className={`fixed top-0 right-0 left-0 z-50 ${fond}`}>
      <ul className="flex flex-wrap gap-x-6 gap-y-2 px-6 py-4">
        {PARCOURS.map(({ chemin, libelle, repere }) => (
          <li key={chemin}>
            <NavLink
              to={chemin}
              end={chemin === "/"}
              onMouseEnter={() => void precharger(chemin)}
              onFocus={() => void precharger(chemin)}
              className={({ isActive }) =>
                [
                  "text-mono font-mono uppercase transition-colors",
                  isActive ? "text-ink" : "text-ink-soft hover:text-ink",
                ].join(" ")
              }
            >
              <span aria-hidden="true">{repere}</span> {libelle}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
