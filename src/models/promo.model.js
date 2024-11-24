/**
 * -----------------------------------------------------------------
 * Importamos mongoose
 * -----------------------------------------------------------------
 */
const mongoose = require('mongoose');

/**
 * -----------------------------------------------------------------
 * Creamos el nombre del modelo para eventos
 * -----------------------------------------------------------------
 */
const modelName = 'Promo';

/**
 * -----------------------------------------------------------------
 * Creamos el nombre del modelo para eventos
 * -----------------------------------------------------------------
 */
const promoSchema = new mongoose.Schema({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: false
    },
    name: {
        type: String,
        required: false,
        maxLength: 100
    },
    description: {
        type: String,
        maxLength: 500
    },
    startDate: {
        type: Date,
        required: false
    },
    endDate: {
        type: Date,
        required: false
    },
    openingTime: {
        type: Number,
        required: false
    },
    closingTime: {
        type: Number,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

promoSchema.pre('save', function (next) {
    const duration = (this.endDate - this.startDate) / (1000 * 60 * 60 * 24); // Convertir a días
    if (duration > 30) {
        return next(new Error('La duración de la promoción no puede exceder los 30 días.'));
    }
    next();
});


module.exports = mongoose.model(modelName, promoSchema);
