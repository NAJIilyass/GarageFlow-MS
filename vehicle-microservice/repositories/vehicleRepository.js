const Vehicle = require("../Models/vehicleModel");

class VehicleRepository {
    getAllVehicles = async () => {
        try {
            const response = await Vehicle.find({}).sort({ createdAt: -1 });
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    getVehicleById = async (vehicleId) => {
        try {
            const response = await Vehicle.findById(vehicleId);
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    getVehiclesByOwnerId = async (owner_id) => {
        try {
            const response = await Vehicle.find({ owner_id });
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    createVehicle = async (createdVehicle) => {
        try {
            const response = await Vehicle.create(createdVehicle);
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    updateVehicle = async (vehicleId, updatedVehicle) => {
        try {
            const response = await Vehicle.findByIdAndUpdate(
                vehicleId,
                updatedVehicle,
                {
                    new: true,
                }
            );
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    changeStatus = async (vehicleId, newStatus) => {
        try {
            const response = await Vehicle.findByIdAndUpdate(
                vehicleId,
                { status: newStatus },
                { new: true }
            );
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };
}

module.exports = VehicleRepository;
