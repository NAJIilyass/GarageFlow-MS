import axios from "axios";

class VehicleService {
    constructor() {
        this.gatewayURL = "http://localhost:4000";
        this.baseURL = `${this.gatewayURL}/vehicles`;
    }

    getAllVehicles = async () => {
        try {
            const response = await axios.get(this.baseURL);
            return response.data;
        } catch (err) {
            console.error("Error fetching vehicles:", err);
            throw err;
        }
    };

    getVehicleById = async (vehicleId) => {
        try {
            const response = await axios.get(`${this.baseURL}/${vehicleId}`);
            return response.data;
        } catch (err) {
            console.error(`Error fetching vehicle of ID ${vehicleId}:`, err);
            throw err;
        }
    };

    getVehiclesByOwnerId = async (ownerId) => {
        try {
            const response = await axios.get(
                `${this.baseURL}/owner/${ownerId}`
            );
            return response.data;
        } catch (err) {
            console.error(
                `Error fetching vehicles for owner ID ${ownerId}:`,
                err
            );
            throw err;
        }
    };

    createVehicle = async (createdVehicle) => {
        try {
            const response = await axios.post(this.baseURL, createdVehicle);
            return response.data;
        } catch (err) {
            console.error("Error creating vehicle:", err);
            throw err;
        }
    };

    updateVehicle = async (vehicleId, updatedVehicle) => {
        try {
            const response = await axios.patch(
                `${this.baseURL}/${vehicleId}`,
                updatedVehicle
            );
            return response.data;
        } catch (err) {
            console.error(`Error updating vehicle with ID ${vehicleId}:`, err);
            throw err;
        }
    };
}

export default VehicleService;
