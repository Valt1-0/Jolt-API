//Service to handle user Projection logic

const userRepository = require("../repository/UserProjectionRepository.js");

exports.createUser = async (userProjection) => {
  try {
    // Call the repository function to create a user projection
    const result = await userRepository.create(userProjection);
    return result;
  } catch (error) {
    console.error("Error creating user projection:", error);
   
  }
};

exports.getUserById = async (userId) => {
  try {
    // Call the repository function to get a user projection by ID
    const result = await userRepository.findById(userId);
    return result;
  } catch (error) {
    console.error("Error retrieving user projection:", error);
  }
};

exports.getUserByPseudoOrEmail = async (pseudoOrEmail) => {
  try {
    // Call the repository function to get a user projection by pseudo or email
    const result = await userRepository.findByPseudoOrEmail(pseudoOrEmail);
    return result;
  } catch (error) {
    console.error(
      "Error retrieving user projection by pseudo or email:",
      error
    );
  }
};

exports.updateUser = async (userProjection) => {
  try {
    // Call the repository function to update a user projection
    const result = await userRepository.update(userProjection);
    return result;
  } catch (error) {
    console.error("Error updating user projection:", error);
  }
};
