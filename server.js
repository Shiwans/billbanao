const path = require("path");
const express = require("express");
// const passport = require('passport')
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require('morgan')
const dotenv = require("dotenv");
const connectDB = require('./config/db')

// const authenticateToken = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1]; // Extract token from the Authorization header

//   if (!token) return res.sendStatus(401); // No token provided

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403); // Invalid token
//     req.user = user;
//     next(); // Proceed to the next middleware or route handler
//   });
// };



dotenv.config({ path: "./config/config.env" });

// require('./config/google')(passport)

connectDB();
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}));
  

app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(morgan("dev"));

// app.use(passport.initialize())

app.use(express.static(path.join(__dirname,'public')))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'public', 'landing.html'));

});

app.use("/customer", require("./routes/customer"));
app.use("/payment",require("./routes/payment"))
app.use("/supplier",require("./routes/supplier"))
app.use("/sales",require("./routes/sales"))
// app.use('/',require('./routes/auth'))



const PORT = process.env.PORT || 4500;
app.listen(PORT, console.log(`Server is running on http://localhost:${PORT}`));