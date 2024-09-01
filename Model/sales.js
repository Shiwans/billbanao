const mongoose = require('mongoose')

const salesSchema = new mongoose.Schema({
    // date:{type:Date,require:true},
    // date:{type:Date},
    name:{type:String,required:true,trim:true},
    price: {type:Number, require:true},
    quantity: {type:Number, require:true},
    jama:{type:Number, require:true},
    // customerId: {type: mongoose.Schema.Types.ObjectId, ref:'Customer'},
});

module.exports = mongoose.model('Sale',salesSchema)