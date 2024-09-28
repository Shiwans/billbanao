// const mongoose = require('mongoose');

// const supplierSchema = new mongoose.Schema({
//     // userId: {
//     //     type: mongoose.Schema.Types.ObjectId,
//     //     ref: 'User',
//     //     required: true // Ensure every supplier is associated with a user
//     // },
//     name: {
//         type: String,
//         required: true
//     },
//     contactInfo: {
//         phone: {
//             type: Number,
//             required: true,
//         },
//         email: {
//             type: String,
//             required:true,
//         },
//         upi: {
//             type: String,
//             required:true
//         },
//     },
//     type: {
//         type: String,
//         default:"supplier"
//     },
//     totalAmount: {
//         type: Number,
//         default: 0, // Total amount of goods purchased
//     },
//     totalPaid: {
//         type: Number,
//         default: 0, // Total amount paid
//     },
//     totalDue: {
//         type: Number,
//         default: 0, // Total left to give
//     },
// });

// module.exports = mongoose.model('Supplier', supplierSchema);


const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    contactInfo: {
        phone: {
            type: Number,
            required: true,
            unique: true, // Ensure phone number is unique
            validate: {
                validator: function (v) {
                    return /^(?=.*[0-9])[- +()0-9]+$/.test(v); // Phone number format validation
                },
                message: props => `${props.value} is not a valid phone number!`
            },
        },
        email: {
            type: String,
            required: true,
            unique: true, // Ensure email is unique
            validate: {
                validator: function (v) {
                    return /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v); // Email validation regex
                },
                message: props => `${props.value} is not a valid email!`
            },
        },
        upi: {
            type: String,
            required: true,
        },
    },
    type: {
        type: String,
        default: "supplier"
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
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
