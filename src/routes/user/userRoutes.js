const express = require("express");
const router = express.Router();

const { getAllUser } = require("../../controllers/user/UserController");
const verifyToken = require("../../middlewares/auth/auth");

router.get("/all", verifyToken, getAllUser);

module.exports = router;