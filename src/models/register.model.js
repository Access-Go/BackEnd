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
    email:{
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        minLength: 4,
        maxLength: 30
    },
    password:{
        type: String,
        required: true,
        minLength: 6,
        maxLength: 60  // Aumentamos el tamaño máximo para acomodar el hash
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

/**
 * -----------------------------------------------------------------
 * Exportamos el model
 * -----------------------------------------------------------------
 */

module.exports = mongoose.model(modelName, userSchema);
