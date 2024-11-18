/**
 * -----------------------------------------------------------------
 * Controladores para las funciones de voluntariado
 * -----------------------------------------------------------------
 */
const Volunteer = require('../models/volunteer.model');

/**
 * Crea un nuevo registro de voluntariado
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const createVolunteer = async (req, res) => {
    try {
        const { userId, companyId, name, address, contact, activities } = req.body;
        const newVolunteer = await Volunteer.create({ userId, companyId, name, address, contact, activities });
        res.status(201).json({ success: true, data: newVolunteer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Obtiene todos los voluntariados
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const getAllVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.find()
            .populate('userId', 'firstName lastName') 
            .populate('companyId', 'companyName');
        res.status(200).json({ success: true, data: volunteers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Obtiene los voluntariados por empresa
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const getVolunteersByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const volunteers = await Volunteer.find({ companyId })
            .populate('userId', 'firstName lastName');
        res.status(200).json({ success: true, data: volunteers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Obtiene los voluntariados por usuario
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const getVolunteersByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const volunteers = await Volunteer.find({ userId })
            .populate('companyId', 'companyName');
        res.status(200).json({ success: true, data: volunteers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Actualiza un voluntariado por su ID
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const updateVolunteer = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedVolunteer = await Volunteer.findByIdAndUpdate(id, req.body, {
            new: true, 
            runValidators: true,
        });
        if (!updatedVolunteer) {
            return res.status(404).json({ success: false, message: 'Voluntariado no encontrado' });
        }
        res.status(200).json({ success: true, data: updatedVolunteer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Elimina un voluntariado por su ID
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const deleteVolunteer = async (req, res) => {
    try {
        const { id } = req.params;
        await Volunteer.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Voluntariado eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    createVolunteer,
    getAllVolunteers,
    getVolunteersByCompany,
    getVolunteersByUser,
    updateVolunteer,
    deleteVolunteer,
};
