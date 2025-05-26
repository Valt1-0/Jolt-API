const utils = require("../utils");
const maintainRepository = require("../repository/maintainRepository");
exports.createMaintain = async (maintainData, userId) => {
  try {
    console?.log("Creating maintenance with data:", maintainData);
    maintainData.owner = userId; // Assuming owner is the userId
    if (maintainData.periodicity) {
      if (maintainData.periodicity.days !== undefined) {
        maintainData.periodicity.days = Number(maintainData.periodicity.days);
      }
      if (maintainData.periodicity.km !== undefined) {
        maintainData.periodicity.km = Number(maintainData.periodicity.km);
      }
    }
    const createdMaintain = await maintainRepository.createMaintain(
      maintainData
    );
    return createdMaintain;
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new utils.ValidationError(
        Object.values(error.errors)
          .map((e) => e.message)
          .join(", ")
      );
    }
    if (error.code === 11000) {
      throw new utils.ConflictError("Maintenance already exists");
    }
    throw new utils.APIError(
      "An error occurred while creating the maintenance",
      error
    );
  }
};
exports.getMaintains = async (userId, query) => {
  return await maintainRepository.getMaintains(userId, query);
};
exports.getMaintainById = async (maintainId, userId, role) => {
  const maintain = await maintainRepository.getMaintainById(maintainId);
  if (!maintain) {
    throw new utils.NotFoundError("Maintenance not found");
  }
  if (maintain.owner.toString() !== userId.toString() && role !== "admin") {
    throw new utils.ForbiddenError(
      "You do not have permission to access this maintenance"
    );
  }
  return maintain;
};
exports.updateMaintain = async (maintainId, maintainData, userId) => {
  try {
    const updatedMaintain = await maintainRepository.updateMaintain(
      maintainId,
      maintainData,
      userId
    );
    if (!updatedMaintain) {
      throw new utils.NotFoundError("Maintenance not found");
    }
    return updatedMaintain;
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new utils.ValidationError(
        Object.values(error.errors)
          .map((e) => e.message)
          .join(", ")
      );
    }
    throw new utils.APIError(
      "An error occurred while updating the maintenance",
      error
    );
  }
};

exports.deleteMaintain = async (maintainId, userId) => {
  try {
    const deletedMaintain = await maintainRepository.deleteMaintain(
      maintainId,
      userId
    );
    if (!deletedMaintain) {
      throw new utils.NotFoundError("Maintenance not found");
    }
    return deletedMaintain;
  } catch (error) {
    throw new utils.APIError(
      "An error occurred while deleting the maintenance",
      error
    );
  }
};
