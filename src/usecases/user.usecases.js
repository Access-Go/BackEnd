/*
 * -------------------------------------------------------------
 * Importamos el modelo de usuarios y la función de encriptación
 * -------------------------------------------------------------
 */
const user = require('../models/user.model');
const bcrypt = require('bcrypt');

const saltRounds = 10; // Número de rondas de salt para bcrypt

/**
 * --------------------------------------
 * Función para crear un nuevo usuario
 * --------------------------------------
 * @param {Object} userData - Datos del usuario a crear
 * @returns - Nuevo usuario creado
 */
const create = async (userData) => {
    // Verifica si el usuario ya existe
    const userFound = await user.find({ email: userData.email });

    if (userFound.length > 0) throw new Error('El usuario con este correo electrónico ya existe');

    // Encripta la contraseña
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Crea un nuevo objeto con la contraseña encriptada
    const secureUserData = {
        ...userData,
        password: hashedPassword,
    };

    // Crea el nuevo usuario con la contraseña encriptada
    const newUser = await user.create(secureUserData);

    // Devuelve el nuevo usuario creado (sin la contraseña)
    const { password, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
};

/**
 * --------------------------------------
 * Función para actualizar un usuario existente
 * --------------------------------------
 * @param {string} id - ID del usuario a actualizar
 * @param {Object} userData - Datos del usuario a actualizar
 * @returns - Usuario actualizado
 */
const update = async (id, userData) => {
    const userFound = await user.findById(id);

    if (!userFound) throw new Error('El usuario con este ID no existe');

    // Si se proporciona una nueva contraseña, encripta la nueva contraseña
    if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, saltRounds);
    }

    // Actualiza los campos del usuario
    const updatedUserData = {
        ...userFound.toObject(),
        ...userData,
    };

    // Actualiza el usuario en la base de datos
    await user.updateOne({ _id: id }, updatedUserData);

    // Devuelve el usuario actualizado (sin la contraseña)
    const { password, ...userWithoutPassword } = updatedUserData;
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
    const userFound = await user.findById(id);
    return userFound;
};

/**
 * -----------------------------------------
 * Función para obtener todos los usuarios
 * -----------------------------------------
 * @returns - Lista de todos los usuarios
 */
const getAll = async () => {
    const users = await user.find();
    return users;
};

/**
 * -----------------------------------------
 * Función para eliminar un usuario por su ID
 * -----------------------------------------
 * @param {string} id - ID del usuario a eliminar
 * @returns - Confirmación de eliminación
 */
const deleteUser = async (id) => {
    const userFound = await user.findById(id);

    if (!userFound) throw new Error('El usuario con este ID no existe');

    await user.deleteOne({ _id: id });
    return { message: 'Usuario eliminado correctamente' };
};

/**
 * -----------------------------------------
 * Exportamos las funciones
 * -----------------------------------------
 */
module.exports = { create, update, getById, getAll, deleteUser };
