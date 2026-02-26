# Maison Larbin — Conciergerie d'entreprise

> Projet de groupe réalisé dans le cadre de la formation **Développeur Web et Web Mobile (DWWM)** — CEPPIC d'Isneauville

---

## Présentation du projet

**Maison Larbin** est une application web de conciergerie d'entreprise BtoB. Elle centralise des services du quotidien, 
de l'organisation professionnelle et une assistance premium au sein d'une plateforme unique, accessible par abonnement.

Le service s'adresse aux PME et grandes entreprises souhaitant améliorer la qualité de vie au travail (QVT) de leurs 
collaborateurs.

---

## Équipe

| Membre              | Rôle |
|---------------------|------|
| [Juliette Defrance] |  |
| [Héloïse Marie]     |  |
| [Thomas Delville]   |  |

---

## Fonctionnalités

L'application propose trois niveaux de services selon le statut du collaborateur :

### Palier Employés — Services du quotidien
- Carte interactive géolocalisée recensant les services de proximité (restaurants, commerces, services médicaux, 
loisirs…)
- Réservation directe via la plateforme
- Accès à des offres et remises négociées avec des partenaires locaux
- Système de favoris (bookmarks) et partage de services

### Palier Cadres — Assistance professionnelle
- Formulaire de demande personnalisée traité par des agents Maison Larbin
- Organisation logistique : réservation de salles, nettoyage de véhicules, team building, séminaires…

### Palier Dirigeants — Conciergerie premium 24/7
- Assistance disponible 24h/24 et 7j/7
- Gestion des urgences et des demandes exceptionnelles
- Interventions personnalisées (livraisons express, déplacements, achats sur demande…)

---

## Stack technique

| Domaine         | Technologies                 |
|-----------------|------------------------------|
| Frontend        | HTML, CSS, JavaScript, React |
| Backend         | PHP, Symfony                 |
| Base de données | PostgreSQL                   |
| Versionning     | Git / GitHub                 |
| APIs            | Google API                   |

---

## Architecture du projet

```
maison-larbin/

```

---

## Installation

### Prérequis

- PHP >= 8.1
- Composer

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/<org>/maison-larbin.git
cd maison-larbin

# 2. Installer les dépendances PHP
composer install

# 3. Installer les dépendances JS
npm install

# 4. Configurer les variables d'environnement
cp .env.example .env
# Renseigner DATABASE_URL, APP_SECRET, et les clés d'API

# 5. Créer la base de données et jouer les migrations
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate

# 6. Lancer le serveur de développement
symfony server:start
```

---

## Rôles utilisateurs

| Rôle | Accès |
|------|-------|
|------|-------|
|------|-------|

---

## Conception

- **Diagramme de cas d'utilisation (UML)** : ``
- **Wireframes** : ``
- **MBD** : ``
- **Charte graphique** : ``
- **Logo** : ``

---

## Licence

Projet réalisé dans un cadre pédagogique — CEPPIC DWWM.
