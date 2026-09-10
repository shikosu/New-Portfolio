import { NavLink } from "react-router";

/* Navigation persistante. Les 4 etapes du parcours, numerotees comme les
   figures de procede. En phase 5, cette barre ne sera PAS remontee entre
   deux pages : seul le contenu est remplace. */

const ETAPES = [
  { to: "/", libelle: "Presentation", repere: "01" },
  { to: "/objectifs", libelle: "Objectifs", repere: "04" },
  { to: "/experience", libelle: "Experience", repere: "07" },
  { to: "/projets", libelle: "Projets", repere: "10" },
] as const;

export function Nav() {
  return (
    <nav aria-label="Parcours" className="fixed top-0 right-0 left-0 z-50">
      <ul className="flex gap-6 px-6 py-4">
        {ETAPES.map(({ to, libelle, repere }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/"}
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
