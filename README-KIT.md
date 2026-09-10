# Kit de démarrage — Portfolio Irchi v4

Quatre fichiers, quatre rôles distincts. À lire dans cet ordre.

| Fichier | Quand tu le lis | Où il va |
|---|---|---|
| **SETUP.md** | Aujourd'hui, une seule fois | à la racine du dépôt |
| **CLAUDE.md** | Jamais en entier — c'est Claude qui le lit | **racine du dépôt** (obligatoire) |
| **ROADMAP.md** | Au début de chaque session de travail | racine du dépôt |
| **QUALITY.md** | À chaque fin de phase | racine du dépôt |

---

## Comment démarrer

```bash
# 1. Suivre SETUP.md jusqu'à l'étape 8
npm create vite@latest irchi-v4 -- --template react-ts
cd irchi-v4

# 2. Copier les 4 fichiers à la racine
cp .../CLAUDE.md .../ROADMAP.md .../QUALITY.md .

# 3. Ouvrir Claude Code dans ce dossier
claude
```

Claude Code lit `CLAUDE.md` automatiquement au démarrage. Tu n'as pas besoin de le lui rappeler ni de recoller le contexte à chaque session : c'est tout l'intérêt du fichier.

---

## Pourquoi CLAUDE.md et pas simplement expliquer à chaque fois

Sans le fichier, à chaque nouvelle conversation tu repars de zéro : Claude ne sait pas quelle bibliothèque tu utilises, propose Framer Motion, écrit du `useEffect` au lieu de `useGSAP`, invente des durées de 2 secondes. Tu passes ton temps à corriger.

Avec le fichier, les règles sont posées une fois. Il joue le rôle du cahier des charges dans un projet d'électronique : on ne redécrit pas la tension d'alimentation à chaque nouveau bloc du schéma.

**Il vit avec le projet.** Chaque fois que tu prends une décision (le comportement mobile du rail, une valeur de token, un choix d'architecture), tu l'écris dedans. Chaque fois que Claude fait une erreur deux fois, tu ajoutes la règle qui l'empêche.

---

## Le raccourci que je te déconseille

Tu vas être tenté de sauter la phase 0 (cadrage) et la phase 1 (prototype jetable) pour attaquer directement le vrai projet. C'est ce que fait tout le monde.

Le résultat est prévisible : tu codes le rail horizontal dans React sans avoir compris `containerAnimation`, tu passes trois jours à déboguer un problème qui aurait pris vingt minutes à isoler sur un CodePen vide, et tu finis par tout réécrire.

L'analogie est directe avec l'électronique : personne ne route un PCB sans avoir d'abord validé le montage sur plaque d'essai. Le prototype CodePen, c'est ta plaque d'essai.

---

## Ordre de travail par session

```
Ouvrir ROADMAP.md
      │
      ▼
Identifier LA tâche non cochée en cours
      │
      ▼
La faire (avec Claude si besoin)
      │
      ▼
npm run check
      │
      ▼
Cocher la case, commit
      │
      ▼
Fin de phase ? ──oui──► Dérouler QUALITY.md section B
      │ non
      ▼
Tâche suivante
```

Une tâche à la fois. Pas de branche parallèle, pas de « je vais juste ajouter vite fait ». C'est un projet solo : la seule chose qui peut le faire échouer, c'est de le disperser.
