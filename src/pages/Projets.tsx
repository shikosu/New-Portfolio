import { Rail } from "@/components/rail/Rail";
import { Panneau } from "@/components/rail/Panneau";
import { BLOCS_PROJETS } from "@/content/projets";
import { ETAPES_PROJETS } from "@/content/etapes";

/* Page 4 du parcours. Un rail de 3 panneaux, alimente par la carte
   d'etapes figee en phase 0. Le texte redactionnel vient de `content/` (phase 6) :
   aucun texte en dur ici (CLAUDE.md §5). */

export function Projets() {
  return (
    <Rail libelle="Projets et contact — etapes 10 a 12">
      {ETAPES_PROJETS.map((etape) => (
        <Panneau key={etape.repere} etape={etape} bloc={BLOCS_PROJETS[etape.repere]} />
      ))}
    </Rail>
  );
}
