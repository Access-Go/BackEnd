
const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
    value: { type: Number, required: true, min: 1, max: 5 }, // calificación entre 1 y 5
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // referenciando al usuario que hizo la calificación
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }, // si es un rating para un comentario
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }, // si es un rating para una compañía
});

const Rating = mongoose.model('Rating', RatingSchema);
module.exports = Rating;
