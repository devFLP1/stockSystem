const express = require('express');
const router = express.Router();
const stockController = require('../controller/stockController');

router.post('/', stockController.createStock);
router.get('/', stockController.getAllStock);
router.get('/:sku', stockController.getStockBySku);
router.patch('/:sku', stockController.updateStockBySku);
router.delete('/:sku', stockController.deleteStockBySku);

module.exports = router;