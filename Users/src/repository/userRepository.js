const user = require("../models/userModel");
const utils = require("../utils"); 

exports.findUserByEmail = async (email) => {
  const userData = await user.findOne({ email });
  if (!userData) {
    throw new utils.NotFoundError("User not found");
  }
  return userData;
};
exports.findUserById = async (id) => {
  const userData = await user.findById(id);
  if (!userData) {
    throw new utils.NotFoundError("User not found");
  }
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
  const { username, email, password, region } = userData;
  const existingUser = await user.findOne({ email });
  if (existingUser) {
    throw new utils.ValidationError("Email already exists");
  }
  const newUser = new user({
    ...userData,
    password: password,
  });
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
