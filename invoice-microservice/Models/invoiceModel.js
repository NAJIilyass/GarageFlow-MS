const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const invoiceSchema = new Schema(
    {
        invoice_number: {
            type: Number,
            required: true,
        },
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
