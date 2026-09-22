import { FIGURES } from "@/components/process/figures";

/* ---------------------------------------------------------------------
   Une figure de procede, posee sur la piste.

   Le `data-figure` sur l'enveloppe est le point d'accroche des
   revelations : c'est lui que ScrollTrigger surveille (voir
   `lib/procede.ts`). On le met sur un <span> et non sur le <svg>, parce
   que le composant genere par svgr est type `SVGProps` et n'accepte pas
   les attributs `data-*` en TypeScript.

   `aria-hidden` : la figure est une illustration du procede. Le sens est
   porte par le texte HTML a cote (regle 2 du CONTENU.md : aucun <text>
   dans les SVG, justement pour que le texte reste lisible autrement).
   --------------------------------------------------------------------- */

interface ProprietesFigure {
  /** Repere de l'etape : "01" a "12". */
  readonly repere: string;
  readonly className?: string;
}

export function Figure({ repere, className }: ProprietesFigure) {
  const Dessin = FIGURES[repere];
  if (!Dessin) return null;

  return (
    <span data-figure="" aria-hidden="true" className={className}>
      <Dessin className="text-ink block h-full w-full" focusable="false" />
    </span>
  );
}
