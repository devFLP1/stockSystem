const router = require('express').Router()
const Stock = require('../models/Stock')

//Create
router.post('/', async (req, res) => {
    const {name, sku, quantity} = req.body
  
    if(!name || !sku || !quantity) {
      return res.status(400).json({error: 'Missing required parameters'})
    }
  
    try {
      await Stock.create({ name, sku, quantity })
      res.status(201).json({message: 'product saved successfully'})
    } catch (error) {
      res.status(500).json({error: error})
    }
  
})

//Read All
router.get('/', async (req, res) => {
  try {
    const people = await Stock.find()
    res.status(200).json(people)
  } catch (error) {
    res.status(500).json({error: error})
  }
})

//Read by sku
router.get('/:sku', async (req, res) => {
  if (!req.params.sku) return res.status(400).json({error: 'sku is required'})

  try {
    const product = await Stock.findOne({sku: req.params.sku})
    if (!product) return res.status(404).json({error: 'product not found'})

    res.status(200).json(product)
  } catch (error) {
    res.status(500).json({error: error})
  }
})

//Update
router.patch('/:sku', async (req, res) => {
  if (!req.params.sku) return res.status(400).json({error: 'sku is required'})

  try {
    const product = await Stock.findOne({sku: req.params.sku})
    if (!product) return res.status(404).json({error: 'product not found'})

    const {name, quantity} = req.body
    const updatedProductData = { name, quantity }
    await product.updateOne({sku: req.params.sku}, updatedProductData)

    return res.status(200).json(updatedProductData)
  } catch (error) {
    res.status(500).json({error: error})
  }
})

//Delete
router.delete('/:sku', async (req, res) => {
  if (!req.params.sku) return res.status(400).json({error: 'sku is required'})

  try {
    const stock = await Stock.findOne({sku: req.params.sku})
    if (!stock) return res.status(404).json({error: 'product not found'})
    
    await Stock.deleteOne({sku: req.params.sku})
    return res.status(200).json({message: 'product deleted successfully'})
  } catch (error) {
    res.status(500).json({error: error})
  }
})

module.exports = router