const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const salesSchema = new mongoose.Schema({
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true // Ensure every sale is associated with a user
    // },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    customerName: {
        type: String,
        required:true
    },
    date: {
        type: String, // Format it to YYYY-MM-DD
        required:true
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required:true
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'partial', 'unpaid'],
    },
    paymentDetails: {
        paidAmount: {
            type: Number,
        },
        dueAmount: {
            type: Number,
        },
    },
    type: {
        type: String,

    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Pre-save to format date
salesSchema.pre('save', function(next) {
    if (this.date) {
        const formattedDate = new Date(this.date).toISOString().split('T')[0];
        this.date = formattedDate;
    }
    next();
});

module.exports = mongoose.model('Sale', salesSchema);
