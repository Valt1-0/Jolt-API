const utils = require("../utils");
const userRepository = require("../repository/userRepository");
exports.verifyCredentials = async ({ email, password }) => {
  const existingUser = await userRepository.findUserByEmail(email);
  if (!existingUser) {
    throw new utils.NotFoundError("User not found");
  }
  if (existingUser.status !== "active") {
    throw new utils.AuthorizeError("User is not active"); // renvoie une erreur HTTP appropriée
  }
  const isPasswordValid = await existingUser.matchPassword(password);
  if (!isPasswordValid) {
    throw new utils.ValidationError("Invalid password");
  }
  return existingUser;
};

exports.createUser = async (userData) => {
  try {
    const createdUser = await userRepository.createUser(userData);
    return createdUser;
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new utils.ValidationError(
        Object.values(error.errors)
          .map((e) => e.message)
          .join(", ")
      );
    }
    if (error.code === 11000) {
      throw new utils.ConflictError("User already exists");
    }
    throw new utils.APIError(
      "An error occurred while creating the user",
      error
    );
  }
};
