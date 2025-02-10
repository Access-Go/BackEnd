
/* -----------------------------------------------------------------
 * Controladores para las funciones de registro
 * -----------------------------------------------------------------
 */
const companyUseCase = require('../usecases/company.usecases');
const RegisteredEmail = require('../models/registeredEmail.model.js');

const bcrypt = require('bcrypt');

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
        const companyCreated = await companyUseCase.create(request.body);
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

const updateCompanyRating = async (request, response) => {
    try {
        const { businessId } = request.params;
        await companyUseCase.updateCompanyRating(businessId);

        response.json({
            success: true,
            message: 'Company rating updated successfully'
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
        const deletedCompany = await companyUseCase.removeCompany(req.params.id);
        if (!deletedCompany) return res.status(404).json({ success: false, error: 'Company not found' });

        res.json({ success: true, message: 'Company deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * -----------------------------------------------------------------
 * Obtener compañía por ID
 * -----------------------------------------------------------------
 * @param {Object} request - Objeto de solicitud de Express
 * @param {Object} response - Objeto de respuesta de Express
 */
const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await companyUseCase.getById(id);

        if (!company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        res.json({
            success: true,
            data: { company }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const getCompanyByEmailHandler = async (req, res) => {
    try {
        const { email } = req.body;

        // Validar que el correo esté en el cuerpo de la solicitud
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere un correo electrónico válido',
            });
        }

        // Buscar el usuario por su correo
        const company = await companyUseCase.getCompanyByEmail(email);

        return res.status(200).json({
            success: true,
            data: { company },
        });
    } catch (error) {
        const statusCode = error.message.includes('No se encontró') ? 404 : 500;
        return res.status(statusCode).json({
            success: false,
            error: error.message,
        });
    }
};


/**
 * Cambiar la contraseña del usuario
 * @param {String} id - ID del usuario
 * @param {String} newPassword - Nueva contraseña proporcionada por el usuario
 */
const changePassword = async (req, res) => {
    const { id } = req.params; // ID del usuario
    const { newPassword } = req.body; // Nueva contraseña

    try {
        // Buscar al usuario por ID
        const user = await companyUseCase.getById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Validar la nueva contraseña (ejemplo: mínimo 6 caracteres)
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres' });
        }

        // Hash de la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * -----------------------------------------------------------------
 * Exportamos los controladores
 * -----------------------------------------------------------------
 */

module.exports = { createCompany, deleteCompany, companyAll, updateCompany, getCompanyById, updateCompanyRating, getCompanyByEmailHandler, changePassword };