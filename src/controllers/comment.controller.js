const Comment = require('../models/comment.model');
const mongoose = require('mongoose');


/**
 * Crea un nuevo comentario
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const createComment = async (req, res) => {
    try {
        const { businessId, userId, content, rankingId } = req.body;

        // Validar campos obligatorios
        if (!businessId || !userId || !content) {
            return res.status(400).json({ success: false, message: 'Faltan campos obligatorios.' });
        }

        // Crear el comentario
        const newComment = await Comment.create({ businessId, userId, content, rankingId });

        // Popular los datos del ranking (opcional si deseas más detalles sobre el ranking)
        const populatedComment = await Comment.findById(newComment._id).populate('rankingId', 'stars');

        res.status(201).json({ success: true, data: populatedComment });
    } catch (error) {
        console.error('Error al crear comentario:', error);
        res.status(500).json({ success: false, message: 'Error al crear comentario.', error: error.message });
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

        // Validar businessId
        if (!businessId) {
            return res.status(400).json({ success: false, message: 'El ID del negocio es requerido.' });
        }

        const comments = await Comment.find({ businessId })
            .populate('rankingId', 'stars')
            .populate('userId', 'firstName profilePicture');

        if (!comments || comments.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron comentarios para este negocio.' });
        }

        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        res.status(500).json({ success: false, message: 'Error al obtener los comentarios.', error: error.message });
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

        // Validar userId
        if (!userId) {
            return res.status(400).json({ success: false, message: 'El ID del usuario es requerido.' });
        }

        const comments = await Comment.find({ userId })
            .populate('businessId', 'companyName')
            .populate('rankingId', 'stars');

        if (!comments || comments.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron comentarios para este usuario.' });
        }

        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        console.error('Error al obtener comentarios por usuario:', error);
        res.status(500).json({ success: false, message: 'Error al obtener los comentarios.', error: error.message });
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

        // Validar ID del comentario
        if (!id) {
            return res.status(400).json({ success: false, message: 'El ID del comentario es requerido.' });
        }

        const comment = await Comment.findByIdAndDelete(id);

        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comentario no encontrado.' });
        }

        res.status(200).json({ success: true, message: 'Comentario eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar comentario:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar el comentario.', error: error.message });
    }
};

/**
 * Agregar un like a un comentario
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const addLike = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        // Validar userId
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Debes iniciar sesión para dar like.' });
        }

        const comment = await Comment.findById(id);

        // Validar si el comentario existe
        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comentario no encontrado.' });
        }

        // Si ya dio like, quitarlo
        if (comment.likedBy.includes(userId)) {
            comment.likes -= 1;
            comment.likedBy = comment.likedBy.filter((id) => id.toString() !== userId);
            await comment.save();
            return res.status(200).json({ success: true, message: 'Like quitado exitosamente.', comment });
        }

        // Si ya dio dislike, quitarlo
        if (comment.dislikedBy.includes(userId)) {
            comment.dislikes -= 1;
            comment.dislikedBy = comment.dislikedBy.filter((id) => id.toString() !== userId);
        }

        // Agregar el like
        comment.likes += 1;
        comment.likedBy.push(userId);

        await comment.save();

        const updatedComment = await Comment.findById(id).populate('userId', 'firstName profilePicture');

        res.status(200).json({ success: true, message: 'Like agregado exitosamente.', comment: updatedComment });
    } catch (error) {
        console.error('Error al agregar like:', error);
        res.status(500).json({ success: false, message: 'Error al agregar like.', error: error.message });
    }
};

/**
 * Agregar un dislike a un comentario
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const addDislike = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        // Validar userId
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Debes iniciar sesión para dar dislike.' });
        }

        const comment = await Comment.findById(id);

        // Validar si el comentario existe
        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comentario no encontrado.' });
        }

        // Si ya dio dislike, quitarlo
        if (comment.dislikedBy.includes(userId)) {
            comment.dislikes -= 1;
            comment.dislikedBy = comment.dislikedBy.filter((id) => id.toString() !== userId);
            await comment.save();
            return res.status(200).json({ success: true, message: 'Dislike quitado exitosamente.', comment });
        }

        // Si ya dio like, quitarlo
        if (comment.likedBy.includes(userId)) {
            comment.likes -= 1;
            comment.likedBy = comment.likedBy.filter((id) => id.toString() !== userId);
        }

        // Agregar el dislike
        comment.dislikes += 1;
        comment.dislikedBy.push(userId);

        await comment.save();

        const updatedComment = await Comment.findById(id).populate('userId', 'firstName profilePicture');

        res.status(200).json({ success: true, message: 'Dislike agregado exitosamente.', comment: updatedComment });
    } catch (error) {
        console.error('Error al agregar dislike:', error);
        res.status(500).json({ success: false, message: 'Error al agregar dislike.', error: error.message });
    }
};

/**
 * Quitar un like de un comentario
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const removeLike = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        // Validar userId
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Debes iniciar sesión para quitar like.' });
        }

        const comment = await Comment.findById(id);

        // Validar si el comentario existe
        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comentario no encontrado.' });
        }

        // Validar si el usuario ya dio like
        if (!comment.likedBy.includes(userId)) {
            return res.status(400).json({ success: false, message: 'No has dado like a este comentario.' });
        }

        // Quitar el like
        comment.likes -= 1;
        comment.likedBy = comment.likedBy.filter((id) => id.toString() !== userId);

        await comment.save();

        res.status(200).json({ success: true, message: 'Like quitado exitosamente.', comment });
    } catch (error) {
        console.error('Error al quitar like:', error);
        res.status(500).json({ success: false, message: 'Error al quitar like.', error: error.message });
    }
};

/**
 * Quitar un dislike de un comentario
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const removeDislike = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Debes iniciar sesión para quitar dislike.' });
        }

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comentario no encontrado.' });
        }

        const dislikedByIds = comment.dislikedBy.map(user => user.toString());

        if (!dislikedByIds.includes(userId)) {
            return res.status(400).json({ success: false, message: 'No has dado dislike a este comentario.' });
        }

        comment.dislikes -= 1;
        comment.dislikedBy = comment.dislikedBy.filter((user) => user.toString() !== userId);

        await comment.save();

        res.status(200).json({ success: true, message: 'Dislike quitado exitosamente.', comment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al quitar dislike.', error: error.message });
    }
};


module.exports = {
    createComment,
    getCommentsByBusiness,
    getCommentsByUser,
    deleteComment,
    addLike,
    addDislike,
    removeLike,
    removeDislike,
};