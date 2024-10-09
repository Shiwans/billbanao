const express = require('express')
const router = express.Router()

const suppController = require('../controller/suppController')

router.get('/',suppController.fetchData)
router.post('/',suppController.addSupplier)
//description /supplier/payment
router.post('/payment',suppController.makePayment)
router.put('/:id',suppController.updateSupplier)
router.delete('/:id',suppController.deleteSupplier)
module.exports = router;