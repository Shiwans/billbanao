const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const salesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true // Ensure every sale is associated with a user
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
    },
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be positive'],
    },
    price: {
        type: Number,
        required: true,
        min: [1, 'price must be positive'],
    },
    amount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'partial', 'unpaid'],
        required:true,
    },
    paymentDetails: {
        paidAmount: {
            type: Number,
            default: 0, 

        },
        dueAmount: {
            type: Number,
            default: 0,

        },
    },
    type: {
        type: String,
        enum: ['customer', 'supplier'],
        required: true
    }
}, { timestamps: true });

salesSchema.pre('save', function (next) {
    // Set type based on IDs
    if (this.customerId) {
        this.type = 'customer';
    } else if (this.supplierId) {
        this.type = 'supplier';
    } else {
        return next(new Error('Either customerId or supplierId must be provided.'));
    }

    if (this.paymentStatus === 'paid') {
        this.paymentDetails.paidAmount = this.amount;
        this.paymentDetails.dueAmount = 0;
    } else if (this.paymentStatus === 'partial') {
        if (this.paymentDetails.paidAmount === undefined) {
            return next(new Error('Paid amount is required for partial payment.'));
        }
        this.paymentDetails.dueAmount = this.amount - this.paymentDetails.paidAmount;
    } else if (this.paymentStatus === 'unpaid') {
        this.paymentDetails.paidAmount = 0;
        this.paymentDetails.dueAmount = this.amount;
    }

    next();

    if (this.date) {
        this.date = new Date(this.date);
    }
    next();
});

module.exports = mongoose.model('Sale', salesSchema);
