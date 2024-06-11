const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const registrationSchema = {
  email: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Email is required.',
      bail: true,
    },
    isEmail: {
      errorMessage: 'Email must be valid.',
      bail: true,
    },
    custom: {
      options: async (email) => {
        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (user) {
          throw new Error('Email is already in use.');
        }
        return true;
      },
    },
  },
  name: {
    in: ['body'],
    isString: {
      errorMessage: 'Name must be a string.',
      bail: true,
    },
    isLength: {
      errorMessage: 'Name must be at least 2 characters long.',
      options: { min: 2 },
    },
  },
  password: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Password is required.',
      bail: true,
    },
    isString: {
      errorMessage: 'Password must be a string.',
    },
    isLength: {
      errorMessage: 'Password must be at least 8 characters long.',
      options: { min: 8 },
    },
  },
};

const loginSchema = {
  email: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Email is required.',
      bail: true,
    },
    isEmail: {
      errorMessage: 'Email must be valid.',
    },
  },
  password: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Password is required.',
      bail: true,
    },
    isString: {
      errorMessage: 'Password must be a string.',
    },
  },
};

module.exports = {
  registrationSchema,
  loginSchema,
};
