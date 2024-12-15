const mongoose = require("mongoose");
const amqp = require("amqplib");
const axios = require("axios");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { createInvoicePDF } = require("./createInvoicePDF");
const InvoiceRepository = require("../repositories/invoiceRepository");

class InvoiceService {
    static invoice_number = 1001;
    constructor() {
        this.invoiceRepository = new InvoiceRepository();
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

    // Fetch vehicle and client information
    async getVehicleAndClientInfo(vehicle_id) {
        try {
            const vehicleResponse = await axios.get(
                `http://localhost:5002/${vehicle_id}`
            );
            const vehicleData = vehicleResponse.data;

            const clientResponse = await axios.get(
                `http://localhost:5001/${vehicleData.owner_id}`
            );
            const clientData = clientResponse.data;

            return { vehicleData, clientData };
        } catch (error) {
            throw new Error("Failed to fetch vehicle or client information");
        }
    }
    /*
    // Create PDF Invoice
    generatePDF(invoiceDetails) {
        const { clientData, vehicleData, amount, description } = invoiceDetails;

        const doc = new PDFDocument();
        const filePath = path.join(
            __dirname,
            "invoices",
            `${clientData.first_name}_${clientData.last_name}_invoice.pdf`
        );

        doc.pipe(fs.createWriteStream(filePath));

        doc.fontSize(16)
            .text(
                `Invoice for ${clientData.first_name} ${clientData.last_name}`,
                { align: "center" }
            )
            .moveDown();

        doc.fontSize(12).text(
            `Invoice Number: ${InvoiceService.invoiceNumber++}`,
            {
                align: "left",
            }
        );
        doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, {
            align: "left",
        });
        doc.text(`Client Information:`, { align: "left" });
        doc.text(`First Name: ${clientData.first_name}`, { align: "left" });
        doc.text(`Last Name: ${clientData.last_name}`, { align: "left" });
        doc.text(`Address: ${clientData.address}`, { align: "left" });

        doc.text(`\nVehicle Information:`, { align: "left" });
        doc.text(`VIN: ${vehicleData.vin}`, { align: "left" });
        doc.text(`Registration Number: ${vehicleData.registration_number}`, {
            align: "left",
        });
        doc.text(`Brand: ${vehicleData.brand}`, { align: "left" });
        doc.text(`Model: ${vehicleData.model}`, { align: "left" });
        doc.text(`Color: ${vehicleData.color}`, { align: "left" });

        doc.text(`\nMaintenance Details:`, { align: "left" });
        doc.text(`Date of Maintenance: ${new Date().toLocaleDateString()}`, {
            align: "left",
        });
        doc.text(`Description of Services Provided: ${description}`, {
            align: "left",
        });

        doc.text(`\nTotal Amount Due:`, { align: "left" });
        doc.text(`Amount: ${amount}`, { align: "left" });

        doc.end();

        return filePath; // Return path to the generated PDF
    }
    */

    // Publish notification message to RabbitMQ
    publishNotification(channel, clientData, vehicleData, pdfPath) {
        if (channel) {
            const message = {
                email: clientData.email,
                subject: `Invoice for Services Rendered - ${clientData.last_name} ${clientData.first_name} - ${vehicleData.brand} ${vehicleData.model}`,
                text: `Dear ${clientData.first_name},\nI hope this message finds you well.\nPlease find attached the invoice for the maintenance services provided to your vehicle. Should you have any questions or need further clarification, do not hesitate to reach out.\nThank you for trusting us with your vehicle. We appreciate your business!\n\nBest regards,\nThe Garage Team`,
                attachment: pdfPath,
                filename: `${clientData.first_name}_${clientData.last_name}_Invoice.pdf`,
            };

            console.log("message: ", message);

            channel.sendToQueue(
                "NOTIFICATIONS",
                Buffer.from(JSON.stringify(message))
            );
            console.log("Notification message published with PDF attachment");
        } else {
            console.warn(
                "RabbitMQ channel not available. Notification not sent."
            );
        }
    }

    createInvoice = async (clientId, vehicleId, amount, description) => {
        if (!clientId || !vehicleId || !amount || !description)
            throw new Error(
                "clientId, vehicleId, amount, and description are all required"
            );

        if (isNaN(amount) || amount <= 0) throw new Error("Invalid amount");

        const createdInvoice = await this.invoiceRepository.createInvoice({
            invoice_number: InvoiceService.invoice_number,
            clientId,
            vehicleId,
            amount,
            description,
        });

        // Get vehicle and client information
        const { vehicleData, clientData } = await this.getVehicleAndClientInfo(
            vehicleId
        );

        // Generate the PDF
        const pdfPath = createInvoicePDF({
            invoice_number: InvoiceService.invoice_number++,
            amount,
            client_first_name: clientData.first_name,
            client_last_name: clientData.last_name,
            clientPhone: clientData.phone,
            clientAddress: clientData.address,
            vehicleBrand: vehicleData.brand,
            vehicleModel: vehicleData.model,
        });

        // Publish notification message to RabbitMQ with PDF attachment
        this.publishNotification(
            this.channel,
            clientData,
            vehicleData,
            pdfPath
        );
        return createdInvoice;
    };

    getInvoiceById = async (invoiceId) => {
        if (!mongoose.Types.ObjectId.isValid(invoiceId))
            throw new Error("Invalid Object ID");

        const invoice = await this.invoiceRepository.getInvoiceById(invoiceId);

        if (!invoice) throw new Error("Invoice not found");

        return invoice;
    };
}

module.exports = InvoiceService;
