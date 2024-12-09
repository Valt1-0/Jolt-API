const User = require("../models/userModel");

// Get all users (admin functionality)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password")
      .limit(10)
      .sort({ _id: -1 });

    res.status(200).json(users);
    next();
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).send("An error occurred while fetching users");
  }
};

// Rechercher un utilisateur par email ou pseudo
exports.getUser = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "La requête de recherche est vide",
      });
    }

    const user = await User.findOne({
      $or: [
        { email: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    }).select("username email profilePicture");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(
      `Erreur lors de la recherche de l'utilisateur: ${error.message}`
    );
    res.status(500).json({
      success: false,
      message: "Erreur lors de la recherche de l'utilisateur",
      error: error.message,
    });
  }
};
