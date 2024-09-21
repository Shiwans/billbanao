const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true // Ensure every supplier is associated with a user
    // },
    name: {
        type: String,
        required: true
    },
    contactInfo: {
        phone: {
            type: Number,
            required: true,
        },
        email: {
            type: String,
            required:true,
        },
        upi: {
            type: String,
            required:true
        },
    },
    type: {
        type: String,
        default:"supplier"
    },
    totalAmount: {
        type: Number,
        default: 0, // Total amount of goods purchased
    },
    totalPaid: {
        type: Number,
        default: 0, // Total amount paid
    },
    totalDue: {
        type: Number,
        default: 0, // Total left to give
    },
});

module.exports = mongoose.model('Supplier', supplierSchema);
