const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", require("./routes/apiGatewayRoutes"));
app.listen(process.env.PORT, () =>
    console.log(`API Gateway listening on port ${process.env.PORT}`)
);
