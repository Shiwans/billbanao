const Sale = require('../Model/Sale');
const Customer = require('../Model/Customer');

const fetchData = async (req, res) => {
    try {
        const data = await Sale.find({ userId: req.user.id }).sort({ createdAt: -1 })
        res.status(200).json({ message: 'Sales fetched successfully', data });
    } catch (error) {
        res.status(500).json({ message: 'Error while fetching data', error });
    }
};

const postData = async (req, res) => {
    try {
        const { date, name, quantity, price, paymentStatus, paymentDetails, type,customerId } = req.body;
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
            userId: req.user.id,
            customerId
        });

        await newSale.save();

        const due = amount - (paymentDetails.paidAmount || 0);
        await Customer.findOneAndUpdate(
            { name: name, userId: req.user.id },
            {
                $inc: {
                    totalAmount: amount,
                    totalJama: paymentDetails.paidAmount || 0,
                    totalDue: due,
                },
            }
        );

        res.status(200).json({ message: 'Sale saved successfully', sale: newSale });
    } catch (error) {
        console.error('Error saving sale:', error);
        res.status(500).json({ message: 'Error saving sale', error });
    }
};

const updateSale = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const sale = await Sale.findByIdAndUpdate(
            { _id: id, userId: req.user.id },
            updatedData,
            { new: true, runValidators: true }
        );

        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        return res.status(200).json({
            message: 'Sale updated successfully',
            data: sale,
        });
    } catch (error) {
        console.error('Error updating sale:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const fetchQuery = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = { userId: req.user.id };

        if (startDate && endDate) {
            const startOfDay = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0));
            const endOfDay = new Date(new Date(endDate).setUTCHours(23, 59, 59, 999));
            
            const query = {
                userId: req.user.id,
                date: {
                  $gte: startOfDay,
                  $lt: endOfDay,
                },
              };
        }

        const sales = await Sale.find(query);

        res.status(200).json({ message: 'Queried data fetched successfully', data: sales });
    } catch (error) {
        console.error('Error fetching queried data:', error);
        res.status(500).json({ message: 'Error fetching queried data', error });
    }
};

const fetchDay = async (req, res) => {
    try {
        const { start, end } = req.query;

        const startOfDay = new Date(new Date(start).setUTCHours(0, 0, 0, 0));
        const endOfDay = new Date(new Date(end).setUTCHours(23, 59, 59, 999));
        

        let query = { 
            userId: req.user.id, 
            date: {
                $gte: startOfDay,
                $lt: endOfDay,
            }
        };

        const sales = await Sale.find(query);
        res.status(200).json({ message: 'Sales fetched successfully', data: sales });
    } catch (error) {
        console.error('Error fetching sales by day:', error);
        res.status(500).json({ message: 'Error fetching sales by day', error });
    }
};



const fetchNameDate = async (req, res) => {
    try {
        const { name, date } = req.query;

        if (!name || !date) {
            return res.status(400).json({ message: 'Customer name and date query are required' });
        }
        const formattedDate = new Date(date).toISOString().split('T')[0];

        const sales = await Sale.find({
            name: name,
            date: formattedDate, // Ensuring date is correctly formatted
            userId: req.user.id,
        });

        if (sales.length === 0) {
            return res.status(404).json({ message: 'No sales found for this customer on the given date' });
        }

        res.status(200).json({ message: 'Sales for customer on specific date fetched successfully', data: sales });
    } catch (error) {
        console.error('Error fetching customer sales by date:', error);
        res.status(500).json({ message: 'Error fetching customer sales by date', error });
    }
};

const fetchCustomer = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ message: 'Customer name query parameter is required' });
        }

        const sales = await Sale.find({ name, userId: req.user.id });
        res.status(200).json({ message: 'Sales for customer fetched successfully', data: sales });
    } catch (error) {
        console.error('Error fetching customer sales:', error);
        res.status(500).json({ message: 'Error fetching customer sales', error });
    }
};

const deleteSale = async (req, res) => {
    try {
        const sale = await Sale.findById({ _id: req.params.id, userId: req.user.id });

        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        await Sale.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Sale has been deleted' });
    } catch (error) {
        console.error('Error deleting sale:', error);
        return res.status(500).json({ message: 'Error deleting sale', error });
    }
};

const fetch10Sale = async (req, res) => {
    try {
        const sales = await Sale.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10);
        res.status(200).json({ message: 'Last 10 sales fetched successfully', data: sales });
    } catch (error) {
        console.error('Error fetching last 10 sales:', error);
        res.status(500).json({ message: 'Error fetching last 10 sales', error });
    }
};

module.exports = {
    fetchData,
    postData,
    fetchQuery,
    fetchDay,
    fetchCustomer,
    deleteSale,
    fetch10Sale,
    fetchNameDate,
    updateSale,
};
