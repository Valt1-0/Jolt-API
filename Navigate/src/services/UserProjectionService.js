//Service to handle user Projection logic

const userRepository = require("../repository/UserProjectionRepository.js");

exports.createUser = async (userProjection) => {
  try {
    // Call the repository function to create a user projection
    const result = await userRepository.create(userProjection);
    return result;
  } catch (error) {
    // Handle any errors that occur during the creation process
    console.error("Error creating user projection:", error);
    // throw error; // Re-throw the error for further handling if needed
  }
};

exports.getUserById = async (userId) => {
  try {
    // Call the repository function to get a user projection by ID
    const result = await userRepository.findById(userId);
    return result;
  } catch (error) {
    // Handle any errors that occur during the retrieval process
    console.error("Error retrieving user projection:", error);
    // throw error; // Re-throw the error for further handling if needed
  }
};

exports.getUserByPseudoOrEmail = async (pseudoOrEmail) => {
  try {
    // Call the repository function to get a user projection by pseudo or email
    const result = await userRepository.findByPseudoOrEmail(pseudoOrEmail);
    return result;
  } catch (error) {
    // Handle any errors that occur during the retrieval process
    console.error(
      "Error retrieving user projection by pseudo or email:",
      error
    );
    // throw error; // Re-throw the error for further handling if needed
  }
};

exports.updateUser = async (userProjection) => {
  try {
    // Call the repository function to update a user projection
    const result = await userRepository.update(userProjection);
    return result;
  } catch (error) {
    // Handle any errors that occur during the update process
    console.error("Error updating user projection:", error);
    // throw error; // Re-throw the error for further handling if needed
  }
};
