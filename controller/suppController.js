const Supplier = require('../Model/Supplier');
const Sale = require('../Model/Sale')
const Payment= require('../Model/Payment')

// Fetch all suppliers
const fetchData = async (req, res) => {
    try {
        const data = await Supplier.find({ userId: req.user.id });
        res.status(200).json({ message: 'Here are all the suppliers', data });
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).json({ message: 'Error fetching suppliers' });
    }
};

// Add a new supplier
const addSupplier = async (req, res) => {
    try {
        const { name, contactInfo, type, totalAmount, totalPaid, totalDue } = req.body;
        if (!name || !contactInfo || !contactInfo.phone || !contactInfo.email || totalAmount === undefined || totalPaid === undefined || totalDue === undefined) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const supplierExists = await Supplier.findOne({ name, userId: req.user.id });
        if (supplierExists) {
            return res.status(400).json({ message: 'Supplier already exists' });
        }

        const newSupplier = new Supplier({
            userId: req.user.id,
            name,
            contactInfo,
            type,
            totalAmount,
            totalPaid,
            totalDue,
        });
        await newSupplier.save();

        res.status(201).json({ message: 'New supplier added', newSupplier });
    } catch (error) {
        console.error('Error adding supplier:', error.message);
        res.status(500).json({ message: 'Error adding supplier' });
    }
};

// Update supplier details
const updateSupplier = async (req, res) => {
    try {
        const { name, contactInfo, type, totalAmount, totalPaid, totalDue } = req.body;
        const supplierId = req.params.id;
        if (!name || !contactInfo || !contactInfo.email || !contactInfo.phone || !contactInfo.upi || totalAmount === undefined || totalPaid === undefined || totalDue === undefined) {
            return res.status(400).json({ message: 'All fields are required for updating' });
        }

        // const supplierExists = await Supplier.findOne({ name, _id: { $ne: id }, userId: req.user.id });
        // if (supplierExists) {
        //     return res.status(400).json({ message: 'A supplier with the same name already exists' });
        // }    

        const updatedSupplier = await Supplier.findOneAndUpdate(
            { _id: supplierId, userId: req.user.id },
            {
                name,
                contactInfo,
                type,
                totalAmount,
                totalPaid,
                totalDue,
            },
            { new: true, runValidators: true }
        );

        if (!updatedSupplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        res.status(200).json({ message: 'Supplier updated', updatedSupplier });
    } catch (error) {
        console.error('Error updating supplier:', error.message);
        res.status(500).json({ message: 'Error updating supplier' });
    }
};


// Delete a supplier
const deleteSupplier = async (req, res) => {
    try {
        const deletedSupplier = await Supplier.findOne({ _id: req.params.id, userId: req.user.id });

        if (!deletedSupplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

       // Delete related payments using the supplierId
       await Payment.deleteMany({ supplierId: req.params.id });
       // Assuming you have a Sale model to delete related sales as well
       await Sale.deleteMany({ supplierId: req.params.id });
        await Supplier.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Supplier and related sales and payments deleted successfully' });
    } catch (error) {
        console.error('Error deleting supplier:', error);
        res.status(500).json({ message: 'Error deleting supplier' });
    }
};

module.exports = { fetchData, addSupplier, updateSupplier, deleteSupplier };
