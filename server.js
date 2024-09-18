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

app.use(cors({
  origin: 'http://localhost:3000', // Allow this origin
    methods:"GET,POST,PUT,DELETE",
    credentials: true
  }));
  

app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(morgan("dev"));

app.use(express.static(path.join(__dirname,'public')))

app.use("/customer", require("./routes/customer"));
app.use("/payment",require("./routes/payment"))
app.use("/supplier",require("./routes/supplier"))
app.use("/sales",require("./routes/sales"))


const PORT = process.env.PORT || 4500;
app.listen(PORT, console.log(`Server is running on http://localhost:${PORT}`));