/**
 * -----------------------------------------------------------------
 * Importamos mongoose
 * -----------------------------------------------------------------
 */
const mongoose = require('mongoose');

/**
 * -----------------------------------------------------------------
 * Creamos el nombre del modelo
 * -----------------------------------------------------------------
 */
const modelName = 'Register';

/**
 * -----------------------------------------------------------------
 * Creamos nuestro esquema
 * -----------------------------------------------------------------
 */
const userSchema = new mongoose.Schema({
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
        tipoUsuario: {
            type: String,
            enum: ['usuario', 'empresa'], 
            required: true
        }
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
    verificationSentAt: { // Agregamos el campo para almacenar la hora del envío
        type: Date
    }
});

/**
 * -----------------------------------------------------------------
 * Middleware para actualizar `updated_at` cuando se modifica el documento
 * -----------------------------------------------------------------
 */
userSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

/**
 * -----------------------------------------------------------------
 * Exportamos el modelo
 * -----------------------------------------------------------------
 */
module.exports = mongoose.model(modelName, userSchema);
