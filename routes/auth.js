const express = require('express');
const User = require('../Model/User'); 
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Registration Route
router.post('/register', 
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email').notEmpty().withMessage('Email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, email, password } = req.body;

            // Check for existing users by email
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ message: "Email already exists" });
            }

            // Create the user (password will be hashed automatically)
            const userCreated = await User.create({ name, email, password });
            const token = userCreated.generateToken();
            res.status(201).json({ msg: "Registration successful", token, userId: userCreated._id.toString() });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

// Login Route
router.post('/login', 
    body('email').isEmail().withMessage('Invalid email').notEmpty().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password } = req.body;

            const userExist = await User.findOne({ email });
            if (!userExist) {
                console.error('Login attempt with unknown email:', email);
                return res.status(401).json({ message: "Invalid email or password" });
            }

            // Use the comparePassword method
            const isMatch = await userExist.comparePassword(password);
            if (isMatch) {
                const token = userExist.generateToken(); 
                return res.status(200).json({
                    message: 'Login successful',
                    token,
                    userId: userExist._id.toString()
                });
            } else {
                console.warn('Invalid password for user:', email);
                return res.status(401).json({ message: "Invalid email or password" });
            }
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

// Logout Route
router.post('/logout', (req, res) => {
    // Client-side token removal is usually sufficient, but you can add token invalidation logic if needed
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
