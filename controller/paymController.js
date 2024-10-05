const Payment = require("../Model/Payment");

const fetchPayment = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res
      .status(200)
      .json({ message: "Fetched all payments successfully", payments });
  } catch (error) {
    console.error("Error fetching payments", error);
    res.status(500).json({ message: "Error fetching payments", error });
  }
};

const addPayment = async (req, res) => {
  try {
    const { payerType, payerName, amount, paymentDate, method,paymentType } = req.body;
    const newPayment = new Payment({
      payerType,
      payerName,
      amount,
      paymentDate,
      method,
      paymentType,
      userId: req.user.id,
    });
    await newPayment.save();

    res.status(201).json({ message: "New payment added", newPayment });
  } catch (error) {
    console.error("Error adding payment:", error);
    res.status(500).json({ message: "Error adding payment" });
  }
};

// const addPayment =async (req,res) =>{
//     try{
//         const { payerType,payerName,amount,paymentDate,method } = req.body
//         const newPayment = new Payment({
//             payerType,payerName,amount,paymentDate,method,
//             userId:req.user.id
//         })
//         await Customer.findOneAndUpdate(
//             { name: payerName,userId:req.user.id },
//             { $inc: { totalJama: amount } } // Assuming totalJama is the correct field to update
//         );
//         res.status(200).json({message:'new payment added',newPayment})

//     }catch(error){
//         console.log(error)
//         res.status(500).json({message:"unable to add payment"})
//     }
// }
const fetchNameDate = async (req, res) => {
  try {
    const { payerName, paymentDate } = req.query;
    if (!payerName || !paymentDate) {
      return res
        .status(400)
        .json({
          message: "payment name and date query parameters are required",
        });
    }

    const formattedDate = new Date(paymentDate).toISOString().split('T')[0];

    const payment = await Payment.find({
      payerName:payerName,
      paymentDate:formattedDate,
      // paymentDate,
      userId: req.user.id,
    });

    if (payment.length === 0) {
      return res
        .status(404)
        .json({
          message:
            "No payment found for this customer/supplier on the given date",
        });
    }
    res
      .status(200)
      .json({
        message: "Payment for customer on specific date fetched successfully",
        data: payment,
      });
  } catch (error) {
    console.error("Error fetching customer/supplier payment", error);
    res
      .status(500)
      .json({ message: "Error fetching customer/supplier payments", error });
  }
};

const fetch10 = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments" });
  }
};

const fetchCustomer = async (req, res) => {
  try {
      const { name } = req.query;

      if (!name) {
          return res.status(400).json({ message: 'Customer name query parameter is required' });
      }

      const sales = await Payment.find({ payerName:name, userId: req.user.id });
      res.status(200).json({ message: 'Sales for customer fetched successfully', data: sales });
  } catch (error) {
      console.error('Error fetching customer sales:', error);
      res.status(500).json({ message: 'Error fetching customer sales', error });
  }
};

module.exports = { fetchPayment, addPayment, fetchNameDate, fetch10,fetchCustomer };
