const pushTokenService = require("../services/pushTokenService");
const { Expo } = require("expo-server-sdk");
const expo = new Expo();

exports.sendPushToUser = async (req, res) => {
  const { userId, title, body, data } = req.body;
  if (!userId || !title || !body) {
    return res.status(400).json({ message: "Missing fields" });
  }
  try {
    const tokens = await pushTokenService.getUserPushTokens(userId);
    if (!tokens.length) {
      return res.status(404).json({ message: "No push tokens found for user" });
    }
    const messages = tokens.map((t) => ({
      to: t.expoPushToken,
      sound: "default",
      title,
      body,
      data: data || {},
    }));
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    for (let chunk of chunks) {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }
    res.status(200).json({ message: "Push sent", tickets });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending push", error: error.message });
  }
};

exports.registerPushToken = async (req, res) => {
  const { expoPushToken, deviceId, userId } = req.body;
  if (!expoPushToken || !deviceId) {
    return res
      .status(400)
      .json({ message: "expoPushToken et deviceId sont requis" });
  }
  try {
    const token = await pushTokenService.registerPushToken(
      expoPushToken,
      deviceId,
      userId
    );
    res.status(200).json({ message: "Push token saved", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving push token", error: error.message });
  }
};

exports.attachUserToDevice = async (req, res) => {
  const { deviceId, userId } = req.body;
  if (!deviceId || !userId) {
    return res.status(400).json({ message: "deviceId et userId sont requis" });
  }
  try {
    const token = await pushTokenService.attachUserToDevice(deviceId, userId);
    res.status(200).json({ message: "UserId attached to device", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error attaching userId", error: error.message });
  }
};

exports.sendPushToMany = async (req, res) => {
  const { userIds, title, body, data } = req.body;
  if ((!userIds || !Array.isArray(userIds)) && !req.body.toAll) {
    return res.status(400).json({ message: "userIds (array) ou toAll requis" });
  }
  if (!title || !body) {
    return res.status(400).json({ message: "title et body requis" });
  }
  try {
    let tokens;
    if (req.body.toAll) {
      tokens = await pushTokenService.getAllPushTokens();
    } else {
      tokens = await pushTokenService.getPushTokensByUserIds(userIds);
    }
    if (!tokens.length) {
      return res.status(404).json({ message: "Aucun push token trouvé" });
    }
    const { Expo } = require("expo-server-sdk");
    const expo = new Expo();
    const messages = tokens.map((t) => ({
      to: t.expoPushToken,
      sound: "default",
      title,
      body,
      data: data || {},
    }));
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    for (let chunk of chunks) {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }
    res.status(200).json({ message: "Push envoyé", tickets });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur envoi push", error: error.message });
  }
};
