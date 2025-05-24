const authService = require("../services/authService");
const utils = require("../utils");

exports.getToken = async (req, res, next) => {
  try {
    console.log("getToken called with body:", req.body);
    const { accessToken, refreshToken, user } = await authService.getToken(
      req.body
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
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 5 * 24 * 60 * 60 * 1000, // 5 jours
      });

      const successResponse = new utils.OkSuccess("Login successful", {
        user: user
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

    const token = await authService.refreshToken({ refreshToken });
    const successResponse = new utils.OkSuccess("Token refreshed", {
      accessToken: token,
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

    console.log("Token received for verification:", token);
    console.log("req", req.params);
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
