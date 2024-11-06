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

    if (user) {
        isPasswordCorrect = await bcrypt.compare(password, user.password);
        id = user._id;
        type = user.type;
    } else if (company) {
        isPasswordCorrect = await bcrypt.compare(password, company.password);
        id = company._id;
        type = company.type;
    }

    if (!isPasswordCorrect) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ id, type });
    return token;
};

module.exports = {
    login
};
