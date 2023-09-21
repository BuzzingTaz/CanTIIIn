const mongoose = require("mongoose")
const Schema = mongoose.Schema

// User schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
    },
    number: {
        type: String,
        minLength: 10,
        maxLength: 10
    },
    type: {
        type: String,
        enum: ["buyer", "vendor"],
    }
})

module.exports = User = mongoose.model("Users", UserSchema)
