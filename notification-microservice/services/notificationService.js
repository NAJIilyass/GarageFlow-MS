const nodemailer = require("nodemailer");

class NotificationService {
    static sendEmail = async ({
        email,
        subject,
        text,
        attachment,
        filename,
    }) => {
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
            console.log("Mail sent successfully:", info.response);
            return info;
        } catch (error) {
            console.error("Error while sending email", error.message);
            // throw error;
        }
    };
}

module.exports = NotificationService;
