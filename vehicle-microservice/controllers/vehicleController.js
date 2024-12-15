const VehicleService = require("../services/vehicleService");

const vehicleService = new VehicleService();

getAllVehicles = async (req, res) => {
    try {
        const response = await vehicleService.getAllVehicles();
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

getVehicleById = async (req, res) => {
    const { vehicleId } = req.params;

    try {
        const response = await vehicleService.getVehicleById(vehicleId);
        res.status(200).json(response);
    } catch (err) {
        console.error(err);

        if (err.message.includes("Invalid"))
            res.status(400).json({ error: err.message });
        else if (err.message.includes("not found"))
            res.status(404).json({ error: err.message });
        else res.status(500).json({ error: err.message });
    }
};

getVehiclesByOwnerId = async (req, res) => {
    const { owner_id } = req.params;

    try {
        const response = await vehicleService.getVehiclesByOwnerId(owner_id);
        res.status(200).json(response);
    } catch (err) {
        console.error(err);

        if (err.message.includes("Invalid"))
            res.status(400).json({ error: err.message });
        else if (err.message.includes("No vehicles found"))
            res.status(404).json({ error: err.message });
        else res.status(500).json({ error: err.message });
    }
};

createVehicle = async (req, res) => {
    const {
        vin,
        registration_number,
        brand,
        model,
        year,
        color,
        mileage,
        fuel_type,
        purchase_date,
        status,
        owner_id,
    } = req.body;

    try {
        const response = await vehicleService.createVehicle(
            vin,
            registration_number,
            brand,
            model,
            year,
            color,
            mileage,
            fuel_type,
            purchase_date,
            status,
            owner_id
        );
        res.status(201).json(response);
    } catch (err) {
        console.error(err);

        if (err.message.includes("required") || err.message.includes("Invalid"))
            res.status(400).json({ error: err.message });
        else res.status(500).json({ error: err.message });
    }
};

updateVehicle = async (req, res) => {
    const { vehicleId } = req.params;
    const {
        vin,
        registration_number,
        brand,
        model,
        year,
        color,
        mileage,
        fuel_type,
        purchase_date,
        status,
    } = req.body;

    const updatedVehicle = {};
    if (vin) updatedVehicle.vin = vin;
    if (registration_number)
        updatedVehicle.registration_number = registration_number;
    if (brand) updatedVehicle.brand = brand;
    if (model) updatedVehicle.model = model;
    if (year) updatedVehicle.year = year;
    if (color) updatedVehicle.color = color;
    if (mileage) updatedVehicle.mileage = mileage;
    if (fuel_type) updatedVehicle.fuel_type = fuel_type;
    if (purchase_date) updatedVehicle.purchase_date = purchase_date;
    if (status) updatedVehicle.status = status;

    try {
        const response = await vehicleService.updateVehicle(
            vehicleId,
            updatedVehicle
        );
        res.status(200).json(response);
    } catch (err) {
        console.error(err);

        if (
            err.message.includes("Invalid") ||
            err.message.includes("Missing") ||
            err.message.includes("empty")
        )
            res.status(400).json({ error: err.message });
        else if (err.message.includes("not found"))
            res.status(404).json({ error: err.message });
        else res.status(500).json({ error: err.message });
    }
};

changeVehicleStatus = async (req, res) => {
    const { vehicleId } = req.params;
    const { newStatus } = req.body;

    try {
        const response = await vehicleService.changeStatus(
            vehicleId,
            newStatus
        );
        res.status(200).json(response);
    } catch (err) {
        console.error(err);

        if (err.message.includes("Invalid"))
            res.status(400).json({ error: err.message });
        else if (err.message.includes("not found"))
            res.status(404).json({ error: err.message });
        else res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllVehicles,
    getVehicleById,
    getVehiclesByOwnerId,
    createVehicle,
    updateVehicle,
    changeVehicleStatus,
};
