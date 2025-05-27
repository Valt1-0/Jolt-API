const maintainHistoryModal = require("../models/maintainHistoryModel");
const utils = require("../utils");

exports.createMaintainHistory = async (maintainHistoryData) => {
  const newMaintainHistory = new maintainHistoryModal(maintainHistoryData);
  const createdMaintainHistory = await newMaintainHistory.save();
  return createdMaintainHistory;
};
exports.getMaintainHistories = async ( role, query) => {
  if (role === "admin") {
    return await maintainHistoryModal.find(query);
  }
  console.log("query",query)
  return await maintainHistoryModal.find({ ...query });
};
exports.getMaintainHistoryById = async (maintainHistoryId) => {
  const maintainHistoryData = await maintainHistoryModal.findOne({
    _id: maintainHistoryId,
  });
  if (!maintainHistoryData) {
    throw new utils.NotFoundError("Maintenance history not found");
  }
  return maintainHistoryData;
};
exports.updateMaintainHistory = async (
  maintainHistoryId,
  maintainHistoryData,
  userId
) => {
  maintainHistoryData.updatedAt = new Date();
  const updatedMaintainHistory = await maintainHistoryModal.findOneAndUpdate(
    { _id: maintainHistoryId, owner: userId },
    maintainHistoryData,
    { new: true }
  );
  if (!updatedMaintainHistory) {
    throw new utils.NotFoundError("Maintenance history not found");
  }
  return updatedMaintainHistory;
};
exports.deleteMaintainHistory = async (maintainHistoryId, userId) => {
  const deletedMaintainHistory = await maintainHistoryModal.findOneAndDelete({
    _id: maintainHistoryId,
    owner: userId,
  });
  if (!deletedMaintainHistory) {
    throw new utils.NotFoundError("Maintenance history not found");
  }
  return deletedMaintainHistory;
};
exports.getMaintainHistoryByVehicleId = async (vehicleId) => {
  const maintainHistories = await maintainHistoryModal.find({
    vehicleId: vehicleId,
  });
  if (!maintainHistories || maintainHistories.length === 0) {
    throw new utils.NotFoundError(
      "No maintenance histories found for this vehicle"
    );
  }
  return maintainHistories;
};
exports.getMaintainHistoryByUserId = async (userId) => {
  const maintainHistories = await maintainHistoryModal.find({ owner: userId });
  if (!maintainHistories || maintainHistories.length === 0) {
    throw new utils.NotFoundError(
      "No maintenance histories found for this user"
    );
  }
  return maintainHistories;
};
