const utils = require("../utils");
const axios = require("axios");
const jwt = require("../utils/jwt");

exports.getToken = async ({ email, password }) => {
  try {
    const url = process.env.AUTH_SERVICE_URL + "/verify";
    const data = {
      email,
      password,
    };

    const response = await axios.post(url, data);
    const user = response.data?.data;
    const token = await jwt.GenerateAccessToken({
      id: user._id,
      role: user.role,
    });
    return { token: token, user: { pseudo: user.username, email: user.email } };
  } catch (error) {
    console.log("error status ", error.response.status);
    return utils.handleAxiosError(error);
  }
};

exports.refreshToken = async ({ token }) => {
  try {
    const decoded = jwt.VerifyAccessToken(token);
    const newToken = jwt.GenerateRefreshToken({
      id: decoded.id,
      role: decoded.role,
    });
    return newToken;
  } catch (error) {
    throw new utils.AuthorizeError("Invalid token");
  }
};

exports.registerUser = async (userData) => {
  const url = process.env.AUTH_SERVICE_URL + "/create";

  try {
    const response = await axios.post(url, userData);
    console.log("User registered successfully:", response);
    const user = response.data?.data;
    return user;
  } catch (error) {
    console.error("Error registering user:", error.response.status);
    return utils.handleAxiosError(error);
  }
};
