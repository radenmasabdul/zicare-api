const express = require("express");
const router = express.Router();

const { getAllUser, getUserById } = require("../../controllers/user/UserController");
const verifyToken = require("../../middlewares/auth/auth");

router.get("/all", verifyToken, getAllUser);
router.get("/:id", verifyToken, getUserById);

module.exports = router;