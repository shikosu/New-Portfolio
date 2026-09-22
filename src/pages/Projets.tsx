import { Rail } from "@/components/rail/Rail";
import { Panneau } from "@/components/rail/Panneau";
import { ETAPES_PROJETS } from "@/content/etapes";

/* Page 4 du parcours. Un rail de 3 panneaux, alimente par la carte
   d'etapes figee en phase 0. Les figures de procede arrivent en phase 4,
   le texte redactionnel en phase 6 (CONTENU.md). */

export function Projets() {
  return (
    <Rail libelle="Projets et contact — etapes 10 a 12">
      {ETAPES_PROJETS.map((etape) => (
        <Panneau key={etape.repere} etape={etape} />
      ))}
    </Rail>
  );
}
