const User = require('../models/user.model');
const Company = require('../models/company.model');
const bcrypt = require('bcrypt');
const jwt = require('../lib/jwt');

const login = async (email, password) => {
    const user = await User.findOne({ email });
    const company = await Company.findOne({ email });

    if (!user && !company) {
        throw new Error('Invalid email or password');
    }

    let isPasswordCorrect = false;
    let id = null;
    let type = null;
    let cuenta = null; // Variable para almacenar el tipo de cuenta si es una compañía


    if (user) {
        isPasswordCorrect = await bcrypt.compare(password, user.password);
        id = user._id;
        type = user.type;
    } else if (company) {
        isPasswordCorrect = await bcrypt.compare(password, company.password);
        id = company._id;
        type = company.type;

        cuenta = company.cuenta; // Obtener el tipo de cuenta (free o premium)

    }

    if (!isPasswordCorrect) {
        throw new Error('Invalid email or password');
    }

    // Incluir el campo `cuenta` en el token si es una compañía
    const token = jwt.sign({ id, type, cuenta });

    // Devolver un objeto con el token, type, id, y cuenta (si es una compañía)
    return { token, type, id, cuenta };

};

module.exports = {
    login
};
