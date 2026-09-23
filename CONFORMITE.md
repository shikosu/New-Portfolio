# CONFORMITÉ — Portfolio Irchi (chantier du 2026-09-23)

> Le livrable du chantier de mise en conformité légale. Il reprend ce qui a été fait, ce que toi
> seul peux faire, et ce qui ne s'applique pas (avec la raison, pour que tu puisses me contredire).
> Branche : `conformite-legale`. Rien n'est commité : relis, puis `npm run check` et commit.

## Ton cas, en une ligne

Portfolio **non commercial** d'une **personne physique** en France, **0 salarié, 0 €**, hébergé
**chez toi** (Raspberry Pi) derrière un **tunnel Cloudflare**. Aucune vente, aucun compte, aucun
formulaire, aucun cookie, aucun script tiers. Contact par liens directs.

---

## 1. Fichiers créés ou modifiés

| Fichier | Changement |
|---|---|
| `src/content/legal.ts` | **créé** — identité (éditeur = hébergeur), textes des mentions légales, de la politique de confidentialité, du bandeau et du pied de page |
| `src/content/traceurs.ts` | **créé** — registre des traceurs soumis à consentement, **vide** |
| `src/content/types.ts` | ajout des types `PageLegale`, `SectionLegale`, `Tableau` |
| `src/lib/consentement.ts` | **créé** — magasin du consentement, blocage des scripts avant accord, expiration à 6 mois |
| `src/components/legal/PageLegale.tsx` | **créé** — gabarit des pages annexes (h1, date, ancres via Lenis) |
| `src/components/legal/BlocLegal.tsx` | **créé** — une section : h2, paragraphes, liste, tableau accessible, liens |
| `src/components/legal/BandeauConsentement.tsx` | **créé** — bandeau (éteint tant que le registre est vide) |
| `src/components/layout/PiedDePage.tsx` | **créé** — pied de page unifié, sous toutes les pages |
| `src/pages/MentionsLegales.tsx` | **créé** — route `/mentions-legales` |
| `src/pages/Confidentialite.tsx` | **créé** — route `/confidentialite` (+ section `#cookies` calculée depuis le registre) |
| `src/lib/parcours.ts` | ajout de `ANNEXES`, `estAnnexe()`, `libelleDe()` et des deux chargeurs |
| `src/components/layout/TransitionPages.tsx` | routes annexes ; bascule instantanée vers/depuis une annexe ; pied de page dans la scène |
| `src/components/layout/Shell.tsx` | lien d'évitement « Aller au contenu », `id="contenu"`, démarrage du consentement, bandeau, titre d'onglet via `libelleDe` |
| `src/components/layout/Nav.tsx` | fond `bg-ground` sur les annexes (le texte passait sous la barre) ; `flex-wrap` (« 10 Projets » coupé à 390 px) |
| `src/components/rail/Rail.tsx` | **h1** masqué par page (aucune page n'en avait) ; `aria-labelledby` |
| `src/pages/{Presentation,Objectifs,Experience,Projets}.tsx` | accents rétablis dans les libellés lus par les lecteurs d'écran |
| `index.html` | JSON-LD `Person` ; mentions légales et confidentialité résumées dans le `<noscript>` |
| `public/robots.txt` | **créé** — recherche IA autorisée, entraînement refusé |
| `public/sitemap.xml` | **créé** — 6 URL |
| `public/llms.txt` | **créé** — description du site pour les agents IA |
| `public/favicon.svg` | **remplacé** — c'était le logo de Vite (marque tierce) ; provisoire, à redessiner par toi |
| `public/icons.svg` | **supprimé** — sprite du gabarit Vite (logos Bluesky, Discord, GitHub, X), jamais utilisé |
| `deploy/docker-compose.pi.yml` | journaux Docker bornés (3 × 10 Mo) |
| `CLAUDE.md`, `CONTENU.md` | règle des pages annexes, arborescence |

---

## 2. Point par point

**1. Mentions légales — s'applique (LCEN, tout site édité depuis la France).**
Page `/mentions-legales`, liée depuis le pied de page de toutes les pages et résumée dans le
`<noscript>` (sans JavaScript, la route n'existe pas). Contenu : éditeur, directeur de la
publication, hébergeur, prestataire d'acheminement (Cloudflare), propriété intellectuelle,
liens externes, droit applicable.
⚠️ Tu es **ton propre hébergeur** : l'option d'anonymat réservée aux non-professionnels suppose
un hébergeur tiers qui détient ton identité. Elle ne joue donc pas ; tu publies ton adresse et un
téléphone (choix validé le 2026-09-23).

**2. Politique de confidentialité — s'applique (RGPD).**
Trois traitements réels, trouvés dans le code et la config :
(a) journaux de Cloudflare (IP, pays) — intérêt légitime, transfert US sous DPF ;
(b) journaux Nginx — **sans l'IP du visiteur** (le serveur ne voit que le tunnel : aucune
directive `real_ip`) ; (c) e-mails reçus. Droits, contact, CNIL. Portabilité déclarée non
applicable (aucun traitement fondé sur le consentement ou un contrat).

**3. Cookies — inventaire : zéro traceur non nécessaire → PAS de bandeau.**
Le seul cookie possible est `__cf_bm` de Cloudflare (sécurité, 30 min, exempté). Comme demandé,
le mécanisme complet est prêt mais **éteint** : `content/traceurs.ts` vide = aucun bandeau.
Une entrée dans ce registre suffit à allumer : bandeau (« Tout refuser » = même composant que
« Tout accepter »), aucun script avant accord, choix gardé 182 jours, bouton « Gérer mes cookies »
dans le pied de page, tableau des traceurs dans la politique, redemande si la liste change.
**Testé au navigateur** avec un faux traceur : rien chargé avant choix, refus mémorisé,
réouverture avec focus, accord → script injecté, retrait → rechargement sans script,
choix de plus de 6 mois → bandeau redemandé.

**7. Formulaires — ne s'applique pas** (aucun formulaire, contact par liens directs).

**8. Services tiers.**

| Service | Ce qu'il voit | Traceur | Hors UE | Verdict |
|---|---|---|---|---|
| Cloudflare (tunnel, cache, anti-DDoS) | IP, URL, navigateur, pays | `__cf_bm` possible, nécessaire | Oui (US, DPF) | **Nécessaire** — déclaré dans la politique |
| Polices Chakra Petch / IBM Plex Mono | — | Non | Non | Déjà auto-hébergées (`@fontsource`) ✔ |
| GSAP, Lenis, React | — | Non | Non | Empaquetés dans le build ✔ |
| GitHub (lien sortant) | Rien tant qu'on ne clique pas | Non | — | Simple lien ✔ |
| Futur outil de mesure | — | — | — | Préférer **auto-hébergé sur le Pi** (Umami, Matomo) ; voir « à faire » |

**9. Accessibilité — recommandée (pas obligatoire pour toi).** Corrigé : un h1 par page
(il n'y en avait aucun), lien d'évitement, libellés accentués, nav qui passe à la ligne sur
mobile, texte des annexes lisible sous la barre fixe, tableau défilable au clavier avec
`<caption>` et en-têtes `scope`. Déjà conforme avant : `lang="fr"`, contrastes mesurés (§10),
focus visible, figures `aria-hidden`, liens externes annoncés, mode animations réduites.
Pas de page « Déclaration d'accessibilité » : tu n'y es pas soumis.

**10. Agents IA — s'applique (ton choix : recherche oui, entraînement non).**
`robots.txt` (bloque GPTBot, ClaudeBot, Google-Extended, CCBot, Applebot-Extended,
Meta-ExternalAgent, Bytespider… ; autorise OAI-SearchBot, ChatGPT-User, Claude-SearchBot,
Claude-User, PerplexityBot), `sitemap.xml`, `llms.txt`, JSON-LD `Person`. Structure déjà
bonne (`nav`, `main`, `section`, `article`, titres). Limite connue : **SPA sans pré-rendu**,
le contenu n'existe qu'après JavaScript — `llms.txt` et le `<noscript>` compensent en partie.

**11. Contenu.** Aucun avis client, aucune promesse chiffrée, aucun comparatif, aucun « gratuit ».
Les 12 figures sont les tiennes, `og.png` aussi. Deux fichiers à risque corrigés :
`favicon.svg` était **le logo de Vite** et `icons.svg` contenait les logos de Bluesky, Discord,
GitHub et X (reliquats du gabarit). Les entreprises de stage sont citées en texte, sans logo :
c'est un usage descriptif, admis — mais voir « à faire » sur la confidentialité des missions.

**12. Coordonnées et pied de page.** Pied de page unique sous toutes les pages : signature,
contact, mentions légales, confidentialité, cookies. Incohérences trouvées :
- l'e-mail de contact n'existe nulle part (ni bloc 12, ni mentions) → le pied de page
  affiche GitHub en attendant, et basculera tout seul sur l'e-mail dès qu'il sera renseigné ;
- le domaine est écrit en dur dans 5 fichiers (`index.html`, `content/legal.ts`,
  `robots.txt`, `sitemap.xml`, `llms.txt`) → tous à changer ensemble à la bascule ;
- l'identité est recopiée dans `index.html` (`<noscript>`) et `content/legal.ts`.

**13. Autres risques.**
- **Journaux Docker illimités** : par défaut Docker garde tout, pour toujours. Corrigé dans
  `docker-compose.pi.yml` (3 × 10 Mo) — **à recopier sur le Pi**.
- **Cloudflare Web Analytics** peut injecter un script de mesure sans que le code le sache
  (option « automatic setup » du tableau de bord). S'il est actif, la politique est fausse.
- **Watchtower** a accès au socket Docker du Pi (droits root sur la machine). Pas un point RGPD,
  mais une surface d'attaque sur un serveur exposé.
- Pas de page 404 : une adresse inconnue affiche une page vide (hors conformité, à prévoir).

---

## 3. À FAIRE PAR UN HUMAIN (toi)

1. **Remplir `src/content/legal.ts` → `EDITEUR`** : adresse postale, téléphone (qui répond ;
   une ligne secondaire convient), e-mail de contact. **Et la même chose dans le `<noscript>`
   d'`index.html`.** Chercher `[À COMPLÉTER` dans tout le projet : il ne doit plus en rester.
2. **Nommer ton fournisseur de messagerie** (section « Qui y a accès ») et, s'il est hors UE
   (Gmail → Google, US), indiquer le transfert (DPF) dans « Transferts ».
3. **Cloudflare, dans le tableau de bord :** (a) vérifier la durée de conservation des journaux
   et remplacer le `[À VÉRIFIER]` du tableau ; (b) vérifier que **Web Analytics / RUM est
   désactivé** (sinon : un traceur non déclaré) ; (c) noter si Bot Fight Mode est actif
   (`__cf_bm`).
4. **Copier le nouveau `docker-compose.pi.yml` sur le Pi** puis
   `docker compose -f docker-compose.pi.yml up -d` (les limites de journaux ne valent qu'après).
5. **Relire et passer `brouillon: false`** sur `MENTIONS_LEGALES` et `CONFIDENTIALITE` —
   c'est ta règle du §5, pas la mienne.
6. **Mesure d'audience, le jour venu** : choisir l'outil (recommandation : Umami ou Matomo
   **auto-hébergé sur le Pi**, qui garde les données en France). Si tu le configures dans les
   conditions d'exemption CNIL (statistiques anonymes pour toi seul, pas de suivi inter-sites,
   cookie ≤ 13 mois, données ≤ 25 mois), il pourrait se passer de bandeau ; sinon, une entrée
   dans `content/traceurs.ts` allume tout le dispositif. Dans les deux cas : mettre à jour
   `content/legal.ts` (nouveau traitement) dans le même commit.
7. **Stages** : vérifier que les détails publiés (« filtrage de bots en Go » chez Adagio…) ne
   sont pas couverts par une clause de confidentialité de ta convention de stage.
8. **Favicon** : le mien est provisoire (la piste et un boîtier) — à redessiner si tu veux.
9. **Bascule vers teovidal.eu** : changer le domaine dans `index.html`, `content/legal.ts`,
   `robots.txt`, `sitemap.xml`, `llms.txt`.
10. Garder `llms.txt` à jour quand tu réécris les blocs (il reprend les brouillons actuels).
11. **Avocat** : pas indispensable pour ton cas (pas de vente, pas de données sensibles).
    À prévoir si le site devient professionnel (micro-entreprise, prestations, formulaire).
12. Definition of done (§13) : tester au clavier, en « réduire les animations », et en
    `npm run preview` sur ton Mac.

---

## 4. Ce que j'ai jugé NON applicable — contredis-moi si besoin

| Point | Pourquoi |
|---|---|
| 4. CGV | Tu ne vends rien, ni produit ni service. |
| 5. CGU | Pas de compte, pas d'espace connecté, pas de contenu publié par les visiteurs. |
| 6. Médiateur de la consommation | Obligatoire seulement pour qui vend à des particuliers. |
| 7. Formulaires | Aucun formulaire (choix : liens directs). |
| Bandeau cookies (actif) | Zéro traceur non nécessaire : un bandeau serait une gêne et une information fausse. Prêt, éteint. |
| Déclaration d'accessibilité | Réservée aux organismes et entreprises assujettis ; tu n'as ni activité ni CA. |
| Page « Politique de cookies » séparée | Intégrée à `/confidentialite#cookies` : une page de plus pour dire « aucun » serait vide. |
| Mentions « professionnelles » (SIRET, RCS, TVA, capital) | Site non professionnel édité par une personne physique. **Change si tu y proposes un jour tes services freelance** : tu deviendrais éditeur professionnel. |
