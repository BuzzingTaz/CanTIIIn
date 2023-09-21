var mongoose = require("mongoose")
var Schema = mongoose.Schema

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    vendor: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
    rating: {
            count: { type: Number, default: 0 },
            total: { type: Number, default: 0 }
    },
    isnv: {
        type: Boolean,
        required: true
    },
    addons: [{
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    tags: {
        type: [String],
        uppercase: true
    }
})

module.exports  = Product = mongoose.model("Products", ProductSchema)
