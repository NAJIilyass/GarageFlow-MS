const express = require("express");

const {
    createMaintenanceTask,
    getWorkPlan,
    updateStatus,
} = require("../controllers/maintenanceTaskController");

const router = express.Router();

router.post("/", createMaintenanceTask);

router.get("/", getWorkPlan);

router.patch("/:taskId/status", updateStatus);

module.exports = router;
