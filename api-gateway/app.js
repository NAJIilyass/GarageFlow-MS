const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());

const { CLIENT_API_URL, VEHICLE_API_URL, MAINTENANCE_TASKS_API_URL } =
    process.env;

const createProxyOptions = (target) => ({
    target,
    changeOrigin: true,
    /* logLevel: "debug",
    onError: (err, req, res) => {
        console.error(err);
        res.status(500).json({
            error: "Proxy Error",
            message: err.message,
        });
    },*/
});

const optionsClients = createProxyOptions(CLIENT_API_URL);
const optionsVehicles = createProxyOptions(VEHICLE_API_URL);
const optionsMaintenanceTasks = createProxyOptions(MAINTENANCE_TASKS_API_URL);

const clientsProxy = createProxyMiddleware(optionsClients);
const vehiclesProxy = createProxyMiddleware(optionsVehicles);
const maintenanceTasksProxy = createProxyMiddleware(optionsMaintenanceTasks);

app.get("/", (req, res) => res.send("API Getway..!!"));
app.use("/clients", clientsProxy);
app.use("/vehicles", vehiclesProxy);
app.use("/maintenance-tasks", maintenanceTasksProxy);

app.listen(process.env.PORT, () =>
    console.log(`API Gateway listening on port ${process.env.PORT}`)
);
