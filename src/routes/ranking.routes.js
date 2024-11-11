const express = require('express');
const rankingController = require('../controllers/ranking.controller');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Rankings
 *   description: API para la gestión de calificaciones
 */

/**
 * @swagger
 * /api/rankings:
 *   post:
 *     summary: Crear una nueva calificación
 *     tags: [Rankings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessId:
 *                 type: string
 *               userId:
 *                 type: string
 *               stars:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       '201':
 *         description: Calificación creada exitosamente
 */
router.post('/', rankingController.createRanking);

/**
 * @swagger
 * /api/rankings/business/{businessId}:
 *   get:
 *     summary: Obtener todas las calificaciones de un negocio
 *     tags: [Rankings]
 *     parameters:
 *       - in: path
 *         name: businessId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del negocio
 *     responses:
 *       '200':
 *         description: Lista de calificaciones del negocio
 */
router.get('/business/:businessId', rankingController.getRankingsByBusiness);

/**
 * @swagger
 * /api/rankings/business/{businessId}/average:
 *   get:
 *     summary: Obtener la calificación promedio de un negocio
 *     tags: [Rankings]
 *     parameters:
 *       - in: path
 *         name: businessId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del negocio
 *     responses:
 *       '200':
 *         description: Calificación promedio del negocio
 */
router.get('/business/:businessId/average', rankingController.getAverageRankingByBusiness);

module.exports = router;
