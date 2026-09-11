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
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    react(),        // 1. compile le JSX et gère le rechargement à chaud
    tailwindcss(),  // 2. génère le CSS Tailwind à la volée
    svgr(),         // 3. permet d'importer un .svg comme composant React
  ],
  resolve: {
    // 4. alias "@" → src/ : évite les ../../../ illisibles
    // ⚠️ `__dirname` n'existe PAS ici : le projet est en ESM ("type": "module")
    //    dans package.json. Utiliser import.meta.url, sinon Vite refuse de démarrer.
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
```

**`src/styles/index.css` :**

```css
@import "tailwindcss";

@theme {
  --color-ground:   #FAFAF8;  /* quartz — le fond */
  --color-ground-2: #F2F2EE;  /* meme fond, en retrait */
  --color-ink:      #111110;  /* chrome — la piste et le texte */
  --color-ink-soft: #6A6A63;  /* texte secondaire */
  --color-rule:     #DCDCD5;  /* filets — decoratif uniquement */
  --color-litho:    #E8B923;  /* jaune salle blanche — fond de pastille seul */

  --font-display: "Chakra Petch", sans-serif;
  --font-mono:    "IBM Plex Mono", monospace;
}
```

> La palette complete, avec l'echelle typographique et les contrastes mesures,
> est au §10 du CLAUDE.md. Le fichier reel du projet (`src/styles/index.css`) la
> reprend integralement.

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

> ⚠️ **Le linter est `oxlint`, pas ESLint.** Le template Vite actuel l'installe par défaut :
> même travail, écrit en Rust, quasi instantané. Ne pas installer `eslint-config-prettier`,
> il ne servirait à rien. La configuration vit dans `.oxlintrc.json`, où `no-console` et
> `no-debugger` sont passés en `error` — c'est ce qui empêche un `console.log` de finir en
> production.

```bash
# Routage (SPA multi-pages)
npm install react-router

# Polices auto-hébergées — meilleure perf qu'un CDN, et pas de requête tierce
npm install @fontsource/chakra-petch @fontsource/ibm-plex-mono

# SVG comme composants React
npm install -D vite-plugin-svgr

# Qualité de code (oxlint est déjà là, fourni par le template)
npm install -D prettier

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
    "typecheck": "tsc -b --noEmit",
    "lint": "oxlint --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\"",
    "check": "npm run typecheck && npm run lint && npm run build",
    "analyze": "vite build && open dist/stats.html"
  }
}
```

`--max-warnings 0` : un avertissement bloque la commande. C'est volontairement sévère — c'est ce qui empêche les `console.log` et les `markers: true` de finir en production.

**`tsconfig.app.json`** (et non `tsconfig.json`, qui n'est qu'un fichier de références) —
active le mode strict et l'alias :

```jsonc
{
  "compilerOptions": {
    "strict": true,          // ⚠️ ABSENT du template : à ajouter à la main
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "paths": { "@/*": ["./src/*"] }
  }
}
```

> ⚠️ **Pas de `baseUrl`.** Il est déprécié en TypeScript 6 (erreur TS5101 au build) et
> inutile depuis TS 5 : les chemins de `paths` se résolvent relativement au tsconfig.

---

## Étape 7 — Outils externes (hors npm)

| Outil | Usage sur ce projet | Où |
|---|---|---|
| **Inkscape** | Dessiner et corriger les 12 figures de procédé, export « SVG optimisé » | inkscape.org |
| **Figma** | Storyboard et maquettes de la phase 0 | figma.com |
| **SVGOMG** | Nettoyer les SVG exportés avant intégration | jakearchibald.github.io/svgomg |
| **Extension React DevTools** | Voir les re-rendus qui tuent la perf | Chrome Web Store |
| **Lighthouse** (intégré à Chrome) | Audit perf / a11y / SEO | DevTools → onglet Lighthouse |

### Le pipeline figure → site

> ⚠️ **KiCad n'a plus rien à faire ici.** Le concept « circuit imprimé » est abandonné
> (CLAUDE.md §1). Les 12 figures sont des **schémas de procédé** dessinés à la main sous
> Inkscape, pas des routages de cuivre exportés.

```
Inkscape (dessin)
      │  Fichier → Enregistrer sous → « SVG optimisé »
      ▼
figure.svg
      │  vérifier dans un éditeur de texte : fill="none" + stroke="..."
      │  ⚠️ JAMAIS « Contour en chemin » : ça transforme le trait en forme
      │     remplie et casse DrawSVG définitivement
      ▼
src/assets/process/07-photolithographie.svg
      │
      ▼
import Figure from "@/assets/process/07-photolithographie.svg?react";
```

Le `?react` en fin d'import est la syntaxe de `vite-plugin-svgr` : il renvoie un composant
React au lieu d'une URL, ce qui permet d'atteindre chaque `<path>` avec GSAP.

Les contraintes de fabrication du fichier sont au **§8 du CLAUDE.md** — notamment les trois
éléments en tirets qu'il ne faut pas animer avec DrawSVG.

## Étape 7 bis — L'avertissement `install-scripts` sur macOS

Après `npm ci`, npm signale :

```
npm warn install-scripts 1 package had install scripts blocked ... fsevents@2.3.3
```

**C'est un avertissement, pas une erreur.** Les versions récentes de npm bloquent par défaut
les scripts d'installation des paquets — du code qui s'exécuterait avec tes droits pendant
l'installation, principal vecteur des attaques sur la chaîne d'approvisionnement npm.

`fsevents` est le pont vers l'API FSEvents de macOS, que Vite utilise pour être *prévenu*
qu'un fichier a changé plutôt que d'aller le *vérifier* en boucle — une interruption au lieu
d'une scrutation.

Marche à suivre : lancer `npm run dev`, modifier un fichier, vérifier que le rechargement à
chaud fonctionne. Si oui, ignorer l'avertissement. Sinon :

```bash
npm install-scripts approve fsevents
```

Ne concerne que macOS et le développement : `fsevents` est une dépendance optionnelle
`os: darwin`, absente du runner Linux de la CI, et le build de production ne surveille
aucun fichier.

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

  return <div ref={box} className="size-24 bg-ink" />;
}
```

Si le carré noir traverse l'écran : Vite, React, TypeScript, Tailwind v4, GSAP et `useGSAP` fonctionnent tous ensemble. Tu peux passer à la ROADMAP.

Si rien ne bouge, vérifie dans cet ordre : (1) `lib/gsap.ts` existe et exporte bien, (2) l'alias `@` est déclaré **à la fois** dans `vite.config.ts` et `tsconfig.json` — c'est l'oubli le plus fréquent.
