import { Children, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useHorizontalRail } from "@/hooks/useHorizontalRail";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { IndicateurRail } from "@/components/rail/IndicateurRail";
import { Piste } from "@/components/process/Piste";

/* =====================================================================
   <Rail> — recoit des panneaux, les fait defiler horizontalement.

   MISE EN PAGE. Le point delicat est la largeur des panneaux.
   La tentation est d'ecrire `w-screen` (100vw). Piege : 100vw INCLUT la
   barre de defilement verticale, alors que la zone reellement visible ne
   l'inclut pas. Sur un PC a barres classiques, chaque panneau depasse de
   ~15 px et le decalage s'accumule.

   On raisonne donc en pourcentage du CONTENEUR, qui lui est a la bonne
   largeur, via une variable CSS `--panneaux` = N :

       conteneur ............ 100 % (largeur visible, sans la barre)
       piste ................ N x 100 %          -> calc(var(--panneaux)*100%)
       chaque panneau ....... 1/N de la piste    -> calc(100%/var(--panneaux))
                              = 100 % du conteneur. Exactement un ecran.

   Schema pour N = 3 :

       ┌─ conteneur (h-screen, overflow-hidden) ─┐
       │ ┌───────── piste : 300 % ──────────────────────────────┐
       │ │ panneau 0 │ panneau 1 │ panneau 2 │                  │
       │ │   100 %   │   100 %   │   100 %   │                  │
       └─┴───────────┴───────────┴───────────┴──────────────────┘
         ◄── visible ──►
                       ◄──── translation de -200 % au scroll ───►

   TROIS REGIMES :
   - >= 768 px, animations normales : rail horizontal (classes `md:`).
   - <  768 px : les classes `md:` ne s'appliquent pas -> pile verticale,
     defilement natif au doigt. Decision de phase 3, CLAUDE.md §2 bis.
   - "reduire les animations" : `empile` force la pile a TOUTES les
     largeurs, et le hook ne cree aucun ScrollTrigger.
   ===================================================================== */

interface ProprietesRail {
  /** Les panneaux. Un enfant = un panneau plein ecran. */
  readonly children: ReactNode;
  /** Nom de la region pour les lecteurs d'ecran. */
  readonly libelle: string;
}

export function Rail({ children, libelle }: ProprietesRail) {
  const panneaux = Children.toArray(children);
  const total = panneaux.length;

  const animationsReduites = usePrefersReducedMotion();
  const refFilet = useRef<HTMLSpanElement>(null);
  const refCompteur = useRef<HTMLSpanElement>(null);
  const refPisteSvg = useRef<SVGSVGElement>(null);
  const refPisteTrace = useRef<SVGPathElement>(null);
  const refPisteSvgV = useRef<SVGSVGElement>(null);
  const refPisteTraceV = useRef<SVGPathElement>(null);

  const { refConteneur, refConvoyeur } = useHorizontalRail({
    nombreDePanneaux: total,
    animationsReduites,
    refFilet,
    refCompteur,
    refPisteSvg,
    refPisteTrace,
    refPisteSvgV,
    refPisteTraceV,
  });

  // En mode "animations reduites", le rail redevient une simple pile,
  // quelle que soit la largeur de l'ecran.
  const empile = animationsReduites;

  const classesConteneur = empile ? "relative" : "relative md:h-screen md:overflow-hidden";

  const classesConvoyeur = empile
    ? "relative flex flex-col"
    : "relative flex flex-col md:h-screen md:w-[calc(var(--panneaux)*100%)] md:flex-row md:flex-nowrap";

  const classesPanneau = empile
    ? "min-h-screen w-full"
    : "min-h-screen w-full md:h-screen md:min-h-0 md:w-[calc(100%/var(--panneaux))] md:shrink-0";

  return (
    <section
      ref={refConteneur}
      aria-label={libelle}
      className={classesConteneur}
      style={{ "--panneaux": total } as CSSProperties}
    >
      <div ref={refConvoyeur} className={classesConvoyeur}>
        {/* La piste vit DANS le convoyeur : elle se translate avec les
            panneaux, ce qui fait de sa pointe un front fixe a l'ecran. */}
        {!empile && (
          <>
            <Piste refSvg={refPisteSvg} refTrace={refPisteTrace} orientation="horizontale" />
            <Piste refSvg={refPisteSvgV} refTrace={refPisteTraceV} orientation="verticale" />
          </>
        )}

        {panneaux.map((panneau, indice) => (
          <div
            // `data-panneau` porte l'indice : c'est ce que le hook lit
            // quand le focus clavier atterrit dans un panneau hors ecran.
            data-panneau={indice}
            key={indice}
            className={classesPanneau}
          >
            {panneau}
          </div>
        ))}
      </div>

      {!empile && <IndicateurRail refFilet={refFilet} refCompteur={refCompteur} total={total} />}
    </section>
  );
}
