const express = require("express");
const router = express.Router();
const utils = require("../utils");
const {
  sendMail,
  sendRegisterConfirmationMail,
} = require("../controller/mailController");

const channel = async () => {
  const channel = await utils.CreateChannel();

  utils.SubscribeMessage(channel, "sendMail", (msg) => {
    const data = JSON.parse(msg);
    sendRegisterConfirmationMail(data);
  });
};
channel();

module.exports = router;
