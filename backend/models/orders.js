const mongoose = require("mongoose")
const Schema = mongoose.Schema

const OrderSchema = new Schema({
    buyer: {
        type: String,
        required: true
    },
    vendor: {
        type : String, 
        required: true
    },
    item: {
        id : {type: mongoose.Types.ObjectId, ref: "Product", required: true},
        name: { type: String, required: true },
        price: { type: Number, required: true },
        addon: [{
            name: { type: String, required: true },
            price: { type: Number, required: true }
        }],
    },
    quantity: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["placed", "accepted", "cooking", "pickup", "completed", "rejected"],
        default: "placed"
    },
    total: {
        type: Number,
        required: true,
        min: 1
    },
    placedTime: {
        type: Date,
        default: Date.now
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    }

})

module.exports = Order = mongoose.model("Orders", OrderSchema)
