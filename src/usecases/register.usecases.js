/*
 * -------------------------------------------------------------
 * Importamos el modelo de usuarios y la función de encriptación
 * -------------------------------------------------------------
 */
const register = require('../models/register.model');
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
    if (registerFound.length > 0) throw new Error('El registro con este correo electrónico ya existe');

    // Encripta la contraseña
    const hashedPassword = await bcrypt.hash(registerData.password, saltRounds);

    // Crea un nuevo objeto con la contraseña encriptada y el tipo de usuario
    const secureRegisterData = {
        ...registerData,
        password: hashedPassword,
        tipoUsuario: registerData.type.tipoUsuario // Accedemos a tipoUsuario dentro de type
    };

    // Crea el nuevo usuario con la contraseña encriptada
    const newUser = await register.create(secureRegisterData);

    // Devuelve el nuevo usuario creado (sin la contraseña)
    const { password, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
};

/**
 * Función para actualizar un usuario existente
 * --------------------------------------
 * @param {Object} registerData - Datos del registro a actualizar
 * @returns - Usuario actualizado
 */
const update = async (registerData) => {
    // Busca el usuario existente por su email
    const registerFound = await register.findOne({ email: registerData.email });

    // Si no encuentra el usuario, lanza un error
    if (!registerFound) throw new Error('El registro con este correo electrónico no existe');

    // Si se proporciona una nueva contraseña, encripta la nueva contraseña
    if (registerData.password) {
        registerData.password = await bcrypt.hash(registerData.password, saltRounds);
    }

    // Actualiza los campos del usuario con los datos proporcionados
    const updatedRegisterData = {
        ...registerFound.toObject(),
        ...registerData,
        tipoUsuario: registerData.type?.tipoUsuario || registerFound.tipoUsuario // Accedemos a tipoUsuario dentro de type si existe
    };

    // Actualiza el usuario en la base de datos
    await register.updateOne({ email: registerData.email }, updatedRegisterData);

    // Devuelve el usuario actualizado (sin la contraseña)
    const { password, ...userWithoutPassword } = updatedRegisterData;
    return userWithoutPassword;
};

/**
 * -----------------------------------------
 * Función para obtener un usuario por su ID
 * -----------------------------------------
 * @param {string} id - ID del usuario a obtener
 * @returns - Usuario encontrado por su ID
 */

const getById = async (id) => {
    const user = await register.findById(id);
    return user;
}

/**
 * -----------------------------------------
 * Función para obtener un usuario por su ID
 * -----------------------------------------
 * @param {string} id - ID del usuario a obtener
 * @returns - Usuario encontrado por su ID
 */

const getAll = async () => {
    const user = await register.find();
    return user;
}

/**
 * -----------------------------------------
 * Exportamos las funciones
 * -----------------------------------------
 */
module.exports = { create, getById, getAll };
