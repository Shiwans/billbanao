const express = require('express')
const router = express.Router()
const Sale = require('../Model/sales')

//to fill data
router.get("/",async(req,res)=>{
    try {
        // console.log('response',res)
    } catch (error) {
        console.log(error)
    }
})

// router.get("/",(req,res)=>{
//     try {
//     } catch (error) {
        
//     }
// })

//printed this from data.js file just to make it run

router.post('/',async(req,res)=>{
    try{
        // const {name,price, quantity, customerId,jama} = req.body;
        const {name, price,quantity, jama} = req.body

        const newSale = new Sale({
            name,price,quantity,jama
            // price,quantity,customerId,name,jama
    })

        await newSale.save();
        // res.status(200).json({message:'Sale saved successfully',sale:newSale})
        console.log("Sale saved successfully",newSale)
    }catch(error){
        console.log(error)
        res.status(500).json({message:'Error saving sale',error})
    }
})


module.exports = router;