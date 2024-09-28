const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const salesSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
    },
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
    },
    customerName: {
        type: String,
        required: true
    },
    date: {
        type: Date, // Changed to Date type
        required: true
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
        required: true
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
        enum: ['customer', 'supplier'],
        required: true // Ensure type is always set
    }
}, { timestamps: true });

// Pre-save hook to determine type and format date
salesSchema.pre('save', function (next) {
    // Set type based on IDs
    if (this.customerId) {
        this.type = 'customer';
    } else if (this.supplierId) {
        this.type = 'supplier';
    } else {
        return next(new Error('Either customerId or supplierId must be provided.'));
    }

    // Format date if it's provided
    if (this.date) {
        this.date = new Date(this.date); // Mongoose will handle formatting
    }
    next();
});

module.exports = mongoose.model('Sale', salesSchema);
