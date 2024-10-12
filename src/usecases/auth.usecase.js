const createError = require("http-errors")
const Users = require("../models/users.model")
const jwt = require("../lib/jwt")
const encrypt = require("../lib/encrypt")

async function login (email, password) {
    const user = await Users.findOne({ email: email})

    if(!user) {
        throw createError(401, "Invalid data")
    }

    const isPasswordValid = await encrypt.compare(password, user.password)

    if(!isPasswordValid) {
        throw createError(401, "Invalid data")
    }

    const token = jwt.sign({ id: user._id })
    return token
}

module.exports = {
    login,
}