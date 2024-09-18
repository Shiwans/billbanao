const mongoose = require('mongoose')
const Schema = mongoose.Schema;  // Define Schema from mongoose

const salesSchema = new mongoose.Schema({
    // customerId: {
    //   type: Schema.Types.ObjectId,
    // },
    customerName:{type:String},
    date:{
      type:String,//inorder to format it to YYYY-MM-DD
    },
    quantity: {type:Number, require:true},
    price: {type:Number, require:true},
    amount: Number,
    paymentStatus: {
      type:String,
      enum: ['paid','partial','unpaid'] 
    },
    paymentDetails:{
      paidAmount:{type:Number,},
      dueAmount:{type:Number,}
    },
    type:{
      type:String,
    },
    createdAt: {type:Date,default:Date.now}

});

//pre-save to format date
salesSchema.pre('save',function(next){
  if(this.date){
    const formattedDate = new Date(this.date).toISOString().split('T')[0]
    this.date = formattedDate
  }
  next()
  
})

module.exports = mongoose.model('Sale',salesSchema)