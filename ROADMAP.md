# ROADMAP — Portfolio Irchi v4

**Règle du jeu :** une phase ne se termine pas parce qu'elle « a l'air finie ». Elle se termine quand **tous** les critères de sortie sont cochés. Pas de phase entamée avant que la précédente ne soit close.

Durées indicatives pour un rythme d'étudiant (≈ 6-8 h/semaine hors cours).

```
P0 ──► P1 ──► P2 ──► P3 ──► P4 ──► P5 ──► P6 ──► P7
Cadrage Proto  Socle  Rail  Piste  Transi Contenu Qualité
                             ▲                       │
                             └── la boucle de reprise ┘
```

---

## Phase 0 — Cadrage · ~1 semaine

Aucune ligne de code. C'est la phase que tout le monde saute et qui coûte trois semaines plus tard.

- [x] **Storyboard** : 12 vignettes (minimum 8). Pour chaque écran : ce qui entre, ce qui sort, dans quel sens, déclenché par quoi. → artefact « Du sable à la puce ».
- [x] **Nombre d'étapes décidé** : 4 pages × 3 blocs. Course de scroll de 200vw par rail, dans le budget.
- [x] **Arbre des pages figé** : Présentation → Objectifs → Expérience → Projets. Compétences = bloc dopage, Contact = bloc packaging.
- [x] **Palette validée** : 6 valeurs hex, contrastes **mesurés** et consignés au §10 du CLAUDE.md (texte courant 18,08:1 ; l'accent jaune échoue en texte et est donc réservé aux pastilles).
- [x] **Échelle typographique posée** : 6 tailles, 2 familles, 4 fichiers de police. §10 du CLAUDE.md.
- [x] **Les figures de procédé dessinées** : 12 SVG dans `assets/process/`. ⚠️ KiCad n'est plus l'outil — ce ne sont pas des pistes de PCB mais des schémas de procédé (voir §8 du CLAUDE.md).
- [x] **Carte contenu ↔ étape figée** : les 12 blocs ont chacun leur message, son mécanisme d'apparition et la liste de ce qui reste à écrire. → `CONTENU.md`. Deux corrections au passage : l'ordre four/purification rétabli en page 1, et la photolithographie réintroduite comme ★ de la page 3 (elle avait été remplacée par un second polissage).

**Critères de sortie**
- [ ] Je peux décrire à voix haute le parcours complet d'un visiteur, écran par écran, sans hésiter. ← **le seul restant de la phase 0, et il n'appartient qu'à moi**
- [x] Les 12 fichiers SVG existent et sont conformes au §8 (148 éléments, 148 `id`, aucun texte, aucun remplissage).

---

## Phase 1 — Prototype jetable · ~4 jours

**En vanilla, sur CodePen, sans React.** Objectif : comprendre la mécanique avant de la structurer. Tout ce code sera **supprimé**.

- [x] 3 rectangles qui défilent horizontalement au scroll molette (`pin` + `xPercent`) → `proto/rail.html`
- [x] Un trait SVG qui se dessine pendant ce défilement (`containerAnimation` + `drawSVG`) — deux variantes, commutables par la constante `VARIANTE`
- [x] Un point lumineux qui suit ce trait (`MotionPath`)
- [x] Faire varier `scrub: true` / `scrub: 1` / `scrub: 2` et **sentir** la différence
      → **`scrub: 0.3` retenu** (2026-09-10). `true` est sec, `1` commence à flotter.
      → banc d'essai `proto/scrub-lab.html` : les réglages se commutent à chaud, et le pupitre
      sépare les trois progressions (molette → après scrub → après ease). Le retard n'est plus
      ressenti, il est chiffré en pixels.

**Critères de sortie**
- [x] Je sais expliquer ce que fait `containerAnimation` sans relire la doc.
- [x] Je sais pourquoi `ease: "none"` est obligatoire sur un `scrub`. ← confirmé au banc :
      bascule `ease` sur `power2.inOut`, laisse le scrub finir de rattraper, et lis les lignes 2 et 3.
      Elles ne sont plus égales : le temps de l'animation est à jour mais la position à l'écran est
      en retard. Mesuré au banc : molette 27,3 % → position réelle 8,2 %, soit 491 px d'écart **à l'arrêt**.
- [x] Le prototype tourne à 60 fps sur mon écran. ← **mesuré : 60 fps, pire image 17 ms.** Sous le seuil de 20 ms.
      Vert ≥ 55 fps et pire image ≤ 20 ms. À contre-vérifier une fois dans l'onglet Performance.

> ⚠️ Ne pas essayer de faire beau ici. Des rectangles gris suffisent. Si tu commences à styler, tu ne jetteras pas le proto, et il polluera le projet final.

---

## Phase 2 — Socle technique · ~3 jours

- [x] Projet créé, toutes les dépendances de SETUP.md installées
- [x] `npm run check` passe au vert
- [x] Arborescence `src/` en place (dossiers vides acceptés)
- [x] `lib/gsap.ts` : enregistrement centralisé des plugins
- [x] `lib/lenis.ts` : instance unique + synchro `ScrollTrigger.update`
- [x] `lib/motion.ts` : constantes `DUR` / `EASE` / `STAGGER`
- [x] `hooks/usePrefersReducedMotion.ts` fonctionnel
- [x] Routes vides mais navigables
- [x] Git initialisé, `.gitignore` correct, premier commit
- [x] Déploiement automatique branché — **auto-hébergé sur le Raspberry Pi**, pas chez un hébergeur.
      Chaîne écrite et prête : `Dockerfile` (arm64 sans émulation), `deploy/nginx.conf`,
      `.github/workflows/deploiement.yml` (GHCR), `deploy/docker-compose.pi.yml` (+ Watchtower).
      **En ligne depuis le 2026-09-11 sur `v4.teovidal.eu`.** Dépôt `shikosu/New-Portfolio`,
      image `ghcr.io/shikosu/new-portfolio`, workflow vert en 57 s (preuve que le build n'est
      pas émulé). Accès direct à `/experience` vérifié depuis l'extérieur : le `try_files`
      de Nginx répond correctement.
- [ ] **Dernier contrôle, pas encore fait** : vérifier que Watchtower déploie bien tout seul.
      Modifier un texte, pousser, ne toucher à rien, et regarder si le changement arrive
      (~1 min pour Actions, jusqu'à 5 min pour Watchtower).

**Critères de sortie**
✅ Une URL publique affiche 4 pages blanches navigables. → cible : `v4.teovidal.eu`.
`teovidal.eu` continue de servir l'ancien portfolio ; la bascule est prévue fin de phase 5.
✅ Le scroll est lissé par Lenis sur toutes les pages.
✅ Le test du carré cuivré (§8 de SETUP.md) fonctionne.

> Déployer **maintenant**, pas à la fin. Un déploiement branché dès le jour 3 t'évite de découvrir en semaine 8 que ton build casse en production.

---

## Phase 3 — Le rail horizontal · ~1 semaine

C'est le squelette de navigation de tout le site.

- [x] Composant `<Rail>` réutilisable : reçoit des enfants, les fait défiler horizontalement
- [x] Hook `useHorizontalRail` : gère le `pin`, le `scrub`, le recalcul au redimensionnement
- [x] `invalidateOnRefresh: true` et `end` calculé par fonction
- [x] Indicateur de progression : compteur mono `01 / 03` + filet dont la portion encrée
      avance en `scaleX`. Écrit directement dans le DOM par `quickSetter`, **sans state
      React** — 60 rendus React par seconde feraient tomber le site sous les 60 fps.
- [x] Comportement mobile décidé et implémenté → **pile verticale sous 768 px**, consigné
      au §2 du CLAUDE.md.
- [x] Mode « animations réduites » : le rail devient une liste verticale classique

**Critères de sortie**
- [x] Redimensionner la fenêtre en plein défilement ne casse rien. ← vérifié au banc : passage
      1440 → 1000 px **pendant** le scrub, la piste est re-mesurée (3000 = 3 × 1000) et le rail
      finit quand même pile à −2000 px. Aucune erreur JS.
- [x] ⇥ au clavier fait défiler le rail jusqu'à l'élément ciblé. ← vérifié : le focus atteint
      le 3ᵉ panneau, le rail défile à −2560 px, `scrollLeft` du conteneur reste à 0 (c'est la
      tentative du navigateur qu'on annule), le contour de focus est visible.
- [x] Le tracé arrive **exactement** à 100 %. ← mesuré : translation finale −2560 px pour une
      largeur de 1280 px et 3 panneaux, soit −(N−1) × largeur au pixel près ; le bord droit du
      dernier panneau tombe sur 1280 = bord de l'écran.
- [ ] 60 fps tenus sur toute la longueur du rail. ← **à mesurer par moi** dans l'onglet
      Performance, sur le build (`npm run preview`), pas en dev.
- [ ] Testé sur un vrai téléphone, pas seulement dans l'émulateur DevTools. ← **à faire par moi.**
      Le banc confirme la pile verticale en 390 × 844 (aucune translation, indicateur masqué),
      mais un émulateur ne dit rien du confort au doigt.

> **Banc de vérification de la phase 3** : 23 contrôles automatisés dans un navigateur réel
> (bureau 1280, redimensionnement à chaud, mobile 390, `prefers-reduced-motion`, clavier).
> Tous au vert le 2026-09-22. Ils mesurent la mécanique, pas le ressenti — d'où les deux
> critères ci-dessus qui restent manuels.

> **Le mobile, décision à prendre ici et pas plus tard.** Un défilement horizontal détourné est souvent pénible au doigt. Deux options honnêtes : (a) sur < 768 px, le rail devient une pile verticale et le circuit se trace de haut en bas ; (b) le rail devient un carrousel à balayage natif. Choisis, écris-le dans CLAUDE.md, et tiens-t'y.

---

## Phase 4 — La piste et les figures · ~1,5 semaine

L'effet signature. C'est ici que le site devient le tien.

> ⚠️ **Phase réécrite le 2026-09-22.** La version d'origine demandait une lueur
> `feGaussianBlur`, des électrons lumineux en boucle, des nœuds qui s'allument et des repères
> `R1, C4, U2`. C'était un reste du concept **circuit imprimé abandonné en phase 0**, et ça
> contredisait le §10 du CLAUDE.md (« pas d'effet néon ni de dégradé posé par-dessus ») ainsi
> que le §7 (« un seul moment spectaculaire par page »). R1/C4/U2 sont des désignations de
> composants, pas des étapes de procédé.

### 4a — Le socle *(fait)*

- [x] Les 12 figures nettoyées et intégrées via `vite-plugin-svgr` (`?react` → composant React,
      donc SVG **inline** : une `<img>` ne laisserait pas atteindre les `<path>`).
      109 Ko → 15,5 Ko, `id` préfixés `fNN-`. Détail au §8 du CLAUDE.md.
- [x] **La piste** : une droite générée en code, `viewBox` en pixels, remesurée à chaque
      redimensionnement. Pilotée par la progression du rail, pas par un ScrollTrigger à elle
      (voir le piège n°1 du §6.4).
- [x] Sa pointe est un **front** : milieu de l'écran à l'entrée du rail → bord droit exactement
      à la fin. C'est ce qui prépare la sortie par la droite de la phase 5.
- [x] Révélation des figures au passage du front : `containerAnimation` + `start: "left center"`,
      DrawSVG, cascade bornée à `DUR.base` par `stagger.amount`.
- [x] Les 4 éléments en tirets révélés à l'opacité, détectés automatiquement.

### 4b — Les mécanismes propres à chaque bloc *(reste à faire)*

C'est le gros du travail, et il est déjà spécifié : **`CONTENU.md` donne, bloc par bloc, le
mécanisme d'apparition**. Aucun n'est à inventer.

- [ ] Les 12 mécanismes, un par un, validés un par un. Rappel de quelques-uns :
      01 le nom se compose **par sédimentation** (interdit : fondu + glissement) ·
      02 l'arc **s'amorce**, allumage franc en `EASE.strong` ·
      03 les impuretés partent **une par une** (`STAGGER`), compteur `98 %` → `9N` en HTML ·
      04 le lingot **monte** — seul mouvement vertical du site (§7) ·
      07 le texte est **insolé** par `clip-path`, jamais par `opacity` (§7) ·
      08 la gravure **retire** de la matière, seule animation soustractive du site.
- [ ] **Un seul ★ par page.** Les 8 blocs non-★ restent sobres : ils apparaissent, ils ne se
      donnent pas en spectacle.
- [ ] **Le tracé vertical en mobile.** Sous 768 px le rail est une pile (décision de phase 3) :
      la piste doit s'y tracer de haut en bas. Elle est actuellement masquée.
- [ ] La figure « fab en construction » du bloc 12 — **à dessiner par toi**, Inkscape, §8.

**Critères de sortie**
- [x] Le tracé arrive **exactement** à 100 % en fin de rail, pas à 92 %. ← mesuré : pointe à
      1280 px sur un écran de 1280 px, et 3840/3840 de longueur tracée. Idem après un
      redimensionnement 1440 → 1000 px en plein défilement.
- [x] Les figures sont bien des contours (`fill="none"` + `stroke`), pas des formes remplies.
- [x] Aucun `<path>` multi-segments (plusieurs commandes `M`) animé directement.
- [x] Les éléments en tirets ne passent pas par DrawSVG.
- [x] Le contenu survit sans animation : en mode « animations réduites », les 12 figures sont
      intégralement visibles et aucune n'est masquée par un état de départ.
- [ ] Vérifié sur **Firefox** — la longueur des `<path>` y est parfois mal calculée ; le
      contournement documenté est de viser 102 % au lieu de 100 %. ← à faire par toi.
- [ ] Vérifié sur **Safari**. ← à faire par toi.

> **Banc de vérification de la phase 4** : 18 contrôles automatisés (géométrie de la piste,
> position du front au repos et en fin de rail, redimensionnement, révélation des figures,
> éléments en tirets, mode réduit, mobile). Tous au vert le 2026-09-22, sur Chromium
> uniquement — d'où les deux lignes Firefox/Safari ci-dessus.

## Phase 5 — Transitions de page · ~1 semaine

- [ ] La piste sort par le bord droit de la page A et entre par le bord gauche de la page B
- [ ] Le fond et la navigation persistent (seul le contenu est remplacé)
- [ ] Durée ≤ 1,1 s, plafond absolu
- [ ] Préchargement de la page suivante au survol de la flèche
- [ ] Retour navigateur (bouton précédent) géré proprement
- [ ] Mode « animations réduites » : bascule instantanée, aucune transition

**Critères de sortie**
✅ Aucun clignotement blanc entre deux pages.
✅ Aller-retour 10 fois d'affilée entre deux pages : aucune fuite mémoire, aucun ScrollTrigger orphelin (`ScrollTrigger.getAll().length` reste stable dans la console).
✅ L'URL change et une page rechargée directement s'affiche correctement.

---

## Phase 6 — Contenu réel · ~1 semaine

> Le squelette est déjà écrit dans **`CONTENU.md`** (phase 0). Cette phase consiste à remplir
> les entrées marquées « ⧖ à fournir » et à les basculer dans `src/content/*.ts` — pas à
> réinventer la structure.

- [ ] `content/parcours.ts` : chaque étape rédigée, datée, avec ce que j'y ai appris
- [ ] `content/projets.ts` : 4 à 6 projets max. Pour chacun : le problème, la solution technique, ce qui a été difficile, le résultat
- [ ] Compétences : par niveau réel de maîtrise, pas de barres de pourcentage inventées
- [ ] Contact : e-mail, GitHub, LinkedIn, CV en PDF
- [ ] Images de projets optimisées (WebP ou AVIF, dimensions correctes, `loading="lazy"`)
- [ ] Métadonnées : `<title>`, description, image Open Graph
- [ ] **Décider du rendu sans JavaScript.** Constaté en phase 2 : la page brute servie par
      Nginx ne contient que les `<meta>` et un `<div id="root">` vide — tout le contenu est
      fabriqué par React côté navigateur. Le §9.4 du CLAUDE.md n'exige que la survie *sans
      animation*, donc ce n'est pas une violation ; mais pour le SEO ≥ 95 visé ici, il faudra
      soit se contenter des métadonnées (Google exécute le JS), soit pré-générer le HTML des
      4 pages au build (`vite-plugin-prerender` ou équivalent). À trancher ici, pas avant.

**Critères de sortie**
✅ Zéro Lorem ipsum dans le dépôt.
✅ Chaque projet répond à « qu'est-ce que ça prouve sur mes compétences ? ».
✅ Relu par quelqu'un d'autre pour l'orthographe.

> Pour un recruteur en semi-conducteur : un projet expliqué en profondeur (le TB-303, la clé USB d'authentification, le Verilog→GDSII) vaut mieux que six projets listés. Choisis la profondeur.

---

## Phase 7 — Qualité et mise en ligne · ~1 semaine

Tout le détail est dans **QUALITY.md**. Résumé des portes :

- [ ] Lighthouse : Performance ≥ 80, Accessibilité ≥ 95, Bonnes pratiques 100, SEO ≥ 95
- [ ] Audit clavier complet
- [ ] Audit `prefers-reduced-motion` complet
- [ ] Testé sur Chrome, Firefox, Safari (⚠️ Safari, pas seulement Chrome)
- [ ] Testé sur un vrai téléphone en 4G, pas en Wi-Fi
- [ ] Nom de domaine branché, HTTPS actif
- [ ] `README.md` du dépôt propre (un recruteur ira voir ton GitHub)

**Critères de sortie**
✅ Toutes les cases de QUALITY.md sont cochées.
✅ Deux personnes extérieures ont navigué sans que j'aie besoin d'expliquer quoi que ce soit.

---

## Suivi

| Phase | Démarrée | Terminée | Notes |
|---|---|---|---|
| P0 Cadrage | 2026-09-10 | 2026-09-10 | Concept réorienté : ligne de fab au lieu du circuit imprimé. CLAUDE.md §1, §2, §8, §10 réécrits. Carte contenu figée dans `CONTENU.md`. Reste le critère oral. |
| P1 Prototype | 2026-09-10 | 2026-09-10 | Close. `scrub: 0.3`, `ease: "none"`, 60 fps / pire image 17 ms. Décisions reportées au §7 du CLAUDE.md. Les deux fichiers de `proto/` sont jetables : ils meurent en phase 2. |
| P2 Socle | 2026-09-10 | 2026-09-11 | Vite 8 + React 19.2 + TS 6 strict + Tailwind v4. `npm run check` vert, test du carré validé. En ligne sur `v4.teovidal.eu` (Pi 5, Docker/GHCR/Watchtower, tunnel Cloudflare). Reste à confirmer le déploiement automatique de bout en bout. |
| P3 Rail | 2026-09-22 | | Mécanique close et vérifiée au banc (23/23). Décision mobile : pile verticale sous 768 px. Correction du §6.4 : la course se mesure en `clientWidth`, pas en `innerWidth` (barre de défilement). **Restent deux mesures manuelles : 60 fps et le vrai téléphone.** |
| P4 Piste | 2026-09-22 | | **Phase réécrite** : les items « lueur / électrons / nœuds / R1-C4-U2 » étaient des restes du concept PCB. Socle (4a) fait et vérifié au banc (18/18) : figures nettoyées 109→15,5 Ko, piste tracée en front, révélations branchées en `containerAnimation`. Reste 4b : les 12 mécanismes de CONTENU.md, le tracé vertical mobile, la figure du bloc 12. |
| P5 Transitions | | | |
| P6 Contenu | | | |
| P7 Qualité | | | |

---

## Le piège à connaître

Le plus grand risque de ce projet n'est pas technique, c'est de **ne jamais le finir**. Un portfolio animé est infiniment améliorable, donc on continue à polir au lieu de publier.

Contre-mesure : à la fin de la phase 5, le site est mis en ligne **même incomplet**. Les phases 6 et 7 se font sur un site déjà public. Un portfolio à 80 % en ligne bat un portfolio à 100 % en local.
