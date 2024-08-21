const express = require('express')
const router = express.Router()
const Sale = require('../Model/sales')

router.post('/sales',async(req,res)=>{
    try{
        const {name,price, quantity, customerId,jama} = req.body;

        const newSale = new Sale({
            // date,price,quantity,customerId,
            price,quantity,customerId,name,jama
        })

        await newSale.save();
        res.status(200).json({message:'Sale saved successfully',sale:newSale})
    }catch(error){
        console.log(error)
        res.status(500).json({message:'Error saving sale',error})
    }
})

module.exports = router;