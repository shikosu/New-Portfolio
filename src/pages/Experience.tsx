import { Rail } from "@/components/rail/Rail";
import { Panneau } from "@/components/rail/Panneau";
import { Suivant } from "@/components/ui/Suivant";
import { BLOCS_EXPERIENCE } from "@/content/experience";
import { BLOCS_COMPETENCES } from "@/content/competences";
import { ETAPES_EXPERIENCE } from "@/content/etapes";

/* Page 3 du parcours. Un rail de 3 panneaux, alimente par la carte
   d'etapes figee en phase 0. Le texte redactionnel vient de `content/` (phase 6) :
   aucun texte en dur ici (CLAUDE.md §5). */

/* Les blocs 07-08 (experience) et 09 (competences) vivent dans deux
   fichiers distincts (CLAUDE.md §5) : on les fusionne ici, une fois. */
const BLOCS = { ...BLOCS_EXPERIENCE, ...BLOCS_COMPETENCES };

export function Experience() {
  return (
    <Rail
      libelle="Expérience et compétences — étapes 07 à 09"
      suivant={<Suivant depuis="/experience" />}
    >
      {ETAPES_EXPERIENCE.map((etape) => (
        <Panneau key={etape.repere} etape={etape} bloc={BLOCS[etape.repere]} />
      ))}
    </Rail>
  );
}
