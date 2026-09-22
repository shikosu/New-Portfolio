import { SplitText } from "@/lib/gsap";
import { DUR, EASE } from "@/lib/motion";

/* =====================================================================
   LES 12 MECANISMES (CONTENU.md, phase 4b)

   Regle fondatrice du projet : « une etape de fab n'illustre pas le
   propos, elle le PRODUIT. Si on peut retirer l'animation sans rien
   perdre au sens, le bloc est rate. »

   Chaque mecanisme recoit un contexte et remplit une timeline. Aucun
   n'est invente : ils sont tous decrits ligne par ligne dans CONTENU.md.

   Ce qui est interdit ici, et pourquoi (§7) :
   - l'entree « fondu + glissement vers le haut » : c'est le preregle
     generique, il ne vient pas du procede ;
   - tout ce qui n'est pas `transform`, `opacity`, `drawSVG`,
     `stroke-dasharray`, `clip-path` ou un `filter` isole ;
   - un `ease` elastic/bounce.
   ===================================================================== */

/** Ce que chaque mecanisme peut manipuler. */
export interface Contexte {
  readonly tl: gsap.core.Timeline;
  /** #fNN-<suffixe>, cherche dans CETTE figure. */
  readonly el: (suffixe: string) => SVGElement | null;
  /** Tous les #fNN-<prefixe>… dans l'ordre du document. */
  readonly els: (prefixe: string) => SVGElement[];
  /** Tous les elements dessinables de la figure, hors tirets. */
  readonly traits: SVGElement[];
  /** Les elements en tirets : opacite, jamais DrawSVG (§8). */
  readonly tirets: SVGElement[];
  /** Un element du panneau HTML : "[data-titre]", "[data-texte]"… */
  readonly dans: (selecteur: string) => HTMLElement | null;
  /** Dessine au trait (DrawSVG). `etendue` borne la duree de la cascade. */
  readonly dessiner: (
    cibles: ReadonlyArray<SVGElement | null>,
    position?: number,
    options?: { readonly duree?: number; readonly etendue?: number },
  ) => void;
  /** Revele a l'opacite (elements en tirets). */
  readonly opacite: (cibles: ReadonlyArray<SVGElement | null>, position?: number) => void;
  /** A appeler pour defaire ce qui ne l'est pas par gsap (SplitText). */
  readonly auNettoyage: (fn: () => void) => void;
}

export type Mecanisme = (c: Contexte) => void;

// ---------------------------------------------------------------------
// Mecanisme par defaut : la figure se dessine, sobrement.
// « Les blocs non-★ apparaissent, ils ne se donnent pas en spectacle. »
// ---------------------------------------------------------------------
export const MECANISME_PAR_DEFAUT: Mecanisme = (c) => {
  c.dessiner(c.traits, 0);
  c.opacite(c.tirets, DUR.base * 0.6);
};

/* Petit utilitaire : faire apparaitre du texte SANS fondu-glissement.
   Le texte est simplement LA. Utilise par le bloc 02 (l'arc s'amorce). */
function allumer(tl: gsap.core.Timeline, cible: HTMLElement | null, position: number) {
  if (!cible) return;
  tl.fromTo(cible, { opacity: 0 }, { opacity: 1, duration: 0.001 }, position);
}

export const MECANISMES: Readonly<Record<string, Mecanisme>> = {
  /* ------------------------------------------------------------------
     01 · SABLE DE QUARTZ ★
     « Les grains s'ecoulent et se deposent ; le nom se compose par
     SEDIMENTATION — les glyphes arrivent portes par le flux. »
     Les glyphes tombent donc VERS LE BAS, a l'interieur de leur ligne
     clippee. Aucune opacite : c'est du transport de matiere, pas un
     fondu — et c'est exactement ce que le §7 interdit de faire autrement.
     ------------------------------------------------------------------ */
  "01": (c) => {
    c.dessiner([c.el("sol")], 0, { duree: DUR.base });

    // Les grains se deposent un par un, du haut du flux vers le tas.
    const grains = c.els("grain");
    if (grains.length > 0) {
      c.tl.fromTo(
        grains,
        { scale: 0, transformOrigin: "50% 50%" },
        {
          scale: 1,
          duration: DUR.micro,
          ease: EASE.out,
          stagger: { amount: DUR.reveal },
        },
        0.15,
      );
    }

    c.dessiner([c.el("tas")], DUR.reveal * 0.8, { duree: DUR.base });

    // Le nom se compose. SplitText decoupe en lignes puis en caracteres ;
    // chaque ligne est clippee, donc les glyphes tombent DANS la ligne.
    const titre = c.dans("[data-titre]");
    if (titre) {
      const decoupe = new SplitText(titre, {
        type: "lines,chars",
        linesClass: "ligne-clippee",
      });
      c.auNettoyage(() => decoupe.revert());
      c.tl.fromTo(
        decoupe.chars,
        { yPercent: -130 },
        { yPercent: 0, duration: DUR.base, ease: EASE.out, stagger: { amount: DUR.reveal } },
        0.1,
      );
    }
  },

  /* ------------------------------------------------------------------
     02 · FOUR A ARC ELECTRIQUE
     « L'arc s'amorce : allumage franc. Le texte est la au moment de
     l'amorcage, il n'arrive pas en glissant. Un arc, ca ne s'allume pas
     progressivement. » D'ou la duree quasi nulle sur le texte.
     ------------------------------------------------------------------ */
  "02": (c) => {
    const arcs = c.els("arc");
    const cavites = c.els("cavite");
    const structure = c.traits.filter((el) => !arcs.includes(el) && !cavites.includes(el));

    c.dessiner(structure, 0, { etendue: DUR.base });

    // L'amorcage : plein, coupe, plein. Trois images, pas une rampe.
    if (arcs.length > 0) {
      const t = DUR.base * 0.9;
      c.tl.fromTo(arcs, { opacity: 0 }, { opacity: 1, duration: 0.001, ease: EASE.strong }, t);
      c.tl.to(arcs, { opacity: 0.12, duration: 0.001 }, t + 0.06);
      c.tl.to(arcs, { opacity: 1, duration: 0.001 }, t + 0.12);
      allumer(c.tl, c.dans("[data-titre]"), t);
      allumer(c.tl, c.dans("[data-texte]"), t + 0.12);
      c.dessiner(cavites, t + 0.15, { duree: DUR.base });
    }
  },

  /* ------------------------------------------------------------------
     03 · PURIFICATION (SIEMENS)
     « Les impuretes quittent la colonne UNE PAR UNE, et un compteur en
     mono monte de 98 % a 9N. » Le compteur est du texte HTML, pas un
     <text> SVG (§8) : il reste selectionnable et lisible par un lecteur
     d'ecran. 9N = 99,9999999 %, soit une impurete sur un milliard.
     ------------------------------------------------------------------ */
  "03": (c) => {
    c.dessiner([c.el("embase"), c.el("cloche"), ...c.els("barreau")], 0, { etendue: DUR.base });
    c.dessiner(c.els("entree"), DUR.base * 0.6, { duree: DUR.base });
    // La sortie des impuretes : une par une, d'ou le stagger etale.
    c.dessiner(c.els("sortie"), DUR.base, { duree: DUR.base, etendue: DUR.reveal });

    const compteur = c.dans("[data-compteur]");
    if (compteur) {
      const PALIERS = [
        "98 %",
        "99 %",
        "99,9 %",
        "99,99 %",
        "99,999 %",
        "99,9999 %",
        "99,99999 %",
        "99,999999 %",
        "9N",
      ];
      const etat = { palier: 0 };
      c.tl.to(
        etat,
        {
          palier: PALIERS.length - 1,
          duration: DUR.reveal,
          ease: EASE.none,
          snap: { palier: 1 }, // on saute de palier en palier, pas de decimales
          onUpdate: () => {
            const texte = PALIERS[Math.round(etat.palier)] ?? PALIERS[0];
            if (compteur.textContent !== texte) compteur.textContent = texte;
          },
        },
        DUR.base,
      );
    }
  },

  /* ------------------------------------------------------------------
     04 · TIRAGE CZOCHRALSKI ★
     « LE SEUL MOUVEMENT VERTICAL DU SITE (§7). Le lingot MONTE. »
     Rappel du §2 : le lingot est TIRE hors du bain, il ne coule pas.
     C'est la tige qui remonte, et le lingot se forme derriere elle.
     On translate (pur `transform`) au lieu de mettre a l'echelle : un
     scaleY deformerait l'epaisseur du trait.
     ------------------------------------------------------------------ */
  "04": (c) => {
    const tirage = [c.el("germe"), c.el("tige-de-tirage")].filter(Boolean) as SVGElement[];
    const lingot = c.el("lingot");
    const fleches = c.els("fleche");
    const four = c.traits.filter(
      (el) => !tirage.includes(el) && el !== lingot && !fleches.includes(el),
    );

    c.dessiner(four, 0, { etendue: DUR.base });

    // La tige remonte, et le lingot se trace a mesure qu'elle tire.
    if (tirage.length > 0) {
      c.tl.fromTo(
        tirage,
        { y: 38 },
        { y: 0, duration: DUR.reveal, ease: EASE.out },
        DUR.base * 0.7,
      );
    }
    c.dessiner([lingot], DUR.base * 0.7, { duree: DUR.reveal });
    c.dessiner(fleches, DUR.base + DUR.reveal * 0.5, { duree: DUR.base });
  },

  /* ------------------------------------------------------------------
     05 · SCIAGE DU LINGOT
     « Le fil traverse ; A CHAQUE PASSAGE, une tranche se detache. »
     ⚠️ Ici on obtient des WAFERS. La decoupe en puces, c'est le bloc 11.
     Les fils et les tranches sont volontairement entrelaces : un fil,
     une tranche, un fil, une tranche.
     ------------------------------------------------------------------ */
  "05": (c) => {
    const fils = c.els("fil");
    const tranches = c.els("lingot-haut");
    const corps = c.traits.filter((el) => !fils.includes(el) && !tranches.includes(el));

    c.dessiner(corps, 0, { etendue: DUR.base });

    const depart = DUR.base * 0.8;
    const pas = DUR.base / Math.max(fils.length, 1);
    fils.forEach((fil, i) => {
      c.dessiner([fil], depart + i * pas, { duree: DUR.micro });
      // La tranche liberee par CE passage.
      c.dessiner([tranches[i] ?? null], depart + i * pas + DUR.micro * 0.5, { duree: DUR.micro });
    });
    // S'il reste des tranches (plus de tranches que de fils), on les pose.
    c.dessiner(tranches.slice(fils.length), depart + DUR.base, { etendue: DUR.micro });
  },

  /* ------------------------------------------------------------------
     06 · POLISSAGE CMP
     « Le disque tourne ; la surface passe d'un trait TREMBLE a un trait
     NET. » Le tremble est un `filter: blur()` — le §7 tolere `filter`
     sur un element isole, et c'est ici le seul moyen honnete de montrer
     une surface qui n'est pas encore plane.
     ⚠️ Le CMP n'apparait qu'une fois dans le site (§2).
     ------------------------------------------------------------------ */
  "06": (c) => {
    c.dessiner(c.traits, 0, { etendue: DUR.base });
    const figure = c.el("bord")?.ownerSVGElement ?? null;
    if (figure) {
      c.tl.fromTo(
        figure,
        { filter: "blur(2.4px)", rotate: -24 },
        { filter: "blur(0px)", rotate: 0, duration: DUR.reveal, ease: EASE.out },
        0,
      );
    }
  },

  /* ------------------------------------------------------------------
     07 · PHOTOLITHOGRAPHIE ★
     « REVELATION PAR MASQUE / clip-path OBLIGATOIRE (§7). Le texte est
     INSOLE, jamais fondu. Un opacity ici casserait la seule idee forte
     de la page. Le masque descend, le flash part, le motif est la. »
     ------------------------------------------------------------------ */
  "07": (c) => {
    const masque = [c.el("masque"), ...c.els("chrome")].filter(Boolean) as SVGElement[];
    const lumiere = [...c.els("rayon"), ...c.els("faisceau")];
    const banc = c.traits.filter((el) => !masque.includes(el) && !lumiere.includes(el));

    c.dessiner(banc, 0, { etendue: DUR.base });

    // 1. Le masque descend en position.
    if (masque.length > 0) {
      c.tl.fromTo(masque, { y: -34 }, { y: 0, duration: DUR.base, ease: EASE.out }, DUR.base * 0.5);
      c.dessiner(masque, DUR.base * 0.5, { duree: DUR.base });
    }

    // 2. Le flash. Une insolation ne monte pas en puissance : elle part.
    //    Les rayons apparaissent donc d'un coup (duree quasi nulle) et
    //    restent — une lumiere a demi-eteinte laisserait la figure
    //    visuellement inachevee, et un trait de figure porte du sens (§10).
    const tFlash = DUR.base * 1.3;
    c.dessiner(lumiere, tFlash, { duree: 0.001 });

    // 3. Le motif est la : le texte est balaye de gauche a droite par
    //    l'insolation. `inset()` est une forme que GSAP sait interpoler.
    const texte = c.dans("[data-insole]");
    if (texte) {
      c.tl.fromTo(
        texte,
        { clipPath: "inset(0% 100% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: DUR.reveal,
          ease: EASE.out,
        },
        tFlash + 0.05,
      );
    }
  },

  /* ------------------------------------------------------------------
     08 · GRAVURE
     « LA SEULE ANIMATION DU SITE QUI RETIRE DE LA MATIERE au lieu d'en
     ajouter (§7). Le motif SE CREUSE, il n'apparait pas. »
     Traduction en DrawSVG : le profil grave part de son milieu
     (`"50% 50%"`) et s'ouvre vers ses deux extremites. Visuellement, le
     creux s'evide — l'inverse d'un trait qu'on pose.
     ------------------------------------------------------------------ */
  "08": (c) => {
    const profil = c.el("profil-grave");
    const attaques = c.els("attaque");
    const resines = c.els("resine");

    c.dessiner(resines, 0, { etendue: DUR.base });
    c.dessiner(attaques, DUR.base * 0.6, { duree: DUR.base, etendue: DUR.micro });

    if (profil) {
      c.tl.fromTo(
        profil,
        { drawSVG: "50% 50%" },
        { drawSVG: "0% 100%", duration: DUR.reveal, ease: EASE.out },
        DUR.base,
      );
    }
  },

  /* ------------------------------------------------------------------
     09 · DOPAGE
     « Les ions s'implantent en STAGGER. » Les ions bloques par la resine
     arrivent d'abord, les implantes ensuite, et les CAISSONS apparaissent
     en dernier : ce sont eux le resultat du dopage.
     ⚠️ caisson-1 et caisson-2 sont EN TIRETS -> opacite, jamais DrawSVG
     (§8) : le plugin pilote `stroke-dasharray` et ecraserait les tirets.
     ------------------------------------------------------------------ */
  "09": (c) => {
    c.dessiner([c.el("substrat"), ...c.els("resine")], 0, { etendue: DUR.base });
    c.dessiner(c.els("ion-bloque"), DUR.base * 0.6, { duree: DUR.micro, etendue: DUR.base });
    c.dessiner(c.els("ion-implante"), DUR.base * 0.9, { duree: DUR.micro, etendue: DUR.base });
    c.opacite(c.tirets, DUR.base + DUR.reveal * 0.6);
  },

  /* ------------------------------------------------------------------
     10 · TEST SOUS POINTES (EWS) ★
     « Les pointes DESCENDENT, puce par puce. Chaque puce validee
     s'allume. » EWS = Electrical Wafer Sort : on teste chaque die encore
     sur le wafer, et on marque les rebuts pour ne pas les encapsuler.
     ------------------------------------------------------------------ */
  "10": (c) => {
    const pointes = c.el("pointes");
    const testees = c.els("testee");
    const rebuts = c.els("rebut");
    const wafer = c.traits.filter(
      (el) => el !== pointes && !testees.includes(el) && !rebuts.includes(el),
    );

    c.dessiner(wafer, 0, { etendue: DUR.base });

    // Les pointes descendent sur le wafer.
    if (pointes) {
      c.tl.fromTo(
        pointes,
        { y: -26 },
        { y: 0, duration: DUR.base, ease: EASE.out },
        DUR.base * 0.5,
      );
      c.dessiner([pointes], DUR.base * 0.5, { duree: DUR.base });
    }

    // Puis chaque die validee s'allume, une par une.
    c.dessiner(testees, DUR.base, { duree: DUR.micro, etendue: DUR.reveal });
    // Les rebuts arrivent en dernier : ce sont les croix.
    c.dessiner(rebuts, DUR.base + DUR.reveal * 0.7, { duree: DUR.micro, etendue: DUR.micro });
  },

  /* ------------------------------------------------------------------
     11 · DECOUPE (DICING)
     « Les traits de decoupe passent, les puces se separent, UNE D'ELLES
     GLISSE HORS DU WAFER. » ⚠️ Ici on decoupe le WAFER en PUCES — a ne
     pas confondre avec le sciage du lingot (bloc 05).
     `emplacement-libere` est en tirets -> opacite (§8).
     ------------------------------------------------------------------ */
  "11": (c) => {
    const saignees = c.els("saignee");
    const prelevement = c.els("prelevement");
    const prelevee = c.el("die-prelevee");
    const wafer = c.traits.filter(
      (el) => !saignees.includes(el) && !prelevement.includes(el) && el !== prelevee,
    );

    c.dessiner(wafer, 0, { etendue: DUR.base });
    // Les traits de scie passent, l'un apres l'autre.
    c.dessiner(saignees, DUR.base * 0.5, { duree: DUR.micro, etendue: DUR.base });
    // L'emplacement libere (en tirets) : la puce n'y est plus.
    c.opacite(c.tirets, DUR.base * 1.2);
    // Et elle glisse hors du wafer.
    if (prelevee) {
      c.tl.fromTo(
        prelevee,
        { x: -46, y: 16 },
        { x: 0, y: 0, duration: DUR.reveal, ease: EASE.out },
        DUR.base * 1.2,
      );
      c.dessiner([prelevee], DUR.base * 1.2, { duree: DUR.base });
    }
    c.dessiner(prelevement, DUR.base * 1.4, { duree: DUR.base });
  },

  /* ------------------------------------------------------------------
     12 · PACKAGING
     « Les fils de bonding se tracent du die vers les broches ; CHAQUE
     BROCHE EST UN CANAL DE CONTACT. » C'est le bloc contact du site, et
     le seul (§2) : les broches d'un boitier sont l'interface de la puce
     avec l'exterieur.
     ⚠️ `puce` est en tirets -> opacite (§8).
     ------------------------------------------------------------------ */
  "12": (c) => {
    const fils = c.els("fil");
    const broches = c.els("broche").filter((el) => el.id !== "f12-repere-broche-1");
    const boitier = c.traits.filter((el) => !fils.includes(el) && !broches.includes(el));

    c.dessiner(boitier, 0, { etendue: DUR.base });
    c.opacite(c.tirets, DUR.base * 0.6);
    c.dessiner(broches, DUR.base * 0.7, { duree: DUR.micro, etendue: DUR.base });
    // Les fils de bonding, un par broche.
    c.dessiner(fils, DUR.base, { duree: DUR.micro, etendue: DUR.reveal });
  },
};
