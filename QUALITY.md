# QUALITY.md — Protocole de vérification

Un critère n'a de valeur que s'il est **mesurable**. « Ça a l'air fluide » n'est pas un critère ; « 60 fps sans image perdue sur 3 s de défilement » en est un.

Trois niveaux de contrôle :

```
┌──────────────────────────────────────────────┐
│  A. À chaque commit        (2 min)           │
│  B. À chaque fin de phase  (30 min)          │
│  C. Avant mise en ligne    (2 h)             │
└──────────────────────────────────────────────┘
```

---

# A. À chaque commit — 2 minutes

```bash
npm run check
```

Enchaîne `typecheck` → `lint` → `build`. Si l'une échoue, on ne commit pas.

**Vérification manuelle rapide :**

```bash
# Aucun marqueur de debug oublié
grep -rn "markers: *true" src/ && echo "❌ marqueurs oubliés"

# Aucun console.log
grep -rn "console\.log" src/ && echo "❌ console.log oublié"

# Aucun import direct de gsap hors lib/
grep -rn "from \"gsap\"" src/ --exclude-dir=lib && echo "❌ import gsap hors lib/"
```

> Tu peux automatiser tout ça avec un hook Git `pre-commit`, mais commence à la main : tu comprendras ce que tu automatises.

---

# B. À chaque fin de phase — 30 minutes

## B.1 Performance d'animation — le test des 60 fps

**C'est LE test qui sépare un site cher d'un site cheap.** Une animation magnifique à 30 fps est perçue comme cassée.

**Protocole :**
1. `npm run build && npm run preview` — ⚠️ **jamais en `npm run dev`**, le mode dev est 3 à 5× plus lent, la mesure ne veut rien dire.
2. DevTools → onglet **Performance** → activer le ralentissement CPU sur **4× slowdown** (simule un portable modeste)
3. Enregistrer, scroller lentement sur toute la longueur du rail, arrêter
4. Lire la bande **Frames** en haut du profil

| Résultat | Verdict |
|---|---|
| Barres vertes continues | ✅ 60 fps tenus |
| Barres jaunes ponctuelles | ⚠️ acceptable si < 5 % du temps |
| Barres rouges | ❌ à corriger avant de continuer |

**Si ça rame, chercher dans cet ordre :**

| Symptôme dans le profil | Cause probable | Correctif |
|---|---|---|
| Beaucoup de « Layout » (violet) | Tu animes `width`/`height`/`top`/`left` | Passer en `transform` |
| Beaucoup de « Paint » (vert) | `box-shadow`, `filter`, gros dégradé animé | Isoler l'élément, réduire la surface |
| Beaucoup de « Scripting » (jaune) | Trop de ScrollTriggers, ou React qui re-rend | `ScrollTrigger.getAll().length`, `React.memo` |
| Pics au redimensionnement | `refresh()` non limité | Débouncer le `resize` |

**Compteur de fps en direct :** DevTools → `Cmd/Ctrl+Shift+P` → « Show frames per second (FPS) meter ».

## B.2 Fuites de ScrollTrigger

Le bug le plus courant sur ce type de site. Dans la console, après avoir navigué 10 fois entre deux pages :

```js
ScrollTrigger.getAll().length
```

Le nombre doit **revenir à sa valeur de départ**. S'il grimpe à chaque navigation, un `useGSAP` manque son `scope` ou un composant crée ses animations hors du hook.

## B.3 Test clavier

Débranche ta souris. Vraiment.

- [ ] ⇥ parcourt tous les éléments interactifs dans un ordre logique
- [ ] Le focus est **visible** à chaque étape (pas d'`outline: none` sans remplacement)
- [ ] ⇥ sur un élément situé plus loin dans le rail y fait défiler automatiquement
- [ ] ⏎ et Espace activent les boutons
- [ ] Espace, ⇞/⇟ et les flèches font toujours défiler la page (Lenis intercepte le scroll : c'est le point à surveiller)
- [ ] Aucun piège au clavier (impossible de sortir d'une zone)

## B.4 Test « animations réduites »

**macOS** : Réglages → Accessibilité → Affichage → Réduire les animations
**Windows** : Paramètres → Accessibilité → Effets visuels → Effets d'animation
**Firefox** : `about:config` → `ui.prefersReducedMotion` = `1`

- [ ] Aucune animation automatique ne se déclenche
- [ ] **Tout le contenu reste accessible** (c'est le point critique : si le contenu n'apparaît que par animation, il devient invisible)
- [ ] La navigation entre pages fonctionne en bascule instantanée

## B.5 Test de redimensionnement

- [ ] Redimensionner la fenêtre **pendant** une animation en cours : rien ne casse
- [ ] Passer de paysage à portrait sur mobile : la mise en page se recalcule
- [ ] Zoom navigateur à 200 % : le texte reste lisible et rien ne déborde

---

# C. Avant mise en ligne — 2 heures

## C.1 Lighthouse

```bash
npm run build && npm run preview
# puis DevTools → Lighthouse → Mode : Navigation → Appareil : Mobile → Analyser
```

⚠️ **Toujours en navigation privée**, sinon les extensions faussent le score.

| Catégorie | Cible | Plancher acceptable | Commentaire |
|---|---|---|---|
| Performance | 90 | **80** | Un site très animé ne fera pas 100, c'est normal et assumé |
| Accessibilité | 100 | **95** | Aucune excuse ici |
| Bonnes pratiques | 100 | **100** | Aucune excuse non plus |
| SEO | 100 | **95** | Un recruteur doit pouvoir te trouver |

**Métriques à surveiller en priorité :**

| Métrique | Cible | Ce que ça mesure |
|---|---|---|
| LCP | < 2,5 s | Temps d'affichage du plus gros élément visible |
| CLS | < 0,1 | Le contenu qui saute pendant le chargement |
| INP | < 200 ms | Réactivité aux clics |
| TBT | < 300 ms | Temps où le fil principal est bloqué |

> **Le CLS est ton risque n°1.** Les polices auto-hébergées et les SVG sans dimensions déclarées provoquent des sauts de mise en page. Toujours `width`/`height` sur les `<img>` et `font-display: swap` sur les polices.

## C.2 Taille du bundle

```bash
npm run analyze
```

| Ressource | Budget | Note |
|---|---|---|
| JS initial (gzip) | < 200 ko | GSAP + plugins ≈ 70 ko à lui seul |
| CSS (gzip) | < 30 ko | Tailwind v4 purge automatiquement |
| Chaque image | < 200 ko | WebP ou AVIF obligatoire |
| SVG du circuit | < 40 ko | Après passage à SVGOMG |

**Si le JS dépasse :** n'importe que les plugins GSAP réellement utilisés, et charge le code des pages en `React.lazy()` par route.

## C.3 Navigateurs

| Navigateur | Obligatoire | Points de vigilance spécifiques |
|---|---|---|
| Chrome / Edge | ✅ | Ta référence de dev — donc le moins fiable pour trouver des bugs |
| **Firefox** | ✅ | ⚠️ Bug connu : la longueur totale d'un `<path>` y est parfois mal calculée, DrawSVG s'arrête un peu court. Parade officielle : viser 102 % au lieu de 100 %, ou ajouter des points d'ancrage au tracé |
| **Safari** (macOS + iOS) | ✅ | Rendu SVG et filtres différents. C'est là que 80 % des surprises apparaissent |
| Chrome Android | ✅ | Le vrai test de perf |

> Si tu n'as pas de Mac sous la main, Safari se teste gratuitement via BrowserStack en version d'essai, ou en demandant à quelqu'un de ton entourage.

## C.4 Test sur vrai matériel

- [ ] Un vrai téléphone, en **4G** et pas en Wi-Fi (DevTools → Network → « Slow 4G » en attendant)
- [ ] Un portable modeste, pas seulement ta machine de dev
- [ ] Écran non-Retina : vérifier que les traits fins SVG ne disparaissent pas

## C.5 Contenu et SEO

- [ ] `<title>` unique et parlant par page
- [ ] `<meta name="description">` par page
- [ ] Image Open Graph (1200 × 630) — c'est ce qui s'affiche quand ton lien est partagé sur LinkedIn
- [ ] `alt` renseigné sur **toutes** les images ; `alt=""` uniquement pour les images décoratives
- [ ] Un seul `<h1>` par page, hiérarchie `h1 > h2 > h3` respectée
- [ ] `lang="fr"` sur `<html>`
- [ ] `favicon` et manifeste
- [ ] Aucun lien mort (`npx linkinator https://ton-site.fr`)

## C.6 Contraste — vérification chiffrée

Le cuivre sur vert foncé est **limite**. Ne suppose pas, mesure :

DevTools → sélectionner un texte → panneau Styles → la pastille de couleur affiche le ratio de contraste directement.

| Type de texte | Ratio minimum (WCAG AA) |
|---|---|
| Texte courant (< 18 pt) | **4,5:1** |
| Grand texte (≥ 18 pt ou 14 pt gras) | **3:1** |
| Éléments d'interface, bordures | **3:1** |

Si `--color-enig` (#D4AF6A) sur `--color-mask` (#0B2E23) ne passe pas les 4,5:1, il faut éclaircir l'or pour le texte courant — et garder le ton d'origine uniquement pour les gros titres et les pistes graphiques.

---

# Fiche de contrôle finale

À imprimer ou copier dans une issue GitHub avant publication.

```
PERFORMANCE
[ ] Lighthouse Perf ≥ 80 (mobile, nav privée)
[ ] LCP < 2,5 s   [ ] CLS < 0,1   [ ] INP < 200 ms
[ ] 60 fps tenus avec CPU ralenti 4×
[ ] JS initial < 200 ko gzip

ANIMATION
[ ] Aucune durée > 1,2 s
[ ] ease "none" partout où il y a un scrub
[ ] Uniquement transform / opacity (+ stroke-dashoffset)
[ ] ScrollTrigger.getAll().length stable après 10 navigations
[ ] Aucun markers: true

ACCESSIBILITÉ
[ ] Lighthouse A11y ≥ 95
[ ] Navigation clavier complète, focus visible
[ ] prefers-reduced-motion respecté, contenu toujours accessible
[ ] Contrastes ≥ 4,5:1 sur le texte courant
[ ] Zoom 200 % sans débordement

COMPATIBILITÉ
[ ] Chrome  [ ] Firefox (bug DrawSVG vérifié)  [ ] Safari  [ ] Android
[ ] Vrai téléphone en 4G
[ ] Redimensionnement pendant animation

CONTENU
[ ] Zéro Lorem ipsum
[ ] Tous les alt renseignés
[ ] Métadonnées + image Open Graph
[ ] Aucun lien mort
[ ] Orthographe relue par une autre personne

CODE
[ ] npm run check au vert
[ ] Aucun any, aucun ts-ignore non justifié
[ ] README du dépôt propre
```
