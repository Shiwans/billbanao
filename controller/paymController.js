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
        // await Customer.findOneAndUpdate(
        //     { name: payerName },
        //     {$inc: {totalJama: amount}},
        //     // { $inc: {totalDue:due}}
        // );
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
            // date: {
                // $gte: targetDate,
                // $lt: endDate
            // }
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
      const payments = await Payment.find().sort({ createdAt: -1 }).limit(10);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching payments" });
    }
}


module.exports = {fetchPayment,addPayment,fetchNameDate,fetch10}