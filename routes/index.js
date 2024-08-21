const express = require('express')
const router = express.Router()

//to fill data
router.get("/fill",(req,res)=>{
    try {
        console.log("it works")
    } catch (error) {
        console.log(error)
        res.statusCode=500;
    }
})

router.get("/",(req,res)=>{
    try {
    } catch (error) {
        
    }
})


module.exports = router;