const express = require('express')
const router = express.Router()
const paymentC = require('../controller/paymController')

//GET /payment   fetches all the payment
router.get('/',paymentC.fetchPayment)

//POST /payment add payment
router.post('/',paymentC.addPayment)

//GET /payment/pay    fetch payments with name
router.get('/fetch',paymentC.fetchNameDate)

//GET /payment/10    fetch 10 recent payments
router.get('/10',paymentC.fetch10)

module.exports = router;