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
        require: true,
        minLength: 4,
        maxLength: 30
    },
    password:{
        type: String,
        require: true,
        minLength: 4,
        maxLength: 15
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