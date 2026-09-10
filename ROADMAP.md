# ROADMAP — Portfolio Irchi v4

**Règle du jeu :** une phase ne se termine pas parce qu'elle « a l'air finie ». Elle se termine quand **tous** les critères de sortie sont cochés. Pas de phase entamée avant que la précédente ne soit close.

Durées indicatives pour un rythme d'étudiant (≈ 6-8 h/semaine hors cours).

```
P0 ──► P1 ──► P2 ──► P3 ──► P4 ──► P5 ──► P6 ──► P7
Cadrage Proto  Socle  Rail  Circuit Transi Contenu Qualité
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

- [ ] Projet créé, toutes les dépendances de SETUP.md installées
- [ ] `npm run check` passe au vert
- [ ] Arborescence `src/` en place (dossiers vides acceptés)
- [ ] `lib/gsap.ts` : enregistrement centralisé des plugins
- [ ] `lib/lenis.ts` : instance unique + synchro `ScrollTrigger.update`
- [ ] `lib/motion.ts` : constantes `DUR` / `EASE` / `STAGGER`
- [ ] `hooks/usePrefersReducedMotion.ts` fonctionnel
- [ ] Routes vides mais navigables
- [ ] Git initialisé, `.gitignore` correct, premier commit
- [ ] Déploiement automatique branché (Vercel / Netlify / Cloudflare Pages)

**Critères de sortie**
✅ Une URL publique affiche 4 pages blanches navigables.
✅ Le scroll est lissé par Lenis sur toutes les pages.
✅ Le test du carré cuivré (§8 de SETUP.md) fonctionne.

> Déployer **maintenant**, pas à la fin. Un déploiement branché dès le jour 3 t'évite de découvrir en semaine 8 que ton build casse en production.

---

## Phase 3 — Le rail horizontal · ~1 semaine

C'est le squelette de navigation de tout le site.

- [ ] Composant `<Rail>` réutilisable : reçoit des enfants, les fait défiler horizontalement
- [ ] Hook `useHorizontalRail` : gère le `pin`, le `scrub`, le recalcul au redimensionnement
- [ ] `invalidateOnRefresh: true` et `end` calculé par fonction
- [ ] Indicateur de progression (où suis-je dans le rail ?)
- [ ] Comportement mobile décidé et implémenté (voir encadré)
- [ ] Mode « animations réduites » : le rail devient une liste verticale classique

**Critères de sortie**
✅ Redimensionner la fenêtre en plein défilement ne casse rien.
✅ ⇥ au clavier fait défiler le rail jusqu'à l'élément ciblé.
✅ 60 fps tenus sur toute la longueur du rail.
✅ Testé sur un vrai téléphone, pas seulement dans l'émulateur DevTools.

> **Le mobile, décision à prendre ici et pas plus tard.** Un défilement horizontal détourné est souvent pénible au doigt. Deux options honnêtes : (a) sur < 768 px, le rail devient une pile verticale et le circuit se trace de haut en bas ; (b) le rail devient un carrousel à balayage natif. Choisis, écris-le dans CLAUDE.md, et tiens-t'y.

---

## Phase 4 — Le circuit · ~1,5 semaine

L'effet signature. C'est ici que le site devient le tien.

- [ ] SVG KiCad intégré et découpé en segments animables (un `<path>` par piste)
- [ ] Tracé progressif synchronisé au rail (`containerAnimation` + `drawSVG`)
- [ ] Lueur : filtre `feGaussianBlur` sur un calque dupliqué (**pas** de `box-shadow` animé)
- [ ] Électrons : points lumineux en boucle sur `MotionPath`
- [ ] Nœuds / pastilles qui « s'allument » à l'arrivée du tracé
- [ ] Repères de désignation (R1, C4, U2…) en IBM Plex Mono à côté de chaque bloc

**Critères de sortie**
✅ Le tracé arrive exactement à 100 % en fin de rail, pas à 92 %.
✅ Vérifié sur Firefox — la longueur des `<path>` y est parfois mal calculée, le contournement documenté est de viser 102 % au lieu de 100 %.
✅ Les pistes sont bien des contours (`fill="none"` + `stroke`), pas des formes remplies.
✅ Aucun `<path>` multi-segments (plusieurs commandes `M`) animé directement — DrawSVG les rend mal ; il faut les découper.

---

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
| P2 Socle | | | |
| P3 Rail | | | |
| P4 Circuit | | | |
| P5 Transitions | | | |
| P6 Contenu | | | |
| P7 Qualité | | | |

---

## Le piège à connaître

Le plus grand risque de ce projet n'est pas technique, c'est de **ne jamais le finir**. Un portfolio animé est infiniment améliorable, donc on continue à polir au lieu de publier.

Contre-mesure : à la fin de la phase 5, le site est mis en ligne **même incomplet**. Les phases 6 et 7 se font sur un site déjà public. Un portfolio à 80 % en ligne bat un portfolio à 100 % en local.
