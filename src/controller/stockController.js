const stockService = require('../services/stockService');

async function createStock(req, res) {
  try {
    const { name, sku, quantity, threshHoldQuantity } = req.body;

    if (!name || !sku || !quantity || !threshHoldQuantity) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    await stockService.create({ name, sku, quantity, threshHoldQuantity });
    return res.status(201).json({ message: 'Product saved successfully' });
  } catch (error) {
    console.error('Error creating stock item:', error);
    return res.status(500).json({ error: 'Unknown error, contact support.' });
  }
}

async function getAllStock(req, res) {
  try {
    const stock = await stockService.getAllStock();
    return res.status(200).json(stock);
  } catch (error) {
    console.error('Error getting stock:', error);
    return res.status(500).json({ error: 'Unknown error, contact support.' });
  }
}

async function getStockBySku(req, res) {
  try {
    const product = await stockService.getStockBySku(req.params.sku);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    return res.status(200).json(product);
  } catch (error) {
    console.error('Error getting stock by SKU:', error);
    return res.status(500).json({ error: 'Unknown error, contact support.' });
  }
}

async function updateStockBySku(req, res) {
  try {
    if (!req.params.sku) return res.status(400).json({ error: 'Missing required parameter' });

    const updatedProductData = await stockService.updateStockBySku(req.params.sku, req.body);
    return res.status(200).json(updatedProductData);
  } catch (error) {
    console.error('Error updating stock by SKU:', error);
    return res.status(500).json({ error: 'Unknown error, contact support.' });
  }
}

async function deleteStockBySku(req, res) {
  try {
    if (!req.params.sku) return res.status(400).json({ error: 'Missing required parameter' });

    const result = await stockService.deleteStockBySku(req.params.sku);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error deleting stock by SKU:', error);
    return res.status(500).json({ error: 'Unknown error, contact support.' });
  }
}

module.exports = {
  createStock,
  getAllStock,
  getStockBySku,
  updateStockBySku,
  deleteStockBySku,
};