/*
 * -------------------------------------------------------------
 * Importamos el modelo de usuarios y la función de encriptación
 * -------------------------------------------------------------
 */

const register = require('../models/register.model')

/**
 * --------------------------------------
 * Función para crear un nuevo usuario
 * --------------------------------------
 * @param {Object} registerData - Datos del registro a crear
 * @returns - Nuevo usuario creado
 */

const create = async (registerData) => {
    // Busca si ya existe un usuario con el mismo email
    const registerFound = await register.find({ email: registerData.email });

    // Si encuentra un usuario, lanza un error
    if (registerFound.length > 0) throw new Error('Register with this email already exists');

    // Corregimos userData por registerData
    const newUser = await register.create(registerData);

    // Devuelve el nuevo usuario creado
    return newUser;
}

/**
 * -----------------------------------------
 * Exportamos las funciones
 * -----------------------------------------
 */

module.exports = { create, getById };