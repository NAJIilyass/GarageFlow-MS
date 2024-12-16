const express = require("express");
require("dotenv").config();
require("./config/rabbitmq")();

const app = express();

app.use(express.json());

// Routes
app.use("/", require("./routes/notificationRoutes"));

app.listen(process.env.PORT, () =>
    console.log(`Server is running on port ${process.env.PORT}...`)
);
