const utils = require("../utils");
const axios = require("axios");
const jwt = require("../utils/jwt");

exports.login = async ({ email, password }) => {
  const url = process.env.AUTH_SERVICE_URL + "/login";
  const data = {
    email,
    password,
  };

  try {
    const response = await axios.post(url, data);
    const user = response.data;
    if (!user.status != "active") {
      throw new utils.AuthorizeError("User is not active");
    }
    const token = jwt.GenerateAccessToken({ id: user._id, role: user.role });
    return token;
  } catch (error) {
    throw new utils.NotFoundError("User not found");
  }
};
