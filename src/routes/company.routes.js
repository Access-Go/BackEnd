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
 * Rutas para crear una compañía
 * --------------------------------------
 */
router.post('/', companyController.createCompany);

/**
 * --------------------------------------
 * Ruta para buscar una compañía por ID
 * --------------------------------------
 */
router.get('/:id', companyController.companyById);

/**
 * --------------------------------------
 * Ruta para obtener todas las compañías
 * --------------------------------------
 */
router.get('/', companyController.companyAll);

/**
 * --------------------------------------
 * Ruta para actualizar una compañía por ID
 * --------------------------------------
 */
router.put('/:id', companyController.updateCompany);

/**
 * --------------------------------------
 * Exportamos el router
 * --------------------------------------
 */
module.exports = router;