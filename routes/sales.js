const express = require('express')
const router = express.Router()
const saleController = require('../controller/saleController')


//description:-   fetching all sale records
//route:-  GET /sales
// router.get("/",saleController.fetchData) 

//description:-   add a sale
//route:-  POST /sales
router.post('/',saleController.postData)

//description:-   update a sale
//route:-  POST /sales/:id
router.put('/:id',saleController.updateSale)

//description:- query from start to end date
//route:- GET /sales
router.get('/',saleController.fetchQuery)

//description:- query for one particular day
//route:- GET /sales/day
router.get('/day',saleController.fetchDay)

//description:- query for one particular day with particular name
//route:- GET /sales/fetch
router.get('/fetch',saleController.fetchNameDate)

//description:- fetch all the sales from customerName
//route:- GET /sales/customer 
router.get('/customer',saleController.fetchCustomer)

//description:- fetch all the sales from customerName
//route:- DELETE /sales/:id
router.delete('/:id',saleController.deleteSale)

router.get('/10',saleController.fetch10Sale)

module.exports = router;