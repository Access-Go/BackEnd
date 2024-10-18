const phoneUseCase = require('../usecases/phone.usecases');

const validatePhone = async (request, response) => {
    try {
        const { phone } = request.body;
        const { isValid, verificationCode, messageSent } = await phoneUseCase.validatePhone(phone);
        response.status(200).json({
            success: true,
            isValid: isValid,
            message: isValid 
                ? messageSent 
                    ? `Número válido. Se ha enviado un mensaje de WhatsApp con el código: ${verificationCode}` 
                    : `Número válido, pero hubo un problema al enviar el mensaje de WhatsApp.`
                : 'Número no válido.',
            verificationCode: isValid ? verificationCode : null
        });
    } catch (error) {
        response.status(400).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = { validatePhone };
