const express = require("express");
const router = express.Router();

const { getAllSensor, getSensorById, createSensor, updateSensor, deleteSensor } = require("../../controllers/sensor/SensorController");
const { validateSensor } = require('../../utils/validators/sensor/sensor')
const verifyToken = require("../../middlewares/auth/auth");

router.get("/all", verifyToken, getAllSensor);
router.get("/:id", verifyToken, getSensorById);
router.post("/create", verifyToken, validateSensor, createSensor);
router.put("/update/:id", verifyToken, validateSensor, updateSensor)
router.delete("/delete/:id", verifyToken, deleteSensor);

module.exports = router;