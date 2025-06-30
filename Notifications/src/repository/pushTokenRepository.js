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
