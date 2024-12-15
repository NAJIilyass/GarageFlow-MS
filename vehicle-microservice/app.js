const express = require("express");
require("./config/db");
require("dotenv").config();

app = express();

app.use(express.json());

app.use("/", require("./routes/vehicleRoutes"));

app.listen(process.env.PORT, () =>
    console.log(`Server is running on port ${process.env.PORT}...`)
);
