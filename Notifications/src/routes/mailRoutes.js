
const utils = require("../utils");
const {
  sendRegisterConfirmationMail,
} = require("../controller/mailController");

const channel = async () => {
  const channel = await utils.CreateChannel();

  utils.SubscribeMessage(channel, "sendMail", (msg) => {
    const data = JSON.parse(msg);
    sendRegisterConfirmationMail(data);
  });
  utils.SubscribeMessage(channel, "resendConfirmationMail", (msg) => {
    const data = JSON.parse(msg);
    sendRegisterConfirmationMail(data);
  });
};
channel();


