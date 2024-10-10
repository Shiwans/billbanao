const Customer = require('../Model/Customer');
const Sale = require('../Model/Sale')
const Payment= require('../Model/Payment')

const fetchData = async (req, res) => {
    try {
        const data = await Customer.find({ userId: req.user.id })
        res.status(200).json({ message: 'Here are all the customers', data: data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching customers', error });
    }
};

const addCustomer = async (req, res) => {
    try {
        const { name, contactInfo, type, totalPaid, totalAmount, totalDue } = req.body;
        const custCheck = await Customer.findOne({ name, userId: req.user.id });

        if (custCheck) {
            return res.status(409).json({ message: 'Customer already exists' });
        }

        const newCust = new Customer({
            userId: req.user.id, 
            name,
            contactInfo,
            type,
            totalPaid,
            totalAmount,
            totalDue,
        });
        
        await newCust.save();
        res.status(201).json({ message: 'New customer added', newCust });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error adding customer', error });
    }
};


const updateCustomer = async (req, res) => {
    try {
        const { name, contactInfo, type, totalPaid, totalAmount, totalDue } = req.body;
        const updatedCustomer = await Customer.findByIdAndUpdate(
            { _id: req.params.id, userId: req.user._id }, 
            { name, contactInfo, type, totalPaid, totalAmount, totalDue },
            { new: true, runValidators: true } 
        );

        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({ message: 'Customer updated successfully', updatedCustomer });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating customer', error });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById({ _id: req.params.id, userId: req.user.id });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        await Sale.deleteMany({ customerId: req.params.id });
        await Payment.deleteMany({ customerId: req.params.id });
        await Customer.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Customer and related sales and payments deleted successfully' });
    } catch (error) {
        console.log('Error deleting customer', error);
        return res.status(500).json({ message: 'Error deleting customer and related data', error });
    }
};

const receivePayment = async (req, res) => {
    const { customerId, paymentAmount } = req.body; 

    try {
        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        
        if (customer.totalDue - paymentAmount < 0) {
            return res.status(400).json({ message: 'Payment exceeds total due amount' });
        }

        customer.totalDue -= paymentAmount;

        await customer.save();

        res.status(200).json({ message: 'Payment received successfully', data: customer });
    } catch (error) {
        console.error('Error receiving payment:', error);
        res.status(500).json({ message: 'Error receiving payment', error });
    }
};

module.exports = { fetchData, addCustomer, updateCustomer, deleteCustomer,receivePayment };
