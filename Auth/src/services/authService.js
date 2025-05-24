const utils = require("../utils");
const axios = require("axios");
const jwt = require("../utils/jwt");
exports.getToken = async ({ email, password }, ip, device) => {
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

    // Stocker le refreshToken dans Redis
    await utils.redisClient.set(
      `refresh:${user._id}:${refreshToken}`,
      JSON.stringify({
        ip: ip, // ou l'IP récupérée côté client
        device: device, // ou une info device envoyée par le client
        createdAt: Date.now(),
      }),
      { EX: 5 * 24 * 60 * 60 } // 5 jours en secondes
    );

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: { username: user.username, email: user.email },
    };
  } catch (error) {
    console.error("Error during login:", error);
    console.log("error status ", error.response.status);
    return utils.handleAxiosError(error);
  }
};

exports.refreshToken = async (token) => {
  try {
    const decoded = await jwt.verifyRefreshToken(token);

    await utils.redisClient.get(
      `refresh:${decoded.id}:${token}`,
      (err, result) => {
        if (err || !result) {
          throw new utils.AuthorizeError("Invalid token");
        }
      }
    );
    console.log("decoded token", decoded);
    // Générer un nouveau token d'accès
    const newToken = await jwt.generateAccessToken({
      id: decoded.id,
      role: decoded.role,
    });
    console.log("new token", newToken);
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

exports.logout = async (userId, accessToken, refreshToken, ip, userAgent) => {
  // Supprimer le refreshToken de Redis
  await utils.redisClient.del(`refresh:${userId}:${refreshToken}`);
  //blackList le refreshToken
  // Par exemple dans un controller logout
  await utils.redisClient.set(
    `blacklist:${accessToken}`,
    JSON.stringify({
      user: { id: userId },
      ip: ip, // ou l'IP récupérée côté client
      device: userAgent, // ou une info device envoyée par le client
      createdAt: Date.now(),
    }),
    { EX: 15 * 60 } // 15 minutes en secondes (durée de vie du token)
  );

  return { message: "Logout successful" };
};
