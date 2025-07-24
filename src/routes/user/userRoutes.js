const express = require("express");
const router = express.Router();

const { getAllUser, getUserById, createUser } = require("../../controllers/user/UserController");
const { validateRegister } = require('../../utils/validators/auth/auth')
const verifyToken = require("../../middlewares/auth/auth");

router.get("/all", verifyToken, getAllUser);
router.get("/:id", verifyToken, getUserById);
router.post("/create", verifyToken, validateRegister, createUser);

module.exports = router;