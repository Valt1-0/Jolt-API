const utils = require("../utils");
const userRepository = require("../repository/userRepository");
exports.verifyCredentials = async ({ email, password }) => {
  const existingUser = await userRepository.findUserByEmail(email);
  if (!existingUser) {
    throw new utils.NotFoundError("User not found");
  }
  if (existingUser.status !== "active") {
    throw new utils.AuthorizeError("Email not verify"); // renvoie une erreur HTTP appropriée
  }
  const isPasswordValid = await existingUser.matchPassword(password);
  if (!isPasswordValid) {
    throw new utils.ValidationError("Invalid password");
  }
  return existingUser;
};

exports.getUserByIdOrEmail = async (identifier) => {
  const user = await userRepository.findUserByIdOrEmail(identifier);
  if (!user) {
    throw new utils.NotFoundError("User not found");
  }
  return user;
}

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

exports.verifyEmailToken = async (token) => {
  const user = await userRepository.findUserByVerificationToken(token);
  if (!user) {
    throw new utils.NotFoundError("No user found with this token");
  }
  if (user.verificationTokenExpires < Date.now()) {
    throw new utils.ValidationError("Token expired");
  }
  const updatedUser = await userRepository.activateUserByToken(token);
  return updatedUser;
};

exports.updateVerificationToken = async ({ email, verificationToken, verificationTokenExpires }) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new utils.NotFoundError("No user found with this email");
  }
  if (user.status === "active") {
    throw new utils.ValidationError("Account is already active");
  }

  const updateData = {
    verificationToken,
    verificationTokenExpires,
  };
  const updatedUser = await userRepository.updateUserById(user._id, updateData);
  return updatedUser;
}

exports.deleteById = async (userId) => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new utils.NotFoundError("User not found");
  }
  await userRepository.deleteById(userId);
  return { message: "User deleted successfully" };
}