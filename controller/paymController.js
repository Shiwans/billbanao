const Payment = require('../Model/Payment')
const Customer =  require('../Model/Customer')

const fetchPayment =async (req,res)=>{
    try {
        const payments = await Payment.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ message: 'Fetched all payments successfully', payments });
    } catch (error) {
        console.error('Error fetching payments', error);
        res.status(500).json({ message: 'Error fetching payments', error });
    }
}

const addPayment =async (req,res) =>{
    try{
        const { payerType,payerName,amount,paymentDate,method } = req.body
        const newPayment = new Payment({
            payerType,payerName,amount,paymentDate,method,
            userId:req.user.id 
        })
        await Customer.findOneAndUpdate(
            { name: payerName,userId:req.user.id },
            { $inc: { totalJama: amount } } // Assuming totalJama is the correct field to update
        );
        res.status(200).json({message:'new payment added',newPayment})

    }catch(error){
        console.log(error)
        res.status(500).json({message:"unable to add payment"})
    }
}
const fetchNameDate =async(req,res) =>{
    try {
        const { payerName,payerDate } = req.query;
        if (!payerName || !payerDate) {
            return res.status(400).json({ message: 'payment name and date query parameters are required' });
        }

        const payment = await Payment.find({
            payerName,
            payerDate,
            userId: req.user.id
        });

        if (payment.length === 0) {
            return res.status(404).json({ message: 'No payment found for this customer/supplier on the given date' });
        }
        res.status(200).json({ message: 'Payment for customer on specific date fetched successfully', data: payment });
    } catch (error) {
        console.error('Error fetching customer/supplier payment', error);
        res.status(500).json({ message: 'Error fetching customer/supplier payments', error });
    }
}

const fetch10 = async (req,res) =>{
    try {
        const payments = await Payment.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching payments" });
    }
}


module.exports = {fetchPayment,addPayment,fetchNameDate,fetch10}