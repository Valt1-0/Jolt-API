const utils = require("../utils");
const maintainRepository = require("../repository/maintainRepository");
const maintainHistoryModel = require("../models/maintainHistoryModel");

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
exports.getMaintains = async (userId, role, filter = {}, proId = null) => {
  if (filter.owner) {
    delete filter.owner;
  }
  if (role === "pro" && userId) {
    // Pro : types par défaut + ceux de l'utilisateur ciblé + ses propres types
    return await maintainRepository.getMaintains({
      $or: [{ owner: userId }, { owner: proId }, { isDefault: true }],
      ...filter,
    });
  }
  if (role === "admin" && userId) {
    // Admin : types par défaut + ceux de l'utilisateur ciblé
    return await maintainRepository.getMaintains({
      $or: [{ owner: userId }, { isDefault: true }],
      ...filter,
    });
  }
  if (role === "admin" || role === "pro") {
    // Admin/pro sans userId : types par défaut + (pour pro, ses propres types)
    const orArray = [{ isDefault: true }];
    if (role === "pro" && proId) orArray.push({ owner: proId });
    return await maintainRepository.getMaintains({
      $or: orArray,
      ...filter,
    });
  }
  // Utilisateur : ses maintenances + celles par défaut
  return await maintainRepository.getMaintains({
    $or: [{ owner: userId }, { isDefault: true }],
    ...filter,
  });
};
exports.getMaintainById = async (maintainId, userId, role) => {
  const maintain = await maintainRepository.getMaintainById(maintainId);
  if (!maintain) {
    throw new utils.NotFoundError("Maintenance not found");
  }

  if (
    maintain.owner &&
    maintain.owner?.toString() !== userId?.toString() &&
    role !== "admin"
  ) {
    throw new utils.ForbiddenError(
      "You do not have permission to access this maintenance"
    );
  }
  return maintain;
};

exports.updateMaintain = async (maintainId, maintainData, userId, role) => {
  try {
    const maintain = await maintainRepository.getMaintainById(maintainId);
    if (!maintain) {
      throw new utils.NotFoundError("Maintenance not found");
    }
    // Vérification des droits
    if (role !== "admin" && maintain.owner?.toString() !== userId?.toString()) {
      throw new utils.ForbiddenError(
        "You do not have permission to update this maintenance"
      );
    }

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

exports.deleteMaintain = async (maintainId, userId, role) => {
  try {
    const maintain = await maintainRepository.getMaintainById(maintainId);
    if (!maintain) {
      throw new utils.NotFoundError("Maintenance not found");
    }
    // Vérification des droits
    if (role !== "admin" && maintain.owner?.toString() !== userId?.toString()) {
      throw new utils.ForbiddenError(
        "You do not have permission to delete this maintenance"
      );
    }

    // Vérifie s'il existe un historique lié à ce type
    const historyCount = await maintainHistoryModel.countDocuments({
      type: maintainId,
    });
    if (historyCount > 0) {
      // Désactive le type au lieu de supprimer
      maintain.disabled = true;
      await maintain.save();
      return { disabled: true, maintain };
    } else {
      // Supprime définitivement
      const deletedMaintain = await maintainRepository.deleteMaintain(
        maintainId
      );
      if (!deletedMaintain) {
        throw new utils.NotFoundError("Maintenance not found");
      }
      return deletedMaintain;
    }
  } catch (error) {
    throw new utils.APIError(
      "An error occurred while deleting the maintenance",
      error
    );
  }
};
