const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const {
  JWT_ACCESS_KEY,
  JWT_REFRESH_KEY,
  JWT_ACCESS_EXPIRATION,
  JWT_REFRESH_EXPIRATION,
} = require("../../Config");

const generateRefreshToken = async (payload) => {
  try {
    return await jwt.sign(payload, JWT_REFRESH_KEY, {
      expiresIn: JWT_REFRESH_EXPIRATION,
    });
  } catch (error) {
    console.error(error);
    return error;
  }
};

const generateAccessToken = async (payload) => {
  try {
    return await jwt.sign(payload, JWT_ACCESS_KEY, {
      expiresIn: JWT_ACCESS_EXPIRATION,
    });
  } catch (error) {
    console.error(error);
    return error;
  }
};

const verifyAccessToken = async (token) => {
  try {
    const signature = token;
    const payload = await jwt.verify(signature, JWT_ACCESS_KEY);
    return payload;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const verifyRefreshToken = async (token) => {
  try {
    const signature = token;
    const payload = await jwt.verify(signature, JWT_REFRESH_KEY);
    return payload;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const hashRefreshToken = async (token) => {
  return await bcrypt.hash(token, 10);
};


const generateVerificationToken = () =>  {
  return  crypto.randomBytes(32).toString("hex");
}

module.exports = {
  generateRefreshToken,
  generateAccessToken,
  generateVerificationToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashRefreshToken,
};
