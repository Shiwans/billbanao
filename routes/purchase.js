const express = require('express')
const router = express.Router()
const purchaseController = require('../controller/purchaseController')


//description:-   fetching all purchase records
//route:-  GET /sales
// router.get("/",purchaseController.fetchData)

//description:-   add a purchase
//route:-  POST /purchase
router.post('/',purchaseController.postData)

//description:-   update a purchase
//route:-  POST /purchase/:id
router.put('/:id',purchaseController.updatePurchase)

//description:- query from start to end date
//route:- GET /purchase
router.get('/',purchaseController.fetchQuery)

//description:- query for one particular day
//route:- GET /purchase/day
router.get('/day',purchaseController.fetchDay)

//description:- query for one particular day with particular name
//route:- GET /purchase/fetch
router.get('/fetch',purchaseController.fetchNameDate)

//description:- fetch all the purchase from customerName
//route:- GET /purchase/customer 
router.get('/customer',purchaseController.fetchCustomer)

//description:- fetch all the purchase from customerName
//route:- DELETE /purchase/:id
router.delete('/:id',purchaseController.deletePurchase)

router.get('/10',purchaseController.fetch10Purchase)

module.exports = router;