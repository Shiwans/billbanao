const mongoose = require('mongoose')

const supplierSchema = new mongoose.Schema({
    // businessOwnerId: in case of multiple wholesaler but in this we are assuming only one owner so
    name:{
        type:String,
        required:true
    },
    contactInfo:{
        phone:Number,
        email:String,
        address:String,
    },
    type:String,
    totalSupplies:Number,// total value of supplies made by supplier
    outstandingAmount:Number,//Total amout owe to supplier
    paymentHistory:[
        {
            date:Date,
            quantity:Number,
            price:Number,
            amount:Number
            // total jama 
        }
    ],
    // Total due amount
})

module.exports = mongoose.model('supplier',supplierSchema)