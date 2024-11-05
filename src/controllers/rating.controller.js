const Company = require('../models/company.model.js');
const Rating = require('../models/rating.model.js');
const Comment = require('../models/comment.model.js');


const rateCompany = async (req, res) => {
    const { value } = req.body; // valor de la calificación
    const { companyId } = req.params; // ID de la compañía

    if (!value || value < 1 || value > 5) {
        return res.status(400).json({
            success: false,
            message: 'La calificación debe ser un número entre 1 y 5.',
        });
    }

    try {
        const existingRating = await Rating.findOne({ userId: req.user.id, companyId });
        if (existingRating) {
            return res.status(400).json({
                success: false,
                message: 'Ya has calificado esta compañía.',
            });
        }

        const newRating = await Rating.create({ value, userId: req.user.id, companyId });
        await Company.findByIdAndUpdate(companyId, { $push: { ratings: newRating._id } });

        res.status(201).json({
            success: true,
            data: { rating: newRating },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


const rateComment = async (req, res) => {
    const { value } = req.body; // valor de la calificación
    const { commentId } = req.params; // ID del comentario

    if (!value || value < 1 || value > 5) {
        return res.status(400).json({
            success: false,
            message: 'La calificación debe ser un número entre 1 y 5.',
        });
    }

    try {
        // Verifica si el comentario existe
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado.',
            });
        }

        // Verifica si ya existe una calificación para el comentario por parte del usuario
        const existingRating = await Rating.findOne({ userId: req.user.id, commentId });
        if (existingRating) {
            return res.status(400).json({
                success: false,
                message: 'Ya has calificado este comentario.',
            });
        }

        // Crea una nueva calificación
        const newRating = await Rating.create({ value, userId: req.user.id, commentId });
        await Comment.findByIdAndUpdate(commentId, { $push: { ratings: newRating._id } });

        res.status(201).json({
            success: true,
            data: { rating: newRating },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


module.exports = {rateCompany, rateComment}