const Sale = require('../Model/Sale')
const Customer = require('../Model/Customer');

const fetchData = async(req,res)=>{
        try {
            const data =await Sale.find({userId: req.user.id})
            // console.log('data from sale routes for fetching',data)
        } catch (error) {
            res.status(500).json({message:"Error while fetching data ",error})
        }
}

const postData = async(req,res)=>{
    try{
        const {date,
            name,
            quantity,
            price,
            paymentStatus,
            paymentDetails,type} = req.body
        const amount = quantity * price;
        const newSale = new Sale({
            date,
            name,
            quantity,
            price,
            amount,
            paymentStatus,
            paymentDetails,
            type,
            userId: req.user.id
    })
        
        await newSale.save();
        const due = parseInt(amount) - parseInt(paymentDetails.paidAmount);
        await Customer.findOneAndUpdate(
            { name: name, userId: req.user.id },
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

const updateSale = async (req, res) => {
    const { id } = req.params; 
    const updatedData = req.body;
  
    try {
      // Find the sale by ID and update it with new data
      const sale = await Sale.findByIdAndUpdate({ _id: id, userId: req.user.id}, updatedData,
        { new: true, runValidators: true }
      );
  
      if (!sale) {
        return res.status(404).json({ message: 'Sale not found' });
      }
  
      // Return the updated sale data to the client
      return res.status(200).json({
        message: 'Sale updated successfully',
        data: sale,
      });
    } catch (error) {
      console.error('Error updating sale:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
const fetchQuery=async (req,res)=>{
    try {
        const {startDate,endDate} = req.query;
        let query = { userId: req.user.id };
        if(startDate && endDate){
            query.date={
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        
        }
        const sales = await Sale.find(query)
        console.log('querried data',sales)
        res.status(200).json(sales)
    } catch (error) {
        console.log('error',error)
    }
}

const fetchDay = async (req, res) => {
    try {
      const { start, end } = req.query;
      let query = { userId: req.user.id };
  
      if (start && end) {
        query.date = {
          $gte: new Date(start),
          $lt: new Date(end),
        };
      }
  
      const sales = await Sale.find(query);
      console.log('queried data', sales);
      res.status(200).json(sales);
    } catch (error) {
      console.log('error', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const fetchNameDate = async (req, res) => {
    try {
        // const { name, date,endDate } = req.query;
        const { name, date } = req.query;

        if (!name || !date) {
            return res.status(400).json({ message: 'Customer name and date query parameters are required' });
        }

        const sales = await Sale.find({
            name: name,
            date: date,
            userId: req.user.id
        });

        if (sales.length === 0) {
            return res.status(404).json({ message: 'No sales found for this customer on the given date' });
        }
        res.status(200).json({ message: 'Sales for customer on specific date fetched successfully', data: sales });
    } catch (error) {
        console.error('Error fetching customer sales by date', error);
        res.status(500).json({ message: 'Error fetching customer sales by date', error });
    }
};


const fetchCustomer = async (req, res) => {
    try {
        const { name } = req.query;
        if (name) {
            const sales = await Sale.find({ name, userId: req.user.id });
            res.status(200).json({ message: 'Sales for customer fetched successfully', data: sales });
        } else {
            res.status(400).json({ message: 'Customer name query parameter is required' });
        }
    } catch (error) {
        console.error('Error fetching customer sales', error);
        res.status(500).json({ message: 'Error fetching customer sales', error });
    }
};

const deleteSale = async (req, res) => {
    try {
        const customer = await Sale.findById({ _id: req.params.id, userId: req.user.id });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        await Sale.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Sale has been deleted" });
    } catch (error) {
        console.log('Sale was not deleted', error);
        return res.status(500).json({ message: 'Error deleting sale', error });
    }
};


const fetch10Sale = async (req,res) =>{
    try {
      const sales = await Sale.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10)
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: "Error fetching sales" });
    }
}


// put, delete, specific queries
module.exports = {fetchData,postData,fetchQuery,fetchDay,fetchCustomer,deleteSale,fetch10Sale,fetchNameDate,updateSale}
