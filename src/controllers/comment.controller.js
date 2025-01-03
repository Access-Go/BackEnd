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
        const { businessId, userId, content, rankingId } = req.body;

        // Crear el comentario
        const newComment = await Comment.create({ businessId, userId, content, rankingId });

        // Popular los datos del ranking (opcional si deseas más detalles sobre el ranking)
        const populatedComment = await Comment.findById(newComment._id).populate('rankingId', 'stars'); // 'score' es un ejemplo del campo en Ranking

        res.status(201).json({ success: true, data: populatedComment });
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




        const comments = await Comment.find({ businessId })
            .populate('rankingId', 'stars')
            .populate('userId', 'firstName profilePicture');



        /* if (!comments || comments.length === 0) {
  
          return res.status(404).json({ message: 'No se encontraron comentarios para esta compañía.' });
        } */

        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        res.status(500).json({ message: 'Error al obtener los comentarios.' });
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
        const comments = await Comment.find({ userId })
            .populate('businessId', 'companyName')
            .populate('rankingId', 'stars');

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

        if (!userId) {
            return res.status(401).json({ message: 'Debes iniciar sesión para dar like.' });
        }

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }

        if (comment.likedBy.includes(userId)) {
            return res.status(400).json({ message: 'Ya diste like a este comentario.' });
        }

        if (comment.dislikedBy.includes(userId)) {
            return res.status(400).json({ message: 'No puedes dar like porque ya diste dislike.' });
        }

        comment.likes += 1;
        comment.likedBy.push(userId);

        await comment.save();

        res.status(200).json({ message: 'Like agregado exitosamente.', comment });
    } catch (error) {
        console.error('Error al agregar like:', error);
        res.status(500).json({ message: 'Error al agregar like.', error });
    }
};

/**
 *  Agregar un dislike a un comentario
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const addDislike = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Debes iniciar sesión para dar dislike.' });
        }

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }

        if (comment.dislikedBy.includes(userId)) {
            return res.status(400).json({ message: 'Ya diste dislike a este comentario.' });
        }

        if (comment.likedBy.includes(userId)) {
            return res.status(400).json({ message: 'No puedes dar dislike porque ya diste like.' });
        }

        comment.dislikes += 1;
        comment.dislikedBy.push(userId);

        await comment.save();

        res.status(200).json({ message: 'Dislike agregado exitosamente.', comment });
    } catch (error) {
        console.error('Error al agregar dislike:', error);
        res.status(500).json({ message: 'Error al agregar dislike.', error });
    }
};



module.exports = { createComment, getCommentsByBusiness, getCommentsByUser, deleteComment, addLike, addDislike };
