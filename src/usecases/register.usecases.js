/*
 * -------------------------------------------------------------
 * Importamos el modelo de usuarios y la función de encriptación
 * -------------------------------------------------------------
 */

const register = require('../models/register.model')
const bcrypt = require('bcrypt');

const saltRounds = 10; // Número de rondas de salt para bcrypt

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

    // Encripta la contraseña
    const hashedPassword = await bcrypt.hash(registerData.password, saltRounds);

    // Crea un nuevo objeto con la contraseña encriptada
    const secureRegisterData = {
        ...registerData,
        password: hashedPassword
    };

    // Crea el nuevo usuario con la contraseña encriptada
    const newUser = await register.create(secureRegisterData);

    // Devuelve el nuevo usuario creado (sin la contraseña)
    const { password, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
}

/**
 * -----------------------------------------
 * Exportamos las funciones
 * -----------------------------------------
 */

module.exports = { create };
