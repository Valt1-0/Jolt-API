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

const maintainHistoryService = require("../services/maintainHistoryService");
const { GATEWAY_URL } = require("../config");

// Cette fonction calcule le pourcentage d'usure pour un type de maintenance
exports.getWearPercentage = async (vehicleOrId, typeId, userId, role, jwt) => {
  // Récupère le véhicule
  let vehicle = vehicleOrId;

  // Si on reçoit un objet véhicule, on l'utilise directement
  if (typeof vehicleOrId === "object" && vehicleOrId !== null) {
    vehicle = vehicleOrId;
  } else {
    const response = await fetch(`${GATEWAY_URL}/vehicle/${vehicle}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    if (response.status === 403)
      throw new utils.ForbiddenError(
        "Forbidden: you do not have access to this vehicle"
      );
    if (response.status === 404)
      throw new utils.NotFoundError("Vehicle not found");
    const vehicleData = await response.json();
    if (!vehicleData?.data)
      throw new utils.NotFoundError("Vehicle data not found");
    vehicle = vehicleData.data;
  }

  if (!vehicle || !typeId)
    throw new utils.ValidationError("Vehicle ID and Type ID are required");

  const maintainType = await exports.getMaintainById(typeId, userId, role);
  if (!maintainType)
    throw new utils.NotFoundError("Maintenance type not found");

  // Récupère le dernier historique pour ce véhicule et ce type
  const histories = await maintainHistoryService.getMaintainHistories(role, {
    vehicle: vehicle?.id || vehicle._id,
    type: typeId,
  });
  const lastHistory =
    Array.isArray(histories) && histories.length > 0
      ? histories.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
      : null;

  if (!lastHistory) {
    if (vehicle.mileage === 0) return 0;
    let percentKm = 0;
    let percentDays = 0;
    if (maintainType.periodicity.km) {
      percentKm = Math.min(
        (vehicle.mileage / maintainType.periodicity.km) * 100,
        100
      );
    }
    if (maintainType.periodicity.days) {
      const usedDays =
        (Date.now() - new Date(vehicle.firstPurchaseDate)) /
        (1000 * 60 * 60 * 24);
      percentDays = Math.min(
        (usedDays / maintainType.periodicity.days) * 100,
        100
      );
    }
    return Math.max(percentKm, percentDays);
  }

  let percentKm = 0;
  if (maintainType.periodicity.km) {
    const usedKm = vehicle.mileage - lastHistory.mileage;
    percentKm = Math.min((usedKm / maintainType.periodicity.km) * 100, 100);
  }
  let percentDays = 0;
  if (maintainType.periodicity.days) {
    const usedDays = (Date.now() - lastHistory.date) / (1000 * 60 * 60 * 24);
    percentDays = Math.min(
      (usedDays / maintainType.periodicity.days) * 100,
      100
    );
  }
  return Math.max(percentKm, percentDays);
};

exports.getMaintenanceCountForSocket = async (
  userId,
  vehicleId,
  role = "user",
  jwt = null
) => {
  // Récupère le véhicule une seule fois
  let vehicle;
  try {
    const response = await fetch(`${GATEWAY_URL}/vehicle/${vehicleId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    if (response.status === 403)
      throw new utils.ForbiddenError(
        "Forbidden: you do not have access to this vehicle"
      );
    if (response.status === 404)
      throw new utils.NotFoundError("Vehicle not found");
    const vehicleData = await response.json();
    if (!vehicleData?.data)
      throw new utils.NotFoundError("Vehicle data not found");
    vehicle = vehicleData.data;
  } catch (err) {
    throw err;
  }

  // Récupère toutes les maintenances
  const maintains = await exports.getMaintains(userId, role, {}, null);
  let count = 0;
  for (const maintain of maintains) {
    if (maintain._id) {
      // Passe l'objet véhicule déjà récupéré
      const wearPercentage = await exports.getWearPercentage(
        vehicle, // objet véhicule
        maintain._id,
        userId,
        role,
        jwt
      );
      if (wearPercentage > 50) {
        count++;
      }
    }
  }
  return count;
};