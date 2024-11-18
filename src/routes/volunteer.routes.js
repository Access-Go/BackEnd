/**
 * @swagger
 * tags:
 *   name: Volunteers
 *   description: API para gestionar voluntarios
 */

const express = require('express');
const volunteerController = require('../controllers/volunteer.controller');
const router = express.Router();

/**
 * @swagger
 * /api/volunteers:
 *   post:
 *     summary: Crear un registro de voluntariado
 *     tags: [Volunteers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID del usuario
 *               companyId:
 *                 type: string
 *                 description: ID de la empresa
 *               name:
 *                 type: string
 *                 description: Nombre de la asociación
 *               address:
 *                 type: string
 *                 description: Dirección de la asociación
 *               contact:
 *                 type: string
 *                 description: Contacto de la asociación
 *               activities:
 *                 type: string
 *                 description: Descripción de las actividades
 *     responses:
 *       201:
 *         description: Voluntariado creado con éxito
 *       400:
 *         description: Error en la solicitud
 */
router.post('/', volunteerController.createVolunteer);

/**
 * @swagger
 * /api/volunteers:
 *   get:
 *     summary: Obtener todos los voluntariados
 *     tags: [Volunteers]
 *     responses:
 *       200:
 *         description: Lista de voluntariados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   address:
 *                     type: string
 *                   contact:
 *                     type: string
 *                   activities:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   companyId:
 *                     type: string
 */
router.get('/', volunteerController.getAllVolunteers);

/**
 * @swagger
 * /api/volunteers/company/{companyId}:
 *   get:
 *     summary: Obtener voluntariados de una empresa específica
 *     tags: [Volunteers]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la empresa
 *     responses:
 *       200:
 *         description: Lista de voluntariados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   address:
 *                     type: string
 *                   contact:
 *                     type: string
 *                   activities:
 *                     type: string
 *       404:
 *         description: Empresa no encontrada
 */
router.get('/company/:companyId', volunteerController.getVolunteersByCompany);

/**
 * @swagger
 * /api/volunteers/user/{userId}:
 *   get:
 *     summary: Obtener voluntariados de un usuario específico
 *     tags: [Volunteers]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de voluntariados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   address:
 *                     type: string
 *                   contact:
 *                     type: string
 *                   activities:
 *                     type: string
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/user/:userId', volunteerController.getVolunteersByUser);

/**
 * @swagger
 * /api/volunteers/{id}:
 *   put:
 *     summary: Actualizar un registro de voluntariado
 *     tags: [Volunteers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del voluntariado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               contact:
 *                 type: string
 *               activities:
 *                 type: string
 *     responses:
 *       200:
 *         description: Voluntariado actualizado
 *       404:
 *         description: Voluntariado no encontrado
 */
router.put('/:id', volunteerController.updateVolunteer);

/**
 * @swagger
 * /api/volunteers/{id}:
 *   delete:
 *     summary: Eliminar un voluntariado
 *     tags: [Volunteers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del voluntariado
 *     responses:
 *       200:
 *         description: Voluntariado eliminado exitosamente
 *       404:
 *         description: Voluntariado no encontrado
 */
router.delete('/:id', volunteerController.deleteVolunteer);

module.exports = router;
