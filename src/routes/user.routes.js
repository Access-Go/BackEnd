/**
 * --------------------------------------
 * Importamos las dependencias necesarias
 * --------------------------------------
 */
const express = require('express');
const userController = require('../controllers/user.controller');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

/**
 * --------------------------------------
 * Creamos el router de Express
 * --------------------------------------
 */
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API para la gestión de usuarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         profilePicture:
 *           type: string
 *           description: URL de la imagen de perfil del usuario
 *         firstName:
 *           type: string
 *           description: Nombre del usuario
 *         lastName:
 *           type: string
 *           description: Apellido del usuario
 *         email:
 *           type: string
 *           description: Correo electrónico del usuario
 *           format: email
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *         type:
 *           type: string
 *           description: Tipo de usuario
 *           enum: ["user"]
 *         biography:
 *           type: string
 *           description: Biografía del usuario
 *         birthDate:
 *           type: string
 *           description: Fecha de nacimiento del usuario
 *           format: date
 *         aboutMe:
 *           type: string
 *           description: Información adicional sobre el usuario
 *         verified:
 *           type: boolean
 *           description: Estado de verificación del usuario
 */

/**
 * --------------------------------------
 * Rutas para crear un usuario
 * --------------------------------------
 */
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post('/', userController.createUser);

/**
 * --------------------------------------
 * Ruta para obtener un usuario por ID
 * --------------------------------------
 */
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Información del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', userController.userById);

/**
 * --------------------------------------
 * Ruta para obtener todos los usuarios
 * --------------------------------------
 */
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de todos los usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Error en el servidor
 */
router.get('/', userController.getAllUsers);

/**
 * --------------------------------------
 * Ruta para actualizar un usuario por ID
 * --------------------------------------
 */
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualizar un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:id', userController.updateUser);

/**
 * --------------------------------------
 * Ruta para eliminar un usuario por ID
 * --------------------------------------
 */
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/:id', userController.deleteUser);

/**
 * --------------------------------------
 * Ruta para obtener el usuario con sus compañías
 * --------------------------------------
 */
/**
 * @swagger
 * /users/{userId}/companies:
 *   get:
 *     summary: Obtener un usuario con sus compañías
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de compañías del usuario
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:userId/companies', userController.getUserCompanies);

/**
 * --------------------------------------
 * Exportamos el router
 * --------------------------------------
 */
module.exports = router;
