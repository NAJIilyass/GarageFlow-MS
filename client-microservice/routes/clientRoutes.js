const express = require("express");

const {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
} = require("../controllers/clientController");

const router = express.Router();

router.get("/", getAllClients);

router.get("/:clientId", getClientById);

router.post("/", createClient);

router.patch("/:clientId", updateClient);

module.exports = router;
