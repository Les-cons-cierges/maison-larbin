# 🏠 Maison Larbin — Conciergerie d'entreprise

> Projet de groupe réalisé dans le cadre de la formation **Développeur Web et Web Mobile (DWWM)** — CEPPIC d'Isneauville

---

## 📋 Sommaire

1. [Présentation](#présentation)
2. [Équipe](#équipe)
3. [Fonctionnalités](#fonctionnalités)
4. [Stack technique](#stack-technique)
5. [Architecture du projet](#architecture-du-projet)
6. [Modèle de données](#modèle-de-données)
7. [Rôles utilisateurs](#rôles-utilisateurs)
8. [Installation & déploiement](#installation--déploiement)
9. [Conception](#conception)
10. [Licence](#licence)

---

## Présentation

**Maison Larbin** est une application web de conciergerie d'entreprise **BtoB**. Elle centralise des services du quotidien, de l'organisation professionnelle et une assistance premium au sein d'une plateforme unique, accessible par abonnement.

Le service s'adresse aux **PME et grandes entreprises** souhaitant améliorer la qualité de vie au travail (QVT) de leurs collaborateurs, en proposant trois niveaux de services adaptés au statut de chaque utilisateur.

---

## Équipe

| Membre              | GitHub |
|---------------------|--------|
| Juliette Defrance   |        |
| Héloïse Marie       |        |
| Thomas Delville     |        |

---

## Fonctionnalités

### 🟢 Palier Employés — Services du quotidien
- Carte interactive géolocalisée (Google Maps) recensant les services de proximité (restaurants, commerces, services médicaux, loisirs…)
- Réservation directe via la plateforme
- Accès à des offres et remises négociées avec des partenaires locaux
- Système de favoris (bookmarks) et partage de services

### 🔵 Palier Cadres — Assistance professionnelle
- Formulaire de demande personnalisée traité par des agents Maison Larbin
- Organisation logistique : réservation de salles, nettoyage de véhicules, team building, séminaires…
- Suivi de l'avancement des requêtes (statut, assignation)

### 🟣 Palier Dirigeants — Conciergerie premium 24/7
- Assistance disponible 24h/24, 7j/7
- Gestion des urgences et des demandes exceptionnelles
- Interventions personnalisées (livraisons express, déplacements, achats sur demande…)

### 🛠️ Administration
- **Back-office client** : tableau de bord par entreprise, gestion des utilisateurs rattachés
- **Back-office Maison Larbin** : gestion de l'ensemble des requêtes, des utilisateurs et des entreprises clientes (EasyAdmin)

---

## Stack technique

| Domaine           | Technologies                                              |
|-------------------|-----------------------------------------------------------|
| Backend           | PHP 8.4, Symfony 8.0                                      |
| Frontend          | React 19, Vite 7, TailwindCSS 4, Three.js, Lenis          |
| Templating        | Twig, Symfony UX Turbo, Twig Components                   |
| Base de données   | MySQL / Doctrine ORM                                      |
| Administration    | EasyAdmin 5                                               |
| Authentification  | Symfony Security, symfonycasts/reset-password-bundle      |
| API               | Google Maps API (@vis.gl/react-google-maps)               |
| Tests             | PHPUnit 13                                                |
| Versionning       | Git / GitHub                                              |
| Environnement     | MAMP (local), Symfony CLI                                 |

---

## Architecture du projet

```
maison-larbin/
├── assets/               # Sources front-end (React, CSS, JS)
│   ├── component/        # Composants React (App, pages, UI)
│   ├── controllers/      # Contrôleurs Stimulus
│   ├── fonts/            # Polices (Made Mirage, Nunito)
│   └── styles/           # Feuilles de style globales
├── config/               # Configuration Symfony (packages, routes, services)
├── documentation/        # Documentation technique (BDD, déploiement)
├── migrations/           # Migrations Doctrine
├── public/               # Point d'entrée web et assets compilés
├── src/
│   ├── Controller/
│   │   ├── Admin/              # Back-office client (EasyAdmin)
│   │   ├── AdminMaisonLarbin/  # Back-office staff (EasyAdmin)
│   │   ├── HomeController.php
│   │   ├── MapsController.php
│   │   ├── ProfilController.php
│   │   ├── RequeteController.php
│   │   ├── RegistrationController.php
│   │   ├── EntrepriseRegistrationController.php
│   │   ├── SecurityController.php
│   │   └── ResetPasswordController.php
│   ├── Entity/           # Entités Doctrine (User, Entreprise, Requete, Categorie)
│   ├── Form/             # Formulaires Symfony
│   ├── Repository/       # Repositories Doctrine
│   └── Twig/             # Extensions Twig
├── templates/            # Templates Twig
├── tests/                # Tests PHPUnit
├── compose.yaml          # Docker Compose
├── vite.config.js        # Configuration Vite
└── importmap.php         # Import map Symfony AssetMapper
```

---

## Modèle de données

La base est organisée autour de **4 tables principales** :

| Table          | Description                                                      |
|----------------|------------------------------------------------------------------|
| `users`        | Tous les utilisateurs (clients + staff), rôles et connexion      |
| `entreprises`  | Entreprises clientes (SIRET, adresse, abonnement)                |
| `requetes`     | Demandes de service (titre, description, statut, dates)          |
| `categories`   | Catégories de services/demandes                                  |

**Relations clés :**
- `users.entreprise_id → entreprises.id` — Un utilisateur est rattaché à une entreprise cliente *(nullable pour le staff)*
- `requetes.auteur_id → users.id` — L'utilisateur qui soumet la demande
- `requetes.assignee_id → users.id` — Le membre du staff qui traite la demande *(nullable)*
- `requetes.entreprise_id → entreprises.id` — L'entreprise concernée
- `requetes.categorie_id → categories.id` — La catégorie de la demande

> 📊 Voir le schéma complet : [`documentation/BDD/modelisationBDD.png`](documentation/BDD/modelisationBDD.png)

---

## Rôles utilisateurs

La hiérarchie des rôles est la suivante (chaque rôle hérite des droits du rôle inférieur) :

| Rôle               | Accès                                                       |
|--------------------|-------------------------------------------------------------|
| `ROLE_USER`        | Profil, inscription entreprise                              |
| `ROLE_EMPLOYE`     | Carte géolocalisée (`/maps`)                                |
| `ROLE_CADRE`       | Formulaire de requêtes (`/requete`)                         |
| `ROLE_DIRECTION`   | Conciergerie premium 24/7                                   |
| `ROLE_ADMIN`       | Back-office client (tableau de bord entreprise)             |
| `ROLE_ADMIN_STAFF` | Back-office Maison Larbin — accès complet (`/maison-larbin/admin`) |

> ℹ️ `ROLE_ADMINCLIENT` est le rôle assigné par défaut à la création d'un compte.

---

## Installation & déploiement

> 📖 Guide de déploiement complet : [`documentation/DEPLOIEMENT.md`](documentation/DEPLOIEMENT.md)

### Prérequis

| Outil       | Version minimale  | Vérification         |
|-------------|-------------------|----------------------|
| PHP         | **8.4**           | `php -v`             |
| Composer    | **2.x**           | `composer -V`        |
| Node.js     | **18.x**          | `node -v`            |
| npm         | **9.x**           | `npm -v`             |
| MAMP        | **5.x+**          | Interface graphique  |
| Git         | toute version     | `git --version`      |
| Symfony CLI | 5.x *(optionnel)* | `symfony version`    |

### Démarrage rapide

```bash
# 1. Cloner le dépôt
git clone https://github.com/Les-cons-cierges/maison-larbin.git
cd maison-larbin

# 2. Installer les dépendances PHP
composer install

# 3. Installer les dépendances JavaScript
npm install

# 4. Configurer les variables d'environnement
cp .env .env.local
# Renseigner DATABASE_URL, APP_SECRET, GOOGLE_MAPS_API_KEY, etc.

# 5. Créer la base de données et jouer les migrations
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate

# 6. Compiler les assets front-end (mode développement)
npm run dev

# 7. Lancer le serveur de développement
symfony server:start
```

### Variables d'environnement principales

| Variable             | Description                        |
|----------------------|------------------------------------|
| `DATABASE_URL`       | URL de connexion MySQL              |
| `APP_SECRET`         | Clé secrète Symfony                 |
| `GOOGLE_MAPS_API_KEY`| Clé API Google Maps                 |
| `MAILER_DSN`         | Configuration du service mail       |

---

## Conception

| Livrable               | Lien         |
|------------------------|--------------|
| Diagramme UML          |              |
| Wireframes             |              |
| Modèle de BDD          | [`documentation/BDD/modelisationBDD.png`](documentation/BDD/modelisationBDD.png) |
| Charte graphique       | [`assets/design/charte-graphique.jpg`](assets/design/charte-graphique.jpg) |
| Exemples de polices    | [`assets/design/exemple-fonts.jpg`](assets/design/exemple-fonts.jpg) |
| Logo                   | [`assets/design/logo/`](assets/design/logo/) |

---

## Licence

Projet réalisé dans un cadre pédagogique — **CEPPIC DWWM** — Isneauville.
