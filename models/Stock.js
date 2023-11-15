const mongoose = require('mongoose')

const Stock = mongoose.model('Stock', {
    name: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        required: true,
        unique: true
    },
    quantity: {
        type: Number,
        required: true
    }
})

module.exports = Stock