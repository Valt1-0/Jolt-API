const User = require("../models/userModel");

const {
  ValidationError,
  NotFoundError,
  OkSuccess,
  CreatedSuccess,
} = require("../utils");
const userService = require("../services/userService");
// Get all users (admin functionality)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userRepository.getAllUsers(
      req.query.page || 1,
      req.query.limit || 10,
      req.query.sort || { _id: -1 }
    );

    const successResponse = new OkSuccess("Users fetched successfully", users);
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    next(error); // Pass the error to the error handling middleware
  }
};

// Rechercher un utilisateur par email ou username
exports.getUser = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      throw new ValidationError("La requête de recherche est vide");
    }

    const user = await User.findOne({
      $or: [
        { email: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    }).select("username email profilePicture");

    if (!user) {
      throw new NotFoundError("Utilisateur non trouvé");
    }

    const successResponse = new OkSuccess("User found successfully", user);
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    console.error(
      `Erreur lors de la recherche de l'utilisateur: ${error.message}`
    );
    next(error); // Pass the error to the error handling middleware
  }
};

exports.createUser = async (req, res, next) => {
  try {
    console.log("Request body:", req.body); // Log the request body for debugging
    const createdUser = await userService.createUser(req.body);
    const successResponse = new CreatedSuccess(
      "User created successfully",
      createdUser
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    console.error("Error in createUser:", error);
    next(error);
  }
};

exports.verifyUser = async (req, res, next) => {
  try {
    const user = await userService.verifyCredentials(req.body);
    const successResponse = new OkSuccess("User verified successfully", user);
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    console.error("Error in verify:", error);
    next(error);
  }
};

exports.verifyEmailToken = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) {
      throw new ValidationError("Token is required for verification");
    }
    console.log("Token received for verification:", token); // Log the token for debugging
    const user = await userService.verifyEmailToken(token);
    const successResponse = new OkSuccess("Email verified successfully", user);
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    next(error);
  }
};

exports.updateVerificationToken = async (req, res, next) => {
  try {
    console.log("test");
    const { email, verificationToken, verificationTokenExpires } = req.body;
    if (!email) {
      throw new ValidationError("Email is required for verification");
    }
    if (!verificationToken) {
      throw new ValidationError("Token is required for verification");
    }
    const user = await userService.updateVerificationToken({
      email: email,
      verificationToken: verificationToken,
      verificationTokenExpires: verificationTokenExpires,
    });
    const successResponse = new OkSuccess(
      "Verification token updated successfully",
      user
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    console.error("Error in updateVerificationToken:", error);
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    console.log("Request user ID:", req.user); // Log the user ID for debugging
    const { id } = req.user;
    if (!id) {
      throw new ValidationError("ID is required for deletion");
    }
    const deletedUser = await userService.deleteById(id);
    const successResponse = new OkSuccess(
      "User deleted successfully",
      deletedUser
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    console.error("Error in delete:", error);
    next(error);
  }
};
