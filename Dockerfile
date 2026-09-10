# =====================================================================
# Image du portfolio : un serveur Nginx qui sert des fichiers statiques.
#
# Astuce importante : --platform=$BUILDPLATFORM sur l'etape de build.
# Sans elle, construire une image arm64 (le Raspberry Pi) depuis un
# runner x86 ferait tourner npm et Vite sous emulation QEMU : 10 a 15
# minutes au lieu de 40 secondes. Avec elle, la compilation se fait en
# natif sur le runner, et seule l'image FINALE est en arm64 — elle ne
# contient que des fichiers copies, aucun code a executer au build.
# =====================================================================

# --------- etape 1 : compilation (en natif, quelle que soit la cible) ---------
FROM --platform=$BUILDPLATFORM node:22-alpine AS build
WORKDIR /app

# package.json + package-lock.json d'abord, SEULS : tant qu'ils ne changent
# pas, Docker reutilise le cache de `npm ci` et saute l'installation.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# --------- etape 2 : service (arm64 pour le Pi) ---------
FROM nginx:1.29-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
