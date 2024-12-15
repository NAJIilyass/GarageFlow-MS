const mongoose = require("mongoose");
const MaintenanceStatus = require("./utils/MaintenanceStatus");

const MaintenanceTaskSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
        },
        day: {
            type: String,
            required: true,
        },
        start_time: {
            type: Date,
            required: true,
        },
        end_time: {
            type: Date,
            required: true,
        },
        total_amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(MaintenanceStatus),
            default: MaintenanceStatus.PLANNED,
        },
        vehicle_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        client_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("MaintenanceTask", MaintenanceTaskSchema);
