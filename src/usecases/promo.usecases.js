const Promo = require('../models/promo.model');

/**
 * Crea una nueva promoción
 * @param {Object} promoData - Datos de la promoción a crear
 * @returns {Object} - Promoción creada
 */
const create = async (promoData) => {
    const newPromo = await Promo.create(promoData);
    return newPromo;
};

/**
 * Obtiene una promoción por su ID
 * @param {string} id - ID de la promoción
 * @returns {Object} - Promoción encontrada
 */
const getById = async (id) => {
    const promo = await Promo.findById(id);
    if (!promo) throw new Error('Promo not found');
    return promo;
};

/**
 * Obtiene todas las promociones de un negocio específico
 * @param {string} businessId - ID del negocio
 * @returns {Array} - Lista de promociones del negocio
 */
const getByBusiness = async (businessId) => {
    const promos = await Promo.find({ businessId });
    return promos;
};

/**
 * Actualiza una promoción por su ID
 * @param {string} id - ID de la promoción
 * @param {Object} updateData - Datos a actualizar
 * @returns {Object} - Promoción actualizada
 */
const update = async (id, updateData) => {
    const updatedPromo = await Promo.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedPromo) throw new Error('Promo not found');
    return updatedPromo;
};

/**
 * Elimina una promoción por su ID
 * @param {string} id - ID de la promoción
 */
const deleteById = async (id) => {
    const deletedPromo = await Promo.findByIdAndDelete(id);
    if (!deletedPromo) throw new Error('Promo not found');
    return deletedPromo;
};

module.exports = { create, getById, getByBusiness, update, deleteById };
