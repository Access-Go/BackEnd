const mongoose = require('mongoose');

const registeredEmailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/  // Asegura que sea un formato de correo válido
    },
    createdAt: {
        type: Date,
        default: Date.now  // Fecha de registro del correo
    }
});

// Exporta el modelo
module.exports = mongoose.model('RegisteredEmails', registeredEmailSchema);
