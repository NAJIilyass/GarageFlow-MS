const mongoose = require("mongoose");
const axios = require("axios");
const { createInvoicePDF } = require("./createInvoicePDF");
const InvoiceRepository = require("../repositories/invoiceRepository");
const amqp = require("amqplib");
const path = require("path");
const fs = require("fs");

class InvoiceService {
    constructor() {
        this.invoiceRepository = new InvoiceRepository();
        this.channel = null;
        this.invoice_number = 1001;
        this.connectRabbitMQ();
    }

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

    deleteInvoiceAlreadyCreated = (filePath) => {
        fs.unlink(filePath, (err) => {
            if (err)
                console.error(
                    `Failed to delete file at ${filePath}:`,
                    err.message
                );
        });
    };

    async getVehicleAndClientInfo(vehicleId) {
        try {
            const vehicleResponse = await axios.get(
                `http://localhost:5002/${vehicleId}`
            );
            const vehicleData = vehicleResponse.data;
            const clientResponse = await axios.get(
                `http://localhost:5001/${vehicleData.owner_id}`
            );
            return { vehicleData, clientData: clientResponse.data };
        } catch (error) {
            throw new Error("Failed to fetch vehicle or client information");
        }
    }

    async getInvoiceNumber() {
        const documentLength =
            await this.invoiceRepository.getNumberOfInvoices();
        return this.invoice_number + documentLength;
    }

    publishNotification(channel, clientData, vehicleData, pdfPath) {
        if (!channel) {
            console.warn(
                "RabbitMQ channel not available. Notification not sent."
            );
            return;
        }
        const message = {
            email: clientData.email,
            subject: `Invoice for Services Rendered - ${clientData.last_name} ${clientData.first_name} - ${vehicleData.brand} ${vehicleData.model}`,
            text: `Dear ${clientData.first_name} ${clientData.last_name},\n\nWe are pleased to inform you that your ${vehicleData.brand} ${vehicleData.model} has been successfully serviced. Please find attached your detailed invoice for the repair services rendered.\n\nShould you have any questions, feel free to contact us.\n\nThank you for choosing our services!\n\nBest regards,\nThe Garage Team`,
            attachment: pdfPath,
            filename: `${clientData.first_name}_${clientData.last_name}_Invoice.pdf`,
        };
        channel.sendToQueue(
            "NOTIFICATIONS",
            Buffer.from(JSON.stringify(message))
        );
        console.log("Notification message published with PDF attachment");
    }

    async createInvoice(clientId, vehicleId, amount, description) {
        if (!clientId || !vehicleId || !amount || !description) {
            throw new Error("All fields are required");
        }

        if (isNaN(amount) || amount <= 0) {
            throw new Error("Invalid amount");
        }

        const invoiceNumber = await this.getInvoiceNumber();
        const createdInvoice = await this.invoiceRepository.createInvoice({
            invoice_number: invoiceNumber,
            clientId,
            vehicleId,
            amount,
            description,
        });

        const { vehicleData, clientData } = await this.getVehicleAndClientInfo(
            vehicleId
        );
        const pdfPath = createInvoicePDF({
            invoice_number: invoiceNumber,
            amount,
            client_first_name: clientData.first_name,
            client_last_name: clientData.last_name,
            clientPhone: clientData.phone,
            clientAddress: clientData.address,
            vehicleBrand: vehicleData.brand,
            vehicleModel: vehicleData.model,
        });

        this.publishNotification(
            this.channel,
            clientData,
            vehicleData,
            pdfPath
        );

        // Delete the created PDF
        const filePath = path.join(
            __dirname,
            `${clientData.first_name}_${clientData.last_name}_invoice.pdf`
        );

        setTimeout(() => {
            this.deleteInvoiceAlreadyCreated(filePath);
        }, 1500);

        return createdInvoice;
    }

    async getInvoiceById(invoiceId) {
        if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
            throw new Error("Invalid Object ID");
        }
        const invoice = await this.invoiceRepository.getInvoiceById(invoiceId);
        if (!invoice) {
            throw new Error("Invoice not found");
        }
        return invoice;
    }
}

module.exports = InvoiceService;
