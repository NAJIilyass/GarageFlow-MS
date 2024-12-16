const express = require("express");
const {
    processNotification,
} = require("../controllers/notificationController");

const router = express.Router();

router.post("/notify", processNotification);

module.exports = router;
