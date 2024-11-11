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
        required: false, 
        maxLength: 100
    },
    rfc: {
        type: String,
        required: false, 
        maxLength: 13
    },
    representanteLegal: {
        type: String,
        required: false, 
        maxLength: 100
    },
    giro: {
        type: String,
        required: false, 
        maxLength: 50
    },
    horario: {
        abre: { type: String, required: false }, 
        cierra: { type: String, required: false } 
    },
    diasDeServicio: {
        type: [String],
        required: false
    },
    description: {
        type: String,
        maxLength: 500 
    },
    address: {
        type: String,
        required: false // Dirección de la compañía
    },
    latitude:{
        type: Number, // Asegúrate de que sea de tipo número
        required: false,
    },
    longitude:{
        type: Number, // Asegúrate de que sea de tipo número
        required: false,
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
    averageRating: {
        type: Number,
        default: 0,
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

// Middleware para actualizar `updated_at` en cada modificación
companySchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

companySchema.pre('findOneAndUpdate', function (next) {
    this.set({ updated_at: Date.now() });
    next();
});
/**
 * -----------------------------------------------------------------
 * Exportamos el modelo de compañía
 * -----------------------------------------------------------------
 */
module.exports = mongoose.model(modelName, companySchema);