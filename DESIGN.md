# DESIGN.md · Portfolio Irchi

> La charte courte. Toute modification visuelle ou rédactionnelle la respecte ; un choix absent
> d'ici y est ajouté **avant** d'être appliqué. Le détail technique (mesures, pièges GSAP) reste
> dans `CLAUDE.md` ; ce fichier-ci dit **quoi**, pas comment l'animer.
>
> Chantier « ne pas avoir l'air fait par une IA », 2026-09-29.

---

## 1. Direction

**Un photomasque : une ligne de chrome noir sur une plaque de quartz, qui trace une ligne de
fabrication de semi-conducteur, du sable à la puce.**

- Public : un recruteur technique (semi-conducteur, électronique, embarqué) **et** un jury
  d'école d'ingénieurs, à égalité.
- Action principale : **me contacter pour un stage.**
- Références retenues :
  - **le photomasque lui-même** : chrome sur quartz, aucun ornement ;
  - **press.stripe.com** : pour la typographie éditoriale soignée et un mouvement qui sert
    l'objet montré, pas pour sa mise en page ni ses couleurs.

## 2. Couleurs

Tout passe par les jetons de `src/styles/index.css`. **Aucune couleur écrite en dur** dans un
composant ; les SVG prennent `currentColor`. **Aucun dégradé** : aucun ne sert la marque.

| Rôle | Jeton | Code | Usage |
|---|---|---|---|
| Principale | `ink` | `#111110` | texte, piste, contours des figures, bordures qui portent du sens |
| Accent unique | `litho` | `#E8B923` | fond du repère d'étape du moment fort (★), un par page. **Jamais de texte jaune** (1,76:1) |
| Fond | `ground` | `#FAFAF8` | le quartz |
| Fond en retrait | `ground-2` | `#F2F2EE` | zones en retrait |
| Texte secondaire | `ink-soft` | `#6A6A63` | 5,21:1 sur `ground` |
| Filet | `rule` | `#DCDCD5` | décoratif uniquement (1,32:1) |

## 3. Typographie

Deux familles, quatre fichiers, pas un de plus.

| Niveau | Taille | Famille | Graisse | Usage |
|---|---|---|---|---|
| `display` | 44 → 72 px | Chakra Petch | 700 | nom, titre des blocs ★ |
| `title` | 32 px | Chakra Petch | 700 | titre de bloc |
| `lead` | 22 px | Chakra Petch | 400 | chapo, liens de contact |
| `body` | 17 px | Chakra Petch | 400 | corps de texte |
| `small` | 14 px | Chakra Petch | 400 | légendes, pied de page |
| `mono` | 12 px | IBM Plex Mono | 500 | repères, unités, navigation |

**Capitales :** réservées à la navigation, à la flèche « étape suivante » et aux repères
posés *sous* un contenu.
**Jamais de surtitre en capitales espacées au-dessus d'un titre.** Le repère d'étape
(« 01 · Sable de quartz ») s'écrit en casse normale.

## 4. Formes et espacements

- **Rayon d'arrondi : 0, partout.** Un masque de lithographie a des angles vifs. Le thème
  Tailwind efface les rayons (`--radius-*: initial`) : `rounded-md` ne génère plus rien.
- **Grille : 4 px** (l'échelle Tailwind, `0.25rem`). Pas de valeur arbitraire en `[…px]` pour un
  espacement.
- **Boutons :** un composant, `components/ui/Bouton.tsx`, deux variantes.
  - *principal* : fond `ink`, texte `ground` ;
  - *secondaire* : bordure `ink` 1 px, texte `ink`, s'inverse au survol.
  - Les deux : `small` (14 px) en graisse 700, casse normale, bordure 1 px, hauteur minimale
    44 px (cible tactile), angles vifs.
  - Deux boutons de même rang (« Tout refuser » / « Tout accepter ») prennent **la même
    variante** : exigence CNIL, aucun choix n'est mis en avant.
- **Liens de texte :** soulignés, l'épaisseur passe de 1 à 2 px au survol. Pas de pilule.

## 5. Icônes

**Un seul jeu : le trait maison.** Même grammaire que la piste : `fill="none"`,
`stroke="currentColor"`, épaisseur `TRAIT` (2,4), extrémités arrondies, aucune bibliothèque.
Une icône n'existe que si elle dit quelque chose que le texte ne dit pas.
Aujourd'hui : **une seule**, la flèche « étape suivante » (`Suivant.tsx`).
**Aucun emoji dans l'interface.**

## 6. Mouvement

`CLAUDE.md` §7 fait foi. En résumé :

- **Autorisé :** les 12 mécanismes de procédé (un par bloc, un seul ★ par page), la piste liée
  au défilement, la liaison entre deux pages, et au survol : soulignement épaissi, flèche qui
  avance de 4 px, inversion d'un bouton secondaire.
- **Durée des retours de survol et de focus : 200 ms** (`DUR.micro`), portée en CSS par
  `--default-transition-duration`. Aucune durée écrite dans une classe.
- **Interdit :** fondu + glissement générique, parallaxe décorative, rebond, `elastic`,
  curseur personnalisé, agrandissement au survol, ombre animée, écran de chargement.
- **« Réduire les animations »** : tout devient instantané, rien n'est masqué.

## 7. Ton des textes

- **Je** pour parler de moi, **vous** pour s'adresser au visiteur (recruteur, jury).
- **Phrases courtes** : 20 mots au plus, un fait par phrase.
- **Des faits vérifiables** : noms d'entreprises, outils, protocoles, unités réelles (9N, CMP,
  EWS). Un niveau ou un chiffre qu'on ne peut pas défendre en entretien ne s'écrit pas.
- **Ponctuation :** aucun tiret long (—) ni demi-cadratin (–) comme ponctuation. On utilise le
  point, la virgule ou les deux-points. Séparateur de repère ou de titre d'onglet : « · ».
- **Pas de** liste de trois adjectifs, de tournure « ce n'est pas X, c'est Y », de métaphore
  qui n'apporte pas d'information, de question rhétorique.
- **Mots interdits :** passionné, passion, motivé, dynamique, rigoureux, curieux, créatif (tout
  adjectif qu'on se décerne), transformer, booster, libérer, révolutionner, innovant, solution,
  univers, plonger, au cœur de, véritable, incontournable, « n'hésitez pas ».
- **Un texte rédigé par Claude** porte `brouillon: true` et n'utilise que des faits donnés par
  Téo. Le ressenti reste vide plutôt qu'inventé.

## 8. Images et preuves

- Seules images du site : les 12 figures de procédé, dessinées par Téo (`aria-hidden`, le texte
  porte le sens), et l'image de partage `public/og.png`.
- Photos réelles disponibles, **à fournir** : les projets (montages, captures d'outils) et un
  portrait. Aucune photo de banque d'images, aucune image générée.
- **Aucun avis, aucune note, aucun compteur, aucun logo d'entreprise.** Les noms des
  entreprises de stage s'écrivent en texte.
