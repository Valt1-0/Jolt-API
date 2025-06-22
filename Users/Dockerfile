# Utilise une image Node officielle
FROM node:22.16

# Crée le dossier de travail
WORKDIR /app

# Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm install --production

# Copie tout le code source du microservice
COPY . .

# Expose le port 
EXPOSE 5003

# Commande de démarrage 
CMD ["node", "app.js"]