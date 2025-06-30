const socketIo = require("socket.io");

let io = null;

module.exports = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.data.jwt = socket.handshake.auth?.token;

    // Gestion des rooms de trip
    socket.on("joinTrip", ({ roomId, userId, profilePicture }) => {
      socket.join(roomId);
      socket.data.userId = userId;
      socket.data.profilePicture = profilePicture; // <-- Ajout
      console.log(`User ${userId} joined trip room ${roomId}`);
    });

    socket.on("leaveTrip", ({ roomId, userId }) => {
      socket.leave(roomId);
      console.log(`User ${userId} left trip room ${roomId}`);
      // Notifie les autres membres de la room que cet utilisateur part
      socket.to(roomId).emit("userLeft", { userId });
    });
    socket.on("disconnecting", () => {
      // Pour chaque room rejointe, notifie le départ
      for (const roomId of socket.rooms) {
        if (roomId !== socket.id && socket.data.userId) {
          socket.to(roomId).emit("userLeft", { userId: socket.data.userId });
        }
      }
    });
    // Réception de la position d'un utilisateur et broadcast aux autres
    socket.on("position", ({ roomId, userId, position, profilePicture }) => {
      console.log(`User ${userId} position in room ${roomId}:`, position);
      // Envoie à tous les autres utilisateurs de la room SAUF l'émetteur
      socket.to(roomId).emit("userPosition", {
        userId,
        position,
        profilePicture: profilePicture || socket.data.profilePicture,
      });
    });
  });
};

module.exports.getIO = () => io;
