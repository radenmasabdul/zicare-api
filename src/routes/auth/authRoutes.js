const express = require('express');
const router = express.Router();

const { register } = require('../../controllers/auth/RegisterController');
const { validateRegister } = require('../../utils/validators/auth/auth');

router.post("/register", validateRegister, register);

module.exports = router;