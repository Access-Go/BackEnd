/**
 * -----------------------------------------------------------------
 * Controladores para las funciones de registro
 * -----------------------------------------------------------------
 */
const registerUseCase = require('../usecases/register.usecases');
const fs = require('fs');

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
 * Controlador para buscar registro por Id
 * -----------------------------------------------------------------
 * @param {Object} request - Objeto de solicitud de Express
 * @param {Object} response - Objeto de respuesta de Express
 */
const registerById = async (request, response) => {
    try {
        const { id } = request.params;
        const user = await registerUseCase.getById(id);

        if (!user) {
            response.status(404).json({
                success: false,
                error: 'User not found'
            });
            return;
        }

        response.json({
            success: true,
            data: { user }
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
 * @param {Object} request - Objeto de solicitud de Express
 * @param {Object} response - Objeto de respuesta de Express
 */

const registerAll = async (request, response) => {
    try {
        const user = await registerUseCase.getAll();

        if (!user) {
            response.status(404).json({
                success: false,
                error: 'Usiauario no encontrado'
            });
            return;
        }

        response.json({
            success: true,
            data: { user }
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
module.exports = { createRegister, registerById, registerAll };
