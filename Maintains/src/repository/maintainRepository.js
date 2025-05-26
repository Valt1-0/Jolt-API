const maintainModal = require("../models/maintainTypeModel");
const utils = require("../utils");

exports.createMaintain = async (maintainData) => {
  const newMaintain = new maintainModal(maintainData);
  const createdMaintain = await newMaintain.save();
  return createdMaintain;
};
exports.getMaintains = async (userId, filter) => {
  if (!userId) {
    // For admin: return all
    return await maintainModal.find(filter);
  }
  // For a user: return their maintenances
  return await maintainModal.find({
    $or: [{ owner: userId }, { isDefault: true }],
    ...filter,
  });
};
exports.getMaintainById = async (maintainId) => {
  const maintainData = await maintainModal.findOne({ _id: maintainId });
  if (!maintainData) {
    throw new utils.NotFoundError("Maintenance not found");
  }
  return maintainData;
};
exports.updateMaintain = async (maintainId, maintainData, userId) => {
  maintainData.updatedAt = new Date();
  const updatedMaintain = await maintainModal.findOneAndUpdate(
    { _id: maintainId, owner: userId },
    maintainData,
    { new: true }
  );
  if (!updatedMaintain) {
    throw new utils.NotFoundError("Maintenance not found");
  }
  return updatedMaintain;
};
exports.deleteMaintain = async (maintainId, userId) => {
  const deletedMaintain = await maintainModal.findOneAndDelete({
    _id: maintainId,
    owner: userId,
  });
  if (!deletedMaintain) {
    throw new utils.NotFoundError("Maintenance not found");
  }
  return deletedMaintain;
};
exports.getMaintainByVehicleId = async (vehicleId) => {
  const maintains = await maintainModal.find({ vehicleId: vehicleId });
  if (!maintains || maintains.length === 0) {
    throw new utils.NotFoundError("No maintenances found for this vehicle");
  }
  return maintains;
};
exports.getMaintainByUserId = async (userId) => {
  const maintains = await maintainModal.find({ owner: userId });
  if (!maintains || maintains.length === 0) {
    throw new utils.NotFoundError("No maintenances found for this user");
  }
  return maintains;
};
