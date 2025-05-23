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

// Rechercher un utilisateur par email ou pseudo
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
    const successResponse = new CreatedSuccess("User created successfully",createdUser);
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
