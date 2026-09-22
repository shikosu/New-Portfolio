# ROADMAP — Portfolio Irchi v4

**Règle du jeu :** une phase ne se termine pas parce qu'elle « a l'air finie ». Elle se termine quand **tous** les critères de sortie sont cochés. Pas de phase entamée avant que la précédente ne soit close.

Durées indicatives pour un rythme d'étudiant (≈ 6-8 h/semaine hors cours).

```
P0 ──► P1 ──► P2 ──► P3 ──► P4 ──► P5 ──► P6 ──► P7
Cadrage Proto  Socle  Rail  Piste  Transi Contenu Qualité
 [x]    [x]    [~]    [~]   [~]    [x]    [~]    ....
                             ▲                       │
                             └── la boucle de reprise ┘

[~] = mécanique close et vérifiée au banc, restent des contrôles manuels
      (Firefox, Safari, 60 fps, vrai téléphone) ou des reprises après la P6.
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

### 4b — Les mécanismes propres à chaque bloc *(partiellement fait)*

Aucun n'est inventé : **`CONTENU.md` les donne bloc par bloc**, c'est la source.

- [x] **Les 12 mécanismes côté figure**, un par bloc, dans `lib/mecanismes.ts` :
      01 les grains se déposent · 02 l'arc s'amorce (plein, coupé, plein — pas une rampe) ·
      03 les impuretés sortent une par une · 04 la tige **monte** et le lingot se trace derrière
      elle · 05 un fil, une tranche, un fil, une tranche · 06 le disque tourne, le trait passe
      de tremblé à net · 07 le masque descend, le flash part · 08 le creux **s'ouvre depuis son
      milieu** (`drawSVG: "50% 50%"` → `"0% 100%"`) · 09 les ions s'implantent, les caissons
      apparaissent en dernier · 10 les pointes descendent, les dies validées s'allument ·
      11 les saignées passent, une puce glisse hors du wafer · 12 les fils de bonding se tracent.
- [x] **Les mécanismes de texte que `CONTENU.md` spécifie sans liste** :
      01 **sédimentation** — SplitText découpe en lignes puis en glyphes, les lignes sont
      clippées, les glyphes tombent *dedans*. Aucune opacité : c'est du transport de matière ·
      02 le texte **est là** à l'amorçage (durée 0,001 s, il ne glisse pas) ·
      03 le compteur **98 % → 9N** en HTML, par paliers (`snap`), jamais en `<text>` SVG ·
      07 ★ **insolation par `clip-path`** — `inset(0% 100% 0 0)` → `inset(0)`, l'opacité reste
      à 1 d'un bout à l'autre, sinon c'est un fondu et l'idée forte de la page tombe.
- [x] **Le tracé vertical en mobile.** Sous 768 px la piste part du haut et descend le long du
      bord du texte. Le conteneur n'étant pas épinglé, elle a son propre ScrollTrigger — le
      piège n°1 du §6.4 ne concerne qu'un élément épinglé.
- [x] **Un seul ★ par page** : 01, 04, 07, 10. Les 8 autres blocs gardent un texte statique —
      `CONTENU.md` ne leur prescrit aucun mécanisme de texte, et « les blocs non-★ apparaissent,
      ils ne se donnent pas en spectacle ».

#### Ce qui reste, et pourquoi ça ne peut pas être fait maintenant

- [ ] **La mise en scène des listes** — blocs 04, 05, 09, 10, 11, 12. `CONTENU.md` dit « chaque
      habitude s'inscrit au fur et à mesure » (04), « une tranche devient la carte d'un
      objectif » (05), « chaque impact allume une compétence » (09), « chaque puce validée
      devient la vignette d'un projet » (10), « une puce glisse hors du wafer : c'est le lien
      vers tous les projets » (11), « quatre liens » (12). **Ces listes n'existent pas encore**
      — elles sont marquées « ⧖ à fournir » et attendent la phase 6, et la règle 6 de
      `CONTENU.md` interdit d'y mettre du faux texte en attendant.
      👉 À reprendre **juste après** la phase 6, pas avant. *(2026-09-22 : les listes existent
      maintenant, rendues statiques, chaque `<li>` porte `data-entree="04-1"`… — c'est le point
      d'accroche. La liste 04 est encore vide : elle attend tes habitudes.)* Le côté figure, lui, est fini et ne
      sera pas refait : il suffira d'accrocher les items sur les timelines existantes.
- [ ] **La figure « fab en construction » du bloc 12** — à dessiner par toi (Inkscape, §8).
      C'est le fond du bloc contact, ce n'est pas une étape de procédé.
- [ ] Le lien « tous les projets » du bloc 11 doit répondre **au clavier exactement comme au
      clic** (§9.2). Il n'existe pas encore : même blocage que ci-dessus.

**Critères de sortie**
- [x] Le tracé arrive **exactement** à 100 % en fin de rail, pas à 92 %. ← mesuré : pointe à
      1280 px sur un écran de 1280 px, et 3840/3840 de longueur tracée. Idem après un
      redimensionnement 1440 → 1000 px en plein défilement.
- [x] Les figures sont bien des contours (`fill="none"` + `stroke`), pas des formes remplies.
- [x] Aucun `<path>` multi-segments (plusieurs commandes `M`) animé directement.
- [x] Les éléments en tirets ne passent pas par DrawSVG.
- [x] Le contenu survit sans animation : en mode « animations réduites », les 12 figures sont
      intégralement visibles et aucune n'est masquée par un état de départ.
- [x] Les 4 éléments en tirets ont **gardé leurs tirets** après animation (`5px, 4px`
      mesurés sur `f09-caisson-1/2` et `f12-puce`) — la preuve que DrawSVG ne les a pas touchés.
- [x] Le mode « animations réduites » ne découpe pas le titre par SplitText, ne clippe aucun
      texte, et laisse les 12 figures entièrement visibles.
- [ ] Vérifié sur **Firefox** — la longueur des `<path>` y est parfois mal calculée ; le
      contournement documenté est de viser 102 % au lieu de 100 %. ← à faire par toi.
- [ ] Vérifié sur **Safari**. ← à faire par toi.

> **Banc de vérification** : 81 contrôles automatisés au total — 23 sur le rail (phase 3),
> 18 sur la piste (4a), 40 sur les mécanismes, le tracé mobile et le mode réduit (4b). Tous au
> vert le 2026-09-22, **sur Chromium uniquement** — d'où les deux lignes Firefox/Safari
> ci-dessus, et les 60 fps qui restent à mesurer à la main.

## Phase 5 — Transitions de page · ~1 semaine

- [x] **La piste sort par le bord droit de la page A et entre par le bord gauche de la page B.**
      Le trait de raccord est un SVG fixe posé dans la coquille (`components/layout/Liaison.tsx`),
      à la même hauteur et à la même épaisseur que la piste du rail — sinon ce serait deux
      objets et non une ligne (§8). Il reprend le trait **là où la pointe s'est arrêtée**
      (`pointeDeLaPiste()`), et non au bord droit : partir du bord ferait apparaître un trait
      pleine largeur d'un coup quand on clique depuis le haut d'une page.
- [x] **Le fond et la navigation persistent.** `<Shell>` n'est plus une route de mise en page à
      `<Outlet/>` mais la coquille elle-même : fond, nav et instance Lenis vivent au-dessus des
      routes. Un `<Outlet/>` rend toujours l'adresse courante, or la phase 5 a besoin de garder
      l'ancienne page à l'écran le temps qu'elle sorte — d'où `<Routes location={affichee}>`.
- [x] **Durée ≤ 1,1 s.** 0,45 s de sortie + 0,55 s d'entrée = 1,00 s théorique.
      **Mesuré au banc : 1,02 s à l'écran**, du premier trait de liaison au dernier.
- [x] **Préchargement de la page suivante au survol de la flèche.** Les 4 pages sont des
      morceaux séparés (`React.lazy`), et survol **comme focus clavier** déclenchent
      l'`import()`. Vérifié : 0 requête avant le survol, 1 après.
- [x] **Retour navigateur géré proprement**, et en **miroir** : on ne regarde pas *comment*
      on a navigué mais *où on était* et *où on va* (`sensEntre`). Reculer dans le parcours
      fait donc sortir la piste par la gauche et revenir par la droite. Le bouton « précédent »
      et un clic sur une page déjà vue se comportent pareil, sans code de plus.
- [x] **Mode « animations réduites » : bascule instantanée.** Et **sous 768 px aussi** —
      décision consignée au §2 du CLAUDE.md : un seul chemin de code, comme pour le rail.
- [x] **La flèche de fin de rail** (`components/ui/Suivant.tsx`), qui n'existait pas : posée
      dans le dernier panneau, à droite, sur la piste. C'est un bout de trait terminé par un
      chevron, pas un `→` collé au libellé (interdit au §10).

**Critères de sortie**
- [x] Aucun clignotement blanc entre deux pages. ← mesuré image par image : le fond reste à
      `rgb(250,250,248)` sur **tous** les échantillons, et `#root` n'est jamais vide.
- [x] Aller-retour 10 fois d'affilée : aucun ScrollTrigger orphelin. ← un seul `pin-spacer`
      avant comme après, nombre de nœuds DOM stable (131 → 133), et le rail défile toujours
      jusqu'à −2560 px au dixième passage.
- [x] L'URL change et une page rechargée directement s'affiche correctement. ← `/experience`
      ouvert en direct rend bien les étapes 07 à 09, en pleine opacité.

> **Banc de vérification de la phase 5** : 39 contrôles automatisés dans un navigateur réel
> (bureau 1280, mode « animations réduites », mobile 390, clavier, 10 allers-retours).
> Tous au vert le 2026-09-22, **sur Chromium uniquement**.
>
> **Deux défauts trouvés au banc et corrigés — ils valaient le banc à eux seuls :**
> 1. Le rail **rebobinait** au début de la sortie : passer la page en `position: fixed` sort
>    le `pin-spacer` du flux, le document raccourcit et le navigateur ramène le défilement à
>    zéro. On fige la hauteur du `body` le temps de la sortie.
> 2. La page entrante **apparaissait 336 ms en retard, d'un bloc, à 83 % d'opacité** :
>    `React.lazy` suspend au premier rendu et React refuse de remplacer un `fallback` avant
>    ~300 ms. Parade : `startTransition`. Détail au §6.6 du CLAUDE.md.

**Ce qui reste, et qui n'appartient qu'à moi**
- [ ] Vérifié sur **Firefox** et **Safari** (même dette que la phase 4).
- [ ] 60 fps tenus pendant la transition, dans l'onglet Performance, sur le build.
- [ ] **Jugement de goût à rendre** : entre les deux moitiés, l'écran est quasi vide pendant
      ~150 ms. C'est propre sur image fixe, mais c'est à moi de dire si ça respire ou si ça
      tombe. Si ça tombe, le réglage est de faire chevaucher les deux moitiés de ~0,15 s dans
      `TRANSITION` — pas de réécriture.

---

## Phase 6 — Contenu réel · ~1 semaine

> Le squelette est déjà écrit dans **`CONTENU.md`** (phase 0). Cette phase consiste à remplir
> les entrées marquées « ⧖ à fournir » et à les basculer dans `src/content/*.ts` — pas à
> réinventer la structure.

### 6a — La mécanique du contenu *(faite le 2026-09-22)*

- [x] **Le contrat** `content/types.ts` : un `Bloc` par étape (titre, chapô, texte, repère,
      entrées, liens), tous les champs optionnels — un champ absent est un « ⧖ à fournir »,
      pas un oubli. Plus aucun texte de chantier à l'écran (« Contenu rédigé en phase 6 »).
- [x] **Le rendu** : `Panneau` passe à deux colonnes posées sur la piste (texte + figure à
      gauche, listes et liens à droite), une seule en mobile. Nouveaux composants
      `rail/Entrees.tsx` (vraies `<ul>`, fiche projet en `<dl>`) et `rail/Liens.tsx`
      (`<a>` natifs : le clavier répond comme le clic, sans une ligne de JS).
- [x] **Le marquage « brouillon »** : chaque bloc rédigé par Claude porte `brouillon: true`.
      Une pastille le signale **en `npm run dev` uniquement** — `import.meta.env.DEV` vaut
      `false` au build et la pastille disparaît du code livré (vérifié : 3 pastilles en dev,
      0 en production).
- [x] Métadonnées : `<title>` par page (`Objectifs — Téo Vidal`, annoncé par les lecteurs
      d'écran), description, Open Graph + image `public/og.png` 1200 × 630, `theme-color`,
      `canonical`.
- [x] **Rendu sans JavaScript tranché : métadonnées + `<noscript>`**, pas de pré-rendu.
      Google exécute le JS ; un pré-rendu ajoutait une dépendance et une hydratation à
      surveiller sous GSAP/SplitText, pour un gain que la phase 7 dira s'il manque.
- [x] Compétences : aucune barre de pourcentage. 3 groupes (CONTENU.md en listait 4 pour
      « 3 maximum »). **« Flot RTL→GDSII » retiré** : la synthèse n'a pas commencé, l'annoncer
      c'était offrir la question qui le démonte.
- [x] Bloc 10 : **un seul projet phare**, Verilog → GDSII, en fiche problème / solution /
      difficulté / résultat, honnête sur l'avancement.
- [x] Bloc 11 : le lien pointe vers GitHub tant que `/projets` n'existe pas (pas de lien mort).

### 6b — Le contenu lui-même *(à toi)*

Les brouillons n'utilisent **que** des faits déjà donnés (PFMP, projets, parcours). Tout ce
qui relève du ressenti est resté **vide**, et chaque fichier de `content/` liste en tête ce
qui lui manque.

- [ ] Relire chaque brouillon et passer `brouillon: false` bloc par bloc
- [ ] 01 la phrase d'accroche · 02 l'anecdote du déclic · 03 ta méthode en une phrase
- [ ] 04 les 3 à 5 habitudes réelles (la liste est vide) · 05 un 3ᵉ objectif ou non · 06 garder 3 ou 4 axes
- [ ] 08 les dates des PFMP, ce qui a été **livré** dans chacune, l'ordre chronologique, Fiverr
- [ ] 09 le niveau réel de chaque groupe
- [ ] 12 e-mail public, LinkedIn, **CV en PDF** dans `public/`, deux lignes sur le travail en équipe
- [ ] 12 la figure « fab en construction » (Inkscape, §8)
- [ ] Images de projets (WebP/AVIF, `loading="lazy"`) — **aucune pour l'instant** : à ajouter
      seulement si une photo prouve quelque chose (un PCB, un chronogramme GTKWave)
- [ ] ⚠️ `canonical`, `og:url` et `og:image` pointent sur `v4.teovidal.eu` : à changer le jour
      de la bascule vers `teovidal.eu`

**Critères de sortie**
- [x] Zéro Lorem ipsum dans le dépôt. ← vérifié au banc sur les 4 pages, et par recherche
      dans `src/` et `index.html`.
- [x] Chaque projet répond à « qu'est-ce que ça prouve sur mes compétences ? ». ← la fiche
      du bloc 10 impose les 4 questions par son type.
- [ ] Aucun bloc marqué `brouillon: true`.
- [ ] Relu par quelqu'un d'autre pour l'orthographe.

> **Banc de vérification de la phase 6** : 334 contrôles automatisés sur le build, 6 tailles
> de bureau (1024 × 640 → 1920 × 1080), mobile 390, clavier, mode réduit, sans JS, 5
> allers-retours de transition, redimensionnement en plein défilement. Tous au vert le
> 2026-09-22, **sur Chromium uniquement**.
>
> **Trois défauts trouvés au banc et corrigés :**
> 1. Sur 1280 × 720, le titre du bloc 01 et celui du 07 passaient **sous la navigation** (la
>    zone haute ne fait que 490 px). Parade : une colonne large pour les blocs sans liste, et
>    une figure qui ne grandit qu'au-delà de 800 px de haut, qui rétrécit sous 720.
> 2. En mobile, la piste verticale (x = 24 px) **rayait la première lettre** de chaque ligne :
>    le texte commençait lui aussi à 24 px. Invisible tant que les blocs étaient vides.
> 3. À 1000 × 700, les 5 stages sur une seule colonne débordaient de 21 px.
>
> **Limite connue, décision à prendre :** sous ~1000 × 640 (fenêtre réduite, 800 × 600), la
> fiche du bloc 10 ne tient plus dans la zone haute (−264 px à 800 × 600). Deux options :
> (a) l'accepter, c'est une fenêtre rare ; (b) ne passer en rail horizontal que si la fenêtre
> fait **aussi** au moins ~640 px de haut — même chemin de code que le mobile, mais ça touche
> la décision « définitive » de la phase 3 (§2), donc c'est à toi de trancher.

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
| P4 Piste | 2026-09-22 | | **Phase réécrite** : les items « lueur / électrons / nœuds / R1-C4-U2 » étaient des restes du concept PCB. Socle (4a) fait et vérifié au banc (18/18) : figures nettoyées 109→15,5 Ko, piste tracée en front, révélations branchées en `containerAnimation`. 4b fait pour tout ce qui ne dépend pas du contenu : les 12 mécanismes côté figure, la sédimentation (01), l'amorçage (02), le compteur 98 %→9N (03), l'insolation par `clip-path` (07), le tracé vertical mobile. **Reste la mise en scène des listes (04, 05, 09, 10, 11, 12), bloquée par la phase 6**, et la figure du bloc 12. Banc : 81/81. |
| P5 Transitions | 2026-09-22 | 2026-09-22 | Close. Coquille persistante + location différée (`<Routes location>`), liaison SVG fixe qui sort d'un bord et revient par l'autre, sens déduit de l'ordre du parcours (retour = miroir), routes en morceaux séparés avec préchargement au survol **et au focus**. Décision : sous 768 px, bascule instantanée — même chemin que le mode réduit. Banc 39/39. Deux pièges mesurés et consignés au §6.6 du CLAUDE.md : le `pin` qui rebobine quand le document raccourcit, et le garde-fou de 300 ms de Suspense. **Restent Firefox/Safari, les 60 fps et un jugement de goût sur le creux de ~150 ms.** |
| P6 Contenu | 2026-09-22 | | **6a close** : contrat `content/types.ts`, rendu 2 colonnes, listes et liens, marquage brouillon visible en dev seulement, titre par page, Open Graph + `og.png`, `<noscript>`. Décisions : un seul projet phare (Verilog → GDSII), bloc 11 → GitHub, pas de pré-rendu. Banc 334/334. **6b à toi** : relecture des brouillons, textes de ressenti, dates, contact, CV. Limite connue sous ~1000 × 640. |
| P7 Qualité | | | |

---

## Le piège à connaître

Le plus grand risque de ce projet n'est pas technique, c'est de **ne jamais le finir**. Un portfolio animé est infiniment améliorable, donc on continue à polir au lieu de publier.

Contre-mesure : à la fin de la phase 5, le site est mis en ligne **même incomplet**. Les phases 6 et 7 se font sur un site déjà public. Un portfolio à 80 % en ligne bat un portfolio à 100 % en local.
