const mongoose = require("mongoose")

const modelName = "Users"

const schema = new mongoose.Schema({
    profilePicture: {
        type: String,
        required: false,
        maxLength: 100,
    },
    firstName: {
        type: String,
        required: false,
        minLength: 2,
        maxLength: 100,
    },
    biography:{
        type: String,
        required: false,
        maxLength: 200,
        minLength: 5
    },
    lastName: {
        type: String,
        required: false,
        maxLength: 100,
    },
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
        enum: ['user'],
        default: 'user',
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', // Nombre del modelo al que se hace referencia
        required: false // Si deseas que este campo sea opcional
    },
    birthDate: {
        type: Date,
        required: false,
    },
    aboutMe:{
        type: String,
        required:false,
        minLength: 2,
        maxLength: 300
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
schema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

schema.pre('findOneAndUpdate', function (next) {
    this.set({ updated_at: Date.now() });
    next();
});


module.exports = mongoose.model(modelName, schema)