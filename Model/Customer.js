const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    contactInfo:{
        phone:Number,
        email:{type:String,default:'shiwans.vaishya@gmail.com'},
        address:String,
    },
    type:String,
    totalPurchases:{type:Number,default:0},// total value of purchases
    outstandingAmount:{type:Number,default:0},//Total amount they owe
    createdAt: {type:Date,default:Date.now}

    // paymentHistory:[
    //     {
    //         date:Date,
    //         quantity:Number,
    //         price:Number,
    //         amount:Number
    //         // total jama 
    //     }
    // ],
    // Total due amount
})

module.exports = mongoose.model('Customer',customerSchema)