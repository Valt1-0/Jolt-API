const pushTokenRepository = require("../repository/pushTokenRepository");

exports.registerPushToken = async (expoPushToken, deviceId, userId) => {
  return pushTokenRepository.saveOrUpdatePushToken({
    expoPushToken,
    deviceId,
    userId,
  });
};

exports.getUserPushTokens = async (userId) => {
  return pushTokenRepository.getTokensByUserId(userId);
};

exports.attachUserToDevice = async (deviceId, userId) => {
  return pushTokenRepository.attachUserToDevice(deviceId, userId);
};

exports.getPushTokensByUserIds = async (userIds) => {
  return pushTokenRepository.getTokensByUserIds(userIds);
};
exports.getAllPushTokens = async () => {
  return pushTokenRepository.getAllPushTokens();
};