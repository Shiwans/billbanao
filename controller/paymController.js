const Payment = require('../Model/Payment')

const fetchPayment =(req,res)=>{
    res.send("write code to fetch")
}

const addPayment =async (req,res) =>{
    try{
        const { payerType,payerName,amount,paymentDate,method } = req.body
        const newPayment = new Payment({
            payerType,payerName,amount,paymentDate,method
        })
        await newPayment.save()
        res.status(200).json({message:'new payment added',newPayment})

    }catch(error){
        console.log(error)
        res.status(500).json({message:"unable to add payment"})
    }
}


module.exports = {fetchPayment,addPayment}