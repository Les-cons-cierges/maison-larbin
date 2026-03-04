# 🚀 Guide de Déploiement — Maison Larbin

> Projet réalisé dans le cadre de la formation **DWWM** — CEPPIC Isneauville  
> Stack : **Symfony 8** · **React 19** · **Vite** · **TailwindCSS 4** · **MySQL** · **MAMP**

---

## 📋 Sommaire

1. [Prérequis](#1-prérequis)
2. [Cloner le dépôt](#2-cloner-le-dépôt)
3. [Installer les dépendances PHP](#3-installer-les-dépendances-php)
4. [Installer les dépendances JavaScript](#4-installer-les-dépendances-javascript)
5. [Configurer les variables d'environnement](#5-configurer-les-variables-denvironnement)
6. [Configurer et lancer MAMP](#6-configurer-et-lancer-mamp)
7. [Créer la base de données et jouer les migrations](#7-créer-la-base-de-données-et-jouer-les-migrations)
8. [Compiler les assets front-end](#8-compiler-les-assets-front-end)
9. [Lancer le serveur de développement](#9-lancer-le-serveur-de-développement)
10. [Vider le cache](#10-vider-le-cache)
11. [Démarrage rapide (résumé)](#11-démarrage-rapide-résumé)
12. [Référence des ports](#12-référence-des-ports)
13. [Référence des variables d'environnement](#13-référence-des-variables-denvironnement)
14. [Problèmes courants](#14-problèmes-courants)

---

## 1. Prérequis

Assurez-vous d'avoir installé les outils suivants sur votre machine :

| Outil          | Version minimale  | Commande de vérification  |
|----------------|-------------------|---------------------------|
| PHP            | **8.4**           | `php -v`                  |
| Composer       | **2.x**           | `composer -V`             |
| Node.js        | **18.x**          | `node -v`                 |
| npm            | **9.x**           | `npm -v`                  |
| MAMP           | **5.x ou +**      | Interface graphique       |
| Git            | toute version     | `git --version`           |
| Symfony CLI    | 5.x *(optionnel)* | `symfony version`         |

> 💡 La Symfony CLI n'est pas obligatoire mais fortement recommandée pour le développement local.

---

## 2. Cloner le dépôt

```bash
git clone https://github.com/Les-cons-cierges/maison-larbin.git
cd maison-larbin
```

---

## 3. Installer les dépendances PHP

```bash
composer install
```

> **En production**, utilisez :
> ```bash
> composer install --no-dev --optimize-autoloader
> ```
> Cela exclut les packages de développement et optimise l'autoloader.

---

## 4. Installer les dépendances JavaScript

```bash
npm install
```

Cela installe notamment :
- **React 19** + **React DOM**
- **Vite 7** + **TailwindCSS 4**
- **Hamburgers** (menu mobile)
- **Lenis** (smooth scroll)
- **Three.js**
- **@vis.gl/react-google-maps** (carte Google Maps)

---

## 5. Configurer les variables d'environnement

### En développement

Créez un fichier `.env.local` à la racine *(ce fichier n'est pas versionné)* :

```bash
cp .env .env.local
```

Éditez ensuite `.env.local` avec vos propres valeurs :

```dotenv
# Environnement
APP_ENV=dev
APP_SECRET=<chaine_aléatoire_32_caractères>

# Base de données MySQL via MAMP
DATABASE_URL="mysql://root:root@127.0.0.1:8889/maison-larbin?serverVersion=8.0.32&charset=utf8mb4"

# Mailer — laisser null en développement
MAILER_DSN=null://null

# Messenger
MESSENGER_TRANSPORT_DSN=doctrine://default?auto_setup=0

# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=<votre_clé_api_google_maps>
VITE_GOOGLE_MAPS_MAP_ID=<votre_map_id>
```

> ⚠️ **Ne commitez jamais vos secrets** dans `.env`.  
> Consultez la doc Symfony : [gestion des secrets](https://symfony.com/doc/current/configuration/secrets.html)

### En production

Compilez les variables d'environnement :

```bash
composer dump-env prod
```

---

## 6. Configurer et lancer MAMP

MAMP fournit un serveur **Apache**, **PHP** et **MySQL** en local sur macOS.

### Installation
Téléchargez et installez MAMP depuis → [https://www.mamp.info](https://www.mamp.info)

### Configuration

1. Ouvrez **MAMP** et cliquez sur **Préférences**
2. Dans l'onglet **Ports**, vérifiez que MySQL tourne sur le port **8889**
3. Dans l'onglet **PHP**, sélectionnez la version **8.4**
4. Cliquez sur **OK** puis sur **Start** pour démarrer les serveurs

### Vérification

Une fois MAMP démarré, ouvrez **phpMyAdmin** via le bouton **WebStart** ou directement sur :
```
http://localhost:8888/phpMyAdmin
```

> Les identifiants par défaut de MAMP sont `root` / `root`.

> ⚠️ Assurez-vous que MAMP est bien démarré **avant** de jouer les migrations Doctrine.

---

## 7. Créer la base de données et jouer les migrations

```bash
# Créer la base de données
php bin/console doctrine:database:create

# Jouer toutes les migrations
php bin/console doctrine:migrations:migrate
```

Vérifier l'état des migrations :
```bash
php bin/console doctrine:migrations:status
```

---

## 8. Compiler les assets front-end

### En développement — serveur Vite avec Hot Reload

```bash
npm run dev
```

> Vite démarre sur `http://localhost:5173`. **Laissez ce terminal ouvert** pendant tout le développement.

### En production — build optimisé

```bash
# 1. Compiler les assets React / TailwindCSS
npm run build

# 2. Publier les assets via l'Asset Mapper Symfony
php bin/console asset-map:compile
```

---

## 9. Lancer le serveur de développement

### Avec la Symfony CLI *(recommandé)*

```bash
symfony server:start
```

L'application est accessible sur → **https://127.0.0.1:8000**

### Avec le serveur PHP intégré

```bash
php -S localhost:8000 -t public/
```

---

## 10. Vider le cache

À faire après toute modification de configuration ou de templates Twig :

```bash
# Développement
php bin/console cache:clear

# Production
php bin/console cache:clear --env=prod
php bin/console cache:warmup --env=prod
```

---

## 11. Démarrage rapide (résumé)

Toutes les commandes dans l'ordre :

```bash
# Cloner le projet
git clone https://github.com/Les-cons-cierges/maison-larbin.git
cd maison-larbin

# Dépendances
composer install
npm install

# Variables d'environnement
cp .env .env.local
# ✏️  Éditez .env.local avec vos valeurs

# Lancez MAMP et démarrez les serveurs depuis l'interface graphique

# Migrations
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate

# Ouvrir deux terminaux :
# Terminal 1 — Assets Vite
npm run dev

# Terminal 2 — Serveur Symfony
symfony server:start
```

L'application est disponible sur **https://127.0.0.1:8000** 🎉

---

## 12. Référence des ports

| Service          | Port   | Description                          |
|------------------|--------|--------------------------------------|
| Symfony          | `8000` | Serveur web de l'application         |
| Vite (HMR)       | `5173` | Serveur de développement front-end   |
| MAMP Apache      | `8888` | Serveur web MAMP / phpMyAdmin        |
| MAMP MySQL       | `8889` | Base de données MySQL                |

---

## 13. Référence des variables d'environnement

| Variable                   | Exemple                          | Description                                |
|----------------------------|----------------------------------|--------------------------------------------|
| `APP_ENV`                  | `dev` / `prod` / `test`          | Environnement de l'application             |
| `APP_SECRET`               | `b3f4e5a6...` (32 chars)         | Clé secrète Symfony                        |
| `DATABASE_URL`             | `mysql://root:root@127.0.0.1:8889/...` | URL de connexion à MySQL (MAMP)   |
| `MAILER_DSN`               | `null://null`                    | DSN du serveur de mail                     |
| `MESSENGER_TRANSPORT_DSN`  | `doctrine://default?auto_setup=0`| DSN du transport Symfony Messenger         |
| `VITE_GOOGLE_MAPS_API_KEY` | `AIzaSy...`                      | Clé API Google Maps                        |
| `VITE_GOOGLE_MAPS_MAP_ID`  | `DEMO_MAP_ID`                    | Identifiant de la carte Google Maps        |

---

## 14. Problèmes courants

### ❌ Connexion à la base de données impossible
- Vérifiez que **MAMP est bien démarré** et que les serveurs Apache/MySQL sont actifs
- Vérifiez la valeur de `DATABASE_URL` dans `.env.local` (port `8889`, user `root`, password `root`)
- Ouvrez phpMyAdmin sur `http://localhost:8888/phpMyAdmin` pour vérifier que la BDD existe

### ❌ Les assets React/CSS ne s'affichent pas
- En développement : vérifiez que `npm run dev` est actif
- En production : relancez `npm run build` puis `php bin/console asset-map:compile`

### ❌ Erreur de cache Symfony
```bash
php bin/console cache:clear
```

### ❌ Permission refusée sur `var/` ou `public/uploads/`
```bash
chmod -R 777 var/
chmod -R 777 public/uploads/
```

### ❌ Migrations en conflit
```bash
php bin/console doctrine:migrations:status
php bin/console doctrine:schema:validate
```

---

*Documentation — Maison Larbin · Formation DWWM · CEPPIC Isneauville*
