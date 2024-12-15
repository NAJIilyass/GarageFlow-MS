const mongoose = require("mongoose");
require("dotenv").config();

const db = mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database connected successfully -- Maintenance Task");
    })
    .catch((err) => console.error(err));

module.exports = db;