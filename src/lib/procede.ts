import { gsap, ScrollTrigger } from "@/lib/gsap";
import { AVANCE_PISTE, DUR, EASE, HAUTEUR_PISTE, MARGE_PISTE, SCRUB } from "@/lib/motion";
import type { Contexte } from "@/lib/mecanismes";
import { MECANISMES, MECANISME_PAR_DEFAUT } from "@/lib/mecanismes";

/* =====================================================================
   Le procede : la piste, et la revelation des figures.

   Ces deux fonctions ne sont PAS des hooks. Elles sont appelees depuis
   `useHorizontalRail`, a l'interieur du bloc `matchMedia`, et rendent une
   fonction de nettoyage. Pourquoi : elles ont besoin de la geometrie
   exacte du rail (sa course, son tween) et doivent vivre et mourir en
   meme temps que lui. Un hook separe se reveillerait a contretemps quand
   matchMedia recree le rail apres un redimensionnement.
   ===================================================================== */

// ---------------------------------------------------------------------
// 1. LA PISTE
// ---------------------------------------------------------------------

interface BranchementPiste {
  /** A appeler a chaque image, avec la progression du rail (0 a 1). */
  readonly mettreAJour: (progression: number) => void;
  readonly nettoyer: () => void;
}

interface OptionsPiste {
  /** La section epinglee. */
  readonly conteneur: HTMLElement;
  /** La rangee de panneaux, large de N ecrans. */
  readonly convoyeur: HTMLElement;
  readonly svg: SVGSVGElement;
  readonly trace: SVGPathElement;
  readonly nombreDePanneaux: number;
}

/* Ou se trouve la pointe du trace a l'ecran ? C'est LE calcul de la phase 4.

   Notations :  W = largeur d'un ecran,  N = nombre de panneaux,
                L = W x N = largeur du convoyeur,
                A = AVANCE_PISTE,  p = progression du rail, de 0 a 1.

   longueur tracee   : tr(p) = W.A + p.(L - W.A)
   deplacement rail  : dx(p) = p.(L - W)          (le convoyeur part a gauche)
   pointe a l'ecran  : x(p)  = tr(p) - dx(p)
                             = W.A + p.(L - W.A - L + W)
                             = W.(A + p.(1 - A))

   Avec A = 0,5 :  x(0) = W/2  (milieu de l'ecran)
                   x(1) = W    (bord droit, pile a la fin du rail)

   Autrement dit la pointe est un FRONT : le contenu arrive par la droite
   non trace, le franchit, et ressort trace. C'est le convoyeur d'une
   ligne de fab, pas une barre de progression. Et le fait qu'elle finisse
   exactement au bord droit prepare la phase 5, ou la piste sort par la.

   Mettre A = 0 donnerait une page d'accueil sans aucune ligne, et une
   pointe qui balaye tout l'ecran de gauche a droite. C'est reglable.

   Astuce : comme L = N.W par construction, la fraction deja tracee au
   depart vaut W.A / L = A / N — un POURCENTAGE, independant des pixels.
   DrawSVG peut donc recevoir deux constantes, et il n'y a plus de valeur
   en pixels a recalculer a chaque redimensionnement.
   ------------------------------------------------------------------ */
export function brancherPiste({
  conteneur,
  convoyeur,
  svg,
  trace,
  nombreDePanneaux,
}: OptionsPiste): BranchementPiste {
  /* ⚠ LECON DE LA PHASE 4, a ne pas re-apprendre.
     Premiere version : la piste avait SON PROPRE ScrollTrigger, avec les
     memes start/end que le rail. Resultat, elle ne bougeait pas d'un
     pixel. La raison : le rail `pin` le conteneur, donc pendant le
     defilement celui-ci passe en `position: fixed` dans un pin-spacer.
     Un second ScrollTrigger qui vise ce meme element mesure alors des
     positions qui n'ont plus de sens.

     La piste est pilotee par la progression du rail lui-meme. Avantage
     secondaire : les deux ne peuvent plus se desynchroniser, puisqu'il
     n'y a plus qu'une seule horloge.

     Et comme la piste est une DROITE, on n'a meme pas besoin de DrawSVG :
     on ecrit directement le `stroke-dasharray`, qui est le mecanisme que
     le plugin utilise de toute facon. Le §7 l'autorise explicitement.
     DrawSVG reste utilise pour les figures, elles, qui sont courbes. */

  let longueur = 0;

  const mesurer = () => {
    const largeur = convoyeur.offsetWidth;
    const hauteur = conteneur.clientHeight;
    if (largeur === 0 || hauteur === 0) return;
    svg.setAttribute("viewBox", `0 0 ${largeur} ${hauteur}`);
    trace.setAttribute("d", `M 0 ${Math.round(hauteur * HAUTEUR_PISTE)} H ${largeur}`);
    // La piste est horizontale : sa longueur EST la largeur du convoyeur.
    longueur = largeur;
  };
  mesurer();

  // Fraction deja tracee a l'entree du rail. Comme L = N x W, elle vaut
  // A / N — un rapport, donc rien a recalculer au redimensionnement.
  const fractionDepart = AVANCE_PISTE / nombreDePanneaux;

  const mettreAJour = (progression: number) => {
    if (longueur === 0) return;
    poserDash(trace, longueur * (fractionDepart + progression * (1 - fractionDepart)), longueur);
  };

  const surRefresh = () => mesurer();
  ScrollTrigger.addEventListener("refresh", surRefresh);

  return {
    mettreAJour,
    nettoyer: () => ScrollTrigger.removeEventListener("refresh", surRefresh),
  };
}

/* Ecrit la portion tracee d'un chemin. "tracee, longueur" = un tiret
   long de `tracee`, puis un trou assez grand pour que le reste du
   chemin ne reapparaisse jamais. C'est le mecanisme meme de DrawSVG,
   explicitement tolere par le §7. */
function poserDash(trace: SVGPathElement, tracee: number, longueur: number) {
  trace.style.strokeDasharray = `${tracee} ${longueur}`;
}

// ---------------------------------------------------------------------
// 1 bis. LA PISTE VERTICALE (mobile)
// ---------------------------------------------------------------------

interface OptionsPisteVerticale {
  readonly conteneur: HTMLElement;
  readonly svg: SVGSVGElement;
  readonly trace: SVGPathElement;
}

/* Sous 768 px, le rail est une pile verticale (decision de phase 3) :
   la piste s'y trace donc de haut en bas. Meme recit, autre axe.

   Ici le conteneur n'est PAS epingle — le piege n°1 du §6.4 ne
   s'applique pas, et cette piste peut avoir son propre ScrollTrigger. */
export function brancherPisteVerticale({
  conteneur,
  svg,
  trace,
}: OptionsPisteVerticale): () => void {
  let longueur = 0;
  let fractionDepart = 0;

  const mesurer = () => {
    const largeur = conteneur.clientWidth;
    const hauteur = conteneur.offsetHeight;
    if (largeur === 0 || hauteur === 0) return;
    svg.setAttribute("viewBox", `0 0 ${largeur} ${hauteur}`);
    trace.setAttribute("d", `M ${MARGE_PISTE} 0 V ${hauteur}`);
    longueur = hauteur;
    // Meme avance qu'a l'horizontale, mais en hauteurs d'ecran.
    fractionDepart = Math.min(1, (window.innerHeight * AVANCE_PISTE) / hauteur);
  };
  mesurer();

  const declencheur = ScrollTrigger.create({
    trigger: conteneur,
    start: "top top",
    end: "bottom bottom",
    scrub: SCRUB,
    invalidateOnRefresh: true,
    onRefresh: (self) => {
      mesurer();
      appliquer(self.progress);
    },
    onUpdate: (self) => appliquer(self.progress),
  });

  function appliquer(progression: number) {
    if (longueur === 0) return;
    poserDash(trace, longueur * (fractionDepart + progression * (1 - fractionDepart)), longueur);
  }
  appliquer(0);

  return () => declencheur.kill();
}

// ---------------------------------------------------------------------
// 2. LA REVELATION DES FIGURES
// ---------------------------------------------------------------------

const DESSINABLES = "path, line, circle, rect, polyline, polygon, ellipse";

/** Un element en tirets (§8) : DrawSVG pilote `stroke-dasharray` et
    ecraserait les tirets. Ces elements-la se revelent a l'opacite.
    On teste l'attribut plutot qu'une liste d'id : le jour ou une figure
    gagne un element en tirets, il est pris en charge tout seul. */
function enTirets(element: Element): boolean {
  const valeur = element.getAttribute("stroke-dasharray");
  return valeur !== null && valeur !== "" && valeur !== "none";
}

interface OptionsFigures {
  readonly conteneur: HTMLElement;
  /** Le tween du rail. Sans lui, rien ne se declencherait (voir ci-dessous). */
  readonly animation: gsap.core.Tween;
}

export function brancherFigures({ conteneur, animation }: OptionsFigures): () => void {
  const enveloppes = gsap.utils.toArray<HTMLElement>("[data-figure]", conteneur);
  const timelines: gsap.core.Timeline[] = [];
  const nettoyages: Array<() => void> = [];

  for (const enveloppe of enveloppes) {
    const svg = enveloppe.querySelector("svg");
    if (!svg) continue;

    const panneau = enveloppe.closest<HTMLElement>("[data-etape]");
    const repere = panneau?.dataset.etape ?? "";
    const prefixe = `f${repere}-`;

    const elements = gsap.utils.toArray<SVGElement>(DESSINABLES, svg);
    const traits = elements.filter((el) => !enTirets(el));
    const tirets = elements.filter(enTirets);

    /* Une figure deja visible au chargement (celle du 1er panneau) n'a
       aucune entree a jouer : dans un containerAnimation, les elements
       vont de la droite vers la gauche, donc son bord gauche a DEJA
       depasse le milieu de l'ecran. Son ScrollTrigger se placerait avant
       le debut du rail et ne se declencherait jamais. On la joue donc a
       l'ouverture de la page. */
    const dejaVisible = enveloppe.getBoundingClientRect().left < conteneur.clientWidth * 0.5;

    const tl = gsap.timeline({
      scrollTrigger: dejaVisible
        ? undefined
        : {
            // Le declencheur doit etre un element qui SE DEPLACE avec le
            // convoyeur — jamais le convoyeur lui-meme (§6.4).
            trigger: enveloppe,
            // containerAnimation : on dit a ScrollTrigger "cet element ne
            // descend pas, il glisse vers la gauche, surveille CETTE
            // animation-la". Sans cette ligne, rien ne se revele jamais.
            containerAnimation: animation,
            // ⚠ ERREUR N°1 sur ce type de site : dans un containerAnimation
            // les mots-cles changent d'axe. "left center" = "le bord gauche
            // de la figure atteint le milieu de l'ecran". Un "top center"
            // surveillerait une coordonnee verticale qui ne bouge jamais.
            start: "left center",
            toggleActions: "play none none reverse",
          },
    });

    const contexte: Contexte = {
      tl,
      el: (suffixe) => svg.querySelector<SVGElement>(`#${CSS.escape(prefixe + suffixe)}`),
      els: (prefixeCourt) => elements.filter((el) => el.id.startsWith(prefixe + prefixeCourt)),
      traits,
      tirets,
      dans: (selecteur) => panneau?.querySelector<HTMLElement>(selecteur) ?? null,

      dessiner: (cibles, position = 0, options) => {
        // On ecarte les elements en tirets meme si un mecanisme les
        // passe par megarde : DrawSVG ecraserait leur stroke-dasharray.
        const liste = cibles.filter(
          (el): el is SVGElement => el !== null && el !== undefined && !enTirets(el),
        );
        if (liste.length === 0) return;
        tl.fromTo(
          liste,
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            duration: options?.duree ?? DUR.base,
            ease: EASE.out,
            // `stagger.amount` et non `stagger.each` : la cascade dure
            // toujours la meme chose, que la figure ait 2 elements
            // (polissage) ou 43 (test sous pointes). Avec `each`, la
            // figure 10 aurait mis 2,5 s, au-dessus du plafond du §7.
            stagger: { amount: options?.etendue ?? 0 },
          },
          position,
        );
      },

      opacite: (cibles, position = 0) => {
        const liste = cibles.filter((el): el is SVGElement => el !== null && el !== undefined);
        if (liste.length === 0) return;
        tl.fromTo(
          liste,
          { opacity: 0 },
          { opacity: 1, duration: DUR.base, ease: EASE.out, stagger: { amount: DUR.micro } },
          position,
        );
      },

      auNettoyage: (fn) => nettoyages.push(fn),
    };

    // Le mecanisme propre au bloc (CONTENU.md), ou la revelation sobre.
    const mecanisme = MECANISMES[repere] ?? MECANISME_PAR_DEFAUT;
    mecanisme(contexte);

    timelines.push(tl);
  }

  return () => {
    for (const tl of timelines) {
      tl.scrollTrigger?.kill();
      tl.kill();
    }
    // SplitText doit rendre le DOM d'origine, sinon le titre reste
    // decoupe en <div> et les lecteurs d'ecran le lisent lettre a lettre.
    for (const nettoyer of nettoyages) nettoyer();
  };
}
