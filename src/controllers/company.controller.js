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
        const { email } = request.body;

        // Busca el correo en `RegisteredEmails`
        const emailExists = await RegisteredEmail.findOne({ email });
        if (emailExists) {
            return response.status(400).json({
                success: false,
                message: 'El correo ya está registrado.'
            });
        }

        // Crea la compañía y añade el correo a `RegisteredEmails`
        const companyCreated = await Company.create(request.body);
        await RegisteredEmail.create({ email });
        
        response.json({
            success: true,
            data: { company: companyCreated }
        });
    } catch (error) {
        response.status(500).json({
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
        const companies = await companyUseCase.getAll();

        if (!companies || companies.length === 0) {
            response.status(404).json({
                success: false,
                error: 'No companies found'
            });
            return;
        }

        response.json({
            success: true,
            data: { companies }
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
 * Controlador para actualizar una compañía
 * -----------------------------------------------------------------
 * @param {Object} request - Objeto de solicitud de Express
 * @param {Object} response - Objeto de respuesta de Express
 */
const updateCompany = async (request, response) => {
    try {
        const { id } = request.params;
        const updatedCompany = await companyUseCase.update(id, request.body);

        if (!updatedCompany) {
            response.status(404).json({
                success: false,
                error: 'Company not found'
            });
            return;
        }

        response.json({
            success: true,
            data: { company: updatedCompany }
        });
    } catch (error) {
        response.status(error.status || 500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * Eliminar compañía por ID
 */
const deleteCompany = async (req, res) => {
    try {
        const deletedCompany = await Company.findByIdAndDelete(req.params.id);
        if (!deletedCompany) return res.status(404).json({ success: false, error: 'Company not found' });

        res.json({ success: true, message: 'Company deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * -----------------------------------------------------------------
 * Exportamos los controladores
 * -----------------------------------------------------------------
 */
module.exports = { createCompany, deleteCompany, companyAll, updateCompany };
