/**
 * -----------------------------------------------------------------
 * Controladores para las funciones de registro
 * -----------------------------------------------------------------
 */
const registerUseCase = require('../usecases/register.usecases');

/**
 * -----------------------------------------------------------------
 * Controlador para crear registros
 * -----------------------------------------------------------------
 * @param {Object} request - Objeto de solicitud de Express
 * @param {Object} response - Objeto de respuesta de Express
 */
const createRegister = async (request, response) => {
    try {
        const registerCreated = await registerUseCase.create(request.body);
        response.json({
            success: true,
            data: { register: registerCreated }
        });
    } catch (error) {
        response.status(error.status || 500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * -----------------------------------------------------------------
 * Exportamos los controladores
 * -----------------------------------------------------------------
 */
module.exports = { createRegister };