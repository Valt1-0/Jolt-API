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
    const accessToken = await jwt.generateAccessToken({
      id: user._id,
      role: user.role,
    }); 

    const refreshToken = await jwt.generateRefreshToken({
      id: user._id,
      role: user.role,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: { pseudo: user.username, email: user.email },
    };
  } catch (error) {
    console.log("error status ", error.response.status);
    return utils.handleAxiosError(error);
  }
};

exports.refreshToken = async ({ token }) => {
  try {
    const decoded = jwt.verifyAccessToken(token);
    const newToken = jwt.generateRefreshToken({
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
    const verificationToken = jwt.generateVerificationToken();
    const verificationTokenExpires = Date.now() + 10 * 60 * 1000; // 24h

    const payload = {
      ...userData,
      verificationToken: verificationToken,
      verificationTokenExpires: verificationTokenExpires,
    };

    const response = await axios.post(url, payload);
    console.log("User registered successfully:", response);
    const user = response.data?.data;
    return user;
  } catch (error) {
    return utils.handleAxiosError(error);
  }
};

exports.verifyEmail = async (token) => {
  const url = process.env.AUTH_SERVICE_URL + "/verifyEmail/" + token;
  try {
    const response = await axios.get(url);
    console.log("Email verified successfully:", response);
    return response.data?.data;
  } catch (error) {
    return utils.handleAxiosError(error);
  }
};

exports.resendVerificationEmail = async (email) => {
  const url = process.env.AUTH_SERVICE_URL + "/updateVerificationToken";
  const verificationToken = jwt.generateVerificationToken();
  const verificationTokenExpires = Date.now() + 10 * 60 * 1000; // 24h

  try {
    const response = await axios.put(url, {
      email,
      verificationToken,
      verificationTokenExpires,
    });
    console.log("Verification email resent successfully:", response);
    return response.data?.data;
  } catch (error) {
    console.error("Error resending verification email:", error);
    return utils.handleAxiosError(error);
  }
};
