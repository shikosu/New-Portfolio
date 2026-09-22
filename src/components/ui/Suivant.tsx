import { Link } from "react-router";
import { etapeSuivante, precharger } from "@/lib/parcours";
import { TRAIT } from "@/lib/motion";

/* ---------------------------------------------------------------------
   La fleche de fin de rail (ROADMAP phase 5).

   OU. Dans le dernier panneau, a droite, pose sur la piste. On la
   rencontre en finissant de lire la page, a l'endroit meme ou la piste
   sort par le bord droit : le lien est la suite du trait, pas un bouton
   pose par-dessus. Une fleche fixe au bord de l'ecran aurait invite a
   sauter la page avant de l'avoir lue.

   LA FLECHE ELLE-MEME est un SVG, pas le caractere "->" : le §10 interdit
   explicitement un `→` colle en fin de libelle. C'est un bout de piste
   (meme `stroke-width` que tout le reste) termine par un chevron.

   LE PRECHARGEMENT se declenche au survol ET au focus clavier. Le second
   compte autant que le premier : quelqu'un qui tabule jusqu'ici doit
   profiter de la meme avance que quelqu'un qui survole. `precharger` est
   dedoublonne, donc appeler les deux ne telecharge qu'une fois.
   --------------------------------------------------------------------- */

interface ProprietesSuivant {
  /** Le chemin de la page COURANTE ; l'etape suivante en est deduite. */
  readonly depuis: string;
}

export function Suivant({ depuis }: ProprietesSuivant) {
  const etape = etapeSuivante(depuis);

  // Derniere page du parcours : il n'y a rien apres le packaging.
  if (!etape) return null;

  const amorcer = () => void precharger(etape.chemin);

  return (
    <Link
      to={etape.chemin}
      onMouseEnter={amorcer}
      onFocus={amorcer}
      onTouchStart={amorcer}
      aria-label={`Étape suivante : ${etape.repere} ${etape.libelle}`}
      className="text-mono font-mono group text-ink inline-flex items-center gap-3 uppercase"
    >
      <span className="text-ink-soft" aria-hidden="true">
        {etape.repere}
      </span>
      <span aria-hidden="true">{etape.libelle}</span>

      {/* Un bout de piste termine par un chevron. `transition-transform`
          sur une TRANSFORMATION seule (§7) : au survol, le trait avance
          de 4 px vers la sortie, dans le sens du procede. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 48 12"
        className="h-3 w-12 transition-transform duration-200 group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        strokeWidth={TRAIT}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M0 6 H40" />
        <path d="M34 1 L40 6 L34 11" />
      </svg>
    </Link>
  );
}
