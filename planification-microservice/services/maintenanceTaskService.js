const mongoose = require("mongoose");
const amqp = require("amqplib");
const axios = require("axios");
require("dotenv").config();
const MaintenanceTaskRepository = require("../repositories/maintenanceTaskRepository");
const MaintenanceStatus = require("../Models/utils/MaintenanceStatus");

class MaintenanceTaskService {
    constructor() {
        this.maintenanceTaskRepository = new MaintenanceTaskRepository();
        this.channel = null;
        this.connectRabbitMQ();
    }

    // RabbitMQ connection setup
    async connectRabbitMQ() {
        try {
            const amqpServer = process.env.RABBITMQ_URL;
            const connection = await amqp.connect(amqpServer);
            this.channel = await connection.createChannel();
            await this.channel.assertQueue("NOTIFICATIONS");
            console.log("RabbitMQ connected and queue asserted");
        } catch (error) {
            console.error("Failed to connect to RabbitMQ:", error.message);
        }
    }

    // Utility function for date validation
    validateDates(start_time, end_time) {
        const startTimeDate = new Date(start_time);
        const endTimeDate = new Date(end_time);
        const currentDateTime = new Date();

        if (isNaN(startTimeDate) || isNaN(endTimeDate)) {
            throw new Error("Invalid date format for start_time or end_time");
        }

        if (startTimeDate <= currentDateTime) {
            throw new Error("start_time must be a future date and time");
        }

        if (startTimeDate >= endTimeDate) {
            throw new Error("start_time must be earlier than end_time");
        }

        // Check if start_time and end_time are on the same day
        const startDay = new Date(
            startTimeDate.getFullYear(),
            startTimeDate.getMonth(),
            startTimeDate.getDate()
        );
        const endDay = new Date(
            endTimeDate.getFullYear(),
            endTimeDate.getMonth(),
            endTimeDate.getDate()
        );

        if (startDay.getTime() !== endDay.getTime()) {
            throw new Error("start_time and end_time must be on the same day");
        }

        return { startTimeDate, endTimeDate };
    }

    // Format the date for email notification
    formatDate(date) {
        return date.toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
        });
    }

    // Fetch vehicle information
    async getVehicleInfo(vehicle_id) {
        try {
            const vehicleResponse = await axios.get(
                `http://vehicle-microservice:5002/${vehicle_id}`
            );
            const vehicleData = vehicleResponse.data;

            return vehicleData;
        } catch (error) {
            throw new Error("Failed to fetch vehicle information");
        }
    }

    // Fetch client information
    async getClientInfo(client_id) {
        try {
            const clientResponse = await axios.get(
                `http://client-microservice:5001/${client_id}`
            );
            const clientData = clientResponse.data;

            return clientData;
        } catch (error) {
            throw new Error("Failed to fetch client information");
        }
    }

    // Update vehicle status
    async updateVehicleStatus(vehicle_id, newStatus) {
        try {
            const vehicleResponse = await axios.patch(
                `http://vehicle-microservice:5002/${vehicle_id}/status`,
                { newStatus }
            );
            const vehicleData = vehicleResponse.data;

            return vehicleData;
        } catch (error) {
            throw new Error(
                "Failed to update vehicle status or fetch vehicle information"
            );
        }
    }

    // Publish notification message to RabbitMQ
    publishNotification(
        channel,
        email,
        vehicleData,
        description,
        formattedStartTime,
        formattedEndTime
    ) {
        if (channel) {
            const message = {
                email: email,
                subject: "Maintenance Task Scheduled for your vehicle",
                text: `Dear Client,\n\nYour vehicle has been scheduled for maintenance.\n\nTask Details:\n- Description: ${description}\n- Start Time: ${formattedStartTime}\n- End Time: ${formattedEndTime}\n\nVehicle Details:\n- VIN: ${vehicleData.vin}\n- Registration Number: ${vehicleData.registration_number}\n- Make & Model: ${vehicleData.brand} ${vehicleData.model}\n- Year: ${vehicleData.year}\n- Color: ${vehicleData.color}\n- Mileage: ${vehicleData.mileage}\n\nPlease ensure your vehicle is available at the garage during the scheduled time. If you have any questions or need to reschedule, contact us at najiiilyassoo@gmail.com.\n\nThank you for trusting us with your vehicle's maintenance.\n\nBest regards,\nThe Garage Team`,
            };

            channel.sendToQueue(
                "NOTIFICATIONS",
                Buffer.from(JSON.stringify(message))
            );
            console.log("Notification message published");
        } else {
            console.warn(
                "RabbitMQ channel not available. Notification not sent."
            );
        }
    }

    // Create and send invoice
    async sendInvoice(clientId, vehicleId, amount, description) {
        try {
            const invoiceResponse = await axios.post(
                `http://invoice-microservice:5004/`,
                {
                    clientId,
                    vehicleId,
                    amount,
                    description,
                }
            );
            const invoiceData = invoiceResponse.data;

            return invoiceData;
        } catch (error) {
            throw new Error("Failed to send the invoice");
        }
    }

    createMaintenanceTask = async (
        description,
        start_time,
        end_time,
        total_amount,
        status,
        vehicle_id
    ) => {
        if (
            !description ||
            !start_time ||
            !end_time ||
            !total_amount ||
            !vehicle_id
        ) {
            throw new Error(
                "description, start_time, end_time, total_amount, vehicle_id and client_id are all required"
            );
        }

        if (!mongoose.Types.ObjectId.isValid(vehicle_id))
            throw new Error("vehicle_id and client_id must be valid IDs");

        if (total_amount <= 0 || typeof total_amount !== "number") {
            throw new Error("total_amount must be a positive number");
        }

        // Validate and get the formatted start and end times
        const { startTimeDate, endTimeDate } = this.validateDates(
            start_time,
            end_time
        );

        // Create the day attribute at the midnight of the startDay
        const day = startTimeDate.toISOString().substring(0, 10);

        if (!mongoose.Types.ObjectId.isValid(vehicle_id)) {
            throw new Error("Invalid vehicle_id Object ID");
        }

        if (status && !Object.values(MaintenanceStatus).includes(status)) {
            throw new Error(`Invalid maintenance task status`);
        }

        // Get vehicle information
        const vehicleData = await this.getVehicleInfo(vehicle_id);

        // Save the maintenance task in the database
        const createdTask =
            await this.maintenanceTaskRepository.createMaintenanceTask({
                description,
                day,
                start_time,
                end_time,
                total_amount,
                status,
                vehicle_id,
                client_id: vehicleData.owner_id,
            });

        // Get client information
        const clientData = await this.getClientInfo(vehicleData.owner_id);

        await this.updateVehicleStatus(vehicle_id, "SCHEDULED");

        const formattedStartTime = this.formatDate(startTimeDate);
        const formattedEndTime = this.formatDate(endTimeDate);

        // Publish notification message to RabbitMQ
        this.publishNotification(
            this.channel,
            clientData.email,
            vehicleData,
            description,
            formattedStartTime,
            formattedEndTime
        );

        return createdTask;
    };

    getWorkPlan = async (day) => {
        if (!day || isNaN(new Date(day))) throw new Error("Invalid day format");

        return await this.maintenanceTaskRepository.getWorkPlan(day);
    };

    getMaintenanceTaskById = async (taskId) => {
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            throw new Error("Invalid Object ID");
        }

        const maintenanceTask =
            await this.maintenanceTaskRepository.getMaintenanceTaskById(taskId);

        if (!maintenanceTask) throw new Error("MaintenanceTask not found");

        return maintenanceTask;
    };

    updateStatus = async (taskId, status) => {
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            throw new Error("Invalid taskId Object ID");
        }

        if (!Object.values(MaintenanceStatus).includes(status)) {
            throw new Error("Invalid maintenance status");
        }

        const previousTask = await this.maintenanceTaskRepository.updateStatus(
            taskId,
            status
        );

        if (!previousTask) throw new Error("Maintenance task not found");

        if (
            status === MaintenanceStatus.COMPLETED &&
            previousTask.status !== MaintenanceStatus.COMPLETED
        ) {
            await this.updateVehicleStatus(
                previousTask.vehicle_id,
                "MAINTAINED"
            );
            await this.sendInvoice(
                previousTask.client_id,
                previousTask.vehicle_id,
                previousTask.total_amount,
                previousTask.description
            );
        }
        return previousTask;
    };
}

module.exports = MaintenanceTaskService;
