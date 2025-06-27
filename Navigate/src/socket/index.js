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
        socket.on("joinTrip", ({ roomId, userId }) => {
          socket.join(roomId);
          socket.data.userId = userId;
          console.log(`User ${userId} joined trip room ${roomId}`);
        });

        socket.on("leaveTrip", ({ roomId, userId }) => {
          socket.leave(roomId);
          console.log(`User ${userId} left trip room ${roomId}`);
        });

        // Réception de la position d'un utilisateur et broadcast aux autres
        socket.on("position", ({ roomId, userId, position }) => {
            console.log(`User ${userId} position in room ${roomId}:`, position);
          // Envoie à tous les autres utilisateurs de la room SAUF l'émetteur
          socket.to(roomId).emit("userPosition", { userId, position });
        });
      });
    };

    module.exports.getIO = () => io;
