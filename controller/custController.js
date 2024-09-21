// const Customer = require('../Model/Customer')
// const Sale = require('../Model/Sale')
// const Payment = require('../Model/Payment')

// const fetchData =async (req,res)=>{
//     try {
//         const data = await Customer.find()
//         res.status(200).json({message:'here are all the customers',data:data})
//     } catch (error) {
//         console.log(error)
//     }
// }

// const addCustomer = async(req,res)=>{
//     try{
//         const {name,contactInfo,type,totalJama,totalAmount,totalDue}= req.body
//         const custCheck = await Customer.findOne({name})

//         if(custCheck){
//             res.status(400).json({message:'Customer already exists'})
//         }
//         const newCust = new Customer({
//             name,
//             contactInfo,
//             type,
//             totalJama,totalAmount,totalDue
//         }) 
//         await newCust.save()
//         // const newCust = await customer.create({name,contactInfo})
//         res.status(200).json({message:'new Customer added',newCust})
//     }catch(error){
//         console.log(error)
//         res.status(500).json({message:'Error adding customer',error})
//     }
// }

// const updateCustomer = async(req,res)=>{
//     try {
//         // const {name,contactInfo,}
//         console.log("updateCustomer")
        
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({message:"error updating cusotmer",error})
//     }
// }

// const deleteCustomer = async (req, res) => {
//         try {
//             const customer = await Customer.findById(req.params.id);
            
//             if (!customer) {
//                 return res.status(404).json({ message: 'Customer not found' });
//             }
//             await Sale.deleteMany({ customerId: req.params.id });
//             await Payment.deleteMany({ customerId: req.params.id });
//             // Now delete the customer itself
//             await Customer.findByIdAndDelete(req.params.id);
//             res.status(200).json({ message: 'Customer and related sales and payments deleted successfully' });
//         } catch (error) {
//             console.log('Error deleting customer', error);
//             return res.status(500).json({ message: 'Error deleting customer and related data', error });
//         }
//     }
    
// }

// module.exports = {fetchData,addCustomer,updateCustomer,deleteCustomer}

const Customer = require('../Model/Customer');
const Sale = require('../Model/Sale');
const Payment = require('../Model/Payment');

const fetchData = async (req, res) => {
    try {
        const data = await Customer.find();
        res.status(200).json({ message: 'Here are all the customers', data: data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching customers', error });
    }
};

const addCustomer = async (req, res) => {
    try {
        const { name, contactInfo, type, totalJama, totalAmount, totalDue } = req.body;
        const custCheck = await Customer.findOne({ name });

        if (custCheck) {
            return res.status(409).json({ message: 'Customer already exists' }); // Use 409 Conflict
        }

        const newCust = new Customer({
            name,
            contactInfo,
            type,
            totalJama,
            totalAmount,
            totalDue
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
        const { name, contactInfo, type, totalJama, totalAmount, totalDue } = req.body;
        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            { name, contactInfo, type, totalJama, totalAmount, totalDue },
            { new: true, runValidators: true } // return the updated document
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
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        await Sale.deleteMany({ customerId: req.params.id });
        await Payment.deleteMany({ customerId: req.params.id });
        // Now delete the customer itself
        await Customer.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Customer and related sales and payments deleted successfully' });
    } catch (error) {
        console.log('Error deleting customer', error);
        return res.status(500).json({ message: 'Error deleting customer and related data', error });
    }
};

module.exports = { fetchData, addCustomer, updateCustomer, deleteCustomer };
