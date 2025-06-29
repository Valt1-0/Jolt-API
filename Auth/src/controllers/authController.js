const authService = require("../services/authService");
const utils = require("../utils");

exports.getToken = async (req, res, next) => {
  try {
    const device = req.headers["x-client-type"] || req.headers["user-agent"];
    const { accessToken, refreshToken, user } = await authService.getToken(
      req.body,
      req.ip, // IP de l'utilisateur
      device // Informations sur le device
    );
    const isMobile = req.headers["x-client-type"] === "mobile";

    if (isMobile) {
      // Mobile : token dans le body
      const successResponse = new utils.OkSuccess("Login successful", {
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
      res.status(successResponse.statusCode).json(successResponse.toJSON());
    } else {
      // Web : token dans un cookie HTTP-only
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 5 * 24 * 60 * 60 * 1000, // 5 jours
      });

      const successResponse = new utils.OkSuccess("Login successful", {
        user: user,
      });
      res.status(successResponse.statusCode).json(successResponse.toJSON());
    }
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    // Récupérer le refreshToken depuis l'en-tête Authorization ou les cookies
    let refreshToken = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      refreshToken = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.refresh_token) {
      refreshToken = req.cookies.refresh_token;
    }
    if (!refreshToken) {
      throw new utils.AuthorizeError("Refresh token missing");
    }

    const token = await authService.refreshToken(refreshToken);
    const successResponse = new utils.OkSuccess("Token refreshed", {
      accessToken: token,
    });
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.status(successResponse.statusCode).json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

exports.registerUser = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    const successResponse = new utils.CreatedSuccess("User registered", {
      user: { username: user.username, email: user.email },
    });
    res.status(successResponse.statusCode).json(successResponse.toJSON());

    // Publish message to the queue
    const channel = await utils.getChannel();
    const msg = JSON.stringify({
      to: user.email,
      username: user.username,
      verificationToken: user.verificationToken,
    });
    utils.PublishMessage(channel, "sendMail", msg);
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await authService.verifyEmail(token);
    const successResponse = new utils.OkSuccess("Email verified", user);
    res.status(successResponse.statusCode).json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

exports.resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new utils.ValidationError("Email is required for verification");
    }
    const user = await authService.resendVerificationEmail(email);
    const successResponse = new utils.OkSuccess(
      "Verification email resent",
      user
    );
    res.status(successResponse.statusCode).json(successResponse.toJSON());
    // Publish message to the queue
    const channel = await utils.getChannel();
    const msg = JSON.stringify({
      to: user.email,
      username: user.username,
      verificationToken: user.verificationToken,
    });
    utils.PublishMessage(channel, "sendMail", msg);
  } catch (error) {
    next(error);
  }
};
exports.logout = async (req, res, next) => {
  try {
    const { id } = req.user;
    // Récupérer l'accessToken depuis l'Authorization header
    let accessToken = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      accessToken = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.access_token) {
      accessToken = req.cookies.access_token;
    }

    // Récupérer le refreshToken depuis le body ou les cookies
    const refreshToken =
      req.body.refreshToken || (req.cookies && req.cookies.refresh_token);

    if (!accessToken || !refreshToken) {
      throw new utils.AuthorizeError("Tokens missing");
    }

    const device = req.headers["x-client-type"] || req.headers["user-agent"];
    await authService.logout(id, accessToken, refreshToken, req.ip, device);

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    const successResponse = new utils.OkSuccess("Logout successful");
    res.status(successResponse.statusCode).json(successResponse.toJSON());
  } catch (error) {
    console.log("Error during logout:", error);
    next(error);
  }
};
