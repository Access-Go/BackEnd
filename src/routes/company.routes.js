/**
 * --------------------------------------
 * Importamos las dependencias necesarias
 * --------------------------------------
 */
const express = require('express');
const companyController = require('../controllers/company.controller');

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

router.post('/register', companyController.createCompany);

/**
 * --------------------------------------
 * Rutas buscar usuario por id
 * --------------------------------------
 */
router.get('/:id', companyController.companyById);

/**
 * --------------------------------------
 * Rutas buscar todos los registros
 * --------------------------------------
 */

router.get('/', companyController.companyAll);

console.log('Company de registro cargadas');
/**
 * --------------------------------------
 * Exportamos el router
 * --------------------------------------
 */
module.exports = router;