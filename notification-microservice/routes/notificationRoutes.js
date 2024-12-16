const express = require("express");
const {
    processNotification,
} = require("../controllers/notificationController");

const router = express.Router();

router.post("/notify", processNotification); // For manual trigger of notifications

module.exports = router;
