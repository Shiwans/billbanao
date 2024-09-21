const Payment = require('../Model/Payment')
const Customer =  require('../Model/Customer')

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
        await Customer.findOneAndUpdate(
            { name: payerName },
            {$inc: {totalJama: paymentDetails.paidAmount}},
            // { $inc: {totalDue:due}}
        );
        res.status(200).json({message:'new payment added',newPayment})

    }catch(error){
        console.log(error)
        res.status(500).json({message:"unable to add payment"})
    }
}

const fetchName =async(req,res) =>{
    try {
        const { name } = req.query;
        if (name) {
            const payment = await Payment.find({ payerName: name });
            res.status(200).json({ message: 'Sales for customer fetched successfully', data: payment });
        } else {
            res.status(400).json({ message: 'Customer name query parameter is required' });
        }
    } catch (error) {
        console.error('Error fetching customer sales', error);
        res.status(500).json({ message: 'Error fetching customer sales', error });
    }
}

module.exports = {fetchPayment,addPayment,fetchName}