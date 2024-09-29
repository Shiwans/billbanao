const express = require('express');
const router = express.Router();
const customerController = require('../controller/custController');


// Apply the authenticateToken middleware to all customer routes
router.get('/', customerController.fetchData);
router.post('/',  customerController.addCustomer);
router.put('/:id',  customerController.updateCustomer);
router.delete('/:id' , customerController.deleteCustomer);

module.exports = router;