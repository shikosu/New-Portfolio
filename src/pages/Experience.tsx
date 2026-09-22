import { Rail } from "@/components/rail/Rail";
import { Panneau } from "@/components/rail/Panneau";
import { ETAPES_EXPERIENCE } from "@/content/etapes";

/* Page 3 du parcours. Un rail de 3 panneaux, alimente par la carte
   d'etapes figee en phase 0. Les figures de procede arrivent en phase 4,
   le texte redactionnel en phase 6 (CONTENU.md). */

export function Experience() {
  return (
    <Rail libelle="Experience et competences — etapes 07 a 09">
      {ETAPES_EXPERIENCE.map((etape) => (
        <Panneau key={etape.repere} etape={etape} />
      ))}
    </Rail>
  );
}
