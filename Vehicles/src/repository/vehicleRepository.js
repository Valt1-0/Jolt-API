const vehicle = require("../models/vehicleModel");
const utils = require("../utils");

exports.createVehicle = async (vehicleData, userId) => {
  const newVehicle = new vehicle({
    ...vehicleData,
    userId: userId,
  });
  const createdVehicle = await newVehicle.save();
  return createdVehicle;
};
exports.getAllVehicles = async (userId) => {
  if (!userId) {
    // Pour admin : retourne tout
    return await vehicle.find({});
  }
  // Pour un utilisateur : retourne ses véhicules
  return await vehicle.find({ owner: userId });
};
exports.getVehicleById = async (vehicleId) => {
    console.log("Fetching vehicle with ID:", vehicleId);
  const vehicleData = await vehicle.findOne({ _id: vehicleId });
  console.log("Vehicle found:", vehicleData);
  if (!vehicleData) {
    throw new utils.NotFoundError("Vehicle not found");
  }
  return vehicleData;
};

exports.updateVehicle = async (vehicleId, vehicleData, userId) => {
    vehicleData.updatedAt = new Date();
  const updatedVehicle = await vehicle.findOneAndUpdate(
    { _id: vehicleId, owner: userId },
    vehicleData,
    { new: true }
  );
  if (!updatedVehicle) {
    throw new utils.NotFoundError("Vehicle not found");
  }
  return updatedVehicle;
};

exports.deleteVehicle = async (vehicleId, userId) => {
  const deletedVehicle = await vehicle.findOneAndDelete({
    _id: vehicleId,
    owner: userId,
  });
  if (!deletedVehicle) {
    throw new utils.NotFoundError("Vehicle not found");
  }
  return deletedVehicle;
};
