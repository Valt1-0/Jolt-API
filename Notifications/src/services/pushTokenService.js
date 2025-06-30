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
