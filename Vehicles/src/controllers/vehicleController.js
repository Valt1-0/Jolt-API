const {
  ValidationError,
  NotFoundError,
  OkSuccess,
  CreatedSuccess,
} = require("../utils");
const fs = require("fs");
const path = require("path");
const vehicleService = require("../services/vehicleService");
const { IMAGE_BASE_URL } = require("../config");
// Create a new vehicle
exports.createVehicle = async (req, res, next) => {
  try {
    const vehicleData = req.body;
    const userId = req.user.id; // Assuming user ID is stored in req.user
    console.log("User ID:", userId, "vehicleImage:", req.file);
    if (req.file) {
      vehicleData.image = `${IMAGE_BASE_URL}${req.file.filename}`;
    } else {
      // Sinon, on ne touche pas au champ image (il reste inchangé)
      delete vehicleData.image;
    }
    const newVehicle = await vehicleService.createVehicle(vehicleData, userId);

    const successResponse = new CreatedSuccess(
      "Vehicle created successfully",
      newVehicle
    );

    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

// Get all vehicles for a user
exports.getAllVehicles = async (req, res, next) => {
  try {
    const role = req.user.role;
    let userId;

    // Si admin ou pro et userId fourni, filtrer
    if ((role === "admin" || role === "pro") && req.query.userId) {
      userId = req.query.userId;
    }
    // Si membre, vérifier qu'il ne demande pas autre chose que lui-même
    else if (
      role === "member" &&
      req.query.userId &&
      req.query.userId !== req.user.id
    ) {
      throw new ValidationError(
        "Vous n'avez pas le droit d'accéder à ces véhicules."
      );
    }
    // Si membre ou pro sans query, utiliser son propre id
    else if (role !== "admin") {
      userId = req.user.id;
    }
    // Si admin sans query, récupérer tout
    else {
      userId = undefined; // Pour getAllVehicles => tout
    }

    const vehicles = await vehicleService.getAllVehicles(userId, role);

    const successResponse = new OkSuccess(
      "Vehicles fetched successfully",
      vehicles
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

// Get a vehicle by ID
exports.getVehicleById = async (req, res, next) => {
  try {
    const vehicleId = req.params.id;
    const userId = req.user.id; // Assuming user ID is stored in req.user
    // Assuming role is stored in req.user.role
    const role = req.user.role; // Uncomment if role is needed for permission checks
    const vehicle = await vehicleService.getVehicleById(
      vehicleId,
      userId,
      role
    );
    const successResponse = new OkSuccess(
      "Vehicle fetched successfully",
      vehicle
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

// Update a vehicle by ID
exports.updateVehicle = async (req, res, next) => {
  try {
    const vehicleId = req.params.id;
    const vehicleData = req.body;
    const userId = req.user.id; // Assuming user ID is stored in req.user

    if (!vehicleId)
      throw new ValidationError("Vehicle ID is required for update");
    if (!vehicleData || Object.keys(vehicleData).length === 0) {
      throw new ValidationError("Vehicle data is required for update");
    }

    // Récupère l'ancien véhicule pour connaître l'ancienne image
    const oldVehicle = await vehicleService.getVehicleById(
      vehicleId,
      userId,
      req.user.role
    );
    const imageUrl = oldVehicle.image;
    const imagePath = imageUrl.replace(/^https?:\/\/[^/]+/, ""); // retire le domaine

    const absolutePath = path.join(__dirname, "../..", imagePath);
    console.log("Absolute path:", absolutePath);
    // Si une nouvelle image est uploadée, on met à jour le champ image
    if (req.file) {
      if (
        oldVehicle.image &&
        !oldVehicle.image.includes("default") &&
        fs.existsSync(absolutePath)
      ) {
        fs.unlinkSync(absolutePath);
      }
      vehicleData.image = `${IMAGE_BASE_URL}${req.file.filename}`;
    } else {
      delete vehicleData.image;
    }
    const updatedVehicle = await vehicleService.updateVehicle(
      vehicleId,
      vehicleData,
      userId
    );
    const successResponse = new OkSuccess(
      "Vehicle updated successfully",
      updatedVehicle
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

exports.updateVehicleMileage = async (req, res, next) => {
  try {
    const vehicleId = req.params.id;
    const userId = req.user.id;
    const { mileage } = req.body;

    if (!vehicleId) {
      throw new ValidationError("Vehicle ID is required for update");
    }
    if (typeof mileage !== "number") {
      throw new ValidationError("mileage must be a number");
    }

    const updatedVehicle = await vehicleService.updateVehicleMileage(
      vehicleId,
      mileage,
      userId
    );

    const successResponse = new OkSuccess(
      "Vehicle mileage updated successfully",
      updatedVehicle
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    console.error("Error in updateVehicleMileage:", error);
    next(error);
  }
};

exports.setFavoriteVehicle = async (req, res, next) => {
  try {
    const vehicleId = req.params.id;
    const userId = req.user.id;

    // 1. Mettre tous les véhicules de l'utilisateur à isFavorite: false
    await vehicleService.unsetAllFavorites(userId);

    // 2. Mettre le véhicule choisi à isFavorite: true
    const updatedVehicle = await vehicleService.setFavorite(vehicleId, userId);

    const successResponse = new OkSuccess(
      "Favorite vehicle updated successfully",
      updatedVehicle
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    console.error("Error in setFavoriteVehicle:", error);
    next(error);
  }
};
// Delete a vehicle by ID
exports.deleteVehicle = async (req, res, next) => {
  try {
    const vehicleId = req.params.id;
    const userId = req.user.id; // Assuming user ID is stored in req.user

    if (!vehicleId) {
      throw new ValidationError("Vehicle ID is required for deletion");
    }
    // Récupère l'ancien véhicule pour connaître l'ancienne image
    const oldVehicle = await vehicleService.getVehicleById(
      vehicleId,
      userId,
      req.user.role
    );
    const imageUrl = oldVehicle.image;
    const imagePath = imageUrl.replace(/^https?:\/\/[^/]+/, ""); // retire le domaine
    const absolutePath = path.join(__dirname, "../..", imagePath);
    // Si l'image n'est pas une image par défaut et qu'elle existe, on la supprime
    if (
      oldVehicle.image &&
      !oldVehicle.image.includes("default") &&
      fs.existsSync(absolutePath)
    ) {
      fs.unlinkSync(absolutePath);
    }

    await vehicleService.deleteVehicle(vehicleId, userId);
    const successResponse = new OkSuccess("Vehicle deleted successfully");
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};
