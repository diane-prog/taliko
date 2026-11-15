# Taliko 🌍

> **Univers numérique ludo-éducatif africain pour enfants**  
> Une application d'apprentissage, de contes interactifs, de créativité et de divertissement adaptée aux enfants, célébrant les cultures d'Afrique.

Construit avec **NestJS**, **TypeScript**, **PostgreSQL** et **TypeORM**, en suivant rigoureusement l'architecture et les standards du projet **Kulina**.

---

## 🌟 Fonctionnalités Clés

1. **Histoires & Contes Africains Interactifs**
   - Contes traditionnels revisités (Anansi, Soundiata Keïta...).
   - Scènes illustrées et choix d'embranchement narratif (*histoires dont l'enfant est le héros*).
   - Narration audio multilingue : **Français, Fon, Yoruba et Anglais**.

2. **Jeux Éducatifs & Découverte**
   - Reconnaissance de l'alphabet & phonétique (Baobab, Kora, Djembé...).
   - Mathématiques contextuelles (comptage de mangues, pirogues...).
   - Quiz sur la faune, la flore et les traditions africaines.
   - Système de récompenses en étoiles et montée de niveaux.

3. **Dessin & Créativité**
   - Modèles de coloriage interactifs (animaux de la savane, masques royaux, cases traditionnelles).
   - Espace de dessin libre avec galerie privée sauvegardée par profil enfant.

4. **Musique, Comptines & Instruments Traditionnels**
   - Comptines en langues locales et chansons éducatives.
   - Découverte sonore des instruments d'Afrique (Kora, Balafon, Djembé, Tama).

5. **Espace Parental & Contrôle du Temps d'Écran**
   - Code PIN parental à 4 chiffres protégeant les réglages et achats.
   - Limite quotidienne de temps d'écran configurable avec heartbeat et verrouillage automatique bienveillant.
   - Tableau de bord de suivi du temps passé et de la progression d'apprentissage.

6. **Monétisation Adaptée au Continent**
   - Modèle Freemium + Forfait Famille Premium et Licences Écoles.
   - Paiements par **Mobile Money** (MTN MoMo, Moov, Orange Money, Wave) et Carte Bancaire en **FCFA**.

---

## 🏗️ Architecture Technique (Standard Kulina)

- `src/core/` : Modules métier isolés (`auth`, `users`, `roles`, `profiles`, `parental-control`, `stories`, `games`, `creativity`, `audio-music`, `dashboard`, `subscriptions`).
- `src/libs/` : Couche d'infrastructure (`database` avec `AbstractEntity` & `AbstractRepository`).
- `src/helpers/` : Utilitaires (`password_hash`, `cors.config`, `api_documentation`).
- `src/common/` : Guards (`JwtAuthGuard`, `RolesGuard`), Intercepteurs (`ResponseInterceptor`), Enums et Seeders.
- `src/config/` : Configuration globale typée.

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js (v20+ recommandé)
- pnpm
- PostgreSQL (ou instance locale configurée dans `.env`)

### Installation & Lancement

```bash
# Installation des dépendances
pnpm install

# Configuration des variables d'environnement
cp .env.example .env

# Lancement en mode développement (avec hot reload)
pnpm run start:dev
```

L'API démarre sur `http://localhost:3000/api/v1`  
La documentation Swagger interactive est accessible sur `http://localhost:3000/docs`

---

## 📚 Endpoints Principaux

| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Inscription parent avec code PIN à 4 chiffres |
| `POST` | `/api/v1/auth/login` | Connexion parent & récupération des tokens |
| `POST` | `/api/v1/auth/verify-pin` | Vérification du PIN de sécurité parentale |
| `GET` | `/api/v1/profiles` | Liste des profils enfants du parent connecté |
| `POST` | `/api/v1/profiles` | Création d'un profil enfant (âge, avatar, langue) |
| `POST` | `/api/v1/parental-control/heartbeat` | Ping d'activité et contrôle du temps d'écran |
| `POST` | `/api/v1/parental-control/unlock-extra-time`| Déverrouillage de temps additionnel via PIN |
| `GET` | `/api/v1/stories` | Liste des contes filtrables par âge et langue |
| `GET` | `/api/v1/stories/:id/nodes/:nodeId` | Scène de conte avec choix et audio multilingue |
| `GET` | `/api/v1/games/:gameType` | Questions de jeux (maths, alphabet, quiz, etc.) |
| `POST` | `/api/v1/games/:profileId/submit` | Soumission d'une réponse et gain d'étoiles |
| `GET` | `/api/v1/creativity/templates` | Modèles SVG de coloriage interactif |
| `POST` | `/api/v1/creativity/:profileId/artworks` | Sauvegarde d'un dessin d'enfant |
| `GET` | `/api/v1/music` | Comptines et morceaux de musique |
| `GET` | `/api/v1/music/instruments` | Découverte des instruments traditionnels |
| `GET` | `/api/v1/dashboard/parent` | Tableau de bord parental complet |
| `POST` | `/api/v1/subscriptions/subscribe` | Abonnement Mobile Money / Carte (FCFA) |
| `GET` | `/ping` | Endpoint de vérification de santé (healthcheck) |
