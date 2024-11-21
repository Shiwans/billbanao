const express = require('express');
const router = express.Router();
// const authController = require('../Controllers/authController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../Model/User');
var nodemailer = require('nodemailer');

// Check Email and Send Reset Link
router.post("/forgetpassword", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: "User does not exist" });
    }

    const secret = process.env.JWT_SECRET_KEY + user._id;
    const ltoken = jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: "5m" });
    const link = `${process.env.CLIENT_URL}/change/forgetpassword/${user.email}/${ltoken}`;

    // Uncomment to enable email sending functionality
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "g22.shiwans.vaishya@gnkhalsa.edu.in",
          pass: process.env.PASS
        }
      });
      
    var mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Set you password for log in',
        text: link
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

    // console.log(link); // For testing purposes

    return res.status(200).json({ status: "Reset link sent", link });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "Internal server error" });
  }
});

// Verify Token and Return Status
router.get("/forgetpassword/:email/:ltoken", async (req, res) => {
  const { email, ltoken } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: "User does not exist" });
    }

    const secret = process.env.JWT_SECRET_KEY + user._id;
    jwt.verify(ltoken, secret); // Verifying the token

    // If verified, return status so the front-end can proceed with password reset form
    return res.status(200).json({ status: "Token verified", email });
  } catch (error) {
    return res.status(400).json({ status: error.message });
  }
});

// Set New Password
router.post('/forgetpassword/:email/:ltoken', async (req, res) => {
  const { email, ltoken } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: "User does not exist" });
    }

    const secret = process.env.JWT_SECRET_KEY + user._id; // Your JWT secret
    jwt.verify(ltoken, secret); // Verify the token

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });

    return res.status(200).json({ status: "Password updated successfully" });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ status: "Invalid token" });
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ status: "Token expired" });
    }
    return res.status(500).json({ status: "Internal server error", error: error.message });
  }
});

module.exports = router;
