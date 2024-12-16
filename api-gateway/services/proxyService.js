require("dotenv").config();

const { CLIENT_API_URL, VEHICLE_API_URL, MAINTENANCE_TASKS_API_URL } =
    process.env;

const getProxyOptions = (service) => {
    let target;

    switch (service) {
        case "CLIENT":
            target = CLIENT_API_URL;
            break;
        case "VEHICLE":
            target = VEHICLE_API_URL;
            break;
        case "MAINTENANCE":
            target = MAINTENANCE_TASKS_API_URL;
            break;
        default:
            throw new Error("Service not found");
    }

    return {
        target,
        changeOrigin: true,
    };
};

module.exports = {
    getProxyOptions,
};
