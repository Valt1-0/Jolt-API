const jwt = require("jsonwebtoken");
const {
  JWT_ACCESS_KEY,
  JWT_REFRESH_KEY,
  JWT_ACCESS_EXPIRATION,
  JWT_REFRESH_EXPIRATION,
} = require("../../Config");

const GenerateRefreshToken = async (payload) => {
  try {
    return await jwt.sign(payload, JWT_REFRESH_KEY, {
      expiresIn: JWT_REFRESH_EXPIRATION,
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

const GenerateAccessToken = async (payload) => {
  try {
    return await jwt.sign(payload, JWT_ACCESS_KEY, {
      expiresIn: JWT_ACCESS_EXPIRATION,
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

const VerifyAccessToken = async (token) => {
  try {
    const signature = token;
    const payload = await jwt.verify(signature, JWT_ACCESS_KEY);
    return payload;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const VerifyRefreshToken = async (token) => {
  try {
    const signature = token;
    const payload = await jwt.verify(signature, JWT_REFRESH_KEY);
    return payload;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const hashRefreshToken = async (token) => {
  return await bcrypt.hash(token, 10);
};

module.exports = {
  GenerateRefreshToken,
  GenerateAccessToken,
  VerifyAccessToken,
  VerifyRefreshToken,
  hashRefreshToken,
};
