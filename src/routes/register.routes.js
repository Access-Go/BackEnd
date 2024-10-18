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

console.log('Rutas de registro cargadas');
/**
 * --------------------------------------
 * Exportamos el router
 * --------------------------------------
 */
module.exports = router;