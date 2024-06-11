const express = require('express');
const router = express.Router();

const { registerUser, loginUser } = require('../controllers/authController');
const validate = require('../middlewares/validationMiddleware');
const {
  registrationSchema,
  loginSchema,
} = require('../validations/userValidations');

router.post('/register', validate(registrationSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);

module.exports = router;
