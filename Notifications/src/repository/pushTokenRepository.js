const PushToken = require("../models/pushTokenModel");

exports.saveOrUpdatePushToken = async ({ expoPushToken, deviceId, userId }) => {
  return PushToken.findOneAndUpdate(
    { deviceId, userId },
    { expoPushToken },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

exports.getTokensByUserId = async (userId) => {
  return PushToken.find({ userId });
};

exports.attachUserToDevice = async (deviceId, userId) => {
  return PushToken.findOneAndUpdate({ deviceId }, { userId }, { new: true });
};

exports.getTokensByUserIds = async (userIds) => {
  return PushToken.find({ userId: { $in: userIds } });
};
exports.getAllPushTokens = async () => {
  return PushToken.find({});
};