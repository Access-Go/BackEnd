/*
 * -------------------------------------------------------------
 * Importamos el modelo de compañías
 * -------------------------------------------------------------
 */
const Company = require('../models/company.model');
const Ranking = require('../models/ranking.model');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * --------------------------------------
 * Función para crear una nueva compañía
 * --------------------------------------
 * @param {Object} companyData - Datos de la compañía a crear
 * @returns - Nueva compañía creada
 */
const create = async (companyData) => {
    // Verifica si existe una compañía con el mismo email
    const companyFound = await Company.findOne({ email: companyData.email });
    if (companyFound) throw new Error('La compañía con este correo electrónico ya existe');

    // Encripta la contraseña
    if (companyData.password) {
        companyData.password = await bcrypt.hash(companyData.password, saltRounds);
    }

    const newCompany = new Company(companyData);
    await newCompany.save();

    // Excluir el campo `password` en la respuesta
    const { password, ...companyWithoutPassword } = newCompany.toObject();
    return companyWithoutPassword;
};

/**
 * -----------------------------------------
 * Función para obtener una compañía por su ID
 * -----------------------------------------
 * @param {string} id - ID de la compañía a obtener
 * @returns - Compañía encontrada por su ID
 */
const getById = async (id) => {
    const company = await Company.findById(id).select('-password');
    return company;
}

/**
 * --------------------------------------
 * Función para actualizar una compañía
 * --------------------------------------
 * @param {string} id - ID de la compañía a actualizar
 * @param {Object} updateData - Datos de la compañía a actualizar
 * @returns - Compañía actualizada sin campo `password`
 */
const update = async (id, updateData) => {
    if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }
    const updatedCompany = await Company.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    if (!updatedCompany) throw new Error('Company not found');
    return updatedCompany;
};

/**
 * --------------------------------------
 * Función para actualizar el rating de una compañía
 * --------------------------------------
 * @param {string} id - ID de la compañía a actualizar
 * @param {Object} updateData - Datos de la compañía a actualizar
 * @returns - Compañía actualizada sin campo `password`
 */
const updateCompanyRating = async (businessId) => {
    const ratings = await Ranking.find({ businessId });
    const totalRatings = ratings.length;
    const sumOfRatings = ratings.reduce((sum, rating) => sum + rating.stars, 0);
    const averageRating = totalRatings > 0 ? (sumOfRatings / totalRatings).toFixed(2) : 0;

    await Company.findByIdAndUpdate(businessId, { averageRating });
};

/**
 * -----------------------------------------
 * Función para obtener todas las compañías
 * -----------------------------------------
 * @returns - Lista de todas las compañías
 */
const getAll = async () => {
    const companies = await Company.find().select('-password');
    return companies;
}

/**
 * -----------------------------------------
 * Función para eliminar una compañía por su ID
 * -----------------------------------------
 * @param {string} id - ID de la compañía a eliminar
 * @returns - Mensaje de éxito si se elimina la compañía
 */

const removeCompany = async (id) => {
    const deletedCompany = await Company.findByIdAndDelete(id);
    if (!deletedCompany) throw new Error('Company not found');
    return { message: 'Company successfully deleted' };
};

/**
 * -----------------------------------------
 * Exportamos las funciones
 * -----------------------------------------
 */
module.exports = { create, getById, getAll, update, removeCompany, updateCompanyRating };
