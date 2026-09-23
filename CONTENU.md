# CONTENU.md — carte contenu ↔ étape de procédé

> **Source de vérité du contenu du site.** Aucun texte n'entre dans `src/content/*.ts`
> sans être passé par ce fichier d'abord. Le CLAUDE.md fixe *comment* le site se comporte,
> ce fichier fixe *ce qu'il raconte*.
>
> **Statut : figé le 2026-09-10 (phase 0).** La structure des 12 blocs ne bouge plus.
> Ce qui reste ouvert, ce sont les données personnelles marquées « ⧖ à fournir »,
> qui seront rédigées en phase 6.

---

## 1. Le principe

Le site raconte deux histoires en même temps, et c'est le seul truc à retenir :

```
   procédé :  sable ──► silicium pur ──► lingot ──► wafer ──► puce ──► boîtier
                │            │             │          │         │         │
   parcours :  qui       pourquoi        mes        ce que    ce que    comment
               je suis   ce domaine   objectifs   j'ai fait  j'ai fait  me joindre
                                                  (exp.)    (projets)
```

Une étape de fab n'illustre pas le propos : **elle le produit**. Le sable ne « symbolise »
pas les débuts, c'est le sable qui se dépose qui fait apparaître le texte de présentation.
Si on peut retirer l'animation sans rien perdre au sens, le bloc est raté.

---

## 2. Tableau récapitulatif

| # | SVG | Page | Bloc | Étape | Contenu | ★ |
|---|---|---|---|---|---|---|
| 01 | `01-sable.svg` | 1 | 1 | sable de quartz | Qui je suis | ★ |
| 02 | `02-four-arc.svg` | 1 | 2 | four à arc | Pourquoi l'électronique bas niveau | |
| 03 | `03-purification.svg` | 1 | 3 | purification Siemens | Mon exigence et ma cible | |
| 04 | `04-czochralski.svg` | 2 | 1 | tirage Czochralski | Mes objectifs au quotidien | ★ |
| 05 | `05-sciage.svg` | 2 | 2 | sciage du lingot | Mes objectifs principaux (GEII) | |
| 06 | `06-polissage.svg` | 2 | 3 | polissage CMP | Mes objectifs secondaires — polyvalence | |
| 07 | `07-photolithographie.svg` | 3 | 1 | photolithographie | Mes expériences professionnelles | ★ |
| 08 | `08-gravure.svg` | 3 | 2 | gravure | Mes stages et emplois | |
| 09 | `09-dopage.svg` | 3 | 3 | dopage | Mes compétences et mes outils | |
| 10 | `10-test-wafer.svg` | 4 | 1 | test sous pointes (EWS) | Mes projets phares | ★ |
| 11 | `11-decoupe.svg` | 4 | 2 | découpe (dicing) | Accès à tous les projets | |
| 12 | `12-packaging.svg` | 4 | 3 | packaging | Contact et posture pro | |

**Un seul ★ par page** (§7 du CLAUDE.md). Les blocs non-★ sont sobres : ils apparaissent,
ils ne se donnent pas en spectacle.

**Deux découpes différentes, ne pas les confondre :**
- bloc 05 = **sciage du lingot** → on obtient des *wafers* ;
- bloc 11 = **dicing** → on découpe le *wafer* en *puces*.

---

## PAGE 1 — Présentation

### Bloc 01 · Sable de quartz ★

| | |
|---|---|
| **Procédé** | Le silicium n'est pas rare : c'est 28 % de la croûte terrestre, sous forme de silice SiO₂. Le point de départ de toute puce, c'est du sable de quartz de haute pureté. |
| **Message** | Le point de départ, c'est de la matière ordinaire. Ce qui compte, c'est ce qu'on en fait. |
| **Mécanisme** | Les grains s'écoulent et se déposent ; le nom se **compose par sédimentation** — les glyphes arrivent portés par le flux, pas par un fondu. Interdit ici : `opacity` + translation vers le haut (§7). |
| **Longueur** | Un titre `display`, un chapô `lead` de 2 lignes, une ligne `mono` de repère. |

**Contenu :**
- Téo Vidal — Irchi
- Étudiant BUT GEII, IUT de Montpellier-Sète
- Trajectoire : le semi-conducteur (conception, ASIC)
- ⧖ à fournir : la phrase d'accroche, en une ligne. Pas « passionné de… ». Quelque chose qu'un autre étudiant GEII ne pourrait pas écrire à ta place.

---

### Bloc 02 · Four à arc électrique

| | |
|---|---|
| **Procédé** | SiO₂ + C → Si + CO, vers 1900–2000 °C par réduction carbothermique. On en sort du silicium *métallurgique* à 98–99 %. C'est brutal, c'est chaud, et c'est ce qui casse la molécule. |
| **Message** | Le déclic. Pourquoi je ne me suis pas arrêté au logiciel : ce qui m'intéresse est en dessous — le transistor, le signal, la datasheet. |
| **Mécanisme** | L'arc **s'amorce** entre les électrodes : allumage franc, `DUR.base`, `EASE.strong`. Le texte est là au moment de l'amorçage, il n'arrive pas en glissant. Analogie assumée : un arc, ça ne s'allume pas progressivement. |
| **Longueur** | Titre `title`, 3 à 4 lignes de `body` maximum. |

**Contenu :**
- ⧖ à fournir : le moment concret du déclic (un montage, un cours, une panne réparée). Une anecdote vaut mieux qu'une déclaration d'intention.
- Le fil : Bac Pro CIEL (Lycée Champollion, Lattes) → BUT GEII → l'analogique et le bas niveau.

---

### Bloc 03 · Purification (procédé Siemens)

| | |
|---|---|
| **Procédé** | Le MG-Si à 99 % ne sert à rien en microélectronique. On le convertit en trichlorosilane SiHCl₃, on distille, on redépose par CVD : on obtient du polysilicium **9N**, soit 99,9999999 %. Une impureté sur un milliard d'atomes suffit à changer le comportement électrique. |
| **Message** | Mon exigence, et où je vais. Le niveau de finition n'est pas un détail dans ce métier : c'est le métier. |
| **Mécanisme** | Les impuretés quittent la colonne **une par une** (`STAGGER`), et un compteur en `mono` monte de `98 %` à `9N`. Le compteur est du texte HTML, pas du `<text>` SVG (§8). |
| **Longueur** | Titre `title`, 3 lignes de `body`, le compteur en `mono`. |

**Contenu :**
- Cap visé : école d'ingénieurs orientée micro-nano (Grenoble INP–Phelma en cible), puis l'industrie du semi-conducteur.
- ⧖ à fournir : ce que tu veux qu'on retienne de ta façon de travailler — en une phrase, sans adjectif auto-décerné.

> ⚠️ **Aucun bloc de contact sur cette page.** Le contact est le bloc 12 (packaging) et nulle part
> ailleurs. C'est l'arbitrage du 2026-09-10 : les broches d'un boîtier *sont* l'interface avec
> l'extérieur, dupliquer les liens en page 1 casserait l'analogie pour gagner deux scrolls.

---

## PAGE 2 — Objectifs & formation

### Bloc 04 · Tirage Czochralski ★

| | |
|---|---|
| **Procédé** | Un germe monocristallin est trempé dans le bain de silicium fondu, puis **tiré vers le haut** en rotation lente. Le cristal grandit atome par atome. Tirer trop vite crée des dislocations : le cristal est fichu. |
| **Message** | Je progresse par petites doses régulières plutôt que par crises. La vitesse n'est pas le sujet ; la continuité l'est. |
| **Mécanisme** | **Le seul mouvement vertical du site** (§7). Le lingot monte, et chaque habitude s'inscrit au fur et à mesure de sa croissance. Réutiliser ce mouvement ailleurs le viderait de sa force. |
| **Longueur** | Titre `title`, 3 à 5 entrées courtes qui apparaissent à la montée. |

**Contenu :**
- ⧖ à fournir : 3 à 5 habitudes réelles et vérifiables (ce que tu fais *vraiment* chaque semaine). Une habitude fausse se sent à l'entretien.
- L'analogie « tirer trop vite = dislocations » est à écrire noir sur blanc : elle est juste, et elle montre que tu connais le procédé.

---

### Bloc 05 · Sciage du lingot

| | |
|---|---|
| **Procédé** | Scie à fil diamanté : le lingot devient des centaines de wafers. Un seul cristal, beaucoup de plans de travail. |
| **Message** | Mes objectifs principaux, ceux qui structurent le BUT. |
| **Mécanisme** | Le fil traverse ; **à chaque passage, une tranche se détache** et devient la carte d'un objectif. Autant de passages que d'objectifs — pas un de plus. |
| **Longueur** | 2 à 3 cartes, titre `lead` + 2 lignes `body` chacune. |

**Contenu :**
- Comprendre l'architecture d'un CPU (du jeu d'instructions au chemin de données)
- Être réellement à l'aise en électronique analogique
- ⧖ à fournir : un 3ᵉ objectif principal, ou on reste à deux — deux objectifs assumés valent mieux que trois dont un de remplissage.

---

### Bloc 06 · Polissage CMP

| | |
|---|---|
| **Procédé** | *Chemical Mechanical Polishing* : abrasion mécanique + attaque chimique jusqu'à une planéité de l'ordre du nanomètre. Sans cette planéité, la photolitho de la page suivante ne peut pas faire la mise au point. |
| **Message** | Mes à-côtés — ce qui me rend polyvalent et me permet de tenir le reste. |
| **Mécanisme** | Le disque tourne ; la surface passe d'un trait **tremblé** à un trait **net**. |
| **Continuité** | ⚠️ Le wafer poli produit ici est le **seul objet qui traverse deux pages** (§2). Il naît dans ce bloc et devient le support de toute la page 3. Ne pas casser cette continuité. |

**Contenu :**
- ⧖ à fournir : les axes secondaires (réseau/Cisco, auto-hébergement, web, musique/électronique audio…). Choisis-en 3 ou 4 qui *servent* le profil, pas une liste de loisirs.
- Le lien de causalité est à écrire : sans CMP, pas de litho. Sans polyvalence, pas d'expérience exploitable.

---

## PAGE 3 — Expérience & compétences

> Toute cette page se joue **sur le wafer poli de la page 2**. Le fond, c'est cette surface.

### Bloc 07 · Photolithographie ★

| | |
|---|---|
| **Procédé** | Résine photosensible étalée, masque (chrome sur quartz) posé, insolation UV, développement. Le masque **ne fabrique rien** : il décide seulement où la lumière passe. Tout le motif de la puce vient de là. |
| **Message** | Ce que mon parcours a réellement produit. Le panorama de mes expériences. |
| **Mécanisme** | ⚠️ **Révélation par masque / `clip-path` obligatoire** (§7). Le texte est *insolé*, jamais fondu. Un `opacity` ici casserait la seule idée forte de la page. Le masque descend, le flash part, le motif est là. |
| **Longueur** | Titre `display` de page, puis le panorama en `body`. |

**Contenu :**
- ⧖ à fournir : la vue d'ensemble — combien d'expériences, sur quelle période, quelle part hardware / software.
- Le lien avec le CIEL : le cursus est le masque, les expériences sont le motif.

---

### Bloc 08 · Gravure

| | |
|---|---|
| **Procédé** | Gravure sèche (plasma RIE) ou humide : on **retire** la matière non protégée par la résine. C'est la seule étape soustractive du flot. |
| **Message** | Mes stages et mes emplois — le concret, ce qui a été livré. |
| **Mécanisme** | ⚠️ **La seule animation du site qui retire de la matière au lieu d'en ajouter** (§7). Ce contraste est voulu : le motif se creuse, il n'apparaît pas. |
| **Longueur** | 2 à 4 entrées : intitulé, structure, dates, ce qui a été fait. |

**Contenu :**
- Freelance (Fiverr) — ⧖ à fournir : type de missions, volume, ce que ça t'a appris
- ⧖ à fournir : PFMP / stages du Bac Pro — entreprise, dates, mission réelle, résultat
- ⧖ à fournir : jobs et alternance éventuels

> Règle de rédaction : **une ligne par entrée sur ce qui a été livré**, pas sur ce qui a été observé.
> « J'ai assisté à » ne se met pas dans un portfolio.

---

### Bloc 09 · Dopage

| | |
|---|---|
| **Procédé** | Implantation ionique ou diffusion : on introduit du bore (type P) ou du phosphore/arsenic (type N). Le silicium pur est un mauvais conducteur — **c'est le dopage qui lui donne ses propriétés électriques.** |
| **Message** | Mes compétences et mes outils. Ce sont elles qui rendent le reste utilisable. |
| **Mécanisme** | Les ions s'implantent en `STAGGER` ; chaque impact allume une compétence. ⚠️ `caisson-1` et `caisson-2` du SVG 09 sont **en tirets** : révélation à l'opacité, **jamais DrawSVG** (§8) — le plugin pilote `stroke-dasharray` et écraserait les tirets. |
| **Longueur** | 3 groupes maximum, chacun avec ses items en `mono`. |

**Contenu — par niveau réel de maîtrise, aucune barre de pourcentage inventée (ROADMAP P6) :**
- Embarqué : C/C++, Arduino, ESP32, I²C / SPI / UART
- Électronique : lecture de datasheets, schématique, simulation LTspice, conception de PCB
- Réseau / systèmes : Cisco IOS, Packet Tracer, Linux, Docker, auto-hébergement
- Numérique : Verilog, flot RTL→GDSII en outils libres, FPGA
- ⧖ à valider : la répartition en groupes et le niveau annoncé pour chacun. Un niveau surévalué se démonte en trois questions.

---

## PAGE 4 — Projets & contact

### Bloc 10 · Test sous pointes (EWS) ★

| | |
|---|---|
| **Procédé** | *Electrical Wafer Sort* : une carte à pointes vient tester chaque puce **encore sur le wafer**. Les puces défaillantes sont marquées et ne seront jamais mises en boîtier. |
| **Message** | Mes projets phares — ceux qui ont passé le test. |
| **Mécanisme** | Les pointes descendent, puce par puce. Chaque puce validée s'allume et devient la vignette d'un projet. C'est le ★ de la page. |
| **Longueur** | 3 à 4 projets. Pour chacun : le problème, la solution technique, ce qui a été difficile, le résultat. |

**Contenu — ⧖ à choisir, 3 ou 4 maximum :**
Candidats, par ordre de valeur supposée pour un recruteur semi-conducteur :
1. Verilog → GDSII en outils libres (le plus pertinent pour la cible : c'est littéralement le sujet du site)
2. Clone analogique TB-303 à composants discrets (analogique, méthode, endurance)
3. Clé USB d'authentification VPN (MCU + secure element : embarqué + sécurité)
4. Serveur / NAS auto-hébergé sur Raspberry Pi (Docker, réseau, exploitation)
5. FPGA Tang Nano 20K, module Eurorack, thermomètre ESP32…

> La ROADMAP est explicite : **un projet expliqué en profondeur bat six projets listés.**
> Chaque projet doit répondre à « qu'est-ce que ça prouve sur mes compétences ? ».

---

### Bloc 11 · Découpe (dicing)

| | |
|---|---|
| **Procédé** | Scie ou laser : le wafer est séparé en puces individuelles. Chacune part de son côté. |
| **Message** | Tout le reste est là. |
| **Mécanisme** | Les traits de découpe passent, les puces se séparent, **une d'elles glisse hors du wafer** : c'est le lien vers la page « tous les projets ». ⚠️ `emplacement-libere` est **en tirets** → opacité, pas DrawSVG (§8). Doit répondre au clavier exactement comme au clic (§9.2). |
| **Longueur** | Un lien, une phrase. Rien de plus. |

**Contenu :**
- Lien vers `/projets` (page complète, hors périmètre de cette version — à faire plus tard)
- ⧖ à décider : d'ici là, ce lien pointe vers le GitHub ou est désactivé ? Un lien mort sur un portfolio coûte plus cher qu'un lien absent.

---

### Bloc 12 · Packaging

| | |
|---|---|
| **Procédé** | *Die attach*, *wire bonding*, encapsulation : la puce est collée, reliée par des fils d'or à la grille de connexion, moulée. **Les broches sont la seule interface entre la puce et le monde extérieur.** |
| **Message** | Comment me joindre, et ce que je vaux en équipe. |
| **Mécanisme** | Les fils de bonding se tracent du die vers les broches ; **chaque broche est un canal de contact**. ⚠️ `puce` est **en tirets** → opacité (§8). Fond : la fab en construction, au trait — ⧖ figure encore à produire (§8). |
| **Longueur** | Une phrase de posture, quatre liens. |

**Contenu :**
- Broches : e-mail · GitHub · LinkedIn · CV (PDF)
- ⧖ à fournir : les URL exactes et le CV à jour en PDF
- ⧖ à fournir : deux lignes sur la façon de travailler en équipe. Concret : ce que tu fais quand tu es bloqué, comment tu documentes. Pas « rigoureux et motivé ».

---

## 3. Ce qu'il reste à produire avant la phase 6

| Élément | Bloc | Qui |
|---|---|---|
| Phrase d'accroche | 01 | Toi |
| L'anecdote du déclic | 02 | Toi |
| Ta phrase sur ta méthode de travail | 03 | Toi |
| 3 à 5 habitudes réelles | 04 | Toi |
| 3ᵉ objectif principal (ou on reste à 2) | 05 | Toi |
| Les 3-4 axes de polyvalence | 06 | Toi |
| Panorama chiffré des expériences | 07 | Toi |
| PFMP / stages / jobs détaillés | 08 | Toi |
| Validation des niveaux de compétence | 09 | Toi |
| Choix des 3-4 projets phares | 10 | Toi |
| Sort du lien « tous les projets » | 11 | Toi |
| URL, CV PDF, 2 lignes sur le travail en équipe | 12 | Toi |
| Figure « fab en construction » (SVG) | 12 | Toi (Inkscape, §8) |

---

## 3 bis. État au 2026-09-22 (phase 6a)

Le texte vit dans `src/content/*.ts`. Chaque bloc rédigé par Claude porte `brouillon: true`
et affiche une pastille « brouillon » **en `npm run dev` seulement**. Tant qu'un bloc est
marqué, il n'a pas été relu par toi.

| Bloc | Fichier | État |
|---|---|---|
| 01 | `presentation.ts` | brouillon (nom, chapô, repère) — ⧖ accroche |
| 02 | `presentation.ts` | brouillon (le fil CIEL → GEII) — ⧖ anecdote du déclic |
| 03 | `presentation.ts` | brouillon (cap Phelma, 9N) — ⧖ ta méthode en une phrase |
| 04 | `objectifs.ts` | brouillon (analogie des dislocations) — ⧖ **habitudes : liste vide** |
| 05 | `objectifs.ts` | brouillon, 2 objectifs — ⧖ un 3ᵉ ou non |
| 06 | `objectifs.ts` | brouillon, 4 axes proposés — ⧖ en garder 3 ou 4 |
| 07 | `experience.ts` | brouillon (4 PFMP, panorama) |
| 08 | `experience.ts` | brouillon — ⧖ dates, ce qui a été livré, ordre, Fiverr |
| 09 | `competences.ts` | brouillon, 3 groupes — ⧖ niveau réel par groupe |
| 10 | `projets.ts` | brouillon, **un seul projet phare** : Verilog → GDSII |
| 11 | `projets.ts` | brouillon, lien → GitHub (décidé) |
| 12 | `projets.ts` | brouillon, GitHub seul — ⧖ e-mail, LinkedIn, CV PDF, 2 lignes équipe |

**Décisions du 2026-09-22 :**
- Bloc 09 : 3 groupes (« Embarqué et numérique », « Électronique », « Réseau et systèmes »),
  le Verilog/FPGA rejoint l'embarqué. **« Flot RTL→GDSII » retiré** tant que la synthèse n'a
  pas tourné — c'est un niveau surévalué, de ceux qui se démontent en trois questions.
- Bloc 10 : un seul projet, Verilog → GDSII. La mécanique « chaque puce validée devient la
  vignette d'un projet » n'allumera donc qu'une puce — c'est cohérent avec le choix de la
  profondeur, mais à garder en tête pour la mise en scène.
- Bloc 11 : GitHub, pas de lien mort.
- Rendu sans JS : métadonnées + `<noscript>`, pas de pré-rendu.

---

## 4. Règles de rédaction, valables partout

1. **Aucun texte en dur dans un composant** (§5 du CLAUDE.md). Tout passe par `src/content/*.ts`.
2. **Pas de `<text>` dans les SVG** (§8). Tout le texte reste en HTML : sélectionnable, lisible par un lecteur d'écran, traduisible.
3. **Les blocs sont courts par construction.** Chakra Petch est une police d'affichage : au-delà de ~5 lignes en `body`, le problème est le contenu, pas la police (§10).
4. **Le vocabulaire de fab doit être juste.** 9N, CMP, EWS, SiO₂, RIE, die attach : le public visé connaît le flot. Un sigle mal employé décrédibilise plus qu'il ne crédibilise. En cas de doute, retirer le sigle.
5. **Le contenu existe sans animation** (§9.4). Si GSAP ne charge pas, le parcours reste lisible de bout en bout.
6. **Zéro Lorem ipsum dans le dépôt** (ROADMAP P6). Un bloc sans contenu réel reste vide, il ne reçoit pas de faux texte.


---

## Annexe — pages légales (hors procédé, 2026-09-23)

Les textes des pages `/mentions-legales` et `/confidentialite` ne sont **pas** des blocs :
ils ne passent pas par ce fichier. Ils vivent dans `src/content/legal.ts`, portent
`brouillon: true` (rédigés par Claude à partir de l'inventaire du code) et contiennent des
champs `[À COMPLÉTER]` que toi seul peux remplir. Liste complète : `CONFORMITE.md`.
