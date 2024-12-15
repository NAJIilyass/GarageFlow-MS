const express = require("express");
const amqp = require("amqplib");
const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async ({ email, subject, text, attachment, filename }) => {
    console.log({ email, subject, text, attachment, filename });
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        const mailOptions = {
            to: email,
            subject: subject,
            text: text,
        };

        if (attachment) {
            mailOptions.attachments = [
                {
                    filename: filename || "Invoice.pdf",
                    path: attachment,
                },
            ];
        }

        const info = await transporter.sendMail(mailOptions);
        console.log("Mail sent successfully: ", info.response);
        return info;
    } catch (error) {
        console.error("Error while sending email", error.message);
        // throw error;
    }
};

let channel;

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue("NOTIFICATIONS");

        channel.consume("NOTIFICATIONS", async (message) => {
            const notification = JSON.parse(message.content.toString());
            console.log(
                `Received notification: ${JSON.stringify(notification)}`
            );

            await sendEmail(notification);

            channel.ack(message);
        });

        console.log("Notification service listening to NOTIFICATIONS queue...");
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error.message);
    }
}
connectRabbitMQ();
