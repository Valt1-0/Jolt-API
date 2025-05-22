const utils = require("../utils");
const userRepository = require("../repository/userRepository");
exports.verifyCredentials = async ({ email, password }) => {
  const existingUser = await userRepository.findUserByEmail(email);
  if (!existingUser) {
    throw new utils.NotFoundError("User not found");
  }
  const isPasswordValid = await existingUser.matchPassword(password);
  if (!isPasswordValid) {
    throw new utils.ValidationError("Invalid password");
  }
  return existingUser;
};

exports.createUser = async (userData) => {
  const { email, password } = userData;
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new utils.ValidationError("Email already exists");
  }
  const newUser = new userRepository({
    ...userData,
    password: password,
  });
  await newUser.save();
  return newUser;
};
