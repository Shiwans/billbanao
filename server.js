// const path = require("path");
// const express = require("express");
// // const passport = require('passport');
// const mongoose = require("mongoose");
// const session = require('express-session')
// const MongoStore = require('connect-mongo')
// const cors = require("cors");
// const morgan = require('morgan');
// const dotenv = require("dotenv");
// const connectDB = require('./config/db');
// // const bcrypt = require('bcryptjs');

// dotenv.config({ path: "./config/.env" });

// // Connect to MongoDB
// connectDB();

// const app = express();

// // CORS setup
// app.use(cors({
//   origin: 'http://localhost:3000',
//   methods: "GET,POST,PUT,DELETE",
//   credentials: true,
// }));

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(morgan("dev"));

// // app.use(passport.initialize());
// app.use(
//   session({
//   secret:'shiwans',
//   resave:false,
//   saveUninitialized:false,
//   store: MongoStore.create({
//       mongoUrl: process.env.MONGO_URL,
//       collectionName:'sessions',
//       ttl: 1 * 24 * 60 * 60 // Session TTL in seconds (1 days in this example
//   })
// }))

// // app.use()

// // Serve static files

// app.use(express.static(path.join(__dirname, 'public')));
// // const SECRET_KEY = process.env.SECRET_KEY || 'shiwans'; // Make sure this is secure

// // const authenticate = (req, res, next) => {
// //   const token = req.headers['authorization']?.split(' ')[1]; // Assuming "Bearer <token>"

// //   if (!token) {
// //       return res.status(403).json({ message: 'No token provided' });
// //   }

// //   jwt.verify(token, SECRET_KEY, (err, decoded) => {
// //       if (err) {
// //           return res.status(401).json({ message: 'Unauthorized' });
// //       }
// //       req.userId = decoded.id; // Save user ID for use in protected routes
// //       next();
// //   });
// // };

// // Protected routes
// app.use("/customer", require("./routes/customer"));
// app.use("/payment", require("./routes/payment"));
// app.use("/supplier", require("./routes/supplier"));
// app.use("/sales", require("./routes/sales"));
// app.use("/api",require("./routes/auth"))
// const PORT = process.env.PORT || 4500;
// app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));


const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require("cors");
const morgan = require('morgan');
const dotenv = require("dotenv");
const connectDB = require('./config/db');

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
app.use(morgan("dev"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: 'sessions',
      ttl: 1 * 24 * 60 * 60 // Session TTL in seconds (1 day)
    })
  })
);

// Middleware to check if user is authenticated
// const isAuthenticated = (req, res, next) => {
//   console.log('session userid',req.session.userId)
//     if (req.session.userId) {
//         next();
//     } else {
//         res.status(401).json({ message: "Unauthorized" });
//     }
// };

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Protected routes
app.use("/customer", require("./routes/customer"));
app.use("/payment", require("./routes/payment"));
app.use("/supplier", require("./routes/supplier"));
app.use("/sales", require("./routes/sales"));
app.use("/api", require("./routes/auth"));

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
