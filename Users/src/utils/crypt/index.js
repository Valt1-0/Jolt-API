const bcrypt = require("bcryptjs");

const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};
const GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

const ValidatePassword = async (enteredPassword, savedPassword, salt) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports = {
  GenerateSalt,
  GeneratePassword,
  ValidatePassword,
};
