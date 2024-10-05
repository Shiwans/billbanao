const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require('morgan');
const dotenv = require("dotenv");
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const authenticateToken = require('./middleware/authenticateToken')
dotenv.config({ path: "./config/.env" });


// Connect to MongoDB
connectDB();
const app = express();

// CORS setup
app.use(cors({
  origin: 'http://localhost:3000',
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Protected routes
app.use("/customer",authenticateToken,require("./routes/customer"));
app.use("/payment", authenticateToken,require("./routes/payment"));
app.use("/supplier",authenticateToken, require("./routes/supplier"));
app.use("/sales",authenticateToken, require("./routes/sales"));
app.use("/purchase",authenticateToken, require("./routes/purchase"));
app.use("/api", require("./routes/auth"));
app.use("/", require("./routes/dashboard"));

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
