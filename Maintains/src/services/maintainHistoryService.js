const utils = require("../utils");
const maintainHistoryRepository = require("../repository/maintainHistoryRepository");
exports.createMaintainHistory = async (
  maintainHistoryData,
  userId,
  filePaths
) => {
  try {
    maintainHistoryData.owner = userId; // Assuming owner is the userId
    maintainHistoryData.files = filePaths;
    maintainHistoryData.invoiceUrl = filePaths.map((p) =>
      p.replace(/\\/g, "/")
    );
    const createdMaintainHistory =
      await maintainHistoryRepository.createMaintainHistory(
        maintainHistoryData
      );
    return createdMaintainHistory;
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new utils.ValidationError(
        Object.values(error.errors)
          .map((e) => e.message)
          .join(", ")
      );
    }
    if (error.code === 11000) {
      throw new utils.ConflictError("Maintenance history already exists");
    }
    throw new utils.APIError(
      "An error occurred while creating the maintenance history",
      error
    );
  }
};

exports.getMaintainHistories = async (role, query) => {
  return await maintainHistoryRepository.getMaintainHistories(role, query);
};
exports.getMaintainHistoryById = async (maintainHistoryId, userId, role) => {
  const maintainHistory =
    await maintainHistoryRepository.getMaintainHistoryById(maintainHistoryId);
  if (!maintainHistory) {
    throw new utils.NotFoundError("Maintenance history not found");
  }

  return maintainHistory;
};

//TODO : verify userID = owner of vehicle
exports.updateMaintainHistory = async (
  maintainHistoryId,
  maintainHistoryData,
  userId,
  filePaths
) => {
  try {
    maintainHistoryData.files = filePaths;

    const updatedMaintainHistory =
      await maintainHistoryRepository.updateMaintainHistory(
        maintainHistoryId,
        maintainHistoryData,
        userId
      );
    if (!updatedMaintainHistory) {
      throw new utils.NotFoundError("Maintenance history not found");
    }
    return updatedMaintainHistory;
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new utils.ValidationError(
        Object.values(error.errors)
          .map((e) => e.message)
          .join(", ")
      );
    }
    throw new utils.APIError(
      "An error occurred while updating the maintenance history",
      error
    );
  }
};

//TODO : verify userID = owner of vehicle
exports.deleteMaintainHistory = async (maintainHistoryId, userId) => {
  try {
    const deletedMaintainHistory =
      await maintainHistoryRepository.deleteMaintainHistory(
        maintainHistoryId,
        userId
      );
    if (!deletedMaintainHistory) {
      throw new utils.NotFoundError("Maintenance history not found");
    }
    return deletedMaintainHistory;
  } catch (error) {
    throw new utils.APIError(
      "An error occurred while deleting the maintenance history",
      error
    );
  }
};
