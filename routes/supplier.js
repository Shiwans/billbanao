const express = require('express')
const router = express.Router()

const suppController = require('../controller/suppController')
router.get('/',suppController.fetchData)
router.post('/',suppController.addSupplier)
router.put('/update/:id',suppController.updateSupplier)
router.delete('/delete/:id',suppController.deleteSupplier)
module.exports = router;