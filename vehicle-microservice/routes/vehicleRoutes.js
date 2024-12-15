const express = require("express");

const {
    getAllVehicles,
    getVehicleById,
    getVehiclesByOwnerId,
    createVehicle,
    updateVehicle,
    changeVehicleStatus,
} = require("../controllers/vehicleController");

const router = express.Router();

router.get("/", getAllVehicles);

router.get("/:vehicleId", getVehicleById);

router.get("/owner/:owner_id", getVehiclesByOwnerId);

router.post("/", createVehicle);

router.patch("/:vehicleId", updateVehicle);

router.patch("/:vehicleId/status", changeVehicleStatus);

module.exports = router;
