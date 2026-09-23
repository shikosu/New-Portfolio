# CLAUDE.md — Portfolio Irchi (refonte 2026)

> Fichier lu automatiquement par Claude Code à chaque session.
> Il fixe le contexte, les règles et les garde-fous. Le modifier = changer le comportement de Claude sur tout le projet.
>
> **Révision en cours : phase 0 close.** Concept « ligne de fab » adopté, identité PCB abandonnée.
> L'ancienne version est conservée dans `CLAUDE.pcb-obsolete.bak.md` — pour référence, pas pour usage.

---

## 1. Le projet en trois phrases

Portfolio personnel de Téo Vidal (marque **Irchi**), étudiant BUT GEII visant l'industrie du semi-conducteur.

Concept : **le site est une ligne de fabrication de semi-conducteur, du sable à la puce.** On avance de gauche à droite ; une ligne noire unique — la piste — traverse tout le site et se trace au scroll. Chaque étape du procédé (sable, four à arc, lithographie, dopage, packaging…) n'est pas un décor : c'est **le mécanisme qui fait apparaître le contenu**. En fin de rail, la piste sort par le bord droit et entre par le bord gauche de la page suivante.

Objectif : impressionner un recruteur technique (semi-conducteur, électronique, embarqué), pas un directeur artistique.

**Priorité assumée : effet visuel maximal.** Le poids et le nombre de requêtes passent après la qualité de l'animation — mais jamais avant l'accessibilité et la fluidité (voir §9).

> ⚠️ L'ancien concept « la navigation est un circuit imprimé qui se route », avec sa palette vernis épargne vert / cuivre / FR-4, est **abandonné**. Si tu croises une trace de PCB, de vernis vert ou de piste de cuivre dans le projet, c'est un reste à supprimer, pas une intention.

---

## 2. Structure du site — figée en phase 0

4 pages, 3 blocs chacune. Chaque bloc est une étape réelle du procédé.

| Page | Rôle | Bloc 1 | Bloc 2 | Bloc 3 |
|---|---|---|---|---|
| **1** | Présentation | `01` sable de quartz ★<br>*qui je suis* | `02` four à arc<br>*pourquoi le bas niveau* | `03` purification (Siemens)<br>*mon exigence, ma cible* |
| **2** | Objectifs & formation | `04` tirage Czochralski ★<br>*objectifs au quotidien* | `05` sciage du lingot<br>*objectifs principaux* | `06` polissage CMP<br>*objectifs secondaires* |
| **3** | Expérience & compétences | `07` photolithographie ★<br>*expériences pro* | `08` gravure<br>*stages et emplois* | `09` dopage<br>*compétences et outils* |
| **4** | Projets & contact | `10` test sous pointes ★<br>*projets phares* | `11` découpe (dicing)<br>*tous les projets* | `12` packaging<br>*contact, posture pro* |

Le détail de chaque bloc — message, mécanisme d'apparition, données à fournir — est figé dans
**`CONTENU.md`**. Aucun texte n'entre dans `src/content/*.ts` sans y passer d'abord.

★ = le moment fort de la page. **Un seul par page**, jamais deux (voir §7).

Règles de structure :

- **Pas de page Compétences.** Elles sont le bloc *dopage* (page 3) : le dopage est ce qui donne au silicium ses propriétés électriques.
- **Pas de page Contact.** C'est le bloc *packaging* (page 4) : les broches d'un boîtier sont l'interface de la puce avec l'extérieur. Une fab en construction, au trait, occupe le fond.
- 3 blocs par page → course de scroll de `(3 − 1) × 100vw = 200vw` par rail. C'est le budget, pas une estimation.
- Le **wafer poli** (bloc 06) est le seul objet qui traverse deux pages : il naît en page 2 et sert de support à toute la page 3. Ne pas casser cette continuité.
- **L'ordre du procédé est réel, jamais réarrangé pour la mise en page.** En particulier : le four à arc vient *avant* la purification (réduction carbothermique → Si métallurgique 99 %, *puis* procédé Siemens → 9N), et le lingot *monte* (il est tiré hors du bain), il ne coule pas.
- **Ne pas confondre les deux découpes.** Bloc 05 = *sciage du lingot* → on obtient des wafers. Bloc 11 = *dicing* → on découpe le wafer en puces. Deux étapes, deux figures, deux moments du récit.
- **Le polissage CMP n'apparaît qu'une fois** (bloc 06). Le réutiliser en page 3 doublonnerait la figure et priverait la page 3 de son ★.
- **Sous 768 px, le rail n'est plus horizontal** — décidé en phase 3, définitif. Les 3 blocs
  s'empilent verticalement et le défilement redevient natif. Deux raisons : un défilement
  horizontal détourné est pénible au doigt, et surtout c'est **exactement le même chemin de
  code que le mode « animations réduites »** — une seule mécanique à déboguer au lieu de deux.
  Le seuil vit dans `SEUIL_RAIL` (`hooks/useHorizontalRail.ts`), les classes `md:` du
  composant `<Rail>` doivent rester alignées dessus.
  ⚠️ Conséquence : la piste se tracera **de haut en bas** en mobile (phase 4), pas de gauche
  à droite. Ce n'est pas une dégradation, c'est le même récit sur l'autre axe.
  ⚠️ Deuxième conséquence, décidée en phase 5 : **sous 768 px, le changement de page est une
  bascule instantanée**, le même chemin de code que le mode « animations réduites ». Une
  liaison horizontale n'aurait aucun sens sur une piste verticale, et un balayage vertical
  serait une deuxième mécanique à régler et à tester pour un gain que personne ne réclame.
  Le critère « aucun clignotement blanc » reste tenu : une bascule instantanée n'en a pas.

**Pages annexes (conformité légale, 2026-09-23) — hors du récit.** `/mentions-legales` et
`/confidentialite` ne sont **pas** des étapes du procédé : pas de rail, pas de piste, pas de
figure, bascule instantanée à l'entrée et à la sortie. Elles vivent dans `ANNEXES`
(`lib/parcours.ts`), jamais dans `PARCOURS`. On y accède par le **pied de page**, présent sous
toutes les pages et monté **dans** la scène de `TransitionPages` (sinon il remonte dans le
vide pendant une transition). Détail et « à faire » : `CONFORMITE.md`.
⚠️ Toute nouvelle collecte de données (formulaire, outil de mesure, script tiers) impose de
mettre à jour `content/legal.ts` et, pour un traceur, `content/traceurs.ts` **dans le même
commit**. Le bandeau cookies n'existe que si ce registre n'est pas vide.

Storyboard détaillé des 12 vignettes — ce qui entre, ce qui sort, dans quel sens, déclenché par quoi :
`https://claude.ai/code/artifact/077a28a2-2ce5-4a46-a2d8-3613e6d6d437`

---

## 3. Stack figée

Ne pas proposer d'alternative sans que je le demande explicitement.

| Rôle | Choix | Pourquoi |
|---|---|---|
| Build | **Vite** | rapide, je le connais |
| UI | **React 19 + TypeScript** (strict) | déjà maîtrisé |
| Styles | **Tailwind CSS v4** (config CSS-first via `@theme`) | pas de `tailwind.config.js` |
| Animation | **GSAP 3.15+** + ScrollTrigger, DrawSVG, MotionPath, SplitText, Flip | gratuit depuis avril 2025 |
| Intégration React | **`@gsap/react`** (`useGSAP`) | nettoyage automatique |
| Scroll fluide | **Lenis** | < 4 ko, ne casse pas la structure DOM |
| Routage | **React Router v7** | SPA, transitions maîtrisées |
| SVG | **`vite-plugin-svgr`** | importer un `.svg` comme composant React |
| Polices | **`@fontsource/*`** (auto-hébergées) | pas de CDN Google |

**Interdits :** Framer Motion / Motion, anime.js, Locomotive Scroll, AOS, ScrollSmoother, toute autre lib d'animation. Une seule ligne d'animation dans le projet = GSAP. Deux moteurs qui se battent pour la même propriété CSS, c'est la garantie de bugs impossibles à déboguer.

**3D (React Three Fiber) :** interdite tant que la phase 5 de la ROADMAP n'est pas terminée.

---

## 4. Commandes

```bash
npm run dev         # serveur de dev
npm run build       # build de production
npm run preview     # sert le build local (à utiliser pour tester la perf, PAS le dev)
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run format      # prettier --write
npm run check       # typecheck + lint + build : à lancer avant chaque commit
npm run analyze     # build + visualiseur de bundle
```

**Règle :** `npm run check` doit passer au vert avant tout commit. Si Claude modifie du code, il lance `npm run typecheck` avant de dire que c'est fini.

---

## 5. Architecture des dossiers

```
src/
├── main.tsx                 # point d'entrée
├── App.tsx                  # routes + providers
├── styles/
│   ├── index.css            # @import "tailwindcss" + @theme (tokens)
│   └── fonts.css
├── vite-env.d.ts            # types des imports `?react` (svgr)
├── lib/
│   ├── gsap.ts              # ⚠️ SEUL endroit où on fait registerPlugin()
│   ├── lenis.ts             # instance unique + synchro ScrollTrigger
│   ├── motion.ts            # constantes d'animation + géométrie de la piste — cf. §7
│   ├── procede.ts           # branchement de la piste et des révélations de figures
│   ├── mecanismes.ts        # LES 12 MÉCANISMES, un par bloc — cf. CONTENU.md
│   ├── parcours.ts          # l'ordre des 4 pages, le sens, le chargement à la demande
│   ├── transition.ts        # les deux moitiés d'une transition de page — cf. §6.6
│   └── consentement.ts      # consentement aux traceurs (éteint tant que le registre est vide)
├── hooks/
│   ├── useHorizontalRail.ts
│   └── usePrefersReducedMotion.ts
├── components/
│   ├── layout/              # Shell, Nav, TransitionPages, Liaison, PiedDePage
│   ├── rail/                # Rail, Panneau, IndicateurRail, Entrees, Liens
│   ├── legal/               # PageLegale, BlocLegal, BandeauConsentement
│   ├── process/             # Piste, Figure, figures.ts (les 12 imports svgr)
│   └── ui/                  # Suivant (la flèche de fin de rail), primitives
├── pages/
│   ├── Presentation.tsx
│   ├── Objectifs.tsx
│   ├── Experience.tsx
│   ├── Projets.tsx
│   ├── MentionsLegales.tsx  # annexe, hors récit
│   └── Confidentialite.tsx  # annexe, hors récit
├── content/                 # ⚠️ données séparées du rendu
│   ├── types.ts             # le contrat : Bloc, Entree, Fiche, Lien (phase 6)
│   ├── site.ts              # nom, titre d'onglet — recopiés dans index.html
│   ├── etapes.ts            # les 12 étapes du procédé (structure, figée en P0)
│   ├── presentation.ts
│   ├── objectifs.ts
│   ├── experience.ts
│   ├── competences.ts
│   ├── projets.ts
│   ├── legal.ts             # mentions légales, confidentialité, pied de page (annexes)
│   └── traceurs.ts          # registre des traceurs soumis à consentement — VIDE à ce jour
└── assets/
    └── process/             # les 4 figures de procédé (SVG) — cf. §8
```

**Le contrat entre le HTML et les mécanismes.** `lib/mecanismes.ts` ne connaît le panneau que
par des attributs `data-*`. Les renommer casse un mécanisme sans que TypeScript s'en aperçoive :

| Attribut | Porté par | Utilisé par |
|---|---|---|
| `data-etape="07"` | l'`<article>` du panneau | retrouve le mécanisme **et** le préfixe des `id` de sa figure (`f07-`) |
| `data-figure` | l'enveloppe du SVG | déclencheur ScrollTrigger de la révélation |
| `data-titre` | le `<h2>` | 01 (sédimentation), 02 (amorçage) |
| `data-texte` | le paragraphe | 02 |
| `data-insole` | la zone de texte entière | 07 ★, révélation par `clip-path` |
| `data-compteur` | le compteur `mono` | 03, 98 % → 9N |
| `data-panneau="2"` | l'enveloppe de panneau du rail | défilement au focus clavier (§9.2) ; le retrait `pb-14` de la colonne droite du dernier panneau (la flèche « suivant ») |
| `data-entree="04-1"` | chaque `<li>` d'une liste de bloc | point d'accroche de la mise en scène des listes (dette 4b) |
| `data-piste="horizontale"` | le `<svg>` de la piste | `pointeDeLaPiste()` y lit où le trait s'est arrêté, pour que la transition reprenne au bon endroit |
| `data-liaison` | le `<svg>` fixe de la coquille | le trait qui relie deux pages pendant une transition (§6.6) |

**Règle du `content/` :** aucun texte de contenu en dur dans un composant. Tout passe par un tableau typé dans `content/`. Ça me permet de changer le contenu sans toucher aux animations.

**Règle du brouillon (phase 6) :** un texte rédigé par Claude porte `brouillon: true` sur son
bloc, et n'utilise que des faits que j'ai donnés. Ce qui relève de mon ressenti (accroche,
déclic, habitudes, travail en équipe) **reste vide** plutôt que d'être inventé. La pastille
« brouillon » n'existe qu'en `npm run dev`. C'est moi, et moi seul, qui passe un bloc à `false`.

---

## 6. Règles GSAP en React — non négociables

### 6.1 Un seul point d'enregistrement des plugins

```ts
// src/lib/gsap.ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin, SplitText, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
```

Partout ailleurs : `import { gsap } from "@/lib/gsap"`. Jamais `import { gsap } from "gsap"` dans un composant.

### 6.2 Toujours `useGSAP`, jamais `useEffect`

```tsx
useGSAP(() => {
  gsap.to(".piste", { drawSVG: "100%" });
}, { scope: container, dependencies: [] });
```

`useGSAP` crée un contexte et révoque automatiquement toutes les animations au démontage. Avec `useEffect`, en StrictMode, tout se crée deux fois → animations fantômes et ScrollTriggers dupliqués.

Le `scope` (une ref sur le conteneur) limite les sélecteurs à ce composant. Sans lui, `".piste"` attrape les pistes des autres pages.

### 6.3 ScrollTrigger : les pièges à connaître

- Après tout changement de mise en page (chargement d'image, police, ouverture d'accordéon) → `ScrollTrigger.refresh()`.
- `invalidateOnRefresh: true` dès qu'un `end` est calculé à partir d'une largeur.
- Toujours écrire `end: () => "+=" + el.offsetWidth` (fonction) et pas une valeur figée : sinon le redimensionnement casse tout.
- En développement, `markers: true` est autorisé. **Aucun `markers` ne doit survivre à un commit.**

### 6.4 Dans un défilement horizontal (`containerAnimation`)

Les mots-clés de position changent d'axe : `start: "left center"` et non `"top center"`. C'est la source d'erreur n°1 sur ce type de site — un `top` dans un `containerAnimation` surveille une coordonnée qui ne varie jamais, donc l'animation est soit déjà finie au chargement, soit jamais déclenchée.

Le déclencheur doit être un élément **qui se déplace avec le conteneur**, et jamais le conteneur animé lui-même.

⚠️ **Deux pièges mesurés en phase 4, à ne pas ré-apprendre :**

1. **Ne jamais poser un second ScrollTrigger sur l'élément que le rail `pin`.** La piste avait
   d'abord le sien, avec les mêmes `start`/`end` que le rail : elle n'a pas bougé d'un pixel.
   Pendant le défilement, le conteneur épinglé passe en `position: fixed` dans un pin-spacer,
   et un autre ScrollTrigger qui le vise mesure des positions qui n'ont plus de sens. Tout ce
   qui doit suivre le rail se pilote depuis le `onUpdate` du rail — une seule horloge.
2. **Une figure déjà à l'écran au chargement n'a pas d'entrée à jouer.** Dans un
   `containerAnimation`, les éléments vont de droite à gauche : le bord gauche de la figure du
   1ᵉʳ panneau a *déjà* dépassé le milieu de l'écran, donc son `start: "left center"` se place
   avant le début du rail et ne se déclenche jamais. Elle se dessine à l'ouverture de la page,
   sans ScrollTrigger.

Rappel de dimensionnement, vérifié sur le prototype de phase 1 :
- `xPercent` est un pourcentage de la largeur de **l'élément animé**. Pour N panneaux de 100vw dans un conteneur de N × 100vw : `xPercent: -100 * (N - 1) / N`.
- La course de scroll vaut `piste.offsetWidth - conteneur.clientWidth`.
  ⚠️ **Corrigé en phase 3 : `clientWidth`, pas `window.innerWidth`.** `innerWidth` inclut la
  barre de défilement verticale, `clientWidth` non. Sur un PC à barres classiques (~15 px)
  les deux diffèrent, et la piste finit décalée de 15 px à 100 %. Sur un Mac à barres
  flottantes l'erreur est invisible — donc invérifiable sur ma machine. Pour la même raison,
  les panneaux sont dimensionnés en **pourcentage du conteneur** (variable CSS `--panneaux`)
  et jamais en `100vw`, qui souffre du même défaut.
- Pour qu'une pointe de tracé reste fixe à l'écran, l'étendue horizontale du `<path>` doit **égaler** cette course. Si elle est plus grande, la pointe fuit vers l'avant ; plus petite, elle prend du retard.

### 6.5 Lenis + ScrollTrigger

Une seule instance de Lenis, créée dans `lib/lenis.ts`, avec la synchro obligatoire :

```ts
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

Sans ça, ScrollTrigger lit la position native du navigateur pendant que Lenis affiche une position lissée : tout se déclenche au mauvais moment.

### 6.6 Transitions de page : les deux pièges mesurés en phase 5

Ils se ressemblent : dans les deux cas, ce qui casse n'est pas l'animation mais le
**moment** où le DOM change sous elle.

1. **`transform` crée un bloc conteneur pour les descendants en `position: fixed`.**
   Or le rail `pin` son conteneur en `position: fixed`. Donc translater l'enveloppe d'une
   page qui contient un rail épinglé déplace aussi le pin — et si la boîte de l'enveloppe
   n'est pas celle de la fenêtre, tout saute.
   - La page **sortante** peut glisser, parce qu'on la passe d'abord en
     `position: fixed; inset: 0` (classe `.scene-figee`) : sa boîte **est** la fenêtre, le
     pin retombe au pixel près. ⚠️ Il faut alors figer la hauteur du `body` avant, sinon le
     `pin-spacer` quitte le flux, le document raccourcit, le navigateur ramène le
     défilement à 0 et **le rail rebobine sous les yeux de l'utilisateur**.
   - La page **entrante** ne peut pas glisser : son rail vient d'être mesuré. Elle se
     révèle en `opacity`, la seule propriété qui ne crée pas de bloc conteneur.
     Ce n'est pas le préréglage « fondu » interdit par le §7 : le mouvement est porté par
     le front de la liaison, l'opacité ne fait que découvrir ce qu'il a déjà tracé.

2. **Une page chargée à la demande suspend, et React attend 300 ms avant de remplacer un
   `fallback`.** Mesuré au banc : la page entrante arrivait 336 ms en retard, donc d'un
   bloc, à 83 % d'opacité. La parade est `startTransition` : React garde l'ancien arbre
   à l'écran, n'affiche jamais le fallback, et n'a donc aucun garde-fou à appliquer.
   👉 Règle générale : **un changement de page qui déclenche une animation passe
   obligatoirement par `startTransition`**, sinon l'animation et le DOM se désynchronisent.

Corollaire de la même famille : `lagSmoothing(0)` (§6.5) fait que GSAP **ne lisse pas** une
image longue. L'image du rendu de la nouvelle page en est une. L'entrée est donc créée en
pause et lancée à l'image suivante, sinon elle démarre déjà à 11 % de sa course.

---

## 7. Règles d'animation — le barème « cher vs cheap »

Ces valeurs vivent dans `src/lib/motion.ts` et sont importées. Aucune durée ni easing en dur dans un composant.

```ts
export const DUR = {
  micro: 0.2,    // hover, focus, changement d'état
  base: 0.5,     // apparition d'un élément
  reveal: 0.8,   // révélation d'une section
  page: 1.1,     // transition entre deux pages (plafond absolu)
} as const;

export const EASE = {
  out: "power2.out",      // défaut pour tout ce qui apparaît
  strong: "expo.out",     // moments forts uniquement
  inOut: "power2.inOut",  // aller-retour
  none: "none",           // OBLIGATOIRE pour tout ce qui est lié au scrub
} as const;

export const STAGGER = 0.06;

// Géométrie de la piste (phase 4).
export const HAUTEUR_PISTE = 0.68; // hauteur dans le panneau, en fraction d'écran
export const AVANCE_PISTE  = 0.5;  // longueur déjà tracée à l'entrée du rail, en écrans
export const TRAIT         = 2.4;  // épaisseur commune piste + figures (§8)

// Retard de rattrapage entre la molette et l'animation, en secondes.
// Mesure de phase 1 (`proto/scrub-lab.html`, 2026-09-10) : 0.3 reste collé au
// doigt, 1 commence a flotter, 2 devient elastique. 60 fps, pire image 17 ms.
export const SCRUB = 0.3;

// Transitions de page (phase 5). Les deux moitiés sont SÉQUENTIELLES :
// leur somme est la durée perçue, et elle reste sous DUR.page.
//     0,45 + 0,55 = 1,00 s   ≤   1,10 s
// Mesure au banc : 1,02 s à l'écran, du premier trait de liaison au dernier.
export const TRANSITION = { sortie: 0.45, entree: 0.55 } as const;
```

**Interdits stricts :**
- Toute durée > 1,2 s (hors boucle décorative infinie).
- `ease: "elastic"` ou `"bounce"` — sauf demande explicite de ma part.
- Animer `width`, `height`, `top`, `left`, `margin`. **Uniquement `transform` et `opacity`.** Exception tolérée : `stroke-dashoffset` (c'est le mécanisme même de DrawSVG) et `filter` sur un élément isolé.
- `box-shadow` animé.
- Un `ease` autre que `none` sur une animation en `scrub` : ça désynchronise de la molette et c'est immédiatement perçu comme amateur. **Mesuré en phase 1** : avec `power2.inOut`, scroll immobile et scrub déjà rattrapé, la molette est à 27,3 % pendant que le track est à 8,2 % — 491 px d'erreur qui ne se résorbent jamais. En `scrub`, la molette n'est pas un déclencheur, c'est l'axe des temps : un `ease` déforme ce que l'utilisateur tient dans la main.
- **Les entrées « fondu + glissement vers le haut ».** C'est le défaut générique. Le mouvement doit venir du procédé — le sable qui s'écoule, le lingot qui est tiré, le masque qui insole, les ions qui s'implantent — jamais d'un préréglage.

**Règles propres au concept :**
- La révélation du texte en page 3 se fait par **masque / `clip-path`** (le texte est *insolé*), jamais par `opacity`.
- Le tirage Czochralski (bloc 04) est le **seul mouvement vertical du site**. S'il est repris ailleurs, il perd sa force.
- La gravure (bloc 08) est la seule animation qui **retire** de la matière au lieu d'en ajouter. Ce contraste est voulu.
- **La pointe de la piste est un front, pas une barre de progression.** Elle part du milieu de
  l'écran à l'entrée du rail et atteint le bord droit exactement à la fin — le contenu arrive
  par la droite non tracé, franchit le front, et ressort tracé. C'est le convoyeur d'une ligne
  de fab. Le calcul complet est en tête de `lib/procede.ts` ; les deux réglages sont
  `HAUTEUR_PISTE` et `AVANCE_PISTE`.
- **Un bloc sans mécanisme de texte garde un texte statique.** `CONTENU.md` n'en prescrit que
  pour 01, 02, 03 et 07. Les autres n'en reçoivent pas : « les blocs non-★ apparaissent, ils ne
  se donnent pas en spectacle ». Ne pas leur inventer une entrée pour « équilibrer ».
- **La piste n'utilise pas DrawSVG.** C'est une droite : on écrit directement son
  `stroke-dasharray`, qui est le mécanisme que le plugin emploie de toute façon (toléré par le
  §7). DrawSVG reste utilisé pour les figures, qui sont courbes.

**Règle de restraint :** un seul moment spectaculaire par page — ils sont désignés dans le tableau du §2. Si une page a trois effets « waouh », elle n'en a aucun.

---

## 8. Les figures de procédé — format SVG obligatoire

Les 4 figures (une par page) sont **dessinées par moi**. Un schéma récupéré sur le web est protégé par le droit d'auteur et n'a rien à faire dans un portfolio qu'on montre à un recruteur. Les références servent à comprendre le procédé, pas à être copiées.

Contraintes de fabrication du fichier, non négociables :

| Règle | Pourquoi |
|---|---|
| `fill="none"` + `stroke` partout | DrawSVG anime un **contour**. Une forme remplie ne se dessine pas. |
| **Jamais** *Contour en chemin* / *Stroke to Path* | Ça convertit le trait en forme remplie et casse DrawSVG définitivement. |
| Un `<path>` par élément animable, avec un `id` explicite | On cible `#piste-p1`, pas `.st0`. |
| Aucun `<path>` multi-segments (plusieurs commandes `M`) animé directement | DrawSVG les rend mal — il faut les découper. |
| Pas de `<text>` dans le SVG | Le texte reste en HTML : sélectionnable, lisible par un lecteur d'écran, traduisible. |
| Pas de `transform="matrix(...)"` sur un chemin suivi par MotionPath | L'alignement devient imprévisible. Aplatir les transformations à l'export. |
| Même `viewBox` et même épaisseur de trait sur les 4 figures | La piste est **une seule ligne**. Deux épaisseurs = deux objets. |
| Passer le fichier à SVGO avant intégration | Un export brut pèse 5 à 10 fois trop. |

**Outil recommandé : Inkscape** (gratuit), export « SVG optimisé ».
⚠️ Figma et Illustrator convertissent fréquemment les contours en formes remplies à l'export. Si tu passes par eux, ouvrir le `.svg` dans un éditeur de texte et vérifier qu'on y lit bien `fill="none"` et `stroke=` avant de l'intégrer.

**Les 12 figures sont dans `src/assets/process/`** (`01-sable.svg` … `12-packaging.svg`) :
viewBox commun `0 0 400 400`, `stroke-width` 2.4, **177 éléments et 177 `id`**, aucun `<text>`,
aucune transformation matricielle, aucun remplissage, aucun chemin multi-`M`.

Deux passes faites en phase 4, à refaire sur toute nouvelle figure :

- **Nettoyage.** Chaque fichier portait un manifeste C2PA de 7 736 octets — **84 % du poids
  pour 0 trait**. Total : 109 Ko → 15,5 Ko. C'est la règle SVGO du tableau ci-dessus.
- **Préfixage des `id`.** `grain-1` est devenu `f01-grain-1`. Sans ça, `substrat` existait à la
  fois dans 07 et 09, et `die-01` dans 10 et 11 : deux éléments du même `id` dans la page, donc
  du HTML invalide et des sélecteurs `#id` qui attrapent le mauvais. Toute nouvelle figure
  prend le préfixe `fNN-`.

⚠️ **Quatre éléments sont en tirets** — `f09-caisson-1`, `f09-caisson-2`, `f11-emplacement-libere`,
`f12-puce`. Ne pas les animer avec DrawSVG : le plugin pilote `stroke-dasharray` et écraserait
les tirets. Ils sont révélés à l'opacité, et **détectés automatiquement** par la présence de
l'attribut `stroke-dasharray` (`lib/procede.ts`) — pas par une liste d'`id` à tenir à jour.
Une nouvelle figure en tirets est donc prise en charge toute seule.

Reste à produire : le fond « fab en construction » du bloc 12, qui n'est pas une étape de procédé.

---

## 9. Accessibilité — plancher non négociable

Même en mode « effet maximal », ces quatre points ne se négocient pas :

1. **`prefers-reduced-motion`** respecté. Le hook `usePrefersReducedMotion` conditionne tout : en mode réduit, les animations deviennent des changements d'état instantanés, le contenu reste intégralement accessible.
2. **Navigation clavier** : ⇥ atteint tout, le focus est visible (pas de `outline: none` sans remplacement), et le focus doit faire défiler le rail jusqu'à l'élément ciblé. Le passage au détail d'un projet (bloc 11) doit répondre au clavier exactement comme au clic.
3. **Contraste** : 4,5:1 minimum sur le texte courant (WCAG AA). Avec la palette du §10 on est à 19:1 — la marge existe, il n'y a aucune raison de la dépenser.
4. **Le contenu existe sans JavaScript animé** : si GSAP échoue à charger, on doit toujours pouvoir lire le parcours et les projets.

---

## 10. Identité visuelle

Décidée en phase 0. **Fond quasi-blanc, une seule ligne noire qui suit le scroll.**
Justification dans le sujet : un photomasque, c'est du chrome noir sur une plaque de quartz transparente. Ce n'est pas du minimalisme gratuit — c'est l'objet qui sert à graver la puce.

```css
@theme {
  --color-ground:   #FAFAF8;  /* quartz — le fond */
  --color-ground-2: #F2F2EE;  /* même fond, en retrait */
  --color-ink:      #111110;  /* chrome — la piste et le texte */
  --color-ink-soft: #6A6A63;  /* texte secondaire */
  --color-rule:     #DCDCD5;  /* filets, séparateurs */
  --color-litho:    #E8B923;  /* jaune salle blanche — accent unique, rationné */

  --font-display: "Chakra Petch", sans-serif;
  --font-mono:    "IBM Plex Mono", monospace;
}
```

Ne pas utiliser `#000000` sur `#FFFFFF` purs : même effet, mais agressif en grande surface sur écran lumineux.

Contrastes **mesurés** (WCAG 2.1, calcul sur la luminance relative — pas estimés) :

| Usage | Paire | Ratio | Seuil | |
|---|---|---|---|---|
| Texte courant | `ink` sur `ground` | **18,08:1** | 4,5 | OK |
| Texte sur fond en retrait | `ink` sur `ground-2` | 16,83:1 | 4,5 | OK |
| Texte secondaire | `ink-soft` sur `ground` | 5,21:1 | 4,5 | OK |
| Texte secondaire en retrait | `ink-soft` sur `ground-2` | 4,85:1 | 4,5 | OK, sans marge |
| Texte sur pastille accent | `ink` sur `litho` | 10,25:1 | 4,5 | OK |
| Accent utilisé comme texte | `litho` sur `ground` | 1,76:1 | 4,5 | **ÉCHOUE** |

Trois conséquences, mesurées et non négociables :

1. **`--color-litho` ne porte jamais de texte.** Il ne sert que de fond de pastille, avec `--color-ink` par-dessus (10,25:1). Sur le fond clair il tombe à 1,76:1, soit quatre fois moins que le minimum.
2. **`--color-rule` est purement décoratif** — 1,32:1 sur le fond. Tout trait qui porte du sens (la piste, un contour de figure de procédé, une bordure de champ de saisie) prend `--color-ink`. Jamais `--color-rule`.
3. `ink-soft` sur `ground-2` passe à 4,85:1, donc **sans marge**. Si `ground-2` est un jour assombri, revérifier cette paire avant toute autre.

**Le jaune est l'accent unique et il est rationné.** Il vient de l'éclairage anti-UV des salles de photolithographie. Il ne sert qu'à marquer le moment fort d'une page. Jamais pour du texte courant sur fond clair : le contraste ne passe pas.

### Échelle typographique — figée en phase 0

Six tailles, deux familles, deux graisses par famille.

```css
@theme {
  --text-mono:    0.75rem;    /* 12 px — reperes, unites, libelles d'etape (IBM Plex Mono) */
  --text-small:   0.875rem;   /* 14 px — legendes, notes */
  --text-body:    1.0625rem;  /* 17 px — corps de texte */
  --text-lead:    1.375rem;   /* 22 px — chapo, entree de bloc */
  --text-title:   2rem;       /* 32 px — titre de bloc */
  --text-display: clamp(2.75rem, 6vw, 4.5rem); /* 44 -> 72 px — titre de page */
}
```

| Niveau | Famille | Graisse | Interlignage | Approche | Mesure max |
|---|---|---|---|---|---|
| `mono` | IBM Plex Mono | 500 | 1,4 | +0,08 em, capitales | — |
| `small` | Chakra Petch | 400 | 1,5 | 0 | 60 caractères |
| `body` | Chakra Petch | 400 | 1,6 | 0 | 65 caractères |
| `lead` | Chakra Petch | 400 | 1,4 | 0 | 45 caractères |
| `title` | Chakra Petch | 700 | 1,15 | −0,01 em | `text-wrap: balance` |
| `display` | Chakra Petch | 700 | 1,02 | −0,02 em | `text-wrap: balance` |

Les écarts s'élargissent vers le haut de l'échelle (×1,17 puis ×1,21, ×1,29, ×1,45). C'est voulu : en petit, l'œil distingue des écarts fins ; en grand, il faut des sauts francs pour que deux niveaux ne se confondent pas.

**Quatre fichiers de police, pas un de plus :** Chakra Petch 400 et 700, IBM Plex Mono 400 et 500. Si un niveau semble manquer, on ajuste l'échelle — on n'ajoute pas une graisse.

**Une limite à connaître :** Chakra Petch est une police d'affichage. Elle tient en corps de texte sur des blocs courts, ce que le format impose de toute façon (3 blocs par page). Si un bloc dépasse ~5 lignes en `body`, le problème est le contenu, pas la police.

**Pièges à éviter :**
- Pas de libellé en MAJUSCULES espacées au-dessus de chaque titre.
- Pas de `→` collé à la fin des libellés de bouton.
- Pas de gris improvisé : les gris viennent de la palette, ils ont une légère dominante chaude assumée.
- Ne pas ajouter une deuxième couleur « parce que c'est triste ». Une ligne noire sur du blanc, c'est le sujet.
- Le style « semi-conducteur » vient de la **justesse du procédé** — l'ordre des étapes, les vraies unités et sigles (9N, CMP, EWS, SiO₂) — pas d'un effet néon ni d'un dégradé posé par-dessus.

---

## 11. Conventions de code

- TypeScript **strict**. Pas de `any`. Pas de `@ts-ignore` sans commentaire expliquant pourquoi.
- Composants en PascalCase, un composant par fichier, export nommé.
- Alias d'import `@/` → `src/`.
- Pas de `console.log` en commit (le lint le bloque).
- Commits en français, format `type: description` (`feat:`, `fix:`, `perf:`, `refactor:`, `docs:`).
- Une branche par phase de la ROADMAP.

---

## 12. Comment je veux que tu travailles avec moi

Je suis en **BUT GEII (bac+1)**, je viens de Bac Pro CIEL. Je suis à l'aise en électronique et en embarqué (C/C++, Arduino/ESP32, I2C/SPI/UART), moins en animation web avancée.

- **Réponds toujours en français.**
- **Explique le code bloc par bloc.** Je ne veux pas de fichier livré sans comprendre ce qu'il fait — c'est le but du projet.
- Utilise des **schémas ASCII, tableaux et analogies électroniques** quand c'est utile. Une timeline GSAP ressemble à un chronogramme : sers-t'en.
- Vocabulaire simplifié mais **techniquement exact**. Ne dis pas « ça bouge », dis « on translate le conteneur de -66,7 % sur l'axe X ».
- **Une étape à la fois.** Ne code pas trois phases d'avance. Termine, fais-moi valider, passe à la suite.
- Si je propose quelque chose qui va casser la perf, l'accessibilité ou la cohérence du concept, **dis-le-moi franchement** avant de le coder.
- Si je me trompe sur le procédé de fabrication, **corrige-moi**. Le public visé connaît le flot : une étape dans le mauvais ordre se voit.
- Si une info te manque (une mesure, un choix de contenu), **pose la question** au lieu d'inventer.

---

## 13. Definition of done — une tâche n'est finie que si

- [ ] `npm run check` passe
- [ ] testé en `npm run preview` (build), pas seulement en dev
- [ ] testé au clavier seul
- [ ] testé avec « réduire les animations » activé dans l'OS
- [ ] testé en redimensionnant la fenêtre pendant une animation
- [ ] aucun `markers: true`, aucun `console.log`
- [ ] 60 fps tenus dans l'onglet Performance de DevTools
- [ ] je comprends chaque ligne du code livré
