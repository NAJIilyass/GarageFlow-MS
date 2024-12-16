const amqp = require("amqplib");
const NotificationService = require("../services/notificationService");

const connectRabbitMQ = async () => {
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
                console.error("Error processing notification:", err.message);
            }
        });

        console.log(
            "RabbitMQ connected and listening to NOTIFICATIONS queue..."
        );
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error.message);
    }
};

module.exports = connectRabbitMQ;
