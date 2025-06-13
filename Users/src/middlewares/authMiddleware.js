const jwt = require("jsonwebtoken");
const {
  AuthorizeError,
  ForbiddenError,
  handleErrorWithLogger,
  redisClient,
} = require("../utils");

const config = require("../Config");

const authenticateToken = async (req, res, next) => {
  const JWT_ACCESS_KEY = config.JWT_ACCESS_KEY;
  // Récupérer le token depuis l'en-tête Authorization ou les cookies
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.access_token) {
    token = req.cookies.access_token;
  }

  if (!token) {
    const error = new AuthorizeError("Token missing");
    return handleErrorWithLogger(error, req, res, next);
  }

  const isBlacklisted = await redisClient.get(`blacklist:${token}`);
  if (isBlacklisted) {
    const error = new ForbiddenError("Token revoked");
    return handleErrorWithLogger(error, req, res, next);
  }

  jwt.verify(token, JWT_ACCESS_KEY, (err, user) => {
    if (err) {
      console.error("Token verification error:", err);
      const error = new ForbiddenError("Invalid token");
      return handleErrorWithLogger(error, req, res, next);
    }
    req.user = user; 
    next();
  });
};

const csrfMiddleware = (req, res, next) => {
  const csrfToken = req.headers["x-csrf-token"]; // Récupérer le token depuis l'en-tête
  const csrfSecret = req.cookies.csrf_secret; // Récupérer le secret depuis le cookie

  if (!csrfToken || !csrfSecret || !csrfTokens.verify(csrfSecret, csrfToken)) {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }

  next();
};

module.exports = { authenticateToken, csrfMiddleware };
