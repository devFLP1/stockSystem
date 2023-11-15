require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

const stockRoutes = require('./routes/stockRoute')
app.use('/stock', stockRoutes)

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@apicluster.zkflsc8.mongodb.net/`)
.then(() => {
    console.log('Conectado ao MongoDB!')
    app.listen(3000)
}).catch(err => console.log(err))

