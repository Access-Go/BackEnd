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
        required: true,
        maxLength: 100
    },
    moralPersonName: {
        type: String,
        required: true, 
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
        required: true
    },
    phone: {
        type: String,
        required: true, 
        match: /^\+?[1-9]\d{1,14}$/ 
    },
    rfc: {
        type: String,
        required: true, 
        match: /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/i 
    },
    tipo: {
        type: String,
        enum: ['hotel', 'restaurante'],
        required: true
    },
    cuenta: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free', 
        required: true
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
