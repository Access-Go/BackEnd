/**
 * --------------------------------------
 * Importamos las dependencias necesarias
 * --------------------------------------
 */
const express = require('express');
const registerController = require('../controllers/register.controller');

/**
 * --------------------------------------
 * Creamos el router de Express
 * --------------------------------------
 */
const router = express.Router();

/**
 * --------------------------------------
 * Rutas crear usuario
 * --------------------------------------
 */

router.post('/register', registerController.createRegister);

/**
 * --------------------------------------
 * Rutas buscar usuario por id
 * --------------------------------------
 */
router.get('/:id', registerController.registerById);

/**
 * --------------------------------------
 * Rutas buscar todos los registros
 * --------------------------------------
 */

router.get('/', registerController.registerAll);

console.log('Rutas de registro cargadas');
/**
 * --------------------------------------
 * Exportamos el router
 * --------------------------------------
 */
module.exports = router;