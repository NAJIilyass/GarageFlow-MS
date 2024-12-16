const MaintenanceTask = require("../Models/maintenanceTaskModel");

class MaintenanceTaskRepository {
    createMaintenanceTask = async (createdTask) => {
        try {
            const response = await MaintenanceTask.create(createdTask);
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    getWorkPlan = async (day) => {
        try {
            const response = await MaintenanceTask.find({ day }).sort({
                start_time: 1,
            });

            return response;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    getMaintenanceTaskById = async (taskId) => {
        try {
            const response = await MaintenanceTask.findById(taskId);
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    updateStatus = async (taskId, status) => {
        try {
            const response = await MaintenanceTask.findByIdAndUpdate(
                taskId,
                { status },
                { new: false }
            );

            return response;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };
}

module.exports = MaintenanceTaskRepository;
