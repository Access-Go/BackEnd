const mongoose = require('mongoose');

// Esquema de verificación
const verificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'register',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

// Índice TTL para eliminar códigos de verificación expirados
verificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Exporta el modelo 'Verification'
module.exports = mongoose.model('Verification', verificationSchema);
