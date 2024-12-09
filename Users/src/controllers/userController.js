const User = require("../models/userModel");

// Get all users (admin functionality)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password -__v")
      .limit(10)
      .sort({ _id: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).send("An error occurred while fetching users");
  }
};