import { PageLegale } from "@/components/legal/PageLegale";
import { MENTIONS_LEGALES } from "@/content/legal";

/* Page annexe, hors du parcours du procede. Obligation LCEN : identifier
   l'editeur, le directeur de la publication et l'hebergeur. Le texte vit
   dans content/legal.ts (§5 : aucun texte en dur dans un composant). */

export function MentionsLegales() {
  return <PageLegale page={MENTIONS_LEGALES} />;
}
