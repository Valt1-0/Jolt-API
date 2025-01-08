const User = require("../models/userModel");
const {
  ValidationError,
  NotFoundError,
  OkSuccess,
  handleErrorWithLogger,
} = require("../utils");

// Get all users (admin functionality)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password")
      .limit(10)
      .sort({ _id: -1 });

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
