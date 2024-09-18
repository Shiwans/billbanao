const Supplier = require('../Model/Supplier')

const fetchData =async (req,res)=>{
    try {
        const data = await Supplier.find()
        console.log('all Supplier data',data)
        res.status(200).json({message:'here are all the Supplier',data:data})
    } catch (error) {
        console.log(error)
    }
}

const addSupplier = async(req,res)=>{
    try{
        const {name,contactInfo,type}= req.body
        const custCheck = await Supplier.findOne({name})

        if(custCheck){
            res.status(400).json({message:'Supplier already exists'})
        }
        const newCust = new Supplier({
            name,
            contactInfo,
            type
        }) 
        await newCust.save()
        // const newCust = await customer.create({name,contactInfo})
        res.status(200).json({message:'new Supplier added',newCust})
    }catch(error){
        console.log(error)
        res.status(500).json({message:'Error adding Supplier',error})
    }
}

module.exports = {fetchData,addSupplier}