const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const {
  ValidationError,
  CreatedSuccess,
  OkSuccess,
  ForbiddenError,
  AuthorizeError,
} = require("../utils");
const crypto = require("crypto");
const success = require("../utils/success");
const Session = require("../models/sessionModel");
const bcrypt = require("bcrypt");
const { sendVerificationEmail } = require("../utils/functions");
const path = require("path");
const fs = require("fs");

// Génération de tokens
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET);
};

// Register User
exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password, region } = req.body;

    // Vérification de l'unicité
    const userExists = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username }],
    });

    if (userExists) {
      throw new ValidationError("This email or username is already taken");
    }

    // Création du jeton de vérification
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 heures

    // Création de l'utilisateur
    const user = await User.create({
      username: username,
      email: email,
      password,
      region,
      status: "waiting",
      verificationToken,
      verificationTokenExpires,
    });

    // Envoi de l'email de vérification
    // MICROSERVICE MAIL
    await sendVerificationEmail(user.email, user.username, verificationToken);

    const successResponse = new CreatedSuccess(
      "Inscription réussie. Veuillez vérifier votre email pour activer votre compte.",
      {
        id: user._id,
        username: user.username,
        email: user.email,
        status: user.status,
      }
    );

    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};

// Verify Email
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const user = await User.findOneAndUpdate(
      {
        verificationToken: token,
        verificationTokenExpires: { $gte: Date.now() },
      },
      {
        status: "active",
        verificationToken: null,
        verificationTokenExpires: null,
      },
      { new: true }
    );

    if (!user) {
      throw new NotFoundError(
        "The verification token has expired or is invalid."
      );
    }

    const responseData = {
      title: "Email Verification",
      message: "Email Verified Successfully!",
      details: "Your account is now active.",
      headerColor: "#4CAF50",
    };

    const templatePath = path.join(__dirname, "../utils/mails/template.html");
    let template = fs.readFileSync(templatePath, "utf-8");

    template = template.replace("{{title}}", responseData.title);
    template = template.replace("{{message}}", responseData.message);
    template = template.replace("{{details}}", responseData.details);
    template = template.replace("{{headerColor}}", responseData.headerColor);

    const successResponse = new OkSuccess(responseData.message);
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    console.error("Error during email verification:", error);
    next(error); // Pass the error to the error handling middleware
  }
};

exports.resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.status === "active") {
      throw new ValidationError("Account is already active");
    }

    // Régénération du jeton de vérification
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 heures

    // Mise à jour du jeton de vérification et de son expiration
    await User.updateOne(
      { _id: user._id },
      {
        verificationToken,
        verificationTokenExpires,
      }
    );

    // Envoi de l'email de vérification
    await sendVerificationEmail(user.email, user.username, verificationToken);

    const successResponse = new OkSuccess(
      "Verification email resent successfully",
      {
        id: user._id,
        username: user.username,
        email: user.email,
        status: user.status,
      }
    );

    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};

exports.loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  const MAX_SESSIONS_ALLOWED = process.env.MAX_SESSIONS_ALLOWED || 5;
  try {
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new AuthorizeError("Invalid credentials");

    if (user.is_banned)
      throw new ForbiddenError("User is banned", "User is banned");

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const existingSessions = await Session.find({ user_id: user._id });
    if (existingSessions.length >= MAX_SESSIONS_ALLOWED) {
      throw new ForbiddenError("Too many active sessions");
    }

    const session = new Session({
      user_id: user._id,
      refresh_token: refreshToken,
      device_info: req.headers["user-agent"],
      ip_address: req.ip,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
    });
    await session.save();

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    const successResponse = new OkSuccess("Logged in successfully", {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });

    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) throw new AuthorizeError("Refresh token missing");

  try {
    const session = await Session.findOne({ refresh_token: refreshToken });
    if (!session) throw new AuthorizeError("Invalid session");

    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const newAccessToken = generateAccessToken(payload.userId);

    const successResponse = new OkSuccess("Token refreshed", {
      accessToken: newAccessToken,
    });

    res.status(successResponse.statusCode).json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

exports.logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    await Session.deleteOne({ refresh_token: refreshToken });
    res.clearCookie("refresh_token");
    const successResponse = new OkSuccess("Logged out successfully");

    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

exports.logoutAll = async (req, res, next) => {
  try {
    await Session.deleteMany({ user_id: req.user.userId });
    res.clearCookie("refresh_token");
    const successResponse = new OkSuccess("Logged out from all devices");
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};
