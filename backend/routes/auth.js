var express = require("express")
var router = express.Router()
var jwt = require("jsonwebtoken") 
var bcrypt = require("bcrypt")
const { DateTime } = require("luxon")

const User = require("../models/users")
const { Buyer, Vendor} = require("../models/types")
const { AUTH_SECRET } = require("../utils/config")

const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

router.post("/login", async(req, res) => {
    var body = req.body

    const user = await User.findOne({ email: body.email })
    if (!user) {
        return res.status(200).json({
            status: 1,
            error : "Email not registered"
        })
    }

    if (!(await bcrypt.compare(body.password, user.password))) {
        return res.status(200).json({
            status: 1,
            error : "Incorrect login credentials"
        })
    }

    const tokenMap = {
        email: user.email,
        type: user.type
    }

    const token = jwt.sign(tokenMap, AUTH_SECRET)

    res.status(200).json({
        status: 0,
        token: token
    })
})

router.post("/google", async (req, res) => {
    const token = req.body.token
    
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    })

    const { email } = ticket.getPayload()

    const user = await User.findOne({ email: email })
    if (!user) {
        return res.status(200).json({
            status: 1,
            error : "Email not registered"
        })
    } 

    const tokenMap = {
        email: user.email,
        type: user.type
    }

    const authToken = jwt.sign(tokenMap, AUTH_SECRET)

    res.status(200).json({
        status: 0,
        token: authToken
    })
})

router.post("/register", async (req, res) => {
    const body = req.body

    const saltRounds = 10
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    const password = await bcrypt.hash(body.password, saltRounds)

    if (body.number.length != 10) {
        return res.status(200).json({
            status: 1,
            error : "Invalid phone number"
        })
    }
    else if (body.password.length < 8) {
        return res.status(200).json({
            status: 1,
            error : "Password must be at least 8 characters"
        })
    }
    else if (body.name.length < 3) {
        return res.status(200).json({
            status: 1,
            error : "Name must be at least 3 characters"
        })
    }
    else if (!emailRegexp.test(body.email)) {
        return res.status(200).json({
            status: 1,
            error: "Invalid email"
        })
    }
    else if (body.type != "buyer" && body.type != "vendor") {
        return res.status(200).json({
            status: 1,
            error: "Invalid user type"
        })
    }

    var user = await User.findOne({ email: body.email })
    if (user) {
        return res.status(200).json({
            status: 1,
            error: "Email already registered"
        })
    }

    user = new User({
        name: body.name,
        email: body.email,
        password: password,
        number: body.number,
        type: body.type
    })

    var profile

    if (body.type == "buyer") {
        if (body.age < 18 || body.age > 100) {
            return res.status(200).json({
                status: 1,
                error: "Invalid age"
            })
        }
        else if (body.batch != "UG1" && body.batch != "UG2" && body.batch != "UG3" && body.batch != "UG4" && body.batch != "UG5") {
            return res.status(200).json({
                status: 1,
                error: "Invalid batch"
            })
        }

        profile = new Buyer({
            email: body.email,
            age: body.age,
            batch: body.batch
        })
    } else {
        const shop = await Vendor.findOne({ name: body.shopname })
        if (shop) {
            return res.status(200).json({
                status: 1,
                error: "Shop name already registered"
            })
        }

        var opening = DateTime.fromISO(body.opening).toLocaleString(DateTime.TIME_24_SIMPLE)
        var closing = DateTime.fromISO(body.closing).toLocaleString(DateTime.TIME_24_SIMPLE)

        if (body.shopname == null)
            return res.status(200).json({
                status: 1,
                error: "Shop name cannot be empty"
            })

        if (body.opening === null || body.closing === null) {
            return res.status(200).json({
                status: 1,
                error: "Invalid opening and closing time"
            })
        }

        profile = new Vendor({
            name: body.shopname,
            opening: opening,
            closing: closing
        })
    }


    await user.save()
    await profile.save()

    res.status(200).json({
        status: 0,
        message: "Registration successful"
    })
})

module.exports = router