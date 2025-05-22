const authService = require("../services/authService");
const utils = require("../utils");

exports.setToken = async (req, res, next) => {
  try {
    const token = await authService.login(req.body);

    const successResponse = new utils.OkSuccess("Login successful", {
      user: { pseudo: user.pseudo, email: user.email },
      accessToken: token,
    });
    res.status(successResponse.statusCode).json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};
