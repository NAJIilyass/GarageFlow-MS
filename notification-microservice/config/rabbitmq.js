const amqp = require("amqplib");
const NotificationService = require("../services/notificationService");

const connectRabbitMQ = async (retries = 5, delay = 10000) => {
    while (retries > 0) {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_URL);
            const channel = await connection.createChannel();

            await channel.assertQueue("NOTIFICATIONS");

            channel.consume("NOTIFICATIONS", async (message) => {
                try {
                    const notification = JSON.parse(message.content.toString());
                    console.log(
                        `Received notification: ${JSON.stringify(notification)}`
                    );
                    await NotificationService.sendEmail(notification);
                    channel.ack(message); // Acknowledge successful processing
                } catch (err) {
                    console.error(
                        "Error processing notification:",
                        err.message
                    );
                }
            });

            console.log(
                "RabbitMQ connected and listening to NOTIFICATIONS queue..."
            );
            return;
        } catch (error) {
            console.error("Error connecting to RabbitMQ:", error.message);
            retries -= 1;
            if (retries === 0) throw new Error("Could not connect to RabbitMQ");
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
};

module.exports = connectRabbitMQ;
