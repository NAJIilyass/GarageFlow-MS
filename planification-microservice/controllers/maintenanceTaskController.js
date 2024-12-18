const MaintenanceTaskService = require("../services/maintenanceTaskService");

const maintenanceTaskService = new MaintenanceTaskService();

createMaintenanceTask = async (req, res) => {
    const {
        description,
        start_time,
        end_time,
        total_amount,
        status,
        vehicle_id,
    } = req.body;

    try {
        const response = await maintenanceTaskService.createMaintenanceTask(
            description,
            start_time,
            end_time,
            total_amount,
            status,
            vehicle_id
        );

        res.status(201).json(response);
    } catch (err) {
        console.error(err);

        if (
            err.message.includes("required") ||
            err.message.includes("Invalid") ||
            err.message.includes("must be")
        )
            res.status(400).json({ error: err.message });
        else res.status(500).json({ error: err.message });
    }
};

getWorkPlan = async (req, res) => {
    const { day } = req.query;

    try {
        const response = await maintenanceTaskService.getWorkPlan(day);
        res.status(200).json(response);
    } catch (err) {
        console.error(err);

        if (err.message.includes("Invalid"))
            res.status(400).json({ error: err.message });
        else res.status(500).json({ error: err.message });
    }
};

updateStatus = async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;
    try {
        const response = await maintenanceTaskService.updateStatus(
            taskId,
            status
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
    createMaintenanceTask,
    getWorkPlan,
    updateStatus,
};
