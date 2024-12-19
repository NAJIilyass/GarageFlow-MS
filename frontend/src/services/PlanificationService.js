import axios from "axios";

class PlanificationService {
    constructor() {
        this.gatewayURL = process.env.REACT_APP_API_GATEWAY_URL;
        this.baseURL = `${this.gatewayURL}/maintenance-tasks`;
    }

    createMaintenanceTask = async (createdTask) => {
        try {
            const response = await axios.post(this.baseURL, createdTask);
            return response.data;
        } catch (err) {
            console.error("Error creating Maintenance Task:", err);
            throw err;
        }
    };

    getWorkPlan = async (day) => {
        try {
            const response = await axios.get(this.baseURL, {
                params: { day },
            });
            return response.data;
        } catch (err) {
            console.error(`Error fetching work plan for day ${day}:`, err);
            throw err;
        }
    };

    updateStatus = async (taskId, status) => {
        try {
            const response = await axios.patch(
                `${this.baseURL}/${taskId}/status`,
                {
                    status: status,
                }
            );
            return response.data;
        } catch (err) {
            console.error("Error updating maintenance task's status:", err);
            throw err;
        }
    };
}

export default PlanificationService;
