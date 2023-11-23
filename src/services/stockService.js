require('dotenv').config();
const Stock = require('../models/Stock');
const { sendNotification } = require('../services/notificationService');

async function create({ name, sku, quantity, threshHoldQuantity }) {
  return Stock.create({ name, sku, quantity, threshHoldQuantity });
}

async function getAllStock() {
  return Stock.find();
}

async function getStockBySku(sku) {
  return Stock.findOne({ sku });
}

async function updateStockBySku(sku, { name, quantity, threshHoldQuantity }) {
  const product = await Stock.findOne({ sku });
  if (!product) throw new Error('Product not found');

  const updatedProductData = { name, quantity, threshHoldQuantity };
  await product.updateOne(updatedProductData);

if (updatedProductData.quantity < product.threshHoldQuantity) {
    await sendNotification(process.env.DEV_TEST_MAIL, `Stock is low for ${product.name}`, `Stock is low for ${product.name}, actual quantity is ${updatedProductData.quantity}`);
}

  return updatedProductData;
}

async function deleteStockBySku(sku) {
  const stock = await Stock.findOne({ sku });
  if (!stock) throw new Error('Product not found');

  await Stock.deleteOne({ sku });
  return { message: 'Product deleted successfully' };
}

module.exports = {
  create,
  getAllStock,
  getStockBySku,
  updateStockBySku,
  deleteStockBySku,
};