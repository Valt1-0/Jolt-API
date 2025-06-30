<h1 align="center">
  <img src="https://img.icons8.com/color/96/000000/electric-scooter.png" width="48" alt="Jolt Logo"/>
  <br>
  Jolt-Microservices - Architecture Microservices
</h1>

<p align="center">
  <strong>Plateforme Node.js modulaire basée sur une architecture microservices.</strong><br>
  Gestion des utilisateurs, véhicules, navigations, maintenances, notifications email et push.<br>
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
  <a href="#-modèles-principaux-des-bases-mongodb">Modèles</a>
  <span> · </span>
  <a href="#-fonctionnalités-principales">Fonctionnalités</a>
  <span> · </span>
  <a href="#-contribution">Contribution</a>
</h3>

---

## ✨ Présentation

**Jolt-API** est une plateforme modulaire basée sur une architecture microservices, permettant la gestion complète d'utilisateurs, de véhicules, de navigations (trajets), de maintenances, et de notifications par email ou push.  
Chaque domaine métier est isolé dans un microservice indépendant, facilitant la scalabilité, la maintenance et le déploiement.

---

## 🏗️ Architecture des microservices

- **Gateway** : Point d'entrée unique (API Gateway) qui route les requêtes vers les bons microservices.
- **Auth** : Authentification, gestion des tokens JWT, sécurité, sessions.
- **Users** : Gestion des utilisateurs, profils, rôles, projection des données utilisateurs.
- **Vehicles** : Gestion des véhicules, informations, images, historique.
- **Navigate** : Gestion des trajets, groupes, géolocalisation, notes, favoris.
- **Maintains** : Gestion des maintenances, historiques, usure, notifications associées.
- **Notifications** : Envoi d'emails transactionnels (confirmation, notifications, etc.) **et** notifications push Expo (gestion des push tokens, envoi de messages push).

Chaque microservice possède sa propre base MongoDB et communique via HTTP et RabbitMQ (AMQP).

---

## 🚦 Badges d’état

| Service       | Port | Statut                                                                      |
| ------------- | ---- | --------------------------------------------------------------------------- |
| Gateway       | 5000 | ![Gateway](https://img.shields.io/badge/Gateway-OK-brightgreen)             |
| Auth          | 5002 | ![Auth](https://img.shields.io/badge/Auth-OK-brightgreen)                   |
| Users         | 5003 | ![Users](https://img.shields.io/badge/Users-OK-brightgreen)                 |
| Vehicles      | 5004 | ![Vehicles](https://img.shields.io/badge/Vehicles-OK-brightgreen)           |
| Maintains     | 5005 | ![Maintains](https://img.shields.io/badge/Maintains-OK-brightgreen)         |
| Navigate      | 5006 | ![Navigate](https://img.shields.io/badge/Navigate-OK-brightgreen)           |
| Notifications | 5001 | ![Notifications](https://img.shields.io/badge/Notifications-OK-brightgreen) |

---

## 📋 Prérequis

- **Node.js** (v18+ recommandé)
- **MongoDB** (v5+)
- **RabbitMQ** (pour la communication inter-services)
- **npm** ou **yarn**
- **Redis** (pour Auth, optionnel)

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
   cd ../Notifications && npm install
   cd ../Gateway && npm install
   ```

3. **Configurer les fichiers `.env` pour chaque microservice (voir exemples ci-dessous).**

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
    "password": String (hash),
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

Le fichier `docker-compose.yml` fourni permet de lancer :

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

Le fichier [`start-all.js`](./start-all.js) permet de lancer tous les microservices en parallèle avec `nodemon` :

```bash
node start-all.js
```

Chaque service affiche ses logs préfixés par son nom.

---

## 🛠 Fonctionnalités principales

- **Gestion des utilisateurs** : inscription, connexion, rôles, projection, recherche.
- **Gestion des véhicules** : ajout, modification, suppression, images, historique.
- **Gestion des navigations** : création de trajets, groupes, géolocalisation, notes, favoris.
- **Gestion des maintenances** : planification, historique, calcul d’usure, notifications.
- **Notifications** : confirmation, alertes.
- **Sécurité** : JWT, blacklist tokens, CSRF, CORS.
- **Communication inter-services** : RabbitMQ (AMQP), HTTP REST, projections, REDIS.

---

## 💡 Bonnes pratiques

- **Sépare bien chaque microservice** (base de code, base de données, .env).
- **Ne partage jamais tes secrets (.env) publiquement.**
- **Utilise Docker pour faciliter le déploiement.**
- **RabbitMQ ainsi que REDIS doit être lancé avant les microservices pour la communication.**

---

## 📦 Exemple de requête API

```http
POST /auth/login
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


Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus d’informations.

---

<p align="center">
Pour toute question, contacte l’équipe Jolt à <a href="mailto:contact@joltz.fr">contact@joltz.fr</a>
</p>