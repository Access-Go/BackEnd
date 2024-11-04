const jsonwebtoken = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

function sign(payload) {
    if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
    return jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

function verify(token) {
    if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
    return jsonwebtoken.verify(token, JWT_SECRET);
}

module.exports = { 
    sign,
    verify,
};
