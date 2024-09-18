const Sale = require('../Model/Sale')

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
            customerName, //
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
    // try {
    //     const { date } = req.query;
    //     if (!date) {
    //         return res.status(400).json({ message: 'Date query parameter is required' });
    //     }

    //     // Ensure the date is in YYYY-MM-DD format
    //     const startDate = new Date(date);
    //     startDate.setHours(0, 0, 10, 1); // Set start of the day

    //     const endDate = new Date(date);
    //     endDate.setHours(23, 59, 59, 999); // Set end of the day

    //     const sales = await Sale.find({
    //         date: {
    //             $gte: startDate.toISOString().split('T')[0],
    //             $lte: endDate.toISOString().split('T')[0]
    //         }
    //     });

    //     res.status(200).json(sales);
    // } catch (error) {
    //     res.status(500).json({ message: 'Error fetching data', error });
    // }
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