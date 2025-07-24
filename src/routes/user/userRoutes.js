const express = require("express");
const router = express.Router();

const { getAllUser, getUserById, createUser, updateUser } = require("../../controllers/user/UserController");
const { validateRegister } = require('../../utils/validators/auth/auth')
const { validateUser } = require('../../utils/validators/users/users')
const verifyToken = require("../../middlewares/auth/auth");

router.get("/all", verifyToken, getAllUser);
router.get("/:id", verifyToken, getUserById);
router.post("/create", verifyToken, validateRegister, createUser);
router.put("/update/:id", verifyToken, validateUser, updateUser);

module.exports = router;