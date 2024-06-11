const bcrypt = require('bcrypt');
require('dotenv').config();

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(
    password + process.env.PEPPER_KEY,
    10
  );
  return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
  const isPasswordValid = await bcrypt.compare(
    password + process.env.PEPPER_KEY,
    hashedPassword
  );
  return isPasswordValid;
};

module.exports = {
  hashPassword,
  comparePassword,
};
