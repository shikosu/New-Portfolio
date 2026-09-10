# CLAUDE.md — Portfolio Irchi (refonte 2026)

> Fichier lu automatiquement par Claude Code à chaque session.
> Il fixe le contexte, les règles et les garde-fous. Le modifier = changer le comportement de Claude sur tout le projet.

---

## 1. Le projet en trois phrases

Portfolio personnel de Téo Vidal (marque **Irchi**), étudiant BUT GEII visant l'industrie du semi-conducteur.
Concept : **la navigation est un circuit imprimé qui se route**. On avance de gauche à droite ; les blocs de contenu sont des composants qui se relient par des pistes de cuivre qui se tracent au scroll. Une flèche en fin de rail fait continuer la piste vers la page suivante (Parcours → Projets → Compétences → Contact).
Objectif : impressionner un recruteur technique (électronique / embarqué / semi-conducteur), pas un directeur artistique.

**Priorité assumée : effet visuel maximal.** Le poids et le nombre de requêtes passent après la qualité de l'animation — mais jamais avant l'accessibilité et la fluidité (voir §6).

---

## 2. Stack figée

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

**3D (React Three Fiber) :** interdite tant que la phase 5 de la ROADMAP n'est pas terminée. C'est le piège classique qui fait exploser un portfolio.

---

## 3. Commandes

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

## 4. Architecture des dossiers

```
src/
├── main.tsx                 # point d'entrée
├── App.tsx                  # routes + providers
├── styles/
│   ├── index.css            # @import "tailwindcss" + @theme (tokens)
│   └── fonts.css
├── lib/
│   ├── gsap.ts              # ⚠️ SEUL endroit où on fait registerPlugin()
│   ├── lenis.ts             # instance unique + synchro ScrollTrigger
│   └── motion.ts            # constantes d'animation (durées, eases) — cf. §6
├── hooks/
│   ├── useHorizontalRail.ts
│   └── usePrefersReducedMotion.ts
├── components/
│   ├── layout/              # Shell, Nav, Footer
│   ├── rail/                # le défilement horizontal
│   ├── circuit/             # pistes SVG, pastilles, électrons
│   └── ui/                  # boutons, liens, primitives
├── pages/
│   ├── Parcours.tsx
│   ├── Projets.tsx
│   ├── Competences.tsx
│   └── Contact.tsx
├── content/                 # ⚠️ données séparées du rendu
│   ├── parcours.ts
│   └── projets.ts
└── assets/
    └── circuits/            # SVG exportés de KiCad
```

**Règle du `content/` :** aucun texte de contenu en dur dans un composant. Tout passe par un tableau typé dans `content/`. Ça me permet de changer le contenu sans toucher aux animations.

---

## 5. Règles GSAP en React — non négociables

### 5.1 Un seul point d'enregistrement des plugins

```ts
// src/lib/gsap.ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
```

Partout ailleurs : `import { gsap } from "@/lib/gsap"`. Jamais `import { gsap } from "gsap"` dans un composant.

### 5.2 Toujours `useGSAP`, jamais `useEffect`

```tsx
useGSAP(() => {
  gsap.to(".piste", { drawSVG: "100%" });
}, { scope: container, dependencies: [] });
```

`useGSAP` crée un contexte et révoque automatiquement toutes les animations au démontage. Avec `useEffect`, en StrictMode, tout se crée deux fois → animations fantômes et ScrollTriggers dupliqués.

Le `scope` (une ref sur le conteneur) limite les sélecteurs à ce composant. Sans lui, `".piste"` attrape les pistes des autres pages.

### 5.3 ScrollTrigger : les pièges à connaître

- Après tout changement de mise en page (chargement d'image, police, ouverture d'accordéon) → `ScrollTrigger.refresh()`.
- `invalidateOnRefresh: true` dès qu'un `end` est calculé à partir d'une largeur.
- Toujours écrire `end: () => "+=" + el.offsetWidth` (fonction) et pas une valeur figée : sinon le redimensionnement casse tout.
- En développement, `markers: true` est autorisé. **Aucun `markers` ne doit survivre à un commit.**

### 5.4 Dans un défilement horizontal (`containerAnimation`)

Les mots-clés de position changent : `start: "left center"` et non `"top center"`. C'est la source d'erreur n°1 sur ce type de site.

### 5.5 Lenis + ScrollTrigger

Une seule instance de Lenis, créée dans `lib/lenis.ts`, avec la synchro obligatoire :

```ts
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

Sans ça, ScrollTrigger lit la position native du navigateur pendant que Lenis affiche une position lissée : tout se déclenche au mauvais moment.

---

## 6. Règles d'animation — le barème « cher vs cheap »

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
```

**Interdits stricts :**
- Toute durée > 1,2 s (hors boucle décorative infinie).
- `ease: "elastic"` ou `"bounce"` — sauf demande explicite de ma part.
- Animer `width`, `height`, `top`, `left`, `margin`. **Uniquement `transform` et `opacity`.** Exception tolérée : `stroke-dashoffset` (c'est le mécanisme même de DrawSVG) et `filter` sur un élément isolé.
- `box-shadow` animé. Pour la lueur des pistes → filtre SVG `feGaussianBlur` sur un calque dupliqué.
- Un `ease` autre que `none` sur une animation en `scrub` : ça désynchronise de la molette et c'est immédiatement perçu comme amateur.
- Les entrées « fondu + glissement vers le haut » sur chaque section. C'est le défaut générique. Le mouvement doit venir du concept circuit (un signal qui se propage), pas d'un préréglage.

**Règle de restraint :** un seul moment spectaculaire par page. Si une page a trois effets « waouh », elle n'en a aucun.

---

## 7. Accessibilité — plancher non négociable

Même en mode « effet maximal », ces quatre points ne se négocient pas :

1. **`prefers-reduced-motion`** respecté. Le hook `usePrefersReducedMotion` conditionne tout : en mode réduit, les animations deviennent des changements d'état instantanés, le contenu reste intégralement accessible.
2. **Navigation clavier** : ⇥ atteint tout, le focus est visible (pas de `outline: none` sans remplacement), et le focus doit faire défiler le rail jusqu'à l'élément ciblé.
3. **Contraste** : 4,5:1 minimum sur le texte courant (WCAG AA). Le cuivre sur vert foncé passe tout juste — à vérifier, pas à supposer.
4. **Le contenu existe sans JavaScript animé** : si GSAP échoue à charger, on doit toujours pouvoir lire le parcours et les projets.

---

## 8. Identité visuelle

Point de départ, ancré dans le sujet (matériaux réels d'un PCB). À challenger en phase 0, pas à appliquer aveuglément.

```css
@theme {
  --color-mask:    #0B2E23;  /* vernis épargne vert foncé */
  --color-mask-2:  #123A2C;  /* même vernis, éclairé */
  --color-copper:  #B87333;  /* cuivre nu */
  --color-enig:    #D4AF6A;  /* finition or ENIG — accent */
  --color-silk:    #E8EDE9;  /* sérigraphie blanche — texte */
  --color-fr4:     #C9A96B;  /* substrat FR-4 nu */

  --font-display: "Chakra Petch", sans-serif;
  --font-mono:    "IBM Plex Mono", monospace;
}
```

**Typographie :** deux familles maximum. Chakra Petch pour les titres (elle a un côté technique/coupé qui colle), IBM Plex Mono pour les données, références et libellés de composants.

**Pièges à éviter :**
- Pas de libellé en MAJUSCULES espacées au-dessus de chaque titre.
- Pas de `→` collé à la fin des libellés de bouton.
- Pas de fond noir + un seul accent vert acide : c'est le préréglage « site tech » que tout le monde produit.
- Le style « composant électronique » doit venir de la **structure** (repères de désignation R1/C4/U2, pastilles, traversées, sérigraphie) et pas d'un filtre néon posé par-dessus.

---

## 9. Conventions de code

- TypeScript **strict**. Pas de `any`. Pas de `@ts-ignore` sans commentaire expliquant pourquoi.
- Composants en PascalCase, un composant par fichier, export nommé.
- Alias d'import `@/` → `src/`.
- Pas de `console.log` en commit (le lint le bloque).
- Commits en français, format `type: description` (`feat:`, `fix:`, `perf:`, `refactor:`, `docs:`).
- Une branche par phase de la ROADMAP.

---

## 10. Comment je veux que tu travailles avec moi

Je suis en **BUT GEII (bac+1)**, je viens de Bac Pro CIEL. Je suis à l'aise en électronique et en embarqué (C/C++, Arduino/ESP32, I2C/SPI/UART), moins en animation web avancée.

- **Réponds toujours en français.**
- **Explique le code bloc par bloc.** Je ne veux pas de fichier livré sans comprendre ce qu'il fait — c'est le but du projet.
- Utilise des **schémas ASCII, tableaux et analogies électroniques** quand c'est utile. Une timeline GSAP ressemble à un chronogramme : sers-t'en.
- Vocabulaire simplifié mais **techniquement exact**. Ne dis pas « ça bouge », dis « on translate le conteneur de -300 % sur l'axe X ».
- **Une étape à la fois.** Ne code pas trois phases d'avance. Termine, fais-moi valider, passe à la suite.
- Si je propose quelque chose qui va casser la perf ou l'accessibilité, **dis-le-moi franchement** avant de le coder.
- Si une info te manque (une mesure, un choix de contenu), **pose la question** au lieu d'inventer.

---

## 11. Definition of done — une tâche n'est finie que si

- [ ] `npm run check` passe
- [ ] testé en `npm run preview` (build), pas seulement en dev
- [ ] testé au clavier seul
- [ ] testé avec « réduire les animations » activé dans l'OS
- [ ] testé en redimensionnant la fenêtre pendant une animation
- [ ] aucun `markers: true`, aucun `console.log`
- [ ] 60 fps tenus dans l'onglet Performance de DevTools
- [ ] je comprends chaque ligne du code livré
