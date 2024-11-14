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
 * @swagger
 * tags:
 *   name: Companies
 *   description: API para la gestión de compañías
 */

/**
 * --------------------------------------
 * Rutas para crear una compañía
 * --------------------------------------
 */
/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Crear una nueva compañía
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico de la compañía
 *                 example: "company@example.com"
 *               password:
 *                 type: string
 *                 description: Contraseña de la compañía
 *                 example: "password123"
 *               companyName:
 *                 type: string
 *                 description: Nombre de la compañía
 *                 example: "AccessGo"
 *               giro:
 *                 type: string
 *                 description: Sector o giro de la compañía
 *                 example: "Tecnología"
 *               diasDeServicio:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Días de servicio de la compañía
 *                 example: ["Lunes", "Martes", "Miércoles"]
 *               address:
 *                 type: string
 *                 description: Dirección de la compañía
 *                 example: "Calle 123, Ciudad, País"
 *               cuenta:
 *                 type: string
 *                 description: Tipo de cuenta de la compañía
 *                 enum: ["free", "premium"]
 *     responses:
 *       201:
 *         description: Compañía creada exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post('/', companyController.createCompany);

/**
 * --------------------------------------
 * Ruta para eliminar una compañía por ID
 * --------------------------------------
 */
/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     summary: Eliminar una compañía por ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la compañía a eliminar
 *     responses:
 *       200:
 *         description: Compañía eliminada exitosamente
 *       404:
 *         description: Compañía no encontrada
 */
router.delete('/:id', companyController.deleteCompany);

/**
 * --------------------------------------
 * Ruta para obtener todas las compañías
 * --------------------------------------
 */
/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Obtener todas las compañías
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: Lista de todas las compañías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 */
router.get('/', companyController.companyAll);

/**
 * --------------------------------------
 * Ruta para actualizar una compañía por ID
 * --------------------------------------
 */
/**
 * @swagger
 * /companies/{id}:
 *   put:
 *     summary: Actualizar una compañía por ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la compañía a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *                 description: Nombre de la compañía
 *                 example: "AccessGo"
 *               giro:
 *                 type: string
 *                 description: Sector o giro de la compañía
 *                 example: "Tecnología"
 *               address:
 *                 type: string
 *                 description: Dirección de la compañía
 *                 example: "Calle 123, Ciudad, País"
 *     responses:
 *       200:
 *         description: Compañía actualizada exitosamente
 *       404:
 *         description: Compañía no encontrada
 */
router.put('/:id', companyController.updateCompany);

/**
 * --------------------------------------
 * Ruta para obtener una compañía por ID
 * --------------------------------------
 */
/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Obtener una compañía por ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la compañía a obtener
 *     responses:
 *       200:
 *         description: Datos de la compañía
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Compañía no encontrada
 */
router.get('/:id', companyController.getCompanyById);

/**
 * --------------------------------------
 * Exportamos el router
 * --------------------------------------
 */
module.exports = router;
