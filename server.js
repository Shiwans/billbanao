const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require('morgan')
const dotenv = require("dotenv");
const connectDB = require('./config/db')

dotenv.config({ path: "./config/config.env" });

connectDB();
const app = express();

// app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cors())


app.use("/", require("./routes/index"));
// app.use("/data", require("./routes/data"));

const PORT = process.env.PORT || 4500;
app.listen(PORT, console.log(`Server is running on http://localhost:${PORT}`));
