/* Importamos las dependencias necesarias
 * --------------------------------------
 */
const express = require('express');
const userController = require('../controllers/user.controller');

/**
 * --------------------------------------
 * Creamos el router de Express
 * --------------------------------------
 */
const router = express.Router();

/**
 * --------------------------------------
 * Rutas para crear un usuario
 * --------------------------------------
 */
router.post('/', userController.createUser);

/**
 * --------------------------------------
 * Ruta para obtener un usuario por ID
 * --------------------------------------
 */
router.get('/:id', userController.userById);

/**
 * --------------------------------------
 * Ruta para obtener todos los usuarios
 * --------------------------------------
 */
router.get('/', userController.getAllUsers);

/**
 * --------------------------------------
 * Ruta para actualizar un usuario por ID
 * --------------------------------------
 */
router.put('/:id', userController.updateUser);

/**
 * --------------------------------------
 * Ruta para eliminar un usuario por ID
 * --------------------------------------
 */
router.delete('/:id', userController.deleteUser);


// Define una ruta para obtener el usuario con su compañía

router.get('/:userId/companies', userController.getUserCompanies);


/**
 * --------------------------------------
 * Exportamos el router
 * --------------------------------------
 */
module.exports = router;