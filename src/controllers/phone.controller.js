const phoneUseCase = require('../usecases/phone.usecases');

const validatePhone = async (request, response) => {
    try {
        const { phone } = request.body;
        const isValid = await phoneUseCase.validatePhone(phone);
        response.status(200).json({
            success: true,
            isValid: isValid
        });
    } catch (error) {
        response.status(400).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = { validatePhone };