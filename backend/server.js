const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const { DB_URI } = require('./utils/config')

const PORT = 4000

// Middleware
const authRequired = require('./middleware/auth')

// Routers
var AuthRouter = require("./routes/auth")
var UserRouter = require("./routes/user")
var ProductsRouter = require("./routes/products")
var OrderRouter = require("./routes/orders")

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// mongoose.connect('mongodb://127.0.0.1:27017/cantiiin', { useNewUrlParser: true })
mongoose.connect(DB_URI)
const connection = mongoose.connection;
connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
})

app.use("/api/auth", AuthRouter)

app.use(authRequired)
app.use('/api/user', UserRouter)

app.use("/api/products", ProductsRouter)
app.use("/api/orders", OrderRouter)

app.listen(PORT, () => {
    console.log(`Backend app listening at http://localhost:${PORT}`)
})