/**
 * -----------------------------------------------------------------
 * Controladores para las funciones de registro
 * -----------------------------------------------------------------
 */
const Comment = require('../models/comment.model');

/**
 * Crea un nuevo comentario
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const createComment = async (req, res) => {
    try {
        const { businessId, userId, content } = req.body;
        const newComment = await Comment.create({ businessId, userId, content });
        res.status(201).json({ success: true, data: newComment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Obtiene los comentarios por negocio
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const getCommentsByBusiness = async (req, res) => {
    try {
        const { businessId } = req.params;
        const comments = await Comment.find({ businessId }).populate('userId', 'firstName lastName');
        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Obtiene los comentarios por usuario
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const getCommentsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const comments = await Comment.find({ userId }).populate('businessId', 'companyName');
        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Elimina un comentario por su ID
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        await Comment.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { createComment, getCommentsByBusiness, getCommentsByUser, deleteComment };