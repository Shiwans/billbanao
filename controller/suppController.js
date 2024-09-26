// const Supplier = require('../Model/Supplier');

// // Fetch all suppliers
// const fetchData = async (req, res) => {
//     try {
//         const data = await Supplier.find();
//         if (!data.length) {
//             return res.status(404).json({ message: 'No suppliers found' });
//         }
//         res.status(200).json({ message: 'Here are all the suppliers', data });
//     } catch (error) {
//         console.error('Error fetching suppliers:', error);
//         res.status(500).json({ message: 'Error fetching suppliers', error: error.message });
//     }
// };

// // Add a new supplier
// const addSupplier = async (req, res) => {
//     try {
//         const { name, contactInfo, totalAmount, totalPaid } = req.body;

//         // Check if all required fields are provided
//         if (!name || !contactInfo || !contactInfo.phone || !contactInfo.email || totalAmount === undefined || totalPaid === undefined) {
//             return res.status(400).json({ message: 'All fields are required: name, contactInfo, totalAmount, and totalPaid' });
//         }

//         // Ensure totalAmount and totalPaid are valid numbers
//         if (typeof totalAmount !== 'number' || totalAmount < 0) {
//             return res.status(400).json({ message: 'Total amount must be a non-negative number' });
//         }
//         if (typeof totalPaid !== 'number' || totalPaid < 0) {
//             return res.status(400).json({ message: 'Total paid must be a non-negative number' });
//         }

//         // Check if supplier already exists
//         const supplierExists = await Supplier.findOne({ name });
//         if (supplierExists) {
//             return res.status(400).json({ message: 'Supplier already exists' });
//         }

//         // Calculate total due
//         const totalDue = totalAmount - totalPaid;

//         // Create new supplier
//         const newSupplier = new Supplier({
//             name,
//             contactInfo,
//             totalAmount,
//             totalPaid,
//             totalDue,
//         });
//         await newSupplier.save();

//         res.status(201).json({ message: 'New supplier added', newSupplier });
//     } catch (error) {
//         console.error('Error adding supplier:', error.message);
//         res.status(500).json({ message: 'Error adding supplier', error: error.message });
//     }
// };

// // Update supplier details
// const updateSupplier = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { name, contactInfo, totalAmount, totalPaid } = req.body;

//         // Check if the supplier ID is valid
//         if (!id) {
//             return res.status(400).json({ message: 'Supplier ID is required' });
//         }

//         // Check if all required fields are provided
//         if (!name || !contactInfo || !contactInfo.email || totalAmount === undefined || totalPaid === undefined) {
//             return res.status(400).json({ message: 'All fields are required for updating' });
//         }

//         // Ensure totalAmount and totalPaid are valid numbers
//         if (typeof totalAmount !== 'number' || totalAmount < 0) {
//             return res.status(400).json({ message: 'Total amount must be a non-negative number' });
//         }
//         if (typeof totalPaid !== 'number' || totalPaid < 0) {
//             return res.status(400).json({ message: 'Total paid must be a non-negative number' });
//         }

//         // Check if another supplier with the same name exists, excluding the current supplier
//         const supplierExists = await Supplier.findOne({ name, _id: { $ne: id } });
//         if (supplierExists) {
//             return res.status(400).json({ message: 'A supplier with the same name already exists' });
//         }

//         // Calculate total due
//         const totalDue = totalAmount - totalPaid;

//         // Find and update the supplier
//         const updatedSupplier = await Supplier.findByIdAndUpdate(
//             id,
//             {
//                 name,
//                 contactInfo,
//                 totalAmount,
//                 totalPaid,
//                 totalDue,
//             },
//             { new: true } // Return the updated supplier document
//         );

//         if (!updatedSupplier) {
//             return res.status(404).json({ message: 'Supplier not found' });
//         }

//         res.status(200).json({ message: 'Supplier updated', updatedSupplier });
//     } catch (error) {
//         console.error('Error updating supplier:', error.message);
//         res.status(500).json({ message: 'Error updating supplier', error: error.message });
//     }
// };


// // Delete a supplier
// const deleteSupplier = async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Check if the supplier ID is valid
//         if (!id) {
//             return res.status(400).json({ message: 'Supplier ID is required' });
//         }

//         // Find and delete the supplier
//         const deletedSupplier = await Supplier.findByIdAndDelete(id);

//         if (!deletedSupplier) {
//             return res.status(404).json({ message: 'Supplier not found' });
//         }

//         res.status(200).json({ message: 'Supplier deleted', deletedSupplier });
//     } catch (error) {
//         console.error('Error deleting supplier:', error.message);
//         res.status(500).json({ message: 'Error deleting supplier', error: error.message });
//     }
// };

// module.exports = { fetchData, addSupplier, updateSupplier, deleteSupplier };

const Supplier = require('../Model/Supplier');

// Fetch all suppliers
const fetchData = async (req, res) => {
    try {
        const data = await Supplier.find();
        res.status(200).json({ message: 'Here are all the suppliers', data });
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).json({ message: 'Error fetching suppliers' });
    }
};

// Add a new supplier
const addSupplier = async (req, res) => {
    try {
        const { name, contactInfo, totalAmount, totalPaid,totalDue } = req.body;

        const newSupplier = new Supplier({
            name,
            contactInfo,
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
        const { id } = req.params;
        const { name, contactInfo, totalAmount, totalPaid } = req.body;

        // Update without extensive checks
        const totalDue = totalAmount - totalPaid;

        const updatedSupplier = await Supplier.findByIdAndUpdate(
            id,
            {
                name,
                contactInfo,
                totalAmount,
                totalPaid,
                totalDue,
            },
            { new: true,runValidators: true }
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
        const { id } = req.params;

        const deletedSupplier = await Supplier.findByIdAndDelete(id);

        if (!deletedSupplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        res.status(200).json({ message: 'Supplier deleted', deletedSupplier });
    } catch (error) {
        console.error('Error deleting supplier:', error.message);
        res.status(500).json({ message: 'Error deleting supplier' });
    }
};

module.exports = { fetchData, addSupplier, updateSupplier, deleteSupplier };
