# Irchi · portfolio de Téo Vidal

Étudiant en BUT GEII à l'IUT de Montpellier-Sète. Je cherche un stage, cap sur le
semi-conducteur.

**Site :** [v4.teovidal.eu](https://v4.teovidal.eu/)
**Contact :** [teo.vidal@etu.umontpellier.fr](mailto:teo.vidal@etu.umontpellier.fr)

## Le principe

Le site suit une ligne de fabrication de semi-conducteur, du sable de quartz au boîtier. On
avance de gauche à droite ; une ligne noire unique se trace au défilement. Chaque étape du
procédé fait apparaître une partie du contenu :

| Page | Étapes |
|---|---|
| Présentation | sable de quartz, four à arc, purification Siemens |
| Objectifs | tirage Czochralski, sciage du lingot, polissage CMP |
| Expérience | photolithographie, gravure, dopage |
| Projets et contact | test sous pointes (EWS), découpe, packaging |

L'ordre des étapes est celui du procédé réel. Les 12 figures sont dessinées à la main sous
Inkscape, au trait, pour être animées avec DrawSVG.

## Stack

Vite, React 19, TypeScript strict, Tailwind CSS v4, GSAP (ScrollTrigger, DrawSVG, SplitText),
Lenis, React Router v7. Polices auto-hébergées (Chakra Petch, IBM Plex Mono).

Accessibilité : le réglage « réduire les animations » est respecté, tout est atteignable au
clavier, et le contraste du texte courant est de 18:1.

## Lancer le projet

```bash
npm ci
npm run dev       # serveur de développement
npm run check     # typecheck + lint + build, avant chaque commit
npm run preview   # sert le build de production
```

## Hébergement

Image Docker construite par GitHub Actions, publiée sur GHCR, récupérée par un Raspberry Pi 5
qui la sert avec Nginx derrière un tunnel Cloudflare. Aucun port ouvert. Détail :
[`DEPLOIEMENT.md`](DEPLOIEMENT.md).

## Documentation

| Fichier | Contenu |
|---|---|
| [`DESIGN.md`](DESIGN.md) | la charte : couleurs, typographie, formes, mouvement, ton |
| [`CONTENU.md`](CONTENU.md) | chaque bloc : étape du procédé, message, mécanisme |
| [`ROADMAP.md`](ROADMAP.md) | les phases du projet |
| [`CLAUDE.md`](CLAUDE.md) | règles techniques du projet |
| [`CONFORMITE.md`](CONFORMITE.md) | mentions légales et données personnelles |

Ce projet est développé avec l'aide de Claude Code : `CLAUDE.md` est le cahier des charges
qu'il suit. Les choix de concept, le contenu et les figures sont les miens.
