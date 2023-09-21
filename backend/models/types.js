const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Buyer schema
const BuyerSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true,
        max: 100
    },
    batch: {
        type: String,
        required: true,
        enum: ["UG1", "UG2", "UG3", "UG4", "UG5"]
    },
    wallet: {
        type: Number,
        default: 0
    },
    favourites: [{
        type: Schema.Types.ObjectId,
        ref: "Product"
    }]
})

const VendorSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    opening: {
        type: String,
        required: true,
    },
    closing: {
        type: String,
        required: true,
    }
})

const Buyer = mongoose.model('Buyer', BuyerSchema)
const Vendor = mongoose.model('Vendor', VendorSchema)

module.exports = { Buyer, Vendor }
