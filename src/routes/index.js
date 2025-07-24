const express = require("express");
const router = express.Router();

const authRoutes = require("./auth/authRoutes");
const userRoutes = require("./user/userRoutes");
const sensorRoutes = require("./sensor/sensorRoutes");

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/sensor", sensorRoutes);

module.exports = router;