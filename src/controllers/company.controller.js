/**
 * -----------------------------------------------------------------
 * Controladores para las funciones de registro
 * -----------------------------------------------------------------
 */
const companyUseCase = require('../usecases/company.usecases');

/**
 * -----------------------------------------------------------------
 * Controlador para crear registros
 * -----------------------------------------------------------------
 * @param {Object} request - Objeto de solicitud de Express
 * @param {Object} response - Objeto de respuesta de Express
 */
const createCompany = async (request, response) => {
    try {
        const registerCreated = await companyUseCase.create(request.body);
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
const companyById = async (request, response) => {
    try {
        const { id } = request.params;
        const company = await companyUseCase.getById(id);

        if (!company) {
            response.status(404).json({
                success: false,
                error: 'Company not found'
            });
            return;
        }

        response.json({
            success: true,
            data: { company }
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

const companyAll = async (request, response) => {
    try {
        const company = await companyUseCase.getAll();

        if (!company) {
            response.status(404).json({
                success: false,
                error: 'Compañia no encontrado'
            });
            return;
        }

        response.json({
            success: true,
            data: { company }
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
module.exports = { createCompany, companyById, companyAll };
