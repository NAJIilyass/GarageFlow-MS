const express = require("express");

const {
    getInvoiceById,
    createInvoice,
} = require("../controllers/invoiceController");

const router = express.Router();

router.get("/:invoiceId", getInvoiceById);

router.post("/", createInvoice);

module.exports = router;
