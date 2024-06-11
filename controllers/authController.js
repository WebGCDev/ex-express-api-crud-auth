const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const generateToken = require('../utils/tokenUtils');
const RestError = require('../utils/restError');
const handleErrors = require('../middlewares/errorHandler');

const registerUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const hashedPassword = await hashPassword(password);
    const newUser = {
      email,
      name,
      password: hashedPassword,
    };

    const user = await prisma.user.create({ data: newUser });

    const token = generateToken({
      email: user.email,
      name: user.name,
    });

    delete user.id;
    delete user.password;

    res.json({ token, data: user });
  } catch (err) {
    handleErrors(err, req, res);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    const authError = new RestError(`Email or password incorrect.`, 400);

    if (!user) {
      throw authError;
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw authError;
    }

    const token = generateToken({
      email: user.email,
      name: user.name,
    });

    delete user.id;
    delete user.password;

    res.json({ token, data: user });
  } catch (err) {
    handleErrors(err, req, res);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
