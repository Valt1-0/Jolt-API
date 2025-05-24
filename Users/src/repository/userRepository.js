const user = require("../models/userModel");
const utils = require("../utils");

exports.findUserByEmail = async (email) => {
  const userData = await user.findOne({ email });
  return userData;
};
exports.findUserById = async (id) => {
  const userData = await user.findById(id);
  return userData;
};

exports.findUserByIdOrEmail = async (identifier) => {
  const userData = await user.findOne({
    $or: [{ _id: identifier }, { email: identifier }],
  });
  return userData;
};

exports.getAllUsers = async (page, limit, sort) => {
  const users = await user
    .find()
    .select("-password")
    .limit(limit)
    .skip((page - 1) * limit)
    .sort(sort);
  return users;
};
exports.createUser = async (userData) => {
  const newUser = new user(userData);
  await newUser.save();
  return newUser;
};

exports.verifyUserPassword = async (email, password) => {
  const userData = await user.findOne({ email });
  if (!userData) {
    throw new utils.NotFoundError("User not found");
  }

  const isPasswordValid = await userData.matchPassword(password);
  if (!isPasswordValid) {
    throw new utils.ValidationError("Invalid password");
  }
  return userData;
};

exports.findUserByVerificationToken = async (token) => {
  const userData = await user.findOne({ verificationToken: token });
  return userData;
};

exports.activateUserByToken = async (token) => {
  return await user.findOneAndUpdate(
    { verificationToken: token },
    {
      $set: {
        status: "active",
      },
      $unset: {
        verificationToken: "",
        verificationTokenExpires: "",
      },
    },
    { new: true }
  );
};

exports.updateUserById = async (id, updateData) => {
  return await user.findByIdAndUpdate(id, updateData, { new: true });
};

exports.deleteById = async (id) => {
  const userData = await user.findByIdAndDelete(id);
  if (!userData) {
    throw new utils.NotFoundError("User not found");
  }
  return userData;
};
