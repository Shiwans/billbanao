const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User', // Reference to the User model
    //     required: true // Ensure that every customer is associated with a user
    // },
    name: {
        type: String,
        required: true
    },
    contactInfo: {
        phone: {
            type: Number,
            required: true
        },
        email: {
            type: String,
            default: 'shiwans.vaishya@gmail.com'
        },
        upi: {
            type: String,
            required: true
        }
    },
    type: {
        type: String,
    },
    totalAmount: {
        type: Number,
        default: 0 // Total amount of goods purchased
    },
    totalPaid: {
        type: Number,
        default: 0 // Total amount paid
    },
    totalDue: {
        type: Number,
        default: 0 // Total left to take
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // sales: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Sale' // Reference to sales related to this customer
    // }],
    // payments: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Payment' // Reference to payments related to this customer
    // }]
});

module.exports = mongoose.model('Customer', customerSchema);
