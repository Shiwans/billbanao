//purchase controller
const Purchase = require('../Model/Purchase');
const Customer = require('../Model/Customer');

const fetchData = async (req, res) => {
    try {
        const data = await Purchase.find({ userId: req.user.id }).sort({ createdAt: -1 })
        res.status(200).json({ message: 'Purchase fetched successfully', data });
    } catch (error) {
        res.status(500).json({ message: 'Error while fetching data', error });
    }
};

const postData = async (req, res) => {
    try {
        const { date, name, quantity, price, paymentStatus, paymentDetails, type,supplierId } = req.body;
        const amount = quantity * price;

        const newPurchase = new Purchase({
            date,
            name,
            quantity,
            price,
            amount,
            paymentStatus,
            paymentDetails,
            type,
            userId: req.user.id,
            supplierId
        });

        await newPurchase.save();

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

        res.status(200).json({ message: 'Purchase saved successfully', Purchase: newPurchase });
    } catch (error) {
        console.error('Error saving Purchase:', error);
        res.status(500).json({ message: 'Error saving Purchase', error });
    }
};

const updatePurchase = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const purchase = await Purchase.findByIdAndUpdate(
            { _id: id, userId: req.user.id },
            updatedData,
            { new: true, runValidators: true }
        );

        if (!purchase) {
            return res.status(404).json({ message: 'Purchase not found' });
        }

        return res.status(200).json({
            message: 'Purchase updated successfully',
            data: purchase,
        });
    } catch (error) {
        console.error('Error updating Purchase:', error);
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

        const purchases = await Purchase.find(query);

        res.status(200).json({ message: 'Queried data fetched successfully', data: purchases });
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

        const purchases = await Purchase.find(query);
        res.status(200).json({ message: 'Purchases fetched successfully', data: purchases });
    } catch (error) {
        console.error('Error fetching Purchases by day:', error);
        res.status(500).json({ message: 'Error fetching Purchases by day', error });
    }
};



const fetchNameDate = async (req, res) => {
    try {
        const { name, date } = req.query;

        if (!name || !date) {
            return res.status(400).json({ message: 'Customer name and date query are required' });
        }
        const formattedDate = new Date(date).toISOString().split('T')[0];

        const purchases = await Purchase.find({
            name: name,
            date: formattedDate, // Ensuring date is correctly formatted
            userId: req.user.id,
        });

        if (purchases.length === 0) {
            return res.status(404).json({ message: 'No purchases found for this customer on the given date' });
        }

        res.status(200).json({ message: 'Purchases for customer on specific date fetched successfully', data: purchases });
    } catch (error) {
        console.error('Error fetching customer purchases by date:', error);
        res.status(500).json({ message: 'Error fetching customer purchases by date', error });
    }
};

const fetchCustomer = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ message: 'Customer name query parameter is required' });
        }

        const purchases = await Purchase.find({ name, userId: req.user.id });
        res.status(200).json({ message: 'Purchases for customer fetched successfully', data: purchases });
    } catch (error) {
        console.error('Error fetching customer purchases:', error);
        res.status(500).json({ message: 'Error fetching customer purchases', error });
    }
};

const deletePurchase = async (req, res) => {
    try {
        const purchase = await Purchase.findById({ _id: req.params.id, userId: req.user.id });

        if (!purchase) {
            return res.status(404).json({ message: 'Purchase not found' });
        }

        await Purchase.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Purchase has been deleted' });
    } catch (error) {
        console.error('Error deleting Purchase:', error);
        return res.status(500).json({ message: 'Error deleting Purchase', error });
    }
};

const fetch10Purchase = async (req, res) => {
    try {
        const purchases = await Purchase.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10);
        res.status(200).json({ message: 'Last 10 Purchase fetched successfully', data: purchases });
    } catch (error) {
        console.error('Error fetching last 10 purchases:', error);
        res.status(500).json({ message: 'Error fetching last 10 Purchases', error });
    }
};

module.exports = {
    fetchData,
    postData,
    fetchQuery,
    fetchDay,
    fetchCustomer,
    deletePurchase,
    fetch10Purchase,
    fetchNameDate,
    updatePurchase,
};
