const express = require("express");
const router = express.Router();
const { proxyRequest } = require("../controllers/apiGatewayController");

router.use("/clients", proxyRequest("CLIENT"));
router.use("/vehicles", proxyRequest("VEHICLE"));
router.use("/maintenance-tasks", proxyRequest("MAINTENANCE"));

module.exports = router;
