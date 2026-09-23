import { Rail } from "@/components/rail/Rail";
import { Panneau } from "@/components/rail/Panneau";
import { Suivant } from "@/components/ui/Suivant";
import { BLOCS_PRESENTATION } from "@/content/presentation";
import { ETAPES_PRESENTATION } from "@/content/etapes";

/* Page 1 du parcours. Un rail de 3 panneaux, alimente par la carte
   d'etapes figee en phase 0. Le texte redactionnel vient de `content/` (phase 6) :
   aucun texte en dur ici (CLAUDE.md §5). */

export function Presentation() {
  return (
    <Rail libelle="Présentation — étapes 01 à 03" suivant={<Suivant depuis="/" />}>
      {ETAPES_PRESENTATION.map((etape) => (
        <Panneau key={etape.repere} etape={etape} bloc={BLOCS_PRESENTATION[etape.repere]} />
      ))}
    </Rail>
  );
}
