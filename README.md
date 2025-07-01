<h1 align="center">
  <img src="https://img.icons8.com/color/96/000000/electric-scooter.png" width="48" alt="Jolt Logo"/>
  <br>
  Jolt-Microservices - Architecture Microservices
</h1>

<p align="center">
  <strong>Plateforme Node.js modulaire basée sur une architecture microservices.</strong><br>
  Gestion des utilisateurs, véhicules, navigations, maintenances, notifications et paiements.<br>
  <a href="https://github.com/MitryDim/Jolt-Helm">Déploiement Kubernetes (Helm)</a>
</p>

<p align="center">
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" />
  </a>
  <img src="https://img.shields.io/badge/Node.js-18%2B-green" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-5%2B-brightgreen" alt="MongoDB" />
  <img src="https://img.shields.io/badge/RabbitMQ-AMQP-orange" alt="RabbitMQ" />
  <img src="https://img.shields.io/badge/Redis-OK-red" alt="Redis" />
  <img src="https://img.shields.io/badge/Stripe-Payments-6772E5" alt="Stripe" />
  <img src="https://img.shields.io/badge/Swagger-API%20Docs-85EA2D" alt="Swagger" />
  <img src="https://img.shields.io/badge/status-en%20développement-yellow" alt="Status" />
</p>

<h3 align="center">
  <a href="#-présentation">Présentation</a>
  <span> · </span>
  <a href="#-architecture-des-microservices">Architecture</a>
  <span> · </span>
  <a href="#-installation-rapide">Installation</a>
  <span> · </span>
  <a href="#-configuration">Configuration</a>
  <span> · </span>
  <a href="#-documentation-api">Documentation API</a>
  <span> · </span>
  <a href="#-modèles-principaux-des-bases-mongodb">Modèles</a>
  <span> · </span>
  <a href="#-fonctionnalités-principales">Fonctionnalités</a>
  <span> · </span>
  <a href="#-contribution">Contribution</a>
</h3>

---

## ✨ Présentation

**Jolt-API** est une plateforme modulaire basée sur une architecture microservices, permettant la gestion complète d'utilisateurs, de véhicules, de navigations (trajets), de maintenances, de paiements et de notifications par email ou push.  
Chaque domaine métier est isolé dans un microservice indépendant, facilitant la scalabilité, la maintenance et le déploiement.

---

## 🏗️ Architecture des microservices

- **Gateway** : Point d'entrée unique (API Gateway) qui route les requêtes vers les bons microservices.
- **Auth** : Authentification, gestion des tokens JWT, sécurité, sessions.
- **Users** : Gestion des utilisateurs, profils, rôles, projection des données utilisateurs.
- **Vehicles** : Gestion des véhicules, informations, images, historique.
- **Navigate** : Gestion des trajets, groupes, géolocalisation, notes, favoris.
- **Maintains** : Gestion des maintenances, historiques, usure, notifications associées.
- **Payment** : Gestion des paiements Stripe, abonnements, produits, webhooks.
- **Notifications** : Envoi d'emails transactionnels (confirmation, notifications, etc.) **et** notifications push Expo (gestion des push tokens, envoi de messages push).

Chaque microservice possède sa propre base MongoDB et communique via HTTP et RabbitMQ (AMQP).

---

## 🚦 Badges d'état

| Service       | Port | Statut                                                                      |
| ------------- | ---- | --------------------------------------------------------------------------- |
| Gateway       | 5000 | ![Gateway](https://img.shields.io/badge/Gateway-OK-brightgreen)             |
| Auth          | 5002 | ![Auth](https://img.shields.io/badge/Auth-OK-brightgreen)                   |
| Users         | 5003 | ![Users](https://img.shields.io/badge/Users-OK-brightgreen)                 |
| Vehicles      | 5004 | ![Vehicles](https://img.shields.io/badge/Vehicles-OK-brightgreen)           |
| Maintains     | 5005 | ![Maintains](https://img.shields.io/badge/Maintains-OK-brightgreen)         |
| Navigate      | 5006 | ![Navigate](https://img.shields.io/badge/Navigate-OK-brightgreen)           |
| Payment       | 5007 | ![Payment](https://img.shields.io/badge/Payment-OK-brightgreen)             |
| Notifications | 5001 | ![Notifications](https://img.shields.io/badge/Notifications-OK-brightgreen) |

---

## 📋 Prérequis

- **Node.js** (v18+ recommandé)
- **MongoDB** (v5+)
- **RabbitMQ** (pour la communication inter-services)
- **npm** ou **yarn**
- **Redis** (pour Auth, optionnel)
- **Compte Stripe** (pour les paiements)

---

## 🚀 Installation rapide

1. **Cloner le dépôt principal :**

   ```bash
   git clone https://github.com/votre-utilisateur/jolt-api.git
   cd jolt-api
   ```

2. **Installer les dépendances pour chaque microservice :**

   ```bash
   cd Auth && npm install
   cd ../Users && npm install
   cd ../Vehicles && npm install
   cd ../Navigate && npm install
   cd ../Maintains && npm install
   cd ../Payment && npm install
   cd ../Notifications && npm install
   cd ../Gateway && npm install
   ```

3. **Configurer les fichiers `.env` pour chaque microservice (voir exemples ci-dessous).**

4. **Démarrer les services :**

   ```bash
   # Lancer les dépendances (MongoDB, RabbitMQ, Redis)
   docker-compose up -d
   
   # Lancer tous les microservices
   node start-all.js
   ```

---

## ⚙️ Configuration

> **Adapte les valeurs à ton environnement local.**

<details>
<summary><strong>Auth (.env)</strong></summary>

```env
API_PORT=5002
JWT_ACCESS_KEY=your_access_token_secret
JWT_REFRESH_KEY=your_refresh_token_secret
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
MAX_SESSIONS_ALLOWED=5
AUTH_SERVICE_URL=http://localhost:5000/users
MSG_QUEUE_URL=amqp://user:password@localhost:5672
REDIS_URL=redis://localhost:6379
EXCHANGE_NAME=Jolt
NOTIFICATION_SERVICE_QUEUE=notification_service
USER_SERVICE_QUEUE=user_service
```
</details>

<details>
<summary><strong>Users (.env)</strong></summary>

```env
API_PORT=5003
MONGODB_URI=mongodb://localhost:27017/Jolt
JWT_ACCESS_KEY=your_access_token_secret
JWT_REFRESH_KEY=your_refresh_token_secret
MSG_QUEUE_URL=amqp://user:password@localhost:5672
EXCHANGE_NAME=Jolt
NOTIFICATION_SERVICE_QUEUE=notification_service
USER_SERVICE_QUEUE=user_service
```
</details>

<details>
<summary><strong>Vehicles (.env)</strong></summary>

```env
API_PORT=5004
MONGODB_URI=mongodb://localhost:27017/Jolt
JWT_ACCESS_KEY=your_access_token_secret
JWT_REFRESH_KEY=your_refresh_token_secret
MSG_QUEUE_URL=amqp://user:password@localhost:5672
EXCHANGE_NAME=Jolt
NOTIFICATION_SERVICE_QUEUE=notification_service
USER_SERVICE_QUEUE=user_service
IMAGE_BASE_URL=http://localhost:5000/uploads/vehicles/
IMAGE_UPLOAD_PATH=uploads/vehicles/
```
</details>

<details>
<summary><strong>Navigate (.env)</strong></summary>

```env
API_PORT=5006
MONGODB_URI=mongodb://localhost:27017/Jolt
JWT_ACCESS_KEY=your_access_token_secret
JWT_REFRESH_KEY=your_refresh_token_secret
MSG_QUEUE_URL=amqp://user:password@localhost:5672
EXCHANGE_NAME=Jolt
NODE_ENV=development
GATEWAY_URL=http://localhost:5000
```
</details>

<details>
<summary><strong>Maintains (.env)</strong></summary>

```env
API_PORT=5005
MONGODB_URI=mongodb://localhost:27017/Jolt
JWT_ACCESS_KEY=your_access_token_secret
JWT_REFRESH_KEY=your_refresh_token_secret
MSG_QUEUE_URL=amqp://user:password@localhost:5672
EXCHANGE_NAME=Jolt
NOTIFICATION_SERVICE_QUEUE=notification_service
USER_SERVICE_QUEUE=user_service
NODE_ENV=development
IMAGE_BASE_URL=http://localhost:5005/uploads/maintains/
IMAGE_UPLOAD_PATH=uploads/maintains/
VEHICLE_SERVICE_URL=http://localhost:5004
GATEWAY_URL=http://localhost:5000
```
</details>

<details>
<summary><strong>Payment (.env)</strong></summary>

```env
API_PORT=5007
MONGODB_URI=mongodb://localhost:27017/Jolt
JWT_ACCESS_KEY=your_access_token_secret
JWT_REFRESH_KEY=your_refresh_token_secret
MSG_QUEUE_URL=amqp://user:password@localhost:5672
EXCHANGE_NAME=Jolt

# Stripe
STRIPE_SECRET_KEY=sk_test_fake
STRIPE_WEBHOOK_SECRET=whsec_fake

# URLs
GATEWAY_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

NODE_ENV=development
```
</details>

<details>
<summary><strong>Notifications (.env)</strong></summary>

```env
API_PORT=5001
IONOS_EMAIL=contact@joltz.fr
IONOS_PASSWORD=mot_de_passe_exemple
MONGODB_URI=mongodb://localhost:27017/Jolt
MSG_QUEUE_URL=amqp://user:password@localhost:5672
EXCHANGE_NAME=Jolt
NOTIFICATION_SERVICE_QUEUE=notification_service
USER_SERVICE_QUEUE=user_service
```
</details>

---

## 📚 Documentation API

### 🌐 Interface Swagger

Une documentation interactive complète de l'API est disponible via **Swagger UI** :

📖 **[Documentation API - http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

### 📋 Aperçu des endpoints

| Service | Endpoints | Description |
|---------|-----------|-------------|
| **Auth** | `/auth/*` | Authentification, tokens JWT, sessions |
| **Users** | `/users/*` | Gestion des utilisateurs, profils, rôles |
| **Vehicles** | `/vehicle/*` | CRUD véhicules, images, historique |
| **Navigate** | `/navigate/*` | Trajets, groupes, géolocalisation, notes |
| **Maintains** | `/maintain/*` | Types de maintenance, calcul d'usure |
| **MaintainHistory** | `/maintainHistory/*` | Historique des maintenances effectuées |
| **Payment** | `/payment/*` | Sessions de paiement, historique des transactions |
| **Product** | `/product/*` | Gestion des plans d'abonnement et produits |
| **Subscription** | `/subscription/*` | Gestion des abonnements utilisateurs |
| **Webhook** | `/webhook/*` | Webhooks Stripe pour traitement des événements |
| **Notifications** | `/pushToken/*` | Gestion des tokens push, envoi notifications |
| **FavoriteAddress** | `/favorite-addresses/*` | Adresses favorites pour navigation |

### 🔐 Authentification

La plupart des endpoints nécessitent un **token Bearer JWT** :

```http
Authorization: Bearer <votre_token_jwt>
```

1. **Obtenir un token** : `POST /auth/getToken`
2. **Utiliser le token** dans le header `Authorization`
3. **Renouveler** : `POST /auth/refreshToken`

### 💡 Exemples d'utilisation

<details>
<summary><strong>🔑 Connexion utilisateur</strong></summary>

```http
POST /auth/getToken
Content-Type: application/json

{
  "email": "user@joltz.fr",
  "password": "motdepasse"
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "id": "...", "email": "user@joltz.fr" }
  }
}
```
</details>

<details>
<summary><strong>🚗 Créer un véhicule</strong></summary>

```http
POST /vehicle/
Authorization: Bearer <token>
Content-Type: application/json

{
  "brand": "Tesla",
  "model": "Model 3",
  "year": 2023,
  "mileage": 15000
}
```
</details>

<details>
<summary><strong>🗺️ Créer une navigation</strong></summary>

```http
POST /navigate/
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Trajet Paris-Lyon",
  "isPublic": true,
  "startLocation": {
    "type": "Point",
    "coordinates": [2.3522, 48.8566]
  },
  "gpxPoints": [
    { "lat": 48.8566, "lon": 2.3522, "alt": 35, "time": "2024-01-01T10:00:00Z" }
  ]
}
```
</details>

<details>
<summary><strong>💳 Créer une session de paiement</strong></summary>

```http
POST /payment/checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "507f1f77bcf86cd799439011",
  "successUrl": "https://yourapp.com/payment/success",
  "cancelUrl": "https://yourapp.com/payment/cancel"
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
    "url": "https://checkout.stripe.com/pay/cs_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"
  },
  "message": "Checkout session created successfully"
}
```
</details>

<details>
<summary><strong>📦 Créer un produit/plan</strong></summary>

```http
POST /product/
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Plan Premium",
  "description": "Plan premium avec toutes les fonctionnalités",
  "price": 999,
  "currency": "eur",
  "interval": "monthly",
  "features": {
    "maxFavorites": 5,
    "maxVehicles": 3,
    "premiumSupport": true,
    "advancedAnalytics": true
  }
}
```
</details>

### 🔧 Génération de la documentation

Pour régénérer la documentation Swagger :

```bash
cd Gateway
npm run swagger
```

La documentation est générée automatiquement à partir des annotations dans les fichiers de routes de chaque microservice.

---

## 🗂 Modèles principaux des bases MongoDB

### Auth

- **Sessions** : `{ userId, token, createdAt, expiresAt }`
- **BlacklistedTokens** : `{ token, expiresAt }`

### Users

- **User** :
  ```json
  {
    "_id": ObjectId,
    "username": String,
    "email": String,
    "password": String,
    "role": String,
    "profilePicture": String,
    "createdAt": Date,
    "updatedAt": Date
  }
  ```
- **UserProjection** (pour Navigate) :  
  `{ _id, username, profilePicture, email, role, region }`

### Vehicles

- **Vehicle** :
  ```json
  {
    "_id": ObjectId,
    "owner": ObjectId,
    "brand": String,
    "model": String,
    "year": Number,
    "mileage": Number,
    "image": String,
    "createdAt": Date
  }
  ```

### Navigate

- **Navigation** :
  ```json
  {
    "_id": ObjectId,
    "owner": ObjectId,
    "name": String,
    "isPublic": Boolean,
    "isGroup": Boolean,
    "groupMembers": [ObjectId],
    "gpxPoints": [{ lat, lon, alt, time, speed }],
    "startLocation": { type: "Point", coordinates: [lon, lat] },
    "startTime": Date,
    "endTime": Date,
    "altitude": Number,
    "totalDistance": Number,
    "speedMax": Number,
    "notes": [{ user: ObjectId, rating: Number }],
    "createdAt": Date
  }
  ```

### Maintains

- **Maintain** :
  ```json
  {
    "_id": ObjectId,
    "vehicle": ObjectId,
    "type": String,
    "date": Date,
    "mileage": Number,
    "notes": String,
    "files": [String],
    "createdAt": Date
  }
  ```
- **MaintainHistory** :
  ```json
  {
    "_id": ObjectId,
    "vehicle": ObjectId,
    "type": ObjectId,
    "date": Date,
    "mileage": Number,
    "performedBy": "user" | "pro",
    "proName": String,
    "invoiceUrl": [String],
    "notes": String
  }
  ```

### Payment

- **Product** :
  ```json
  {
    "_id": ObjectId,
    "name": String,
    "description": String,
    "price": Number,
    "currency": String,
    "interval": "monthly" | "yearly" | "one-time",
    "features": {
      "maxFavorites": Number,
      "maxVehicles": Number,
      "premiumSupport": Boolean,
      "advancedAnalytics": Boolean
    },
    "isActive": Boolean
  }
  ```
- **Payment** :
  ```json
  {
    "_id": ObjectId,
    "userId": ObjectId,
    "productId": ObjectId,
    "amount": Number,
    "currency": String,
    "status": "pending" | "completed" | "failed",
    "stripeSessionId": String,
    "method": String,
    "createdAt": Date
  }
  ```
- **Subscription** :
  ```json
  {
    "_id": ObjectId,
    "userId": ObjectId,
    "productId": ObjectId,
    "stripeSubscriptionId": String,
    "status": "active" | "inactive" | "cancelled",
    "currentFeatures": Object,
    "startDate": Date,
    "endDate": Date,
    "autoRenew": Boolean
  }
  ```

### Notifications

- **PushToken** :
  ```json
  {
    "_id": ObjectId,
    "expoPushToken": String,
    "deviceId": String,
    "userId": ObjectId,
    "createdAt": Date
  }
  ```

---

## 🐳 docker-compose.yml

Le fichier `docker-compose.yml` fourni permet de lancer :

- **MongoDB** (avec persistance des données)
- **RabbitMQ** (avec interface de management)
- **Redis** (pour Auth)

```yaml
services:
  mongo:
    image: "mongo:latest"
    container_name: "mongoJolt"
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
  rabbitmq:
    image: "rabbitmq:3-management"
    container_name: "rabbitmqJolt"
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: ${RABBITMQ_USER}
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASS}
  redis:
    image: "redis:latest"
    container_name: "redisJolt"
    ports:
      - "6379:6379"
volumes:
  mongo-data:
```

Et dans un .env  
RABBITMQ_USER=monuserfort  
RABBITMQ_PASS=monmotdepasseultrasecret

---

## 🚦 Script de démarrage global

Le fichier [`start-all.js`](./start-all.js) permet de lancer tous les microservices en parallèle avec `nodemon` :

```bash
node start-all.js
```

Chaque service affiche ses logs préfixés par son nom.

---

## 🛠 Fonctionnalités principales

- **Gestion des utilisateurs** : inscription, connexion, rôles, projection, recherche.
- **Gestion des véhicules** : ajout, modification, suppression, images, historique.
- **Gestion des navigations** : création de trajets, groupes, géolocalisation, notes, favoris.
- **Gestion des maintenances** : planification, historique, calcul d'usure, notifications.
- **Gestion des paiements** : intégration Stripe, abonnements, webhooks, produits.
- **Notifications** : confirmation, alertes, push notifications.
- **Sécurité** : JWT, blacklist tokens, CSRF, CORS.
- **Communication inter-services** : RabbitMQ (AMQP), HTTP REST, projections, REDIS.
- **Documentation interactive** : Swagger UI pour tous les endpoints.

---

## 💳 Configuration Stripe

### 🔧 Configuration requise

1. **Créer un compte Stripe** : [https://stripe.com](https://stripe.com)
2. **Récupérer les clés API** :
   - Secret Key : `sk_test_...` (pour le backend)
   - Publishable Key : `pk_test_...` (pour le frontend)
   - Webhook Secret : `whsec_...` (pour vérifier les webhooks)

### 🎯 Configuration des webhooks

Dans votre Dashboard Stripe :

1. Aller dans **Développeurs > Webhooks**
2. Ajouter un endpoint : `http://localhost:5000/webhook`
3. Sélectionner les événements :
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

  /**
   * Cette fonction/code utilise l'environnement de développement Stripe.
   * Pour configurer et tester Stripe en mode développement, veuillez consulter la documentation officielle :
   * https://docs.stripe.com/get-started/development-environment
   *
   * Vous y trouverez des instructions pour obtenir des clés API de test, simuler des paiements, et utiliser les outils Stripe CLI.
   */

### 💰 Produits par défaut

Le système inclut des plans d'abonnement configurables :

- **Plan Basic** : 2 favoris, 1 véhicule (5€/mois)
- **Plan Premium** : 5 favoris, 3 véhicules, support premium (9,99€/mois)
- **Plan Pro** : Illimité, analytics avancés (19,99€/mois)

---

## 💡 Bonnes pratiques

- **Sépare bien chaque microservice** (base de code, base de données, .env).
- **Ne partage jamais tes secrets (.env) publiquement.**
- **Utilise Docker pour faciliter le déploiement.**
- **RabbitMQ ainsi que REDIS doit être lancé avant les microservices pour la communication.**
- **Consulte la documentation Swagger** pour connaître tous les endpoints disponibles.
- **Configure correctement Stripe** en mode test avant la production.

---

## 📦 Exemple de requête API

```http
POST /auth/getToken
Content-Type: application/json

{
  "email": "test@joltz.fr",
  "password": "motdepasse"
}
```

---

## 🤝 Contribution

1. Fork le projet
2. Crée une branche (`git checkout -b feature/ma-feature`)
3. Commit tes modifications (`git commit -am 'Ajout de ma feature'`)
4. Push la branche (`git push origin feature/ma-feature`)
5. Ouvre une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus d'informations.

---

<p align="center">
📖 <a href="http://localhost:5000/api-docs"><strong>Documentation API Swagger</strong></a> | 
💳 <a href="https://stripe.com/docs"><strong>Documentation Stripe</strong></a> | 
📧 <a href="mailto:contact@joltz.fr">contact@joltz.fr</a>
</p>