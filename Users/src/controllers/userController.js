const User = require("../models/userModel");
const { ValidationError, NotFoundError, OkSuccess } = require("../utils");

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

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params; // ID de l'utilisateur à modifier
    const { username, profilePicture, region, password } = req.body; // Champs modifiables
    // const loggedUser = req.user; // Utilisateur connecté (provenant du middleware d'authentification)

    if (!userId) {
      throw new ValidationError("L'ID de l'utilisateur est requis");
    }

    // // Vérification des autorisations
    // if (loggedUser.role !== "admin" && loggedUser._id.toString() !== userId) {
    //   return res.status(403).json({
    //     message: "You are not authorized to modify this user.",
    //   });
    // }

    // Construction des données à mettre à jour
    const updateData = {};
    if (username) {
      // Vérification de l'unicité du username
      const usernameExists = await User.findOne({ username });
      if (usernameExists && usernameExists._id.toString() !== userId) {
        return res.status(400).json({
          message: "This username is already taken. Please choose another one.",
        });
      }
      updateData.username = username;
    }
    if (profilePicture) updateData.profilePicture = profilePicture;
    if (region) updateData.region = region;
    if (password) {
      // Validation du mot de passe
      const isValidPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          password
        );
      if (!isValidPassword) {
        return res.status(400).json({
          message:
            "Password must contain at least 8 characters, including one uppercase, one lowercase, one number, and one special character.",
        });
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    updateData.updatedAt = Date.now(); // Mise à jour de la date de modification

    // Mise à jour dans la base de données
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundError("Utilisateur non trouvé");
    }

    const successResponse = new OkSuccess(
      "User found successfully",
      updatedUser
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      message: "An error occurred while updating the user.",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params; // ID de l'utilisateur à supprimer
    // const loggedUser = req.user; // Utilisateur connecté (provenant du middleware d'authentification)

    // // Vérification des autorisations
    // if (loggedUser.role !== "admin" && loggedUser._id.toString() !== userId) {
    //   return res.status(403).json({
    //     message: "You are not authorized to delete this user.",
    //   });
    // }

    if (!userId) {
      throw new ValidationError("L'ID de l'utilisateur est requis.");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("Utilisateur non trouvé.");
    }

    await User.deleteOne({ _id: userId });

    const successResponse = new OkSuccess("Utilisateur supprimé avec succès.");
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);

    return res.status(error.status || 500).json({
      message: error.message || "Une erreur interne est survenue.",
    });
  }
};
