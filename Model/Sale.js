const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true 
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true,
        default: () => new Date().toISOString().split('T')[0],
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be positive']
    },
    price: {
        type: Number,
        required: true,
        min: [1, 'Price must be positive']
    },
    amount: {
        type: Number,
        required: true,
        min: [0, 'Amount must be non-negative'], // Added validation
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'partial', 'unpaid'],
        required: true
    },
    paymentDetails: {
        paidAmount: {
            type: Number,
            default: 0
        },
        dueAmount: {
            type: Number,
            default: 0
        }
    },
    type: {
        type: String,
        default: 'customer',
        required: true
    }
}, { timestamps: true });

salesSchema.pre('save', function (next) {
    this.type = 'customer';

    // Calculate amount before saving
    this.amount = this.quantity * this.price; 

    // Handle payment details based on payment status
    if (this.paymentStatus === 'paid') {
        this.paymentDetails.paidAmount = this.amount;
        this.paymentDetails.dueAmount = 0;
    } else if (this.paymentStatus === 'partial') {
        if (this.paymentDetails.paidAmount === undefined || this.paymentDetails.paidAmount === 0) {
            return next(new Error('Paid amount is required for partial payment.'));
        }
        this.paymentDetails.dueAmount = this.amount - this.paymentDetails.paidAmount;
    } else if (this.paymentStatus === 'unpaid') {
        this.paymentDetails.paidAmount = 0;
        this.paymentDetails.dueAmount = this.amount;
    }

    if (this.date) {
        this.date = new Date(this.date).toISOString().split('T')[0];
    }

    next();
});

module.exports = mongoose.model('Sale', salesSchema);
