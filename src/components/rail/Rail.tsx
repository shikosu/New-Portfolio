import { Children, useId, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useHorizontalRail } from "@/hooks/useHorizontalRail";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { IndicateurRail } from "@/components/rail/IndicateurRail";
import { Piste } from "@/components/process/Piste";
import { HAUTEUR_PISTE } from "@/lib/motion";

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
  /** Titre de la page : h1 masque, et nom de la region pour les lecteurs d'ecran. */
  readonly libelle: string;
  /**
   * Le lien vers l'etape suivante (phase 5). Il est pose DANS le dernier
   * panneau, a droite, sur la piste : on le rencontre en finissant la
   * page, exactement la ou la piste sort par le bord droit. Absent sur la
   * derniere page du parcours.
   */
  readonly suivant?: ReactNode;
}

export function Rail({ children, libelle, suivant }: ProprietesRail) {
  const panneaux = Children.toArray(children);
  const total = panneaux.length;

  const animationsReduites = usePrefersReducedMotion();
  const idTitre = useId();
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
    ? "relative min-h-screen w-full"
    : "relative min-h-screen w-full md:h-screen md:min-h-0 md:w-[calc(100%/var(--panneaux))] md:shrink-0";

  return (
    <section
      ref={refConteneur}
      aria-labelledby={idTitre}
      className={classesConteneur}
      style={{ "--panneaux": total } as CSSProperties}
    >
      {/* Le h1 de la page (RGAA 9.1 : chaque page a un titre de niveau 1).
          Avant ce chantier, aucune page n'en avait : les blocs portent des
          h2, et le titre visible du bloc 01 est un NOM qui se compose par
          sedimentation, pas le titre de la page. Il est donc masque a
          l'ecran (`sr-only`) et lu en premier par un lecteur d'ecran.
          Hors du convoyeur : il ne se translate pas, il ne perturbe ni
          le calcul de largeur ni la piste. */}
      <h1 id={idTitre} className="sr-only">
        {libelle}
      </h1>
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

            {/* Le lien vers l'etape suivante, pose juste au-dessus de la
                piste : `bottom` vaut la hauteur restante sous elle,
                (1 - HAUTEUR_PISTE), plus une respiration d'un cran. La
                valeur vient de la meme constante que la piste — on ne
                peut pas deplacer l'une sans l'autre. */}
            {suivant && indice === total - 1 && (
              <div
                className="absolute right-6 z-30 md:right-16"
                style={{ bottom: `calc(${(1 - HAUTEUR_PISTE) * 100}% + 1.5rem)` }}
              >
                {suivant}
              </div>
            )}
          </div>
        ))}
      </div>

      {!empile && <IndicateurRail refFilet={refFilet} refCompteur={refCompteur} total={total} />}
    </section>
  );
}
