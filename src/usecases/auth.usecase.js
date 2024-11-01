const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('../lib/jwt'); // Asegúrate de que apunta a tu configuración JWT

const login = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new Error('Invalid email or password');
    }

    // Genera el token con la función `sign`
    const token = jwt.sign({ id: user._id });

    return token;
};

module.exports = {
    login
};
