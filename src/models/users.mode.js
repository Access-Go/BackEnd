const mongoose = require("mongoose")

const modelName = "users"

const schema = new mongoose.Schema({
    profilePicture: {
        type: String,
        required: true,
        maxLength: 100,
    },
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 100,
    },
    lastName: {
        type: String,
        required: false,
        maxLength: 100,
    },
    email: {
        type: String,
        required: true,
        match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    },
    password: {
        type: String,
        required: true,
    },
    birthDate: {
        type: Date,
        required: false,
    },
    cratedAt: {
        type: Date,
        default: Date.now,
    },
})


module.exports = mongoose.model(modelName, schema)