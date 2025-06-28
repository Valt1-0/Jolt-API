const User = require("../models/UserModelProjection");

exports.findById = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error;
  }
};

exports.findByPseudoOrEmail = async (pseudoOrEmail) => {
  try {
    const user = await User.findOne({
      $or: [{ pseudo: pseudoOrEmail }, { email: pseudoOrEmail }],
    });
    return user;
  } catch (error) {
    console.error("Error finding user by pseudo or email:", error);
    throw error;
  }
};

exports.create = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

exports.update = async (id, updateData) => {
  try {
    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    return user;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
