// const mongoose = require('mongoose')

// const reportSchema = new mongoose.Schema(
//     {
//         reportDateRange: {
//           startDate: YYYY-MM-DD,
//           endDate: DD-MM-YYYY,
//         },
//         totalSales: {
//           amount: Number,
//           numberOfTransactions: Number,
//         //   "averageSale": 500
//         },
//         salesBreakdown: [
//           {
//             date: YYYY-MM-DD,
//             totalSalesAmount: Number,
//             totalQuantitySold: Number
//           },
//         //   ...
//         ],
//         topCustomers: [
//           { 
//             customerName:String,
//             totalAmountSpent: Number 
//           },
//            //...
//         ],
//         supplierData: {
//           totalSupplierCosts: Number,
//           topSuppliers: [
//             {
//                 supplierName: String,
//                 totalSpent: Number 
//             },
//             //...
//           ]
//         }
//     }       
// )

// module.exports = mongoose.model('report',reportSchema)

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true // Ensure every report is associated with a user
        },
        reportDateRange: {
            startDate: {
                type: Date,
                required: true,
            },
            endDate: {
                type: Date,
                required: true,
            },
        },
        totalSales: {
            amount: {
                type: Number,
                default: 0,
            },
            numberOfTransactions: {
                type: Number,
                default: 0,
            },
            // averageSale can be calculated dynamically if needed
        },
        salesBreakdown: [
            {
                date: {
                    type: Date,
                    required: true,
                },
                totalSalesAmount: {
                    type: Number,
                    default: 0,
                },
                totalQuantitySold: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        topCustomers: [
            {
                customerName: {
                    type: String,
                    required: true,
                },
                totalAmountSpent: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        supplierData: {
            totalSupplierCosts: {
                type: Number,
                default: 0,
            },
            topSuppliers: [
                {
                    supplierName: {
                        type: String,
                        required: true,
                    },
                    totalSpent: {
                        type: Number,
                        default: 0,
                    },
                },
            ],
        },
    },
    { timestamps: true } // Automatically manage createdAt and updatedAt timestamps
);

module.exports = mongoose.model('Report', reportSchema);
