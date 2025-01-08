const jwt = require("jsonwebtoken");
const {
  AuthorizeError,
  ForbiddenError,
  handleErrorWithLogger,
} = require("../utils");
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    const error = new AuthorizeError("Token missing");
    return handleErrorWithLogger(error, req, res);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
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
