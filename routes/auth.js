const express = require('express');
const User = require('../Model/User'); // Import the User model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Registration Route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userExists = await User.findOne({ username });
        const emailExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "Username already exists" });
        }
        if (emailExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userCreated = await User.create({ username, email, password: hashedPassword });
        res.status(200).json({ msg: "Registration successful", token: await userCreated.generateToken(), userId: userCreated._id.toString() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const userExist = await User.findOne({ email });

        if (!userExist) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await userExist.comparePassword(password);
        if (isMatch) {
            req.session.userId = userExist._id; // Store user ID in session
            res.status(200).json({ msg: "Login successful", token: await userExist.generateToken(), userId: userExist._id.toString() });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

module.exports = router;
