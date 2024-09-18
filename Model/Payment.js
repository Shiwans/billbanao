const mongoose = require('mongoose')
// const Payment = mongoose.Schema

const paymentSchema = new mongoose.Schema({
    payerType:String, //customer or supplier
    // payerId: ObjectId,
    payerName:String,
    amount:Number,
    paymentDate:Date,
    method:String, //cash,online,cheque
    // relatedSale:ObjectId   // array of sale ID's this payment is related to 
})

module.exports = mongoose.model('payment',paymentSchema)