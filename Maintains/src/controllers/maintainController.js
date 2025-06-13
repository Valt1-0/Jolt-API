const {
  ValidationError,
  NotFoundError,
  OkSuccess,
  CreatedSuccess,
} = require("../utils");
const fs = require("fs");
const path = require("path");
const maintainService = require("../services/maintainService");
const maintainHistoryService = require("../services/maintainHistoryService");
const { GATEWAY_URL } = require("../Config");
async function getWearPercentage(vehicleOrId, typeId, userId, role, jwt) {
  let vehicle;

  // Si on reçoit un objet véhicule, on l'utilise directement
  if (typeof vehicleOrId === "object" && vehicleOrId !== null) {
    vehicle = vehicleOrId;
  } else {
    // Sinon, on fait le fetch comme avant
    const response = await fetch(`${GATEWAY_URL}/vehicle/${vehicleOrId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    if (!response.ok) throw new utils.NotFoundError("Vehicle not found");
    let vehicleData = await response.json();
    if (!vehicleData?.data)
      throw new utils.NotFoundError("Vehicle data not found");
    vehicle = vehicleData.data;
  }

  if (!vehicle || !typeId)
    throw new ValidationError("Vehicle ID and Type ID are required");

  const maintainType = await maintainService.getMaintainById(
    typeId,
    userId,
    role
  );

  if (!maintainType) throw new NotFoundError("Maintenance type not found");

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
    // Si le véhicule est neuf (mileage = 0), usure = 0
    if (vehicle.mileage === 0) return 0;

    // Sinon, calculer l'usure depuis la date d'achat et le kilométrage actuel
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

    // Retourne le plus élevé des deux
    return Math.max(percentKm, percentDays);
  }

  // Pourcentage km
  let percentKm = 0;
  if (maintainType.periodicity.km) {
    const usedKm = vehicle.mileage - lastHistory.mileage;
    percentKm = Math.min((usedKm / maintainType.periodicity.km) * 100, 100);
  }

  // Pourcentage jours
  let percentDays = 0;
  if (maintainType.periodicity.days) {
    const usedDays = (Date.now() - lastHistory.date) / (1000 * 60 * 60 * 24);
    percentDays = Math.min(
      (usedDays / maintainType.periodicity.days) * 100,
      100
    );
  }

  // Retourne le plus élevé ou les deux
  return Math.max(percentKm, percentDays);
}

// Create a new maintenance
exports.createMaintain = async (req, res, next) => {
  try {
    const maintainData = req.body;
    const userId = req.user.id; // Assuming user ID is stored in req.user

    const newMaintain = await maintainService.createMaintain(
      maintainData,
      userId
    );

    const successResponse = new CreatedSuccess(
      "Maintenance created successfully",
      newMaintain
    );

    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

//Get Maintenance Count where pourcent is Greate than 50

exports.getMaintenanceCount = async (req, res, next) => {
  try {
    const { vehicleIds } = req.body;
    const userId = req.user.id;
    const role = req.user.role;
    const jwt =
      req.headers.authorization?.split(" ")[1] || req.cookies?.access_token;

    if (!Array.isArray(vehicleIds)) {
      return res.status(400).json({ error: "vehicleIds must be an array" });
    }

    const results = [];
    for (const vehicleId of vehicleIds) {
      const count = await maintainService.getMaintenanceCountForSocket(
        userId,
        vehicleId,
        role,
        jwt
      );
      results.push({ vehicleId, pendingMaintenances: count });
    }
    res.json(results);
  } catch (err) {
    next(err);
  }
};

// Get all maintenances for a user
exports.getMaintains = async (req, res, next) => {
  try {
    const jwt =
      req.headers.authorization?.split(" ")[1] || req.cookies?.access_token;
    const role = req.user.role;
    const vehicleId = req.query.vehicleId;
    const { query } = req.query; // Assuming query is passed in the request
    const proId = role === "pro" ? req.user.id : null;
    let filter = {};

    const userId =
      (role === "admin" || role === "pro") && req.query.userId
        ? req.query.userId
        : req.user.id;
    const stringFields = ["name", "description", "notes"]; // adapte selon ton modèle

    // If query is provided, parse it to filter maintenances

    if (query) {
      // Découpe chaque filtre séparé par une virgule
      const filters = query.split(",");
      filters.forEach((item) => {
        const [key, value] = item.split(":");
        if (key && value) {
          if (stringFields.includes(key)) {
            filter[key] = { $regex: value, $options: "i" };
          } else {
            filter[key] = value;
          }
        }
      });
    }

    // If admin without userId, retrieve all
    const maintains = await maintainService.getMaintains(
      userId,
      role,
      filter,
      proId
    );
    //gear wear percentage for each maintenance
    for (const maintain of maintains) {
      if (vehicleId && maintain._id) {
        maintain.wearPercentage = await getWearPercentage(
          vehicleId,
          maintain._id,
          userId,
          role,
          jwt
        );

      }
    }

    const maintainsWithWear = maintains.map((maintain) => {
      // Convertit en objet JS simple
      const obj = maintain.toObject ? maintain.toObject() : { ...maintain };
      obj.wearPercentage = maintain.wearPercentage || 0;
      return obj;
    });

    const successResponse = new OkSuccess(
      "Maintenances retrieved successfully",
      maintainsWithWear
    );

    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    console.error("Error in getMaintains:", error);
    next(error);
  }
};

// Get a maintenance by ID
exports.getMaintainById = async (req, res, next) => {
  try {
    const maintainId = req.params.id;
    const userId = req.user.id; // Assuming user ID is stored in req.user
    const role = req.user.role; // Assuming role is stored in req.user

    const maintain = await maintainService.getMaintainById(
      maintainId,
      userId,
      role
    );

    if (!maintain) {
      throw new NotFoundError("Maintenance not found");
    }

    const successResponse = new OkSuccess(
      "Maintenance retrieved successfully",
      maintain
    );

    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};
// Update a maintenance by ID
exports.updateMaintain = async (req, res, next) => {
  try {
    const maintainId = req.params.id;
    const maintainData = req.body;

    const userId =
      role === "admin" && req.query.userId ? req.query.userId : req.user.id;

    if (!maintainId)
      throw new ValidationError("Maintenance ID is required for update");
    if (!maintainData || Object.keys(maintainData).length === 0) {
      throw new ValidationError("Maintenance data is required for update");
    }

    const updatedMaintain = await maintainService.updateMaintain(
      maintainId,
      maintainData,
      userId
    );

    const successResponse = new OkSuccess(
      "Maintenance updated successfully",
      updatedMaintain
    );

    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};
// Delete a maintenance by ID
exports.deleteMaintain = async (req, res, next) => {
  try {
    const maintainId = req.params.id;

    const userId =
      (role === "admin" || role === "pro") && req.query.userId
        ? req.query.userId
        : req.user.id;

    if (!maintainId) {
      throw new ValidationError("Maintenance ID is required for deletion");
    }

    await maintainService.deleteMaintain(maintainId, userId);

    const successResponse = new OkSuccess("Maintenance deleted successfully");

    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};
