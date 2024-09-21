const express = require('express')
const router = express.Router()
const saleController = require('../controller/saleController')


//description:-   fetching all sale records
//route:-  GET /sales
// router.get("/",saleController.fetchData)

//description:-   add a sale
//route:-  POST /sales
router.post('/',saleController.postData)

router.get('/',saleController.fetchQuery)
router.get('/day',saleController.fetchDay)
router.get('/customer',saleController.fetchCustomer)

module.exports = router;