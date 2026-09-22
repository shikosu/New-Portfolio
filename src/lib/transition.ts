import { gsap } from "@/lib/gsap";
import { AVANCE_PISTE, EASE, HAUTEUR_PISTE, TRANSITION } from "@/lib/motion";

/* =====================================================================
   Les deux moities d'une transition de page (ROADMAP phase 5).

   Le recit, en une phrase : la piste sort par un bord de la page qu'on
   quitte, et rentre par le bord oppose de la page qui arrive.

   Chronogramme, sens +1 (on avance dans le procede) :

     t (s)   0            0,45                        1,00
             │             │                            │
     scene A │◄ xPercent 0 ──► -100 ►│                  │   (le convoyeur evacue)
     liaison │◄ [0 ; p] ──► [W ; W] ►│                  │   (le trait sort a droite)
             │             │                            │
     scene B │             │      opacity 0 ────────► 1 │   (la station se remplit)
     liaison │             │ [0;0] ──────────► [0 ; R] ►│   (le trait entre a gauche)

       W = largeur de la fenetre
       p = position de la pointe au moment du clic
       R = W x AVANCE_PISTE, la position de repos de la piste (le milieu)

   En sens -1 (bouton "precedent", ou clic sur une page deja vue), tout
   est mis en miroir : la piste sort par la gauche et revient par la
   droite. Le sens de l'animation dit "tu remontes la ligne de fab".

   ⚠ LECON DE LA PHASE 5, a ne pas re-apprendre.
   Pourquoi la page ENTRANTE apparait en opacite au lieu de glisser
   comme la sortante ? Parce que `transform` cree un BLOC CONTENEUR pour
   les descendants en `position: fixed` — et le rail epingle SON
   conteneur en `position: fixed`. Translater l'enveloppe d'une page dont
   le rail vient de se monter decale donc le pin, et ScrollTrigger mesure
   des positions fausses : le rail se retrouve a un ecran de la, ou ne
   revient jamais. La page SORTANTE, elle, peut glisser : on la passe
   d'abord en `position: fixed; inset: 0`, donc sa boite EST la fenetre,
   et le pin qu'elle contient retombe exactement au meme endroit.
   `opacity`, a l'inverse de `transform`, ne cree pas de bloc conteneur.
   C'est la seule propriete qui permet de reveler une page dont le rail
   est deja mesure.
   ===================================================================== */

/** Ce que la liaison doit connaitre pour se dessiner. */
export interface GeometrieLiaison {
  /** Largeur de la fenetre, en pixels. C'est la longueur du trait. */
  readonly largeur: number;
  /** Position de repos de la pointe : le milieu, avec AVANCE_PISTE = 0,5. */
  readonly repos: number;
}

/* ---------------------------------------------------------------------
   Mesure. Comme pour la piste, le `viewBox` est pose en PIXELS : une
   unite du SVG vaut un pixel a l'ecran, donc les positions calculees ici
   sont directement des positions d'ecran. Rien a convertir.
   --------------------------------------------------------------------- */
export function mesurerLiaison(svg: SVGSVGElement, trace: SVGPathElement): GeometrieLiaison {
  const largeur = window.innerWidth;
  const hauteur = window.innerHeight;
  svg.setAttribute("viewBox", `0 0 ${largeur} ${hauteur}`);
  trace.setAttribute("d", `M 0 ${Math.round(hauteur * HAUTEUR_PISTE)} H ${largeur}`);
  return { largeur, repos: largeur * AVANCE_PISTE };
}

/* ---------------------------------------------------------------------
   Dessiner UN SEGMENT [debut ; fin] sur une droite de longueur L.

   Meme mecanique que la piste (§7 : ecrire soi-meme le stroke-dasharray
   est tolere, c'est ce que DrawSVG fait de toute facon). Le motif a
   quatre valeurs se lit : trait de 0, trou de `debut`, trait de
   `fin - debut`, puis un trou de L — assez grand pour que le motif ne se
   repete jamais sur la longueur du trace.

       0     debut        fin              L
       ├───────┤▓▓▓▓▓▓▓▓▓▓▓┤────────────────┤
         trou      trait          trou
   --------------------------------------------------------------------- */
function poserSegment(trace: SVGPathElement, debut: number, fin: number, longueur: number): void {
  const a = Math.max(0, Math.min(debut, longueur));
  const b = Math.max(a, Math.min(fin, longueur));
  trace.style.strokeDasharray = `0 ${a} ${b - a} ${longueur}`;
}

/** Le segment anime : GSAP interpole cet objet, `onUpdate` le recopie
    dans le `stroke-dasharray`. Deux nombres au lieu d'un attribut de
    chaine a parser a chaque image. */
interface Segment {
  debut: number;
  fin: number;
}

function brancherSegment(trace: SVGPathElement, segment: Segment, longueur: number) {
  return () => poserSegment(trace, segment.debut, segment.fin, longueur);
}

/* =====================================================================
   1. LA SORTIE
   ===================================================================== */

interface OptionsSortie {
  /** L'enveloppe de la page sortante — deja figee (voir `figerScene`). */
  readonly scene: HTMLElement;
  readonly trace: SVGPathElement;
  readonly geometrie: GeometrieLiaison;
  /** +1 on avance dans le procede, -1 on le remonte. */
  readonly sens: 1 | -1;
  /** Position de la pointe de la piste a l'instant du clic, en pixels. */
  readonly pointe: number;
  readonly auTermine: () => void;
}

export function jouerSortie({
  scene,
  trace,
  geometrie,
  sens,
  pointe,
  auTermine,
}: OptionsSortie): gsap.core.Timeline {
  const { largeur } = geometrie;

  /* La piste de la page sortante est masquee des le premier instant :
     la liaison demarre exactement la ou elle etait ([0 ; pointe]), donc
     l'echange est invisible. Sans ca, deux traits se chevauchent puis
     se separent, et on voit un trou s'ouvrir au milieu de l'ecran. */
  gsap.set(scene.querySelectorAll("[data-piste]"), { opacity: 0 });

  const segment: Segment = { debut: 0, fin: pointe };
  const recopier = brancherSegment(trace, segment, largeur);
  recopier();

  // Sens +1 : les deux bouts filent vers le bord DROIT (x = largeur).
  // Sens -1 : ils refluent vers le bord GAUCHE (x = 0).
  const bord = sens > 0 ? largeur : 0;

  const tl = gsap.timeline({ onComplete: auTermine });

  tl.to(
    segment,
    {
      debut: bord,
      fin: bord,
      duration: TRANSITION.sortie,
      ease: EASE.inOut,
      onUpdate: recopier,
    },
    0,
  );

  // La page s'en va du cote oppose au bord de sortie du trait : c'est le
  // convoyeur qui continue sa course, exactement comme pendant le rail.
  tl.to(scene, { xPercent: -100 * sens, duration: TRANSITION.sortie, ease: EASE.inOut }, 0);

  return tl;
}

/* =====================================================================
   2. L'ENTREE
   ===================================================================== */

interface OptionsEntree {
  /** L'enveloppe de la page entrante, remise a plat et en opacite 0. */
  readonly scene: HTMLElement;
  readonly trace: SVGPathElement;
  readonly geometrie: GeometrieLiaison;
  readonly sens: 1 | -1;
  readonly auTermine: () => void;
}

export function jouerEntree({
  scene,
  trace,
  geometrie,
  sens,
  auTermine,
}: OptionsEntree): gsap.core.Timeline {
  const { largeur, repos } = geometrie;

  // Sens +1 : le trait nait au bord gauche (segment de longueur nulle en 0)
  //           et son front avance jusqu'au repos.
  // Sens -1 : il nait au bord droit et les deux bouts refluent vers la
  //           gauche, la queue s'arretant au repos. Le miroir exact.
  const depart = sens > 0 ? 0 : largeur;
  const segment: Segment = { debut: depart, fin: depart };
  const recopier = brancherSegment(trace, segment, largeur);
  recopier();

  /* Timeline creee EN PAUSE, lancee a l'image suivante.

     Mesure au banc : le rendu de la nouvelle page occupe une image
     longue (~45 ms). Comme `lagSmoothing(0)` est actif — on l'a coupe en
     phase 2 pour que le scrub ne saute pas —, GSAP ne rattrape pas ce
     retard en douceur : il avance l'animation de tout le temps ecoule.
     L'entree demarrait donc a 11 % de sa course, et le front apparaissait
     d'un bloc de 144 px au bord gauche au lieu de naitre a zero. On laisse
     passer l'image du rendu, puis on joue. */
  const tl = gsap.timeline({ paused: true, onComplete: auTermine });

  tl.to(
    segment,
    {
      debut: 0,
      fin: repos,
      duration: TRANSITION.entree,
      ease: EASE.out,
      onUpdate: recopier,
    },
    0,
  );

  /* La page se revele DERRIERE le front, pas avec lui : le decalage de
     30 % laisse le trait prendre un peu d'avance. C'est le §1 — "la
     piste est le mecanisme qui fait apparaitre le contenu". */
  tl.fromTo(
    scene,
    { opacity: 0 },
    { opacity: 1, duration: TRANSITION.entree * 0.7, ease: EASE.out },
    TRANSITION.entree * 0.3,
  );

  requestAnimationFrame(() => {
    // `paused()` est vrai tant que personne n'a tue la timeline entre-temps.
    if (tl.paused()) tl.play();
  });

  return tl;
}

/* =====================================================================
   3. GELER / DEGELER LA SCENE
   ===================================================================== */

/**
 * Sort la page de son flux pour pouvoir la translater sans que le rail
 * epingle ne saute (voir la lecon en tete de fichier).
 *
 * Le point delicat est la HAUTEUR DU DOCUMENT. Le rail epingle tient sa
 * course de defilement grace a un `pin-spacer` ; des que la scene passe
 * en `position: fixed`, ce spacer quitte le flux, le document se
 * raccourcit d'un coup, le navigateur ramene le defilement a 0 et le
 * rail REBOBINE sous les yeux de l'utilisateur. On fige donc la hauteur
 * du `body` juste avant, et on la relache une fois la page remplacee.
 */
export function figerScene(scene: HTMLElement): () => void {
  const hauteur = document.documentElement.scrollHeight;
  const ancienne = document.body.style.minHeight;
  document.body.style.minHeight = `${hauteur}px`;
  scene.classList.add("scene-figee");

  return () => {
    scene.classList.remove("scene-figee");
    document.body.style.minHeight = ancienne;
    // La scene va servir a la page suivante : on efface la translation
    // AVANT que celle-ci ne se monte, sinon son rail se mesurerait a
    // travers un `transform`, ce que la lecon ci-dessus interdit.
    gsap.set(scene, { clearProps: "transform" });
    gsap.set(scene, { opacity: 0 });
  };
}

/* =====================================================================
   4. LA POSITION DE REPOS, SANS ANIMATION
   Mode "animations reduites" et mobile : la bascule est instantanee,
   mais la liaison ne doit laisser aucune trace a l'ecran.
   ===================================================================== */
export function effacerLiaison(svg: SVGSVGElement): void {
  svg.style.visibility = "hidden";
}

export function afficherLiaison(svg: SVGSVGElement): void {
  svg.style.visibility = "visible";
}
