const mongoose = require("mongoose");
const VehicleStatus = require("./utils/VehicleStatus");
const FuelTypes = require("./utils/FuelTypes");

const Schema = mongoose.Schema;

const vehicleSchema = new Schema(
    {
        vin: {
            type: String,
            required: true,
        },
        registration_number: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        model: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        mileage: {
            type: Number,
            required: true,
        },
        fuel_type: {
            type: String,
            enum: Object.values(FuelTypes),
            required: true,
        },
        purchase_date: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(VehicleStatus),
        },
        owner_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
