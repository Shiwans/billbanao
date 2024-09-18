const express = require('express')
const router = express.Router()

const suppController = require('../controller/suppController')
router.get('/',suppController.fetchData)
router.post('/',suppController.addSupplier)
module.exports = router;