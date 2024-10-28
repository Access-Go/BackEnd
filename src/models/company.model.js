/**
 * -----------------------------------------------------------------
 * Importamos mongoose
 * -----------------------------------------------------------------
 */
const mongoose = require('mongoose');

/**
 * -----------------------------------------------------------------
 * Creamos el nombre del modelo para compañías
 * -----------------------------------------------------------------
 */
const modelName = 'Company';

/**
 * -----------------------------------------------------------------
 * Creamos nuestro esquema para compañías
 * -----------------------------------------------------------------
 */
const companySchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
        minLength: 4,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 60 
    },
    type: {
        type: String,
        enum: ['company'], 
        default: 'company',
        required: true
    },
    companyName: {
        type: String,
        required: false, // Las compañías deben tener un nombre
        maxLength: 100
    },
    giro: {
        type: String,
        required: true, 
        maxLength: 50
    },
    horario: {
        abre: { type: String, required: true }, 
        cierra: { type: String, required: true } 
    },
    diasDeServicio: {
        type: [String],
        required: true
    },
    description: {
        type: String,
        maxLength: 500 
    },
    address: {
        type: String,
        required: false // Dirección de la compañía
    },
    phone: {
        type: String,
        required: false, // Teléfono de contacto de la compañía
        match: /^\+?[1-9]\d{1,14}$/ // Validación para número de teléfono
    },
    cuenta: {
        type: String,
        enum: ['free', 'premium'], // Planes de suscripción
        default: 'free', // Por defecto es gratuita
        required: false
    },
    premiumFeatures: {
        maxLocations: {
            type: Number,
            default: 1 
        },
        hasStatistics: {
            type: Boolean,
            default: false 
        },
    },
    checkpoints: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'tipo',
    },
    verified: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    verificationSentAt: { 
        type: Date
    }
});

/**
 * -----------------------------------------------------------------
 * Middleware para actualizar `updated_at` cuando se modifica el documento
 * -----------------------------------------------------------------
 */
companySchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

/**
 * -----------------------------------------------------------------
 * Exportamos el modelo de compañía
 * -----------------------------------------------------------------
 */
module.exports = mongoose.model(modelName, companySchema);