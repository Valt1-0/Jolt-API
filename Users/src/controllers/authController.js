const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { ValidationError, CreatedSuccess } = require("../utils");
const crypto = require("crypto");
const success = require("../utils/success");
const Session = require("../models/sessionModel");
const bcrypt = require("bcrypt");
const { sendVerificationEmail } = require("../utils/functions");

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
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérification de l'unicité
    const userExists = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username }],
    });

    if (userExists) {
      throw new ValidationError("This email or username is already taken");
    }

    // Création du jeton de vérification
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Création de l'utilisateur
    const user = await User.create({
      username: username,
      email: email,
      password,
      region: "region",
      status: "waiting",
      verificationToken,
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

    return res.status(successResponse.statusCode).json({
      success: successResponse.success,
      message: successResponse.message,
      data: successResponse.data,
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return res.status(error?.status).json({
      message: error.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    console.log(user);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (user.is_banned)
      return res.status(403).json({ message: "User is banned" });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

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
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token missing" });

  try {
    const session = await Session.findOne({ refresh_token: refreshToken });
    if (!session) return res.status(401).json({ message: "Invalid session" });

    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const newAccessToken = generateAccessToken(payload.userId);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

exports.logoutUser = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  await Session.deleteOne({ refresh_token: refreshToken });
  res.clearCookie("refresh_token");
  res.json({ message: "Logged out successfully" });
};

exports.logoutAll = async (req, res) => {
  await Session.deleteMany({ user_id: req.user.userId });
  res.clearCookie("refresh_token");
  res.json({ message: "Logged out from all devices" });
};
