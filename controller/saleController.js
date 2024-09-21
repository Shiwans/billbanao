const Sale = require('../Model/Sale')
const Customer = require('../Model/Customer');


const fetchData = async(req,res)=>{
        try {
            const data =await Sale.find()
            // console.log('data from sale routes for fetching',data)
        } catch (error) {
            res.status(500).json({message:"Error while fetching data ",error})
        }
}

const postData = async(req,res)=>{
    try{

        const {date,
            customerName,
            quantity,
            price,
            paymentStatus,
            paymentDetails,type} = req.body
        const amount = quantity * price;
        const newSale = new Sale({
            date,
            customerName,
            quantity,
            price,
            amount,
            paymentStatus,
            paymentDetails,
            type
    })
        
        await newSale.save();
        const due = amount- paymentDetails.paidAmount;
        await Customer.findOneAndUpdate(
            { name: customerName },
            {
                $inc: {
                    totalAmount: amount,
                    totalJama: paymentDetails.paidAmount,
                    totalDue: due
                }
            }
        );
        res.status(200).json({message:'Sale saved successfully',sale:newSale})
    }catch(error){
        console.log(error)
        res.status(500).json({message:'Error saving sale',error})
    }
}

const fetchQuery=async (req,res)=>{
    try {
        const {startDate,endDate} = req.query;
        let query = {}
        if(startDate && endDate){
            query.date={
                $gte:startDate,
                $lte:endDate
            }
        
        }
        const sales = await Sale.find(query)
        console.log('querried data',sales)
        res.status(200).json(sales)
    } catch (error) {
        console.log('error',error)
    }
}

const fetchDay=async (req,res)=>{
    try {
        const {start,end} = req.query;
        let query = {}
        if(start && end){
            query.date={
                $gte:start,
                $lt:end
            }
        }
        const sales = await Sale.find(query)
        console.log('querried data',sales)
        res.status(200).json(sales)
    } catch (error) {
        console.log('error',error)
    }
}
const fetchCustomer = async (req, res) => {
    try {
        const { name } = req.query;
        if (name) {
            const sales = await Sale.find({ customerName: name });
            res.status(200).json({ message: 'Sales for customer fetched successfully', data: sales });
        } else {
            res.status(400).json({ message: 'Customer name query parameter is required' });
        }
    } catch (error) {
        console.error('Error fetching customer sales', error);
        res.status(500).json({ message: 'Error fetching customer sales', error });
    }
};

// put, delete, specific queries
module.exports = {fetchData,postData,fetchQuery,fetchDay,fetchCustomer}