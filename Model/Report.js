const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema(
    {
        reportDateRange: {
          startDate: YYYY-MM-DD,
          endDate: DD-MM-YYYY,
        },
        totalSales: {
          amount: Number,
          numberOfTransactions: Number,
        //   "averageSale": 500
        },
        salesBreakdown: [
          {
            date: YYYY-MM-DD,
            totalSalesAmount: Number,
            totalQuantitySold: Number
          },
        //   ...
        ],
        topCustomers: [
          { 
            customerName:String,
            totalAmountSpent: Number 
          },
           //...
        ],
        supplierData: {
          totalSupplierCosts: Number,
          topSuppliers: [
            {
                supplierName: String,
                totalSpent: Number 
            },
            //...
          ]
        }
    }       
)

module.exports = mongoose.model('report',reportSchema)