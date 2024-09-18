const express = require('express')
const router = express.Router()
const paymentC = require('../controller/paymController')

router.get('/',paymentC.fetchPayment)
router.post('/',paymentC.addPayment)

module.exports = router;