var express = require("express")
var router = express.Router()

const { DateTime } = require("luxon")

const Order = require("../models/orders")
const Product = require("../models/products")
const { Buyer, Vendor } = require("../models/types")
const { EMAIL_USER, EMAIL_PASS } = require("../utils/config")

var nodemailer = require("nodemailer")

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});



router.post('/new', async (req, res) => {
    if (req.user.type !== "buyer") {
        return res.status(201).json({ status: 1, error: "Unauthorised" })
    }

    const product = await Product.findById(req.body.productId)

    if (!product) {
        return res.status(200).json({ status: 1, error: "Product not found" })
    }
    if (req.body.quantity <= 0)
        return res.status(400).json({ status: 1, error: "Quantity must be positive" })

    var total = product.price
    var addons = []
    if (req.body.addons) {
        product.addons.forEach(addon => {
            if (req.body.addons.includes(addon._id.toString())) {
                addons.push(addon)
                total += addon.price
            }
        })
    }
    total = total * req.body.quantity

    var buyer = await Buyer.findOne({ email: req.user.email })
    if (buyer.wallet < total) {
        return res.status(200).json({ status: 1, error: "Insufficient balance" })
    }
    else {
        buyer.wallet -= total
    }

    var now = new Date()
    // now = now.getHours() * 60 + now.getMinutes()

    const vendor = await Vendor.findOne({ name: product.vendor })
    const opening = DateTime.fromISO(vendor.opening)
    const closing = DateTime.fromISO(vendor.closing)
    if (
        (opening < closing && (now < opening || now > closing)) ||
        (opening > closing && (now < opening && now > closing))
    ) {
        return res.status(200).json({ status: 1, error: "Vendor is closed" })
    }

    var order = new Order({
        buyer: buyer.email,
        vendor: product.vendor,
        item: {
            id: product._id,
            name: product.name,
            price: product.price,
            addon: addons
        },
        quantity: req.body.quantity,
        total: total
    })

    order.save((err) => {
        if (err) {
            return res.status(200).json({ status: 1, error: err })
        }
        buyer.save()
        return res.status(201).json({ status: 0, message: "Order placed successfully" })
    })

})

router.get('/buyer', async (req, res) => {
    if (req.user.type !== 'buyer')
        return res.json({ status: 1, error: "Unauthorised" })

    const orders = await Order.find({ buyer: req.user.email })
    return res.json({ status: 0, message: orders })
})

router.get('/vendor', async (req, res) => {
    if (req.user.type !== 'vendor')
        return res.json({ status: 1, error: "Unauthorised" })

    const vendor = await Vendor.findOne({ email: req.user.email })

    const orders = await Order.find({ vendor: vendor.name })

    return res.json({ status: 0, message: orders })
})

router.post('/accept', async (req, res) => {
    if (req.user.type !== 'vendor')
        return res.json({ status: 1, error: "Unauthorised" })

    var order = await Order.findOne({ _id: req.body.id })
    var vendor = await Vendor.findOne({ name: order.vendor })

    const pending = await Order.find({ vendor: vendor.name, status: { $in: ['accepted', 'cooking'] } })

    if (pending >= 10)
        return res.json({ status: 1, error: "You can have at max 10 pending orders" })

    var mailOptions = {
        from: EMAIL_USER,
        to: order.buyer,
        subject: "Order Accepted",
        text: "Your order has been accepted by " + vendor.name
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) console.log(error)
        else console.log(info)
    })

    order.status = 'accepted'
    order.save()
        .then(() => { return res.json({ status: 0, message: "Order accepted" }) })
        .catch((err) => { return res.json({ status: 1, message: err }) })
})

router.post('/reject', async (req, res) => {
    if (req.user.type !== 'vendor')
        return res.json({ status: 1, error: "Unauthorised" })

    var order = await Order.findOne({ _id: req.body.id })
    var buyer = await Buyer.findOne({ email: order.buyer })
    var vendor = await Vendor.findOne({ name: order.vendor })

    buyer.wallet += order.total
    buyer.save()

    var mailOptions = {
        from: EMAIL_USER,
        to: order.buyer,
        subject: "Order Rejected",
        text: "Your order has been rejected by " + vendor.name
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) console.log(error)
    })

    order.status = 'rejected'
    order.save()
        .then(() => { return res.json({ status: 0, message: "Order rejected" }) })
        .catch((err) => { return res.json({ status: 1, message: err }) })
})

router.post('/move', async (req, res) => {
    if (req.user.type !== 'vendor')
        return res.json({ status: 1, error: "Unauthorised" })

    var order = await Order.findOne({ _id: req.body.id })

    if (order.status === 'accepted')
        order.status = 'cooking'
    else if (order.status == 'cooking')
        order.status = 'pickup'
    else
        return res.json({ status: 1, error: "Invalid operation" })

    order.save()
        .then(() => { return res.json({ status: 0, message: "Order updated" }) })
        .catch((err) => { return res.json({ status: 1, message: err }) })
})

router.post('/pickup', async (req, res) => {
    if (req.user.type !== 'buyer')
        return res.json({ status: 1, error: "Unauthorised" })

    var order = await Order.findOne({ _id: req.body.id })

    if (order.status !== 'pickup')
        return res.json({ status: 1, error: "Invalid operation" })

    order.status = 'completed'
    order.save()
        .then(() => { return res.json({ status: 0, message: "Order completed" }) })
        .catch((err) => { return res.json({ status: 1, message: err }) })
})

router.post('/rate', async (req, res) => {
    if (req.user.type !== 'buyer')
        return res.json({ status: 1, error: "Unauthorised" })

    var order = await Order.findOne({ _id: req.body.id })
    var product = await Product.findOne({ _id: order.item.id })

    if (product) {
        if (!(order.rating)) {
            product.rating.count++
            product.rating.total += parseInt(req.body.rating)
        }
        else {
            product.rating.total += parseInt(req.body.rating) - order.rating
        }
        product.save()
    }
    order.rating = req.body.rating
    order.save((err) => {
        if (err)
            return res.json({ status: 1, error: err })
        return res.json({ status: 0, message: "Review added successfully" })
    })

})

router.get('/stats', async (req, res) => {
    if (req.user.type !== 'vendor')
        return res.json({ status: 1, error: "Unauthorised" })

    const vendor = await Vendor.findOne({ email: req.user.email })
    const products = await Product.find({ vendor: vendor.name })


    var productStats = []
    for (const i in products) {
        const product = products[i]
        const orders = await Order.find({ 'item.name': product.name, vendor: vendor.name })
        productStats.push({ name: product.name, count: orders.length })
    }

    const orders = await Order.find({ vendor: vendor.name })
    const completed = orders.filter((order) => order.status === 'completed')
    const pending = orders.filter((order) => order.status === 'accepted' || order.status === 'cooking' || order.status === 'placed')
    const topProducts = productStats.sort((a, b) => b.count - a.count).slice(0, 5)

    return res.json({ status: 0, message: { top: topProducts, orders: orders.length, completed: completed.length, pending: pending.length } })
})

router.get('/batchstats', async (req, res) => {
    if (req.user.type !== 'vendor')
        return res.json({ status: 1, error: "Unauthorised" })

    const vendor = await Vendor.findOne({ email: req.user.email })

    const batches = ['UG1', 'UG2', 'UG3', 'UG4', 'UG5']
    const batchOrders = []
    for (const i in batches) {
        const batch = batches[i]
        const users = await Buyer.find({ batch: batch })
        var total = 0;
        for (const j in users) {
            const user = users[j]
            const orders = await Order.find({ buyer: user.email, vendor: vendor.name })
            total += orders.length
        }
        batchOrders.push(total)
    }

    return res.json({ status: 0, message: batchOrders })
})

router.get('/agestats', async (req, res) => {
    if (req.user.type !== 'vendor')
        return res.json({ status: 1, error: "Unauthorised" })

    const vendor = await Vendor.findOne({ email: req.user.email })

    var ageOrders = {}
    const users = await Buyer.find({})
    for (const i in users) {
        const user = users[i]
        const orders = await Order.find({ buyer: user.email, vendor: vendor.name })
        if (!ageOrders[user.age])
            ageOrders[user.age] = 0
        ageOrders[user.age] += orders.length
    }

    var labels = []
    var data = []

    for (var i = 0; i < 100; i++) {
        if (ageOrders[i]) {
            labels.push(i)
            data.push(ageOrders[i])
        }
    }

    return res.json({ status: 0, message: { labels: labels, data: data } })
})

module.exports = router
