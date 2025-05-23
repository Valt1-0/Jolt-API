const authService = require("../services/authService");
const utils = require("../utils");

exports.getToken = async (req, res, next) => {
  try {
    const {token,user} = await authService.getToken(req.body);
console.log("User authenticated successfully:", user);  
    const successResponse = new utils.OkSuccess("Login successful", {
      user: user,
      accessToken: token,
    });
    res.status(successResponse.statusCode).json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const token = await authService.refreshToken(req.body);
    const successResponse = new utils.OkSuccess("Token refreshed", {
      accessToken: token,
    });
    res.status(successResponse.statusCode).json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

exports.registerUser = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    const successResponse = new utils.CreatedSuccess("User registered", {
      user: { username: user.username, email: user.email },
    });
    res.status(successResponse.statusCode).json(successResponse.toJSON());

    // Publish message to the queue
    const channel = await utils.getChannel();
    const msg = JSON.stringify({
      to: user.email,
      username: user.username,
      verificationToken: "test",
    });
    utils.PublishMessage(channel, "sendMail", msg);

  } catch (error) {
    next(error);
  }
};