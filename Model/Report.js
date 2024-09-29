const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
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
                default: 0, // Total sales amount in the time frame
            },
            numberOfTransactions: {
                type: Number,
                default: 0, // Total number of sales transactions
            },
        },
        averagePrice: {
            type: Number,
            default: 0, // Average price per sale transaction
        },
        totalAmountToPay: {
            type: Number,
            default: 0, // Total amount customer needs to pay
        },
        profitOrLoss: {
            type: Number,
            default: 0, // Net profit or loss
        },
        totalPurchaseAmount: {
            type: Number,
            default: 0, // Total amount spent on purchases
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
    },
    { timestamps: true }
);

// Static or instance methods can be added here to handle calculations
reportSchema.methods.calculateTotals = async function (salesData, purchasesData) {
    // Calculate total sales, average price, total amount to pay, and profit/loss
    const totalSalesAmount = salesData.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const numberOfTransactions = salesData.length;
    const averagePrice = numberOfTransactions > 0 ? totalSalesAmount / numberOfTransactions : 0;

    const totalPurchaseAmount = purchasesData.reduce((sum, purchase) => sum + purchase.amount, 0);

    const totalAmountToPay = salesData.reduce((sum, sale) => sum + sale.totalDue, 0);

    const profitOrLoss = totalSalesAmount - totalPurchaseAmount;

    // Assign the values to the report
    this.totalSales.amount = totalSalesAmount;
    this.totalSales.numberOfTransactions = numberOfTransactions;
    this.averagePrice = averagePrice;
    this.totalAmountToPay = totalAmountToPay;
    this.totalPurchaseAmount = totalPurchaseAmount;
    this.profitOrLoss = profitOrLoss;

    // Save the updated report
    await this.save();
};

module.exports = mongoose.model('Report', reportSchema);
