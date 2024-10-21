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
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Validación de email
        minLength: 4,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 60 // Aumentamos el tamaño máximo para acomodar el hash
    },
    type: {
        type: String,
        enum: ['company'],
        default: 'company',
        required: true
    },
    companyName: {
        type: String,
        required: true, // Las compañías deben tener un nombre
        maxLength: 100
    },
    address: {
        type: String,
        required: true // Dirección de la compañía
    },
    phone: {
        type: String,
        required: true, // Teléfono de contacto de la compañía
        match: /^\+?[1-9]\d{1,14}$/ // Validación para número de teléfono
    },
    subscription: {
        type: String,
        enum: ['free', 'premium'], // Planes de suscripción
        default: 'free', // Por defecto es gratuita
        required: true
    },
    premiumFeatures: {
        maxLocations: {
            type: Number,
            default: 1 // Solo 1 ubicación para cuentas gratuitas
        },
        hasStatistics: {
            type: Boolean,
            default: false // Solo cuentas premium pueden tener acceso a estadísticas
        },
        // Puedes agregar más características premium aquí
    },
    verified: {
        type: Boolean,
        default: false // Se inicia como no verificado
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    verificationSentAt: { // Campo para almacenar la hora del envío de verificación
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
