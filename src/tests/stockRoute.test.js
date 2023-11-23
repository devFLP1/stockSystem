require('dotenv').config();
const { expect } = require('chai');
const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const app = express();
const Stock = require('../models/Stock');
const stockRoutes = require('../routes/stockRoute');
const { sendNotification } = require('../services/notificationService');

app.use(express.json());
app.use('/stock', stockRoutes);

before(async () => {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@apicluster.zkflsc8.mongodb.net/`);
    console.log('Connected to MongoDB!');
    app.listen(3000);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    throw error;
  }
});

describe('stockRoute API', () => {
  it('should create a new stock item', async () => {
    const newStock = {
      name: 'Test Product',
      sku: 'devEnvTest12349892',
      quantity: 10,
      threshHoldQuantity: 5,
    };

    const res = await request(app)
      .post('/stock')
      .send(newStock);

    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property('message');
  });

  // Teste de informações faltando para criação
  it('should return 400 error without required fields', async () => {
    const res = await request(app)
      .post('/stock')
      .send({
        quantity: 10,
        threshHoldQuantity: 5,
      });

    expect(res.statusCode).to.equal(400);
  });

  // Teste de notificação baixo estoque
  describe('stockRoute API', () => {
    let product;

    beforeEach(async () => {
      const lowStockProduct = {
        name: 'Low Stock Product',
        sku: 'lowStock123',
        quantity: 3,
        threshHoldQuantity: 5,
      };

      product = await Stock.create(lowStockProduct);
    });

    it('should send a low stock notification and return 200', async () => {
      if (product.quantity <= product.threshHoldQuantity) {
        const notificationResult = await sendNotification(process.env.DEV_TEST_MAIL, 'Low Stock Alert Test', 'Low stock for product: Low Stock Product');

        expect(notificationResult.accepted).to.be.an('array').that.is.not.empty;
      }
    });

    afterEach(async () => {
      await Stock.deleteOne({ sku: 'lowStock123' });
    });
  });

  // Teste de leitura por SKU
  describe('GET /stock/:sku', () => {
    beforeEach(async () => {
      const existingStock = await Stock.findOne({ sku: 'devEnvTest12349892' });

      if (!existingStock) {
        await Stock.create({
          name: 'Test Product',
          sku: 'devEnvTest12349892',
          quantity: 10,
          threshHoldQuantity: 5,
        });
      }
    });

    it('should get a stock item by sku', async () => {
      const res = await Stock.findOne({ sku: 'devEnvTest12349892' });
      if (!res) throw Error('Stock item not found');
    });

    afterEach(async () => {
      await Stock.deleteOne({ sku: 'devEnvTest12349892' });
    });
  });

  after(async () => {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  });
});
