const User = require("../models/userModel");

const {
  ValidationError,
  NotFoundError,
  OkSuccess,
  CreatedSuccess,
} = require("../utils");
const userService = require("../services/userService");
const utils = require("../utils");
const { profile } = require("winston");

exports.getAllUsers = async (req, res, next) => {
  try {
    const { query } = req.query;
    let filter = {};

    if (query) {
      // Supporte query = username:john ou query = email:test@test.com
      const [key, value] = query.split(":");
      if (key && value && (key === "username" || key === "email")) {
        filter[key] = { $regex: value, $options: "i" };
      }
    }

    const users = await userService.getAllUsers(
      req.query.page || 1,
      req.query.limit || 10,
      req.query.sort || { _id: -1 },
      filter // passe le filtre au service
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
    const user = await userService.getUserByIdOrEmail(query);

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
    const createdUser = await userService.createUser(req.body);

    if (createdUser) {
      const channel = await utils.getChannel();

      if (channel) {
        const userData = {
          _id: createdUser._id,
          username: createdUser.username,
          profilePicture: createdUser.profilePicture,
        };
        utils.PublishMessage(channel, "user_created", JSON.stringify(userData));
      }
    }
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
    const { id } = req.user;
    const { userId } = req.body; // L'ID de l'utilisateur à supprimer doit être fourni dans le body

    if (!userId) {
      throw new ValidationError("User ID is required for deletion");
    }
    if (id === userId) {
      throw new ValidationError(
        "Vous ne pouvez pas supprimer votre propre compte"
      );
    }

    const deletedUser = await userService.deleteById(userId);
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

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ValidationError("ID is required for update");
    }
    const updatedUser = await userService.updateUser(id, req.body);
    const successResponse = new OkSuccess(
      "User updated successfully",
      updatedUser
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    console.error("Error in update:", error);
    next(error);
  }
};
