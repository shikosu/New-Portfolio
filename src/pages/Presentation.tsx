import { Rail } from "@/components/rail/Rail";
import { Panneau } from "@/components/rail/Panneau";
import { Suivant } from "@/components/ui/Suivant";
import { ETAPES_PRESENTATION } from "@/content/etapes";

/* Page 1 du parcours. Un rail de 3 panneaux, alimente par la carte
   d'etapes figee en phase 0. Les figures de procede arrivent en phase 4,
   le texte redactionnel en phase 6 (CONTENU.md). */

export function Presentation() {
  return (
    <Rail libelle="Presentation — etapes 01 a 03" suivant={<Suivant depuis="/" />}>
      {ETAPES_PRESENTATION.map((etape) => (
        <Panneau key={etape.repere} etape={etape} />
      ))}
    </Rail>
  );
}
