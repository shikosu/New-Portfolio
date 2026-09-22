import { Rail } from "@/components/rail/Rail";
import { Panneau } from "@/components/rail/Panneau";
import { Suivant } from "@/components/ui/Suivant";
import { ETAPES_OBJECTIFS } from "@/content/etapes";

/* Page 2 du parcours. Un rail de 3 panneaux, alimente par la carte
   d'etapes figee en phase 0. Les figures de procede arrivent en phase 4,
   le texte redactionnel en phase 6 (CONTENU.md). */

export function Objectifs() {
  return (
    <Rail
      libelle="Objectifs et formation — etapes 04 a 06"
      suivant={<Suivant depuis="/objectifs" />}
    >
      {ETAPES_OBJECTIFS.map((etape) => (
        <Panneau key={etape.repere} etape={etape} />
      ))}
    </Rail>
  );
}
