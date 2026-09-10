# SETUP.md — Installation du poste de travail

Ordre à suivre de haut en bas. Chaque bloc explique **pourquoi** avant le **comment**.

---

## Étape 0 — Prérequis système

| Outil | Version mini | Vérifier avec |
|---|---|---|
| Node.js | 20 LTS (22 conseillé) | `node -v` |
| npm | 10+ | `npm -v` |
| Git | 2.40+ | `git --version` |

> Si Node est trop vieux, installe **nvm** plutôt que de bricoler l'installation système :
> `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash` puis `nvm install --lts`.

---

## Étape 1 — Créer le projet

```bash
npm create vite@latest irchi-v4 -- --template react-ts
cd irchi-v4
npm install
```

Ce que ça fait : Vite génère un squelette React + TypeScript. `--template react-ts` est important — sans le `-ts`, tu n'as pas TypeScript et il faudra tout reprendre.

---

## Étape 2 — Tailwind CSS v4

⚠️ **La v4 ne s'installe plus comme la v3.** Plus de PostCSS, plus d'Autoprefixer, plus de `tailwind.config.js`. Tout passe par un plugin Vite dédié et la configuration se fait en CSS.

```bash
npm install tailwindcss @tailwindcss/vite
```

**`vite.config.ts` :**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import path from "node:path";

export default defineConfig({
  plugins: [
    react(),        // 1. compile le JSX et gère le rechargement à chaud
    tailwindcss(),  // 2. génère le CSS Tailwind à la volée
    svgr(),         // 3. permet d'importer un .svg comme composant React
  ],
  resolve: {
    // 4. alias "@" → src/ : évite les ../../../ illisibles
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

**`src/styles/index.css` :**

```css
@import "tailwindcss";

@theme {
  --color-mask:   #0B2E23;
  --color-copper: #B87333;
  --color-enig:   #D4AF6A;
  --color-silk:   #E8EDE9;

  --font-display: "Chakra Petch", sans-serif;
  --font-mono:    "IBM Plex Mono", monospace;
}
```

Le bloc `@theme` remplace l'ancien `theme.extend` du fichier de config. Chaque variable devient automatiquement une classe utilitaire : `--color-copper` te donne `bg-copper`, `text-copper`, `border-copper`.

Enfin, dans `src/main.tsx` : `import "./styles/index.css";`

---

## Étape 3 — Le moteur d'animation

```bash
npm install gsap @gsap/react
```

`gsap` contient désormais **tous** les plugins, y compris ceux qui étaient payants (DrawSVG, MorphSVG, SplitText, ScrollSmoother) : ils sont gratuits depuis avril 2025 suite au rachat par Webflow.

`@gsap/react` fournit le hook `useGSAP()`. Il n'est pas optionnel dans un projet React : il gère le nettoyage automatique des animations au démontage d'un composant.

> **Note de licence :** GSAP est gratuit, y compris pour un usage commercial, mais il n'est **pas open source**. Interdiction de décompiler le code source ou d'en tirer un produit concurrent. Pour un portfolio, aucune contrainte.

---

## Étape 4 — Scroll fluide

```bash
npm install lenis
```

Bibliothèque de moins de 4 ko, en licence MIT, développée par Darkroom Engineering. Elle gère le scroll horizontal comme le vertical et le tactile, et se synchronise avec n'importe quel moteur d'animation.

⚠️ **Point de vigilance** : Lenis intercepte l'événement de scroll et interpole une position lissée. Corollaire : il faut vérifier soi-même que la barre d'espace, les flèches et la barre de défilement fonctionnent encore. C'est un test à faire à chaque phase.

---

## Étape 5 — Le reste des dépendances

```bash
# Routage (SPA multi-pages)
npm install react-router

# Polices auto-hébergées — meilleure perf qu'un CDN, et pas de requête tierce
npm install @fontsource/chakra-petch @fontsource/ibm-plex-mono

# SVG comme composants React
npm install -D vite-plugin-svgr

# Qualité de code
npm install -D prettier eslint-config-prettier

# Analyse de la taille du bundle
npm install -D rollup-plugin-visualizer
```

---

## Étape 6 — Scripts de qualité

Dans `package.json`, remplace la section `scripts` :

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\"",
    "check": "npm run typecheck && npm run lint && npm run build",
    "analyze": "vite build && open dist/stats.html"
  }
}
```

`--max-warnings 0` : un avertissement bloque la commande. C'est volontairement sévère — c'est ce qui empêche les `console.log` et les `markers: true` de finir en production.

**`tsconfig.json`** — active le mode strict et l'alias :

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

---

## Étape 7 — Outils externes (hors npm)

| Outil | Usage sur ce projet | Où |
|---|---|---|
| **KiCad** | Router un vrai circuit, exporter la couche cuivre en SVG → c'est ton tracé animé | kicad.org |
| **Figma** | Storyboard et maquettes de la phase 0 | figma.com |
| **SVGOMG** | Nettoyer les SVG exportés (KiCad produit du code très verbeux) | jakearchibald.github.io/svgomg |
| **Extension React DevTools** | Voir les re-rendus qui tuent la perf | Chrome Web Store |
| **Lighthouse** (intégré à Chrome) | Audit perf / a11y / SEO | DevTools → onglet Lighthouse |

### Le pipeline KiCad → site

```
KiCad (routage)
      │  Fichier → Tracer → format SVG, couche F.Cu uniquement
      ▼
fichier.svg  (verbeux, ~200 ko)
      │  SVGOMG : supprimer métadonnées, arrondir les décimales à 2
      ▼
fichier.min.svg  (~15 ko)
      │  ⚠️ vérifier : fill="none" + stroke="..." sur les paths
      │     (DrawSVG anime le CONTOUR, pas le remplissage)
      ▼
src/assets/circuits/ → import Circuit from "@/assets/circuits/parcours.svg?react"
```

Le `?react` en fin d'import est la syntaxe de `vite-plugin-svgr` : il te renvoie un composant React au lieu d'une URL, ce qui te permet d'atteindre chaque `<path>` avec GSAP.

---

## Étape 8 — Vérification de l'installation

```bash
npm run dev       # doit démarrer sur http://localhost:5173
npm run typecheck # doit sortir sans erreur
npm run build     # doit produire dist/ sans erreur
```

Puis un test à 30 secondes qui valide toute la chaîne d'animation :

```tsx
// src/App.tsx — temporaire, à supprimer après
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function App() {
  const box = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(box.current, { x: 300, duration: 0.8, ease: "power2.out" });
  }, { scope: box });

  return <div ref={box} className="size-24 bg-copper" />;
}
```

Si le carré cuivré traverse l'écran : Vite, React, TypeScript, Tailwind v4, GSAP et `useGSAP` fonctionnent tous ensemble. Tu peux passer à la ROADMAP.

Si rien ne bouge, vérifie dans cet ordre : (1) `lib/gsap.ts` existe et exporte bien, (2) l'alias `@` est déclaré **à la fois** dans `vite.config.ts` et `tsconfig.json` — c'est l'oubli le plus fréquent.
