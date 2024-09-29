const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
    },
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
    },
    payerType: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: [0, 'Amount must be positive'],
    },
    method: {
        type: String,
        enum: ['cash', 'card', 'online'],
        required: true,
    },
    payerName: {
        type: String,
        required: true,
    },
    paymentDate: {
        type: String,
        default: () => new Date().toISOString().split('T')[0], //YYYY-MM-DD
    },
});

paymentSchema.pre('save', function(next) {
    if (this.paymentDate) {
        this.paymentDate = new Date(this.paymentDate).toISOString().split('T')[0]; // Format to YYYY-MM-DD
    }
    next();
});


module.exports = mongoose.model('Payment', paymentSchema);
