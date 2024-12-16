const NotificationService = require("../services/notificationService");

const processNotification = async (req, res) => {
    const { email, subject, text, attachment, filename } = req.body;

    try {
        const response = await NotificationService.sendEmail({
            email,
            subject,
            text,
            attachment,
            filename,
        });
        res.status(200).json({
            message: "Notification sent successfully",
            response,
        });
    } catch (err) {
        console.error("Error processing notification:", err.message);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    processNotification,
};
