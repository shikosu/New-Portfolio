# DEPLOIEMENT.md — de `git push` au Raspberry Pi

> Chaîne décidée en phase 2 : **image Docker construite par GitHub Actions, publiée sur GHCR,
> récupérée par le Pi.** Le Pi ne compile jamais et n'expose aucun port vers l'extérieur.

---

## 1. Le trajet complet

```
   ton Mac                GitHub                        Raspberry Pi
   ───────                ──────                        ────────────
   git push  ──────►  Actions (runner x86)
                          │
                          ├─ npm ci
                          ├─ npm run check   ◄── si ça échoue, STOP :
                          │                      le Pi garde l'ancienne version
                          ├─ npm run build ──► dist/
                          │
                          └─ docker build --platform linux/arm64
                                   │
                                   ▼
                              GHCR (ghcr.io)
                                   │
                                   │   Watchtower interroge toutes les 5 min
                                   ▼
                          docker pull + restart ──►  Nginx sert dist/
                                                            │
                                                     tunnel Cloudflare
                                                            │
                                                            ▼
                                                     v4.teovidal.eu
```

**Le sens des flèches est le point important.** C'est toujours le Pi qui va chercher, jamais
GitHub qui pousse. Conséquence : aucun port à ouvrir sur ta box, aucune clé SSH à confier à
GitHub, et rien à reconfigurer si ton IP publique change.

---

## 2. Pourquoi le build n'est pas émulé

Le Pi 5 est en **arm64**, les runners GitHub en **x86_64**. Construire une image arm64 depuis
un runner x86 fait normalement tourner chaque `RUN` sous émulation QEMU — `npm ci` et
`vite build` passent alors de ~40 s à 10-15 min.

Le `Dockerfile` contourne ça :

```dockerfile
FROM --platform=$BUILDPLATFORM node:22-alpine AS build   # ← x86 natif, rapide
...
FROM nginx:1.29-alpine                                   # ← arm64, la cible
COPY --from=build /app/dist /usr/share/nginx/html        # ← une copie, rien à exécuter
```

L'étape lourde tourne en natif ; l'image arm64 finale ne fait que recevoir des fichiers.
Aucune instruction arm n'est exécutée pendant le build.

---

## 3. Ce qu'il te reste à faire — côté GitHub

1. **Créer le dépôt.** Sur github.com, nouveau dépôt (`portfolio` ou `irchi-v4`), **vide** :
   pas de README, pas de .gitignore, pas de licence — ils entreraient en conflit avec le
   commit existant.

2. **Le brancher et pousser :**

   ```bash
   cd ~/Documents/portfolio
   git remote add origin git@github.com:<ton-pseudo>/<le-depot>.git
   git push -u origin main
   ```

3. **Vérifier l'onglet Actions.** Le workflow part tout seul au premier push. S'il échoue,
   lis l'erreur : dans 9 cas sur 10, c'est `npm run check` qui fait son travail.

4. **Rendre le paquet public.** Par défaut GHCR publie en privé, et le Pi ne pourra pas le
   télécharger sans identifiants. Page du dépôt → *Packages* → le paquet → *Package settings*
   → *Change visibility* → **Public**.

   > C'est un site vitrine composé de fichiers déjà servis publiquement : il n'y a rien à
   > protéger. Si tu préfères le garder privé, il faudra un `docker login ghcr.io` sur le Pi
   > avec un jeton d'accès personnel (portée `read:packages`).

---

## 4. Ce qu'il te reste à faire — côté Raspberry Pi

1. **Déposer le compose :**

   ```bash
   mkdir -p ~/mon-cloud/irchi && cd ~/mon-cloud/irchi
   # copier deploy/docker-compose.pi.yml ici, sous le nom docker-compose.yml
   ```

2. **Corriger le nom de l'image** dans le fichier : `ghcr.io/<ton-pseudo>/<le-depot>:latest`,
   **en minuscules** — GHCR refuse les majuscules.

3. **Vérifier que le port 8082 est libre** (`docker ps` : la colonne PORTS). S'il est pris,
   change le premier nombre de `"8082:80"`, pas le second.

4. **Démarrer :**

   ```bash
   docker compose up -d
   docker compose logs -f irchi     # Ctrl-C pour sortir
   curl -I http://localhost:8082    # doit répondre HTTP/1.1 200 OK
   ```

5. **Brancher le tunnel Cloudflare.** Zero Trust → Networks → Tunnels → ton tunnel →
   *Public Hostname* → *Add* :

   | Champ | Valeur |
   |---|---|
   | Subdomain | `v4` |
   | Domain | `teovidal.eu` |
   | Service type | `HTTP` |
   | URL | `localhost:8082` |

   > ⚠️ Le jeton de ce tunnel avait été exposé dans une conversation précédente. Si ce n'est
   > pas déjà fait, régénère-le avant d'ajouter ce nom d'hôte.

---

## 5. Vérifier que le déploiement automatique fonctionne

Le test qui compte, à faire une fois :

```bash
# sur le Mac : une modification visible
# (par exemple le texte d'une page dans src/pages/)
git commit -am "test: verification de la chaine de deploiement"
git push
```

Puis attendre. Compte **2 à 3 min** pour Actions, puis **jusqu'à 5 min** pour que Watchtower
remarque la nouvelle image (il interroge toutes les 300 s). Si la modification apparaît sur
`v4.teovidal.eu` sans que tu aies touché au Pi, la chaîne est bouclée et la phase 2 est close.

Pour ne pas attendre Watchtower pendant une mise au point :

```bash
docker compose pull && docker compose up -d
```

---

## 6. La bascule vers teovidal.eu — plus tard

Prévue **fin de phase 5**, quand le site sera présentable. Il n'y aura rien à reconstruire :
dans le tunnel Cloudflare, changer le nom d'hôte public de `v4.teovidal.eu` en
`teovidal.eu` et faire pointer l'ancien vers l'archive. L'image, elle, ne change pas.

---

## 7. Pannes courantes

| Symptôme | Cause la plus probable |
|---|---|
| `denied` au `docker pull` sur le Pi | Le paquet GHCR est resté privé (§3.4), ou le nom contient une majuscule |
| Page blanche, console : erreur MIME | `try_files` absent de la config Nginx — l'image ne contient pas `deploy/nginx.conf` |
| `/experience` en accès direct → 404 | Même cause : c'est exactement ce que `try_files` corrige |
| Le site ne se met pas à jour | Watchtower ne tourne pas, ou le label `watchtower.enable=true` manque sur le conteneur |
| Ancienne version après un déploiement | `index.html` mis en cache par le navigateur — la config le passe en `no-cache`, vider le cache une fois |
| Build Actions interminable (>10 min) | Le `--platform=$BUILDPLATFORM` a sauté du Dockerfile : tout s'exécute sous émulation |
