//route amqlib
const utils = require("../utils");
const userService = require("../services/UserProjectionService");

const channel = async () => {
  const channel = await utils.getChannel();

  utils.SubscribeMessage(channel, "user_created", (message) => {
    const user = JSON.parse(message);
    userService.createUser(user);
  });
  utils.SubscribeMessage(channel, "user_updated", (message) => {
    const user = JSON.parse(message);
    userService.updateUser(user);
  });
};

module.exports = channel;
