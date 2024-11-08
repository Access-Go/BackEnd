/**
 * --------------------------------------
 * Importamos las dependencias necesarias
 * --------------------------------------
 */
const express = require('express');
const commentController = require('../controllers/comment.controller');
const router = express.Router();

// Ruta para crear un comentario
router.post('/', commentController.createComment);

// Ruta para obtener todos los comentarios de un negocio específico
router.get('/company/:companyId', commentController.getCommentsByBusiness);

// Ruta para obtener todos los comentarios de un usuario específico
router.get('/user/:userId', commentController.getCommentsByUser);

// Ruta para eliminar un comentario por ID
router.delete('/:id', commentController.deleteComment);

module.exports = router;
