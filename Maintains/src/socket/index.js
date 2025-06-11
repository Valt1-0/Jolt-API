const socketIo = require("socket.io");
const maintainService = require("../services/maintainService");

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.data.jwt = socket.handshake.auth.token;
    socket.on("join", (userId) => {
      console.log(`User ${userId} connected`);
      socket.join(userId);
    });

    socket.on("vehicle:change", async ({ userId, vehicle }) => {
      const jwt = socket.data.jwt;
      try {
        const count = await maintainService.getMaintenanceCountForSocket(
          userId,
          vehicle,
          "user",
          jwt
        );
        io.to(userId).emit("maintain:update", {
          vehiculeId: vehicle._id,
          pendingCount: count,
        });
      } catch (err) {
        console.error("Error in vehicle:change socket:", err.status);
        // Si le JWT est expiré, on émet "unauthorized"
        if (err.message && err.message.toLowerCase().includes("jwt expired") || err.status === 401 || err.status === 403) {
          socket.emit("unauthorized");
        } else {
          // Autres erreurs : log ou gestion personnalisée
          console.warn("Erreur vehicle:change socket:", err.message);
        }
      }
    });
  });
};
