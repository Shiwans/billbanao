const Customer = require('../Model/Customer')

const fetchData =async (req,res)=>{
    try {
        const data = await Customer.find()
        res.status(200).json({message:'here are all the customers',data:data})
    } catch (error) {
        console.log(error)
    }
}

const addCustomer = async(req,res)=>{
    try{
        const {name,contactInfo,type}= req.body
        const custCheck = await Customer.findOne({name})

        if(custCheck){
            res.status(400).json({message:'Customer already exists'})
        }
        const newCust = new Customer({
            name,
            contactInfo,
            type
        }) 
        await newCust.save()
        // const newCust = await customer.create({name,contactInfo})
        res.status(200).json({message:'new Customer added',newCust})
    }catch(error){
        console.log(error)
        res.status(500).json({message:'Error adding customer',error})
    }
}

const updateCustomer = ()=>{

}

const deleteCustomer = async(req,res) =>{
    try {
        await Customer.findByIdAndDelete({_id:req.params.id})
        res.status(200).json({message: 'Customer deleted successfully'})
    } catch (error) {
        console.log('Error deleting customer',error)
        return res.status(500).json({message:"error deleting customer"})
    }
}

module.exports = {fetchData,addCustomer,updateCustomer,deleteCustomer}