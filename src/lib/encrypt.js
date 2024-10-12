
const bcrypt = require("bcryptjs")

const SALT_ROUNDS = 10 

function encrypt(text) {
    return bcrypt.hash(text, SALT_ROUNDS)

}

function compare(plainText, hash) {
    return bcrypt.compare(plainText, hash)
}

module.exports  = {
    encrypt,
    compare,
}