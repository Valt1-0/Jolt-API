const utils = require("../utils");
const vehicleRepository = require("../repository/vehicleRepository");

exports.createVehicle = async (vehicleData, userId) => {
  try {
    vehicleData.owner = userId; // Assuming owner is the userId
    const createdVehicle = await vehicleRepository.createVehicle(vehicleData);
    return createdVehicle;
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new utils.ValidationError(
        Object.values(error.errors)
          .map((e) => e.message)
          .join(", ")
      );
    }
    if (error.code === 11000) {
      throw new utils.ConflictError("Vehicle already exists");
    }
    throw new utils.APIError(
      "An error occurred while creating the vehicle",
      error
    );
  }
};
exports.unsetAllFavorites = async (userId) => {
  await vehicleRepository.updateMany(
    { owner: userId, isFavorite: true },
    { isFavorite: false }
  );
};

exports.setFavorite = async (vehicleId, userId) => {
  const vehicle = await vehicleRepository.setFavorite(vehicleId, userId);
  return vehicle;
};

exports.getAllVehicles = async (userId, role) => {
  if (role === "admin" && !userId) {
    // Admin sans userId : récupère tous les véhicules
    return await vehicleRepository.getAllVehicles();
  }
  // Sinon, récupère les véhicules pour un userId donné
  return await vehicleRepository.getAllVehicles(userId);
};
exports.getVehicleById = async (vehicleId, userId, role) => {
  const vehicle = await vehicleRepository.getVehicleById(vehicleId);
  if (vehicle.owner.toString() !== userId.toString() && role !== "admin") {
    console.log("User does not have permission to access this vehicle");
    throw new utils.ForbiddenError(
      "You do not have permission to access this vehicle"
    );
  }
  if (!vehicle) {
    throw new utils.NotFoundError("Vehicle not found");
  }
  return vehicle;
};
exports.updateVehicle = async (vehicleId, vehicleData, userId) => {
  try {
    const updatedVehicle = await vehicleRepository.updateVehicle(
      vehicleId,
      vehicleData,
      userId
    );
    if (!updatedVehicle) {
      throw new utils.NotFoundError("Vehicle not found");
    }
    return updatedVehicle;
  } catch (error) {
    throw new utils.APIError(
      "An error occurred while updating the vehicle",
      error
    );
  }
};

exports.updateVehicleMileage = async (vehicleId, mileage, userId) => {
  try {
    if (!vehicleId) {
      throw new utils.ValidationError("Vehicle ID is required");
    }
    if (typeof mileage !== "number") {
      throw new utils.ValidationError("mileage must be a number");
    }

    const updatedVehicle = await vehicleRepository.updateVehicle(
      vehicleId,
      { mileage },
      userId
    );
    if (!updatedVehicle) {
      throw new utils.NotFoundError("Vehicle not found");
    }
    return updatedVehicle;
  } catch (error) {
    throw new utils.APIError(
      "An error occurred while updating the vehicle counter",
      error
    );
  }
};

exports.deleteVehicle = async (vehicleId, userId) => {
  try {
    const deletedVehicle = await vehicleRepository.deleteVehicle(
      vehicleId,
      userId
    );
    if (!deletedVehicle) {
      throw new utils.NotFoundError("Vehicle not found");
    }
    return deletedVehicle;
  } catch (error) {
    throw new utils.APIError(
      "An error occurred while deleting the vehicle",
      error
    );
  }
};
