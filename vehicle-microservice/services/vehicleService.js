const mongoose = require("mongoose");
const VehicleRepository = require("../repositories/vehicleRepository");
const VehicleStatus = require("../Models/utils/VehicleStatus");
const FuelTypes = require("../Models/utils/FuelTypes");

class VehicleService {
    constructor() {
        this.vehicleRepository = new VehicleRepository();
    }

    getAllVehicles = async () => {
        return await this.vehicleRepository.getAllVehicles();
    };

    getVehicleById = async (vehicleId) => {
        if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
            throw new Error("Invalid Object ID");
        }

        const vehicle = await this.vehicleRepository.getVehicleById(vehicleId);

        if (!vehicle) throw new Error("Vehicle not found");

        return vehicle;
    };

    getVehiclesByOwnerId = async (owner_id) => {
        if (!owner_id || !mongoose.Types.ObjectId.isValid(owner_id))
            throw new Error("Invalid Owner ID");

        const vehicles = await this.vehicleRepository.getVehiclesByOwnerId(
            owner_id
        );

        if (!vehicles || vehicles.length === 0)
            throw new Error("No vehicles found for this owner");

        return vehicles;
    };

    createVehicle = async (
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
    ) => {
        if (
            !vin ||
            !registration_number ||
            !brand ||
            !model ||
            !year ||
            !color ||
            !mileage ||
            !fuel_type ||
            !purchase_date ||
            !status ||
            !owner_id
        )
            throw new Error("All fields are required");

        purchase_date = new Date(purchase_date);

        if (!mongoose.Types.ObjectId.isValid(owner_id))
            throw new Error("Invalid Owner ID");

        if (!Object.values(FuelTypes).includes(fuel_type))
            throw new Error("Invalid fuel type");

        if (!Object.values(VehicleStatus).includes(status))
            throw new Error("Invalid vehicle status");

        if (
            typeof year !== "number" ||
            year < 1886 ||
            year > new Date().getFullYear()
        )
            throw new Error(
                "Invalid year. It must be a number and between 1886 and the current year"
            );

        if (typeof mileage !== "number" || mileage < 0)
            throw new Error("Invalid mileage. It must be a positive number");

        if (purchase_date > new Date())
            throw new Error(
                "Invalid purchase date. It must be a valid date and not in the future"
            );

        return await this.vehicleRepository.createVehicle({
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
        });
    };

    updateVehicle = async (vehicleId, updatedVehicle) => {
        if (!mongoose.Types.ObjectId.isValid(vehicleId))
            throw new Error("Invalid Object ID");

        if (!updatedVehicle) throw new Error("Missing updated vehicle data");

        Object.keys(updatedVehicle).forEach((key) => {
            if (updatedVehicle[key] === "") {
                throw new Error(`${key} cannot be empty`);
            }
        });

        if (updatedVehicle.createdAt) {
            delete updatedVehicle.createdAt;
        }

        if (
            updatedVehicle.year &&
            (typeof updatedVehicle.year !== "number" ||
                updatedVehicle.year < 1886 ||
                updatedVehicle.year > new Date().getFullYear())
        )
            throw new Error(
                "Invalid year. It must be a number and between 1886 and the current year"
            );

        if (
            updatedVehicle.mileage &&
            (typeof updatedVehicle.mileage !== "number" ||
                updatedVehicle.mileage < 0)
        )
            throw new Error("Invalid mileage. It must be a positive number");

        if (
            updatedVehicle.fuel_type &&
            !Object.values(FuelTypes).includes(updatedVehicle.fuel_type)
        )
            throw new Error("Invalid fuel type");

        if (updatedVehicle.purchase_date) {
            updatedVehicle.purchase_date = new Date(
                updatedVehicle.purchase_date
            );
            if (updatedVehicle.purchase_date > new Date())
                throw new Error(
                    "Invalid purchase date. It must be a valid date and not in the future"
                );
        }

        if (
            updatedVehicle.status &&
            !Object.values(VehicleStatus).includes(updatedVehicle.status)
        )
            throw new Error("Invalid vehicle status");

        const updatedResult = await this.vehicleRepository.updateVehicle(
            vehicleId,
            updatedVehicle
        );

        if (!updatedResult) throw new Error("Vehicle not found");

        return updatedResult;
    };

    changeStatus = async (vehicleId, newStatus) => {
        if (!mongoose.Types.ObjectId.isValid(vehicleId))
            throw new Error("Invalid Object ID");

        if (!Object.values(VehicleStatus).includes(newStatus))
            throw new Error("Invalid vehicle status");

        const updatedVehicle = await this.vehicleRepository.changeStatus(
            vehicleId,
            newStatus
        );

        if (!updatedVehicle) throw new Error("Vehicle not found");

        return updatedVehicle;
    };
}

module.exports = VehicleService;
