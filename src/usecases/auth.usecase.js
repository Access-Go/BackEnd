const createError = require("http-errors")
const Users = require("../models/register.model")
const jwt = require("../lib/jwt")
const encrypt = require("../lib/encrypt")

// const login = async (email, password) => {
//     const user = await users.findOne({ email: email });

//     if (!user) throw new createError(401, 'Invalid email or password');

//     const isValidPassword = await encrypt.compare(password, user.password);

//     if (!isValidPassword) throw new createError(401, 'Invalid email or password');

//     const token = jwt.sign({ id: user.id });

//     return token;
//}
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
    // return isPasswordValid
    return token
}

module.exports = { login }