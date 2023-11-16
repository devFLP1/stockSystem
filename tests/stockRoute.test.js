const { expect } = require('chai')
require('dotenv').config()
const mongoose = require('mongoose')
const request = require('supertest')
const express = require('express')
const app = express()
const Stock = require('../models/Stock')
const stockRoutes = require('../routes/stockRoute')

app.use(express.json())
app.use('/stock', stockRoutes)

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
  //Teste criação
  it('should create a new stock item', async () => {
    const newStock = {
      name: 'Test Product',
      sku: 'devEnvTest12349892',
      quantity: 10
    };
    
    const res = await request(app)
      .post('/stock')
      .send(newStock);
    
    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property('message');
    await Stock.deleteOne({sku: 'devEnvTest12349892', name: 'Test Product'})
  });

  //Teste de informações faltando para criação
  it('should return 400 error without required fields', async () => {
    const res = await request(app)
      .post('/stock')
      .send({
        quantity: 10
      })

    expect(res.statusCode).to.equal(400)
  })

  //Teste de read por sku
  describe('GET /stock/:sku', () => {
    beforeEach(async () => {
      await Stock.create({
        name: 'Test Product',
        sku: 'devEnvTest12349892',
        quantity: 10
      })
    })

    it('should get a stock item by sku', async () => {
      const res = await request(app).get('/stock/devEnvTest12349892')
      expect(res.statusCode).to.equal(200)
      expect(res.body).to.have.property('name', 'Test Product')
      await Stock.deleteOne({sku: 'devEnvTest12349892', name: 'Test Product'})
    })
  })
})

after(async () => {
  await mongoose.disconnect();
  console.log('MongoDB connection closed');
});